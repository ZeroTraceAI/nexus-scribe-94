import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface SecurityFinding {
  severity: "Critical" | "High" | "Medium" | "Low" | "Info";
  category: string;
  title: string;
  description: string;
  line: string;
  fix: string;
  cwe: string;
}

const scanCode = (code: string): { findings: SecurityFinding[]; score: number; grade: string } => {
  const findings: SecurityFinding[] = [];
  const lines = code.split("\n");

  const rules: [RegExp, string, string, string, "Critical" | "High" | "Medium" | "Low", string, string][] = [
    [/eval\s*\(/g, "Code Injection", "eval() usage detected", "eval() executes arbitrary code and is a primary injection vector", "Critical", "Use Function constructors, JSON.parse, or AST-based evaluation", "CWE-94"],
    [/innerHTML\s*=|\.html\s*\(/g, "XSS", "Unsafe HTML injection", "Direct HTML insertion without sanitization enables Cross-Site Scripting", "High", "Use textContent, DOMPurify.sanitize(), or framework-safe methods", "CWE-79"],
    [/document\.write/g, "XSS", "document.write usage", "document.write can inject arbitrary content including scripts", "High", "Use DOM manipulation methods instead", "CWE-79"],
    [/password|secret|api.?key|token|private.?key/i, "Secrets", "Potential hardcoded credential", "Secrets in source code can be extracted from version control", "Critical", "Use environment variables or a secrets manager", "CWE-798"],
    [/SELECT\s.*FROM|INSERT\s+INTO|UPDATE\s.*SET|DELETE\s+FROM/gi, "SQL Injection", "Raw SQL query detected", "String-concatenated SQL queries are vulnerable to injection", "Critical", "Use parameterized queries or an ORM", "CWE-89"],
    [/\$\{.*\}.*sql|`.*\$\{.*\}.*SELECT/gi, "SQL Injection", "Template literal in SQL", "Template literals in SQL queries bypass parameterization", "Critical", "Use parameterized queries with placeholders", "CWE-89"],
    [/exec\s*\(|spawn\s*\(|child_process|execSync/g, "Command Injection", "OS command execution", "Executing system commands with user input enables command injection", "Critical", "Validate/sanitize input, use allowlists, avoid shell commands", "CWE-78"],
    [/Math\.random\(\)/g, "Weak Crypto", "Math.random() for security", "Math.random() is not cryptographically secure", "Medium", "Use crypto.getRandomValues() or crypto.randomUUID()", "CWE-330"],
    [/http:\/\//g, "Insecure Transport", "HTTP URL detected", "Unencrypted HTTP transmits data in plaintext", "Medium", "Use HTTPS for all external connections", "CWE-319"],
    [/console\.(log|debug|info|warn)\s*\(.*(?:password|token|secret|key)/gi, "Info Leak", "Sensitive data in logs", "Logging sensitive values exposes them in log aggregators", "High", "Remove sensitive data from log statements", "CWE-532"],
    [/catch\s*\(\s*\w*\s*\)\s*\{\s*\}/g, "Error Handling", "Empty catch block", "Swallowing errors hides security-relevant failures", "Medium", "Log the error and handle it appropriately", "CWE-390"],
    [/dangerouslySetInnerHTML/g, "XSS", "React dangerouslySetInnerHTML", "Bypasses React's XSS protections", "High", "Sanitize with DOMPurify before using", "CWE-79"],
    [/atob\s*\(|btoa\s*\(/g, "Encoding", "Base64 used for security", "Base64 is encoding, not encryption — provides no security", "Low", "Use proper encryption (AES-GCM) for sensitive data", "CWE-327"],
    [/cors\(\s*\)|Access-Control-Allow-Origin.*\*/g, "CORS", "Wildcard CORS policy", "Allows any origin to make authenticated requests", "High", "Restrict to specific trusted origins", "CWE-942"],
    [/jwt\.sign|jsonwebtoken/g, "Auth", "JWT implementation detected", "Custom JWT handling is error-prone — verify algorithm, expiry, and signature", "Info", "Validate algorithm (RS256), set short expiry, use refresh tokens", "CWE-347"],
    [/new\s+RegExp\s*\(/g, "ReDoS", "Dynamic regex construction", "User input in regex can cause catastrophic backtracking (ReDoS)", "Medium", "Validate regex complexity or use re2 library", "CWE-1333"],
    [/localStorage|sessionStorage/g, "Storage", "Client-side storage for sensitive data", "Browser storage is accessible to XSS attacks", "Medium", "Use httpOnly cookies for auth tokens", "CWE-922"],
  ];

  lines.forEach((line, i) => {
    rules.forEach(([pattern, category, title, description, severity, fix, cwe]) => {
      if (pattern.test(line)) {
        findings.push({ severity, category, title, description, line: `Line ${i + 1}`, fix, cwe });
      }
      pattern.lastIndex = 0; // reset regex
    });
  });

  if (findings.length === 0) {
    findings.push({ severity: "Info", category: "Status", title: "No vulnerabilities detected", description: "Static analysis found no known security patterns. Manual review still recommended.", line: "—", fix: "Continue with dynamic testing and code review", cwe: "—" });
  }

  const weights = { Critical: 25, High: 15, Medium: 8, Low: 3, Info: 0 };
  const totalPenalty = findings.reduce((sum, f) => sum + weights[f.severity], 0);
  const score = Math.max(0, 100 - totalPenalty);
  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";

  return { findings, score, grade };
};

const AiCodeSecurityScanner = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ReturnType<typeof scanCode> | null>(null);

  const handleScan = () => {
    if (!code.trim()) { toast({ title: "Paste code to scan" }); return; }
    setResult(scanCode(code));
  };

  const gradeColor = (g: string) => g === "A" ? "text-green-500" : g === "B" ? "text-green-400" : g === "C" ? "text-yellow-500" : "text-destructive";
  const sevColor = (s: string) => { switch (s) { case "Critical": return "destructive"; case "High": return "default"; case "Medium": return "secondary"; default: return "outline"; } };
  const sevIcon = (s: string) => s === "Critical" ? "🔴" : s === "High" ? "🟠" : s === "Medium" ? "🟡" : s === "Low" ? "🔵" : "ℹ️";

  const exportReport = () => {
    if (!result) return;
    const md = `# Security Scan Report\n\nScore: ${result.score}/100 (Grade: ${result.grade})\nFindings: ${result.findings.length}\n\n${result.findings.map(f => `## [${f.severity}] ${f.title} (${f.cwe})\n${f.line}\n${f.description}\n**Fix:** ${f.fix}`).join("\n\n---\n\n")}`;
    navigator.clipboard.writeText(md);
    toast({ title: "Report exported!" });
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste your code to scan for security vulnerabilities..." value={code} onChange={e => setCode(e.target.value)} rows={10} className="font-mono text-sm" />
      <Button onClick={handleScan} className="w-full">Run Security Scan</Button>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-xl p-4 border text-center">
              <p className={`text-4xl font-bold ${gradeColor(result.grade)}`}>{result.grade}</p>
              <p className="text-xs text-muted-foreground mt-1">Grade</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 border text-center">
              <p className="text-4xl font-bold text-foreground">{result.score}</p>
              <p className="text-xs text-muted-foreground mt-1">Score</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 border text-center">
              <p className="text-4xl font-bold text-foreground">{result.findings.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Findings</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">{["Critical", "High", "Medium", "Low"].map(sev => {
              const count = result.findings.filter(f => f.severity === sev).length;
              return count > 0 ? <Badge key={sev} variant={sevColor(sev) as any} className="text-xs">{count} {sev}</Badge> : null;
            })}</div>
            <Button variant="outline" size="sm" onClick={exportReport}>Export</Button>
          </div>

          <div className="space-y-2">
            {result.findings.map((finding, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{sevIcon(finding.severity)}</span>
                    <div>
                      <span className="font-medium text-sm text-foreground">{finding.title}</span>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{finding.category}</Badge>
                        <span className="text-xs text-muted-foreground font-mono">{finding.cwe}</span>
                        <span className="text-xs text-muted-foreground font-mono">{finding.line}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={sevColor(finding.severity) as any}>{finding.severity}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{finding.description}</p>
                <p className="text-xs text-primary mt-2 flex gap-1"><span>💡</span> {finding.fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiCodeSecurityScanner;
