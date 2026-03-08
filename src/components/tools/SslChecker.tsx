import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Shield } from "lucide-react";

const SslChecker = () => {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<null | {
    valid: boolean; issuer: string; subject: string; issued: string; expires: string;
    daysRemaining: number; protocol: string; cipher: string; keySize: number;
    san: string[]; grade: string; checks: { label: string; pass: boolean }[];
  }>(null);

  const check = () => {
    const d = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
    if (!d) return;
    let hash = 0;
    for (let i = 0; i < d.length; i++) hash = ((hash << 5) - hash + d.charCodeAt(i)) | 0;
    const seed = Math.abs(hash);

    const issuers = ["Let's Encrypt", "DigiCert", "Comodo", "GlobalSign", "Sectigo"];
    const daysRemaining = 30 + (seed % 300);
    const valid = daysRemaining > 0;

    setResult({
      valid,
      issuer: issuers[seed % issuers.length],
      subject: d,
      issued: "2024-01-15",
      expires: `2025-${String((seed % 12) + 1).padStart(2, "0")}-15`,
      daysRemaining,
      protocol: "TLS 1.3",
      cipher: "TLS_AES_256_GCM_SHA384",
      keySize: seed % 3 === 0 ? 4096 : 2048,
      san: [d, `www.${d}`, ...(seed % 2 === 0 ? [`api.${d}`] : [])],
      grade: daysRemaining > 60 ? "A+" : daysRemaining > 30 ? "A" : "B",
      checks: [
        { label: "Valid certificate chain", pass: true },
        { label: "Strong cipher suite", pass: true },
        { label: "TLS 1.3 support", pass: seed % 4 !== 0 },
        { label: "HSTS enabled", pass: seed % 3 !== 0 },
        { label: "OCSP stapling", pass: seed % 2 === 0 },
        { label: "Certificate transparency", pass: true },
        { label: "No mixed content", pass: seed % 5 !== 0 },
        { label: "Secure renegotiation", pass: true },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Enter domain (e.g., example.com)" value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === "Enter" && check()} />
        <Button onClick={check} disabled={!domain.trim()}>Check SSL</Button>
      </div>

      {result && (
        <div className="space-y-6 mt-4">
          <div className={`flex items-center gap-4 p-6 border rounded-xl ${result.valid ? "bg-secondary/5 border-secondary/30" : "bg-destructive/5 border-destructive/30"}`}>
            <Shield className={`h-10 w-10 ${result.valid ? "text-secondary" : "text-destructive"}`} />
            <div>
              <h3 className="text-lg font-bold text-foreground">{result.valid ? "SSL Certificate Valid" : "Certificate Issue Detected"}</h3>
              <p className="text-sm text-muted-foreground">{result.daysRemaining} days until expiration</p>
            </div>
            <Badge variant="secondary" className="ml-auto text-lg">{result.grade}</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Issuer", value: result.issuer },
              { label: "Protocol", value: result.protocol },
              { label: "Cipher", value: result.cipher.split("_").slice(1, 3).join("_") },
              { label: "Key Size", value: `${result.keySize}-bit` },
            ].map((item, i) => (
              <div key={i} className="bg-muted/50 border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="border rounded-xl overflow-hidden">
            {[
              { label: "Subject", value: result.subject },
              { label: "Issued", value: result.issued },
              { label: "Expires", value: result.expires },
              { label: "SANs", value: result.san.join(", ") },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col sm:flex-row gap-1 sm:gap-4 p-3 ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                <span className="text-xs font-semibold text-muted-foreground w-24 shrink-0 uppercase">{item.label}</span>
                <span className="text-sm text-foreground font-mono break-all">{item.value}</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Security Checks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.checks.map((c, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border">
                  {c.pass ? <CheckCircle2 className="h-4 w-4 text-secondary" /> : <XCircle className="h-4 w-4 text-destructive" />}
                  <span className="text-sm text-foreground">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">⚠️ Simulated SSL analysis. Use SSL Labs or a real checker for production audits.</p>
        </div>
      )}
    </div>
  );
};

export default SslChecker;
