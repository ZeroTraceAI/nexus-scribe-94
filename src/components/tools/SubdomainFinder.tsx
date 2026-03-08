import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const commonSubdomains = [
  "www", "mail", "ftp", "admin", "api", "dev", "staging", "app", "blog", "cdn",
  "docs", "help", "status", "shop", "store", "portal", "dashboard", "m", "mobile",
  "auth", "login", "sso", "vpn", "git", "ci", "test", "beta", "demo", "support",
];

const SubdomainFinder = () => {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<{ subdomain: string; ip: string; status: string }[]>([]);

  const scan = () => {
    const d = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
    if (!d) return;
    let hash = 0;
    for (let i = 0; i < d.length; i++) hash = ((hash << 5) - hash + d.charCodeAt(i)) | 0;
    const seed = Math.abs(hash);

    const found = commonSubdomains
      .filter((_, i) => (seed + i * 7) % 3 !== 0)
      .map((sub, i) => ({
        subdomain: `${sub}.${d}`,
        ip: `${104 + ((seed + i) % 50)}.${(seed + i * 3) % 256}.${(seed + i * 7) % 256}.${(seed + i * 11) % 256}`,
        status: (seed + i) % 10 === 0 ? "Inactive" : "Active",
      }));

    setResults(found);
  };

  const exportAll = () => {
    navigator.clipboard.writeText(results.map(r => r.subdomain).join("\n"));
    toast({ title: `${results.length} subdomains copied!` });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Enter domain (e.g., example.com)" value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === "Enter" && scan()} />
        <Button onClick={scan} disabled={!domain.trim()}>Find Subdomains</Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{results.length} subdomains found</p>
            <Button variant="outline" size="sm" onClick={exportAll}>Export All</Button>
          </div>
          <div className="border rounded-xl overflow-hidden max-h-96 overflow-y-auto">
            <div className="grid grid-cols-3 gap-2 p-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0">
              <span>Subdomain</span><span>IP Address</span><span>Status</span>
            </div>
            {results.map((r, i) => (
              <div key={i} className={`grid grid-cols-3 gap-2 p-3 text-sm ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                <span className="text-foreground font-mono text-xs break-all">{r.subdomain}</span>
                <span className="text-muted-foreground font-mono text-xs">{r.ip}</span>
                <Badge variant={r.status === "Active" ? "secondary" : "destructive"} className="text-xs w-fit">{r.status}</Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">⚠️ Simulated subdomain enumeration. Use tools like subfinder or amass for real results.</p>
        </div>
      )}
    </div>
  );
};

export default SubdomainFinder;
