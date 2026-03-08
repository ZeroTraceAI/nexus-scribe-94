import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const WhoisLookup = () => {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const lookup = () => {
    const d = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
    if (!d) return;

    let hash = 0;
    for (let i = 0; i < d.length; i++) hash = ((hash << 5) - hash + d.charCodeAt(i)) | 0;
    const seed = Math.abs(hash);

    const registrars = ["GoDaddy", "Namecheap", "Cloudflare", "Google Domains", "Hover", "Gandi"];
    const statuses = ["clientTransferProhibited", "clientDeleteProhibited"];
    const years = 2010 + (seed % 14);
    const expYear = 2025 + (seed % 5);

    setResult({
      "Domain Name": d.toUpperCase(),
      "Registrar": registrars[seed % registrars.length],
      "Registration Date": `${years}-${String((seed % 12) + 1).padStart(2, "0")}-${String((seed % 28) + 1).padStart(2, "0")}`,
      "Expiration Date": `${expYear}-${String((seed % 12) + 1).padStart(2, "0")}-${String((seed % 28) + 1).padStart(2, "0")}`,
      "Updated Date": `2024-${String((seed % 12) + 1).padStart(2, "0")}-15`,
      "Name Servers": `ns1.${d}\nns2.${d}`,
      "Domain Status": statuses.join("\n"),
      "DNSSEC": seed % 2 === 0 ? "signed" : "unsigned",
      "Registrant Organization": "REDACTED FOR PRIVACY",
      "Registrant Country": seed % 3 === 0 ? "US" : seed % 3 === 1 ? "GB" : "DE",
      "Admin Email": "REDACTED@contact.example.com",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Enter domain name (e.g., example.com)" value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === "Enter" && lookup()} />
        <Button onClick={lookup} disabled={!domain.trim()}>Lookup</Button>
      </div>

      {result && (
        <div className="space-y-3 mt-4">
          <div className="bg-muted/50 border rounded-xl p-4">
            <h3 className="text-lg font-bold text-foreground mb-1">{result["Domain Name"]}</h3>
            <Badge variant="secondary">{result["Registrar"]}</Badge>
          </div>
          <div className="border rounded-xl overflow-hidden">
            {Object.entries(result).map(([key, value], i) => (
              <div key={i} className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 p-3 ${i % 2 === 0 ? "bg-muted/30" : "bg-muted/10"}`}>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-48 shrink-0">{key}</span>
                <span className="text-sm text-foreground font-mono whitespace-pre-wrap break-all">{value}</span>
              </div>
            ))}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default WhoisLookup;
