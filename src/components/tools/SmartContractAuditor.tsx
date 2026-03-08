import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Shield, AlertTriangle, CheckCircle2, Copy } from "lucide-react";

interface Finding {
  severity: "Critical" | "High" | "Medium" | "Low" | "Info";
  title: string;
  description: string;
  line?: string;
  recommendation: string;
}

const severityColor: Record<string, string> = {
  Critical: "bg-destructive text-destructive-foreground",
  High: "bg-destructive/80 text-destructive-foreground",
  Medium: "bg-yellow-500 text-white",
  Low: "bg-muted text-muted-foreground",
  Info: "bg-primary/10 text-primary",
};

const patterns: { regex: RegExp; severity: Finding["severity"]; title: string; description: string; recommendation: string }[] = [
  { regex: /\.call\{value:/g, severity: "Critical", title: "Potential Reentrancy Vulnerability", description: "External calls with value transfer can be exploited for reentrancy attacks if state changes happen after the call.", recommendation: "Follow the Checks-Effects-Interactions pattern. Update state variables BEFORE making external calls. Consider using ReentrancyGuard from OpenZeppelin." },
  { regex: /tx\.origin/g, severity: "Critical", title: "tx.origin Used for Authorization", description: "Using tx.origin for authorization is vulnerable to phishing attacks where a malicious contract calls your contract through the original user.", recommendation: "Replace tx.origin with msg.sender for authorization checks." },
  { regex: /selfdestruct|suicide/g, severity: "High", title: "Self-destruct Present", description: "The selfdestruct opcode permanently destroys the contract and sends remaining ETH to a specified address. This is deprecated in newer EVM versions.", recommendation: "Avoid using selfdestruct. Use a pause mechanism or upgradeable proxy pattern instead." },
  { regex: /delegatecall/g, severity: "High", title: "Delegatecall Usage Detected", description: "delegatecall executes code in the context of the calling contract. If the target is user-controlled, it can lead to complete contract takeover.", recommendation: "Only delegatecall to trusted, immutable contracts. Validate the target address. Consider using well-audited proxy patterns (EIP-1967)." },
  { regex: /block\.timestamp/g, severity: "Medium", title: "Block Timestamp Dependency", description: "Block timestamps can be slightly manipulated by miners (up to ~15 seconds). Not suitable for precise time-critical logic.", recommendation: "Don't use block.timestamp for randomness or precise timing. It's acceptable for longer time windows (hours/days)." },
  { regex: /block\.number/g, severity: "Low", title: "Block Number Dependency", description: "Block numbers should not be used for time calculations as block times vary across chains and can change with protocol upgrades.", recommendation: "Use block.timestamp for time-based logic, but be aware of minor miner manipulation." },
  { regex: /assembly\s*\{/g, severity: "Medium", title: "Inline Assembly Used", description: "Inline assembly bypasses Solidity's safety checks. Incorrect use can introduce subtle bugs and security vulnerabilities.", recommendation: "Minimize inline assembly usage. When necessary, document thoroughly and get additional review." },
  { regex: /ecrecover/g, severity: "Medium", title: "ecrecover Usage", description: "ecrecover returns address(0) for invalid signatures instead of reverting. Failing to check for this can lead to signature bypass.", recommendation: "Always verify ecrecover result is not address(0). Consider using OpenZeppelin's ECDSA library which includes this check." },
  { regex: /unchecked\s*\{/g, severity: "Low", title: "Unchecked Arithmetic Block", description: "Unchecked blocks disable overflow/underflow checks for gas optimization. Incorrect use can cause integer overflow vulnerabilities.", recommendation: "Only use unchecked blocks when overflow is mathematically impossible. Document the invariant that prevents overflow." },
  { regex: /pragma solidity \^/g, severity: "Low", title: "Floating Pragma", description: "Using a floating pragma (^) allows compilation with any compatible compiler version, which may introduce subtle behavior differences.", recommendation: "Lock the pragma to a specific version (e.g., pragma solidity 0.8.20;) for production deployments." },
  { regex: /transfer\(|\.send\(/g, severity: "Medium", title: "transfer/send Usage", description: "transfer() and send() forward only 2300 gas, which can fail for contracts with receive functions that require more gas (especially after EIP-1884).", recommendation: "Use call{value: amount}('') with reentrancy protection instead of transfer() or send()." },
  { regex: /while\s*\(|for\s*\(/g, severity: "Medium", title: "Loop Over Dynamic Data", description: "Unbounded loops over arrays or mappings can exceed the block gas limit, making the function uncallable (denial of service).", recommendation: "Implement pagination or batch processing. Set maximum iteration limits. Consider pull-over-push patterns for distributions." },
  { regex: /mapping.*public/g, severity: "Info", title: "Public Mapping Detected", description: "Public mappings auto-generate getter functions, which is usually fine but may expose data you intend to keep internal.", recommendation: "Verify that the exposed data is intended to be publicly readable." },
  { regex: /onlyOwner/g, severity: "Info", title: "Access Control Present", description: "The contract uses owner-based access control, which is good practice for administrative functions.", recommendation: "Consider using role-based access control (OpenZeppelin AccessControl) for more granular permissions." },
];

const SmartContractAuditor = () => {
  const [code, setCode] = useState("");
  const [findings, setFindings] = useState<Finding[] | null>(null);

  const audit = () => {
    if (!code.trim()) {
      toast({ title: "Paste your code", description: "Enter Solidity code to audit.", variant: "destructive" });
      return;
    }

    const results: Finding[] = [];
    const lines = code.split("\n");

    patterns.forEach(p => {
      const matches = code.match(p.regex);
      if (matches) {
        // Find first matching line number
        const lineNum = lines.findIndex(l => p.regex.test(l));
        // Reset regex lastIndex
        p.regex.lastIndex = 0;
        results.push({
          severity: p.severity,
          title: p.title,
          description: p.description,
          line: lineNum >= 0 ? `Line ${lineNum + 1}` : undefined,
          recommendation: p.recommendation,
        });
      }
    });

    // Check for missing patterns (good practices)
    if (!/ReentrancyGuard|nonReentrant/.test(code) && /\.call\{/.test(code)) {
      results.push({ severity: "High", title: "Missing Reentrancy Guard", description: "The contract makes external calls but doesn't use ReentrancyGuard.", recommendation: "Import and inherit OpenZeppelin's ReentrancyGuard. Apply the nonReentrant modifier to functions with external calls." });
    }
    if (!/event\s/.test(code)) {
      results.push({ severity: "Low", title: "No Events Defined", description: "The contract doesn't emit events, making it difficult to track state changes off-chain.", recommendation: "Define and emit events for all state-changing operations to enable off-chain monitoring and indexing." });
    }
    if (!/require\(|revert\s|assert\(/.test(code) && code.length > 100) {
      results.push({ severity: "Medium", title: "No Input Validation", description: "The contract appears to lack require/revert statements for input validation.", recommendation: "Add require() statements to validate function inputs, check preconditions, and enforce access control." });
    }
    if (!/SPDX-License-Identifier/.test(code)) {
      results.push({ severity: "Info", title: "Missing SPDX License", description: "No SPDX license identifier found. This can cause compiler warnings.", recommendation: "Add // SPDX-License-Identifier: MIT (or appropriate license) at the top of the file." });
    }

    results.sort((a, b) => {
      const order = { Critical: 0, High: 1, Medium: 2, Low: 3, Info: 4 };
      return order[a.severity] - order[b.severity];
    });

    setFindings(results);
    toast({ title: `Audit complete`, description: `Found ${results.length} finding${results.length !== 1 ? "s" : ""}.` });
  };

  const copyReport = () => {
    if (!findings) return;
    let report = `Smart Contract Security Audit Report\n${"=".repeat(40)}\n\n`;
    findings.forEach((f, i) => {
      report += `[${f.severity}] ${f.title}${f.line ? ` (${f.line})` : ""}\n`;
      report += `${f.description}\n`;
      report += `Recommendation: ${f.recommendation}\n\n`;
    });
    navigator.clipboard.writeText(report);
    toast({ title: "Report copied!" });
  };

  const critCount = findings?.filter(f => f.severity === "Critical").length || 0;
  const highCount = findings?.filter(f => f.severity === "High").length || 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Paste Solidity Code</label>
        <Textarea
          placeholder={`// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract MyContract {\n    // Paste your contract code here...\n}`}
          value={code}
          onChange={e => setCode(e.target.value)}
          rows={12}
          className="font-mono text-sm"
        />
      </div>

      <Button onClick={audit} className="w-full">Run Security Audit</Button>

      {findings && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Audit Results</h3>
              <span className="text-sm text-muted-foreground">({findings.length} findings)</span>
            </div>
            <Button size="sm" variant="outline" onClick={copyReport}><Copy className="h-3.5 w-3.5 mr-1" /> Copy Report</Button>
          </div>

          {critCount + highCount === 0 && findings.length > 0 && (
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
              <p className="text-sm text-foreground">No critical or high severity issues found. Review medium/low findings for best practices.</p>
            </div>
          )}

          {findings.length === 0 && (
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
              <p className="text-sm text-foreground">No known vulnerability patterns detected. Consider a professional audit for production contracts.</p>
            </div>
          )}

          {findings.map((f, i) => (
            <div key={i} className="bg-card border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{f.title}</p>
                    {f.line && <p className="text-xs text-muted-foreground">{f.line}</p>}
                  </div>
                </div>
                <span className={`text-xs font-medium rounded-full px-2 py-0.5 shrink-0 ${severityColor[f.severity]}`}>{f.severity}</span>
              </div>
              <p className="text-sm text-muted-foreground">{f.description}</p>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-medium text-foreground mb-1">Recommendation</p>
                <p className="text-sm text-muted-foreground">{f.recommendation}</p>
              </div>
            </div>
          ))}

          <p className="text-xs text-muted-foreground">⚠️ This is a pattern-based static analysis tool. It does not replace a professional smart contract audit. Always get contracts audited by security professionals before deploying to mainnet.</p>
        </div>
      )}
    </div>
  );
};

export default SmartContractAuditor;
