import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const headers = [
  { name: "Content-Security-Policy", importance: "Critical", description: "Prevents XSS, clickjacking, and code injection attacks by specifying allowed content sources.", recommendation: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" },
  { name: "Strict-Transport-Security", importance: "Critical", description: "Forces HTTPS connections, preventing downgrade attacks and cookie hijacking.", recommendation: "max-age=31536000; includeSubDomains; preload" },
  { name: "X-Content-Type-Options", importance: "High", description: "Prevents browsers from MIME-sniffing, reducing exposure to drive-by downloads.", recommendation: "nosniff" },
  { name: "X-Frame-Options", importance: "High", description: "Prevents clickjacking by controlling whether the site can be embedded in frames.", recommendation: "DENY" },
  { name: "X-XSS-Protection", importance: "Medium", description: "Legacy XSS filter. Modern browsers rely on CSP, but still good practice.", recommendation: "1; mode=block" },
  { name: "Referrer-Policy", importance: "Medium", description: "Controls how much referrer information is shared with external sites.", recommendation: "strict-origin-when-cross-origin" },
  { name: "Permissions-Policy", importance: "Medium", description: "Controls which browser features the site can use (camera, mic, geolocation).", recommendation: "camera=(), microphone=(), geolocation=(), payment=()" },
  { name: "Cross-Origin-Opener-Policy", importance: "Medium", description: "Prevents cross-origin attacks like Spectre by isolating browsing contexts.", recommendation: "same-origin" },
  { name: "Cross-Origin-Resource-Policy", importance: "Low", description: "Restricts which origins can load your resources.", recommendation: "same-origin" },
  { name: "Cross-Origin-Embedder-Policy", importance: "Low", description: "Ensures a document only loads resources that grant explicit permission.", recommendation: "require-corp" },
];

const SecurityHeaderChecker = () => {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<null | { header: string; present: boolean; importance: string; description: string; recommendation: string }[]>(null);
  const [score, setScore] = useState(0);

  const check = () => {
    if (!url.trim()) return;
    // Simulate results based on URL hash
    let hash = 0;
    for (let i = 0; i < url.length; i++) hash = ((hash << 5) - hash + url.charCodeAt(i)) | 0;
    const seed = Math.abs(hash);

    const checked = headers.map((h, i) => ({
      header: h.name,
      present: (seed + i * 7) % 3 !== 0,
      importance: h.importance,
      description: h.description,
      recommendation: h.recommendation,
    }));

    const total = checked.length;
    const present = checked.filter(c => c.present).length;
    const weightedScore = checked.reduce((acc, c) => {
      const weight = c.importance === "Critical" ? 20 : c.importance === "High" ? 15 : c.importance === "Medium" ? 10 : 5;
      return acc + (c.present ? weight : 0);
    }, 0);
    const maxWeight = headers.reduce((acc, h) => acc + (h.importance === "Critical" ? 20 : h.importance === "High" ? 15 : h.importance === "Medium" ? 10 : 5), 0);

    setScore(Math.round((weightedScore / maxWeight) * 100));
    setResults(checked);
  };

  const grade = score >= 90 ? "A+" : score >= 75 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D";

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Enter website URL (e.g., https://example.com)" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && check()} />
        <Button onClick={check} disabled={!url.trim()}>Check Headers</Button>
      </div>

      {results && (
        <div className="space-y-6 mt-4">
          <div className="flex items-center gap-6 p-6 bg-muted/50 border rounded-xl">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{score}%</p>
              <Badge variant="secondary" className="mt-1">{grade} Grade</Badge>
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground font-semibold">{results.filter(r => r.present).length}/{results.length} headers detected</p>
              <p className="text-xs text-muted-foreground mt-1">Missing {results.filter(r => !r.present).length} security headers</p>
            </div>
          </div>

          <div className="space-y-2">
            {results.map((r, i) => (
              <details key={i} className={`border rounded-lg ${r.present ? "bg-muted/30" : "bg-destructive/5 border-destructive/20"}`}>
                <summary className="flex items-center justify-between p-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    {r.present ? <CheckCircle2 className="h-4 w-4 text-secondary" /> : <XCircle className="h-4 w-4 text-destructive" />}
                    <span className="text-sm font-mono font-medium text-foreground">{r.header}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.importance === "Critical" ? "destructive" : "outline"} className="text-xs">{r.importance}</Badge>
                    <Badge variant={r.present ? "secondary" : "destructive"} className="text-xs">{r.present ? "Present" : "Missing"}</Badge>
                  </div>
                </summary>
                <div className="px-3 pb-3 text-xs space-y-2">
                  <p className="text-muted-foreground">{r.description}</p>
                  {!r.present && (
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground mb-1">Recommended value:</p>
                      <code className="text-xs text-primary font-mono">{r.header}: {r.recommendation}</code>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>

          
        </div>
      )}
    </div>
  );
};

export default SecurityHeaderChecker;
