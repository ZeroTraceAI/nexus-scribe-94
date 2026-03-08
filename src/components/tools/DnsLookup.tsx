import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const recordTypes = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA"];

const DnsLookup = () => {
  const [domain, setDomain] = useState("");
  const [type, setType] = useState("A");
  const [records, setRecords] = useState<null | { type: string; name: string; value: string; ttl: number }[]>(null);

  const lookup = () => {
    const d = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
    if (!d) return;

    let hash = 0;
    for (let i = 0; i < d.length; i++) hash = ((hash << 5) - hash + d.charCodeAt(i)) | 0;
    const seed = Math.abs(hash);

    const generateRecords = (t: string) => {
      switch (t) {
        case "A": return [
          { type: "A", name: d, value: `${104 + (seed % 50)}.${(seed % 256)}.${(seed * 3) % 256}.${(seed * 7) % 256}`, ttl: 300 },
          { type: "A", name: d, value: `${104 + (seed % 50)}.${(seed % 256)}.${(seed * 3) % 256}.${((seed * 7) % 256) + 1}`, ttl: 300 },
        ];
        case "AAAA": return [
          { type: "AAAA", name: d, value: `2606:4700:${(seed % 9999).toString(16)}::${(seed % 255).toString(16)}`, ttl: 300 },
        ];
        case "CNAME": return [
          { type: "CNAME", name: `www.${d}`, value: `${d}.cdn.cloudflare.net`, ttl: 3600 },
        ];
        case "MX": return [
          { type: "MX", name: d, value: `10 mail.${d}`, ttl: 3600 },
          { type: "MX", name: d, value: `20 mail2.${d}`, ttl: 3600 },
        ];
        case "TXT": return [
          { type: "TXT", name: d, value: `v=spf1 include:_spf.google.com ~all`, ttl: 3600 },
          { type: "TXT", name: d, value: `google-site-verification=${seed.toString(36).slice(0, 20)}`, ttl: 3600 },
        ];
        case "NS": return [
          { type: "NS", name: d, value: `ns1.${d.includes("cloudflare") ? "cloudflare" : "registrar"}.com`, ttl: 86400 },
          { type: "NS", name: d, value: `ns2.${d.includes("cloudflare") ? "cloudflare" : "registrar"}.com`, ttl: 86400 },
        ];
        case "SOA": return [
          { type: "SOA", name: d, value: `ns1.${d} admin.${d} ${seed} 3600 900 604800 86400`, ttl: 86400 },
        ];
        default: return [];
      }
    };

    setRecords(generateRecords(type));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Enter domain (e.g., example.com)" value={domain} onChange={e => setDomain(e.target.value)} className="flex-1" onKeyDown={e => e.key === "Enter" && lookup()} />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>{recordTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
        <Button onClick={lookup} disabled={!domain.trim()}>Lookup</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {recordTypes.map(t => (
          <button key={t} onClick={() => { setType(t); if (domain.trim()) { setTimeout(() => lookup(), 0); } }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${type === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
            {t}
          </button>
        ))}
      </div>

      {records && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{type} Records</Badge>
            <span className="text-xs text-muted-foreground">{records.length} record(s) found</span>
          </div>
          <div className="border rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 gap-2 p-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Type</span><span>Name</span><span>Value</span><span>TTL</span>
            </div>
            {records.map((r, i) => (
              <div key={i} className={`grid grid-cols-4 gap-2 p-3 text-sm ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                <Badge variant="outline" className="text-xs w-fit">{r.type}</Badge>
                <span className="text-foreground font-mono text-xs break-all">{r.name}</span>
                <span className="text-foreground font-mono text-xs break-all">{r.value}</span>
                <span className="text-muted-foreground text-xs">{r.ttl}s</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">⚠️ Simulated DNS records. Use dig, nslookup, or a DNS API for real records.</p>
        </div>
      )}
    </div>
  );
};

export default DnsLookup;
