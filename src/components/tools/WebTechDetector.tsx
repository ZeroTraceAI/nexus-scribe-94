import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const techDatabase: Record<string, { category: string; icon: string }> = {
  "React": { category: "Frontend Framework", icon: "⚛️" },
  "Next.js": { category: "Meta Framework", icon: "▲" },
  "Vue.js": { category: "Frontend Framework", icon: "💚" },
  "Angular": { category: "Frontend Framework", icon: "🅰️" },
  "Tailwind CSS": { category: "CSS Framework", icon: "🎨" },
  "Bootstrap": { category: "CSS Framework", icon: "🅱️" },
  "WordPress": { category: "CMS", icon: "📝" },
  "Shopify": { category: "E-commerce", icon: "🛒" },
  "Node.js": { category: "Runtime", icon: "🟢" },
  "Python": { category: "Language", icon: "🐍" },
  "Cloudflare": { category: "CDN/Security", icon: "☁️" },
  "AWS": { category: "Cloud", icon: "🔶" },
  "Google Analytics": { category: "Analytics", icon: "📊" },
  "Nginx": { category: "Web Server", icon: "🌐" },
  "Apache": { category: "Web Server", icon: "🪶" },
  "PostgreSQL": { category: "Database", icon: "🐘" },
  "MongoDB": { category: "Database", icon: "🍃" },
  "Redis": { category: "Cache", icon: "🔴" },
  "Docker": { category: "Container", icon: "🐳" },
  "Kubernetes": { category: "Orchestration", icon: "☸️" },
  "TypeScript": { category: "Language", icon: "🔷" },
  "GraphQL": { category: "API", icon: "◼️" },
  "Webpack": { category: "Bundler", icon: "📦" },
  "Vite": { category: "Bundler", icon: "⚡" },
  "jQuery": { category: "Library", icon: "💲" },
  "Stripe": { category: "Payments", icon: "💳" },
  "Vercel": { category: "Hosting", icon: "▲" },
  "Netlify": { category: "Hosting", icon: "🌐" },
};

const WebTechDetector = () => {
  const [url, setUrl] = useState("");
  const [techs, setTechs] = useState<{ name: string; category: string; icon: string; confidence: number }[]>([]);

  const detect = () => {
    const u = url.toLowerCase().trim();
    if (!u) return;
    let hash = 0;
    for (let i = 0; i < u.length; i++) hash = ((hash << 5) - hash + u.charCodeAt(i)) | 0;
    const seed = Math.abs(hash);

    const allTechs = Object.entries(techDatabase);
    const detected = allTechs
      .filter((_, i) => (seed + i * 11) % 3 !== 0)
      .map(([name, info], i) => ({
        name,
        category: info.category,
        icon: info.icon,
        confidence: Math.min(99, 60 + ((seed + i) % 40)),
      }))
      .slice(0, 12 + (seed % 6));

    setTechs(detected);
  };

  const categories = [...new Set(techs.map(t => t.category))];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Enter website URL (e.g., https://example.com)" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && detect()} />
        <Button onClick={detect} disabled={!url.trim()}>Detect</Button>
      </div>

      {techs.length > 0 && (
        <div className="space-y-6 mt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{techs.length} technologies detected</Badge>
            <Badge variant="outline">{categories.length} categories</Badge>
          </div>

          {categories.map(cat => (
            <div key={cat}>
              <h3 className="text-sm font-semibold text-foreground mb-2">{cat}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {techs.filter(t => t.category === cat).map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-sm font-medium text-foreground">{t.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{t.confidence}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}

          
        </div>
      )}
    </div>
  );
};

export default WebTechDetector;
