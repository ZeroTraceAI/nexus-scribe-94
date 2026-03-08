import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DomainAuthorityChecker = () => {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<null | {
    domain: string;
    da: number;
    pa: number;
    spamScore: number;
    backlinks: number;
    referringDomains: number;
    trustFlow: number;
    citationFlow: number;
    age: string;
    grade: string;
  }>(null);

  const check = () => {
    const d = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
    if (!d) return;

    // Deterministic simulation based on domain hash
    let hash = 0;
    for (let i = 0; i < d.length; i++) hash = ((hash << 5) - hash + d.charCodeAt(i)) | 0;
    const seed = Math.abs(hash);

    const tlds: Record<string, number> = { ".com": 10, ".org": 8, ".io": 7, ".dev": 6, ".net": 5 };
    const tldBonus = Object.entries(tlds).find(([ext]) => d.endsWith(ext))?.[1] || 3;
    const lengthBonus = d.length < 10 ? 8 : d.length < 15 ? 4 : 0;

    const da = Math.min(100, Math.max(1, ((seed % 50) + tldBonus + lengthBonus + 15)));
    const pa = Math.min(100, Math.max(1, da - (seed % 15) + 5));
    const spamScore = Math.max(0, Math.min(17, (seed % 5)));
    const backlinks = (seed % 50000) + 100;
    const referringDomains = Math.round(backlinks * (0.05 + (seed % 20) / 100));
    const trustFlow = Math.min(100, Math.max(5, da - (seed % 20)));
    const citationFlow = Math.min(100, Math.max(5, da + (seed % 10)));
    const years = (seed % 15) + 1;
    const grade = da >= 80 ? "A+" : da >= 60 ? "A" : da >= 40 ? "B" : da >= 20 ? "C" : "D";

    setResults({
      domain: d, da, pa, spamScore, backlinks, referringDomains,
      trustFlow, citationFlow, age: `${years} years`, grade,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Enter domain (e.g., example.com)" value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === "Enter" && check()} />
        <Button onClick={check} disabled={!domain.trim()}>Check DA</Button>
      </div>

      {results && (
        <div className="space-y-6 mt-4">
          <div className="text-center p-6 bg-muted/50 border rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">{results.domain}</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-5xl font-bold text-primary">{results.da}</p>
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
            <Badge variant="secondary" className="mt-2 text-sm">{results.grade} Grade</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Page Authority", value: results.pa, suffix: "/100" },
              { label: "Spam Score", value: results.spamScore, suffix: "/17" },
              { label: "Trust Flow", value: results.trustFlow, suffix: "/100" },
              { label: "Citation Flow", value: results.citationFlow, suffix: "/100" },
            ].map((m, i) => (
              <div key={i} className="bg-muted/50 border rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold text-foreground">{m.value}<span className="text-xs text-muted-foreground">{m.suffix}</span></p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-muted/50 border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Backlinks</p>
              <p className="text-xl font-bold text-foreground">{results.backlinks.toLocaleString()}</p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Referring Domains</p>
              <p className="text-xl font-bold text-foreground">{results.referringDomains.toLocaleString()}</p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Domain Age</p>
              <p className="text-xl font-bold text-foreground">{results.age}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Authority Breakdown</h3>
            {[
              { label: "Domain Authority", value: results.da },
              { label: "Page Authority", value: results.pa },
              { label: "Trust Flow", value: results.trustFlow },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-muted-foreground w-32">{item.label}</span>
                <Progress value={item.value} className="h-2 flex-1" />
                <span className="text-xs font-mono font-bold text-foreground w-8">{item.value}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">⚠️ Simulated metrics for demonstration. Use Moz, Ahrefs, or Semrush APIs for real data.</p>
        </div>
      )}
    </div>
  );
};

export default DomainAuthorityChecker;
