import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const IpLookup = () => {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const lookup = () => {
    const input = ip.trim();
    if (!input) return;
    let hash = 0;
    for (let i = 0; i < input.length; i++) hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
    const seed = Math.abs(hash);

    const isps = ["Cloudflare Inc.", "Amazon AWS", "Google Cloud", "Microsoft Azure", "DigitalOcean", "OVH SAS"];
    const cities = ["San Francisco", "New York", "London", "Frankfurt", "Singapore", "Tokyo", "Sydney"];
    const countries = ["US", "US", "GB", "DE", "SG", "JP", "AU"];
    const idx = seed % cities.length;

    setResult({
      "IP Address": input,
      "Type": input.includes(":") ? "IPv6" : "IPv4",
      "ISP": isps[seed % isps.length],
      "Organization": isps[seed % isps.length],
      "ASN": `AS${13335 + (seed % 50000)}`,
      "City": cities[idx],
      "Region": cities[idx],
      "Country": countries[idx],
      "Timezone": `UTC${seed % 2 === 0 ? "+" : "-"}${seed % 12}`,
      "Latitude": `${(seed % 90).toFixed(4)}`,
      "Longitude": `${-(seed % 180).toFixed(4)}`,
      "Proxy/VPN": seed % 5 === 0 ? "Yes (Detected)" : "No",
      "Hosting": seed % 3 === 0 ? "Yes (Data Center)" : "No (Residential)",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Enter IP address (e.g., 8.8.8.8)" value={ip} onChange={e => setIp(e.target.value)} className="font-mono" onKeyDown={e => e.key === "Enter" && lookup()} />
        <Button onClick={lookup} disabled={!ip.trim()}>Lookup</Button>
      </div>

      {result && (
        <div className="mt-4 border rounded-xl overflow-hidden">
          {Object.entries(result).map(([key, value], i) => (
            <div key={i} className={`flex flex-col sm:flex-row gap-1 sm:gap-4 p-3 ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
              <span className="text-xs font-semibold text-muted-foreground w-36 shrink-0 uppercase tracking-wider">{key}</span>
              <span className="text-sm text-foreground font-mono">{value}</span>
            </div>
          ))}
          <div className="p-3 text-xs text-muted-foreground">⚠️ Simulated geo-IP data. Use an IP geolocation API for real results.</div>
        </div>
      )}
    </div>
  );
};

export default IpLookup;
