import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Shield, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface RiskFinding {
  category: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  recommendation: string;
}

interface ScanResult {
  overallRisk: "Critical" | "High" | "Medium" | "Low";
  score: number;
  findings: RiskFinding[];
  summary: string;
}

const severityColors: Record<string, string> = {
  critical: "bg-red-500/10 text-red-600 border-red-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  low: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  info: "bg-muted text-muted-foreground border-border",
};

interface ChecklistItem {
  id: string;
  label: string;
  category: string;
}

const checklist: ChecklistItem[] = [
  { id: "https", label: "HTTPS enabled on all pages", category: "Network" },
  { id: "hsts", label: "HSTS header configured", category: "Network" },
  { id: "cors", label: "CORS properly configured", category: "Network" },
  { id: "csp", label: "Content Security Policy (CSP) header set", category: "Headers" },
  { id: "xframe", label: "X-Frame-Options header set", category: "Headers" },
  { id: "xcontent", label: "X-Content-Type-Options: nosniff", category: "Headers" },
  { id: "auth_mfa", label: "Multi-factor authentication (MFA) available", category: "Authentication" },
  { id: "auth_lockout", label: "Account lockout after failed attempts", category: "Authentication" },
  { id: "auth_session", label: "Secure session management (HttpOnly, Secure cookies)", category: "Authentication" },
  { id: "input_val", label: "Input validation on all forms", category: "Application" },
  { id: "sql_injection", label: "SQL injection prevention (parameterized queries)", category: "Application" },
  { id: "xss", label: "XSS prevention (output encoding)", category: "Application" },
  { id: "csrf", label: "CSRF tokens on state-changing requests", category: "Application" },
  { id: "rate_limit", label: "Rate limiting on APIs", category: "Application" },
  { id: "deps", label: "Dependencies scanned for vulnerabilities", category: "Supply Chain" },
  { id: "secrets", label: "No hardcoded secrets in codebase", category: "Supply Chain" },
  { id: "backup", label: "Regular data backups configured", category: "Infrastructure" },
  { id: "logging", label: "Security event logging enabled", category: "Infrastructure" },
  { id: "encryption", label: "Data encrypted at rest", category: "Infrastructure" },
  { id: "privacy", label: "Privacy policy and GDPR compliance", category: "Compliance" },
];

const runScan = (domain: string, checked: Set<string>): ScanResult => {
  const findings: RiskFinding[] = [];

  // Check each unchecked item
  checklist.forEach((item) => {
    if (!checked.has(item.id)) {
      let severity: RiskFinding["severity"] = "medium";
      if (["https", "sql_injection", "xss", "secrets", "auth_session"].includes(item.id)) severity = "critical";
      else if (["csp", "auth_mfa", "csrf", "input_val", "rate_limit"].includes(item.id)) severity = "high";
      else if (["hsts", "cors", "xframe", "xcontent", "deps", "encryption"].includes(item.id)) severity = "medium";
      else severity = "low";

      const recommendations: Record<string, string> = {
        https: "Enable HTTPS with a valid TLS 1.3 certificate. Use Let's Encrypt for free certificates.",
        hsts: "Add Strict-Transport-Security header with max-age of at least 31536000.",
        cors: "Configure CORS to allow only trusted origins. Avoid using wildcard (*).",
        csp: "Implement a strict CSP that blocks inline scripts and restricts sources.",
        xframe: "Set X-Frame-Options to DENY or SAMEORIGIN to prevent clickjacking.",
        xcontent: "Add X-Content-Type-Options: nosniff to prevent MIME-type sniffing.",
        auth_mfa: "Implement TOTP or WebAuthn-based MFA for all user accounts.",
        auth_lockout: "Lock accounts after 5 failed login attempts with progressive delays.",
        auth_session: "Use HttpOnly, Secure, and SameSite flags on session cookies.",
        input_val: "Validate and sanitize all user inputs on both client and server side.",
        sql_injection: "Use parameterized queries or an ORM. Never concatenate user input into SQL.",
        xss: "Encode all output. Use frameworks with auto-escaping. Implement CSP.",
        csrf: "Use anti-CSRF tokens on all state-changing forms and AJAX requests.",
        rate_limit: "Implement rate limiting on login, API, and sensitive endpoints.",
        deps: "Use npm audit, Snyk, or Dependabot to scan dependencies regularly.",
        secrets: "Use environment variables or secret managers. Scan repos with git-secrets.",
        backup: "Configure automated daily backups with off-site storage and test restores.",
        logging: "Log authentication events, access violations, and API errors centrally.",
        encryption: "Encrypt sensitive data at rest using AES-256 or your cloud provider's KMS.",
        privacy: "Publish a privacy policy. Implement cookie consent and data deletion workflows.",
      };

      findings.push({
        category: item.category,
        severity,
        title: item.label,
        description: `${item.label} was not confirmed for ${domain || "your application"}.`,
        recommendation: recommendations[item.id] || "Review and implement this security control.",
      });
    }
  });

  // Calculate score
  const totalChecks = checklist.length;
  const passedChecks = checked.size;
  const score = Math.round((passedChecks / totalChecks) * 100);

  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const highCount = findings.filter((f) => f.severity === "high").length;

  let overallRisk: ScanResult["overallRisk"] = "Low";
  if (criticalCount > 0) overallRisk = "Critical";
  else if (highCount > 2) overallRisk = "High";
  else if (findings.length > 5) overallRisk = "Medium";

  const summary = `Scanned ${totalChecks} security controls. ${passedChecks} passed, ${totalChecks - passedChecks} need attention. ${criticalCount > 0 ? `${criticalCount} critical issue(s) require immediate action.` : "No critical issues found."}`;

  // Sort by severity
  const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  findings.sort((a, b) => order[a.severity] - order[b.severity]);

  return { overallRisk, score, findings, summary };
};

const riskColors: Record<string, string> = {
  Critical: "text-red-600",
  High: "text-orange-600",
  Medium: "text-yellow-600",
  Low: "text-green-600",
};

const CyberRiskScanner = () => {
  const [domain, setDomain] = useState("");
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<ScanResult | null>(null);

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
  };

  const scan = () => {
    setResult(runScan(domain, checked));
  };

  const copyReport = () => {
    if (!result) return;
    const text = `Cybersecurity Risk Report for ${domain || "Application"}\nRisk Level: ${result.overallRisk} | Score: ${result.score}/100\n\n${result.summary}\n\nFindings:\n` +
      result.findings.map((f) => `[${f.severity.toUpperCase()}] ${f.title}\n  ${f.recommendation}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Report copied!" });
  };

  const categories = [...new Set(checklist.map((c) => c.category))];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Domain / Application Name</label>
        <Input placeholder="e.g., myapp.com or My SaaS App" value={domain} onChange={(e) => setDomain(e.target.value)} />
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-foreground">Security Checklist — check all that apply:</p>
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
            <div className="space-y-2">
              {checklist.filter((c) => c.category === cat).map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:text-primary transition-colors">
                  <Checkbox checked={checked.has(item.id)} onCheckedChange={() => toggle(item.id)} />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={scan} className="w-full"><Shield className="h-4 w-4 mr-2" /> Run Security Scan</Button>

      {result && (
        <div className="space-y-4">
          <div className="bg-muted/50 border rounded-lg p-4 flex items-center gap-4">
            <div className="shrink-0">
              {result.overallRisk === "Low" ? <ShieldCheck className="h-10 w-10 text-green-500" /> : <ShieldAlert className="h-10 w-10 text-red-500" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-foreground">Risk Level:</p>
                <span className={`font-bold ${riskColors[result.overallRisk]}`}>{result.overallRisk}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{result.summary}</p>
            </div>
            <div className="text-center shrink-0">
              <p className={`text-2xl font-bold ${result.score >= 80 ? "text-green-600" : result.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>{result.score}</p>
              <p className="text-xs text-muted-foreground">/100</p>
            </div>
          </div>

          {result.findings.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground">{result.findings.length} Finding(s)</h3>
                <Button size="sm" variant="outline" onClick={copyReport}><Copy className="h-3.5 w-3.5 mr-1" /> Copy Report</Button>
              </div>
              {result.findings.map((f, i) => (
                <div key={i} className="bg-muted/30 border rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={severityColors[f.severity]}>{f.severity}</Badge>
                    <span className="text-xs text-muted-foreground">{f.category}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">💡 {f.recommendation}</p>
                </div>
              ))}
            </div>
          )}

          {result.findings.length === 0 && (
            <div className="text-center py-6">
              <ShieldCheck className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-foreground">All security controls passed!</p>
              <p className="text-sm text-muted-foreground">Your application meets the baseline security requirements.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CyberRiskScanner;
