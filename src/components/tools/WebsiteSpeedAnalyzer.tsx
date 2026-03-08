import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, XCircle, AlertTriangle, Gauge } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface SpeedCheck {
  name: string;
  status: "pass" | "warn" | "fail";
  detail: string;
  impact: string;
}

interface SpeedResult {
  score: number;
  grade: string;
  checks: SpeedCheck[];
  recommendations: string[];
}

const checklistItems: { id: string; label: string; category: string; weight: number; passDetail: string; failDetail: string; impact: string; recommendation: string }[] = [
  { id: "minify_css", label: "CSS is minified", category: "Assets", weight: 8, passDetail: "CSS files are minified, reducing file size.", failDetail: "CSS files are not minified — can save 20-40% in file size.", impact: "Medium", recommendation: "Use a build tool like Vite, Webpack, or PostCSS to minify CSS." },
  { id: "minify_js", label: "JavaScript is minified", category: "Assets", weight: 10, passDetail: "JavaScript files are minified and optimized.", failDetail: "JavaScript files are not minified — significant size reduction possible.", impact: "High", recommendation: "Use Terser, esbuild, or your bundler's built-in minification." },
  { id: "compress", label: "Gzip/Brotli compression enabled", category: "Server", weight: 12, passDetail: "Server compression is active, reducing transfer size.", failDetail: "No compression detected — can reduce transfer size by 60-80%.", impact: "High", recommendation: "Enable Gzip or Brotli compression on your web server (nginx, Apache, CDN)." },
  { id: "images_opt", label: "Images optimized (WebP/AVIF)", category: "Assets", weight: 10, passDetail: "Images use modern formats for optimal loading.", failDetail: "Images are not optimized — convert to WebP/AVIF for 30-50% smaller files.", impact: "High", recommendation: "Convert images to WebP or AVIF format. Use responsive srcset attributes." },
  { id: "lazy_load", label: "Lazy loading for images/videos", category: "Performance", weight: 8, passDetail: "Off-screen assets are lazy-loaded.", failDetail: "Assets load eagerly — lazy loading can improve initial page speed.", impact: "Medium", recommendation: "Add loading='lazy' to images below the fold. Use Intersection Observer for videos." },
  { id: "cdn", label: "CDN configured", category: "Server", weight: 10, passDetail: "Content is served from a CDN for faster global delivery.", failDetail: "No CDN — users far from the server experience slower loads.", impact: "High", recommendation: "Use Cloudflare, Vercel, AWS CloudFront, or another CDN for static assets." },
  { id: "cache", label: "Browser caching headers set", category: "Server", weight: 8, passDetail: "Cache-Control headers are properly configured.", failDetail: "Missing cache headers — browsers re-download assets unnecessarily.", impact: "Medium", recommendation: "Set Cache-Control headers with max-age for static assets (1 year for versioned files)." },
  { id: "critical_css", label: "Critical CSS inlined", category: "Performance", weight: 6, passDetail: "Critical above-the-fold CSS is inlined for fast rendering.", failDetail: "Critical CSS not inlined — causes render-blocking.", impact: "Medium", recommendation: "Extract and inline critical CSS. Defer non-critical CSS loading." },
  { id: "preload", label: "Key resources preloaded", category: "Performance", weight: 5, passDetail: "Key fonts and scripts use preload hints.", failDetail: "Important resources lack preload hints.", impact: "Low", recommendation: "Add <link rel='preload'> for critical fonts, hero images, and key scripts." },
  { id: "http2", label: "HTTP/2 or HTTP/3 enabled", category: "Server", weight: 7, passDetail: "Modern HTTP protocol provides multiplexing and compression.", failDetail: "Using HTTP/1.1 — upgrade for parallel request handling.", impact: "Medium", recommendation: "Ensure your server or CDN supports HTTP/2 or HTTP/3." },
  { id: "no_render_block", label: "No render-blocking resources", category: "Performance", weight: 8, passDetail: "Scripts and styles don't block initial rendering.", failDetail: "Render-blocking resources delay first paint.", impact: "High", recommendation: "Add async/defer to non-critical scripts. Move CSS to load asynchronously." },
  { id: "font_opt", label: "Fonts optimized (display: swap)", category: "Assets", weight: 5, passDetail: "Fonts use display: swap for immediate text rendering.", failDetail: "Fonts may cause invisible text during loading (FOIT).", impact: "Low", recommendation: "Use font-display: swap in @font-face. Consider system font stacks." },
  { id: "tree_shake", label: "Tree shaking / code splitting", category: "Performance", weight: 8, passDetail: "Unused code is removed and routes are code-split.", failDetail: "Bundle may include unused code — increases load time.", impact: "High", recommendation: "Enable tree shaking in your bundler. Use dynamic imports for route-based code splitting." },
];

const analyzeSpeed = (checked: Set<string>): SpeedResult => {
  const checks: SpeedCheck[] = [];
  let totalWeight = 0;
  let earnedWeight = 0;
  const recommendations: string[] = [];

  checklistItems.forEach((item) => {
    totalWeight += item.weight;
    if (checked.has(item.id)) {
      earnedWeight += item.weight;
      checks.push({ name: item.label, status: "pass", detail: item.passDetail, impact: item.impact });
    } else {
      checks.push({ name: item.label, status: item.weight >= 10 ? "fail" : "warn", detail: item.failDetail, impact: item.impact });
      recommendations.push(item.recommendation);
    }
  });

  const score = Math.round((earnedWeight / totalWeight) * 100);
  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";

  return { score, grade, checks, recommendations };
};

const statusIcons = { pass: <CheckCircle2 className="h-4 w-4 text-green-500" />, warn: <AlertTriangle className="h-4 w-4 text-yellow-500" />, fail: <XCircle className="h-4 w-4 text-red-500" /> };

const WebsiteSpeedAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<SpeedResult | null>(null);

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id); else next.add(id);
    setChecked(next);
  };

  const analyze = () => {
    setResult(analyzeSpeed(checked));
  };

  const copyReport = () => {
    if (!result) return;
    const text = `Website Speed Analysis: ${url || "N/A"}\nScore: ${result.score}/100 (${result.grade})\n\n${result.checks.map((c) => `[${c.status.toUpperCase()}] ${c.name}: ${c.detail}`).join("\n")}\n\nRecommendations:\n${result.recommendations.map((r) => `- ${r}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Report copied!" });
  };

  const categories = [...new Set(checklistItems.map((i) => i.category))];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Website URL (optional)</label>
        <Input placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-foreground">Check all optimizations you've implemented:</p>
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
            <div className="space-y-2">
              {checklistItems.filter((i) => i.category === cat).map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:text-primary transition-colors">
                  <Checkbox checked={checked.has(item.id)} onCheckedChange={() => toggle(item.id)} />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={analyze} className="w-full"><Gauge className="h-4 w-4 mr-2" />Analyze Speed</Button>

      {result && (
        <div className="space-y-4">
          <div className="bg-muted/50 border rounded-lg p-4 flex items-center gap-4">
            <div className={`text-4xl font-bold ${result.score >= 75 ? "text-green-600" : result.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>{result.grade}</div>
            <div className="flex-1">
              <p className="font-bold text-foreground">Performance Score: {result.score}/100</p>
              <p className="text-xs text-muted-foreground">{result.checks.filter((c) => c.status === "pass").length}/{result.checks.length} checks passed</p>
            </div>
            <Button size="sm" variant="outline" onClick={copyReport}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
          </div>

          <div className="space-y-2">
            {result.checks.map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg">
                {statusIcons[c.status]}
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {result.recommendations.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground">Recommendations</p>
              {result.recommendations.map((r, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5"><span className="text-primary">💡</span>{r}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebsiteSpeedAnalyzer;
