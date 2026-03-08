import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const modifiers = {
  "How-to": ["how to", "how to use", "how to start", "how to build", "how to fix", "how to improve"],
  "Best": ["best", "top", "best free", "best open source", "best cheap", "best premium"],
  "Comparison": ["vs", "alternatives", "compared to", "or", "versus", "difference between"],
  "Questions": ["what is", "why use", "when to use", "is it worth", "can you", "should I"],
  "Commercial": ["buy", "pricing", "cost", "free trial", "discount", "review"],
  "Long-tail": ["for beginners", "for developers", "for small business", "for startups", "in 2025", "step by step"],
};

const BulkKeywordGenerator = () => {
  const [seed, setSeed] = useState("");
  const [selected, setSelected] = useState<string[]>(Object.keys(modifiers));
  const [keywords, setKeywords] = useState<{ keyword: string; type: string }[]>([]);

  const generate = () => {
    const seeds = seed.split(",").map(s => s.trim()).filter(Boolean);
    if (!seeds.length) return;
    const result: { keyword: string; type: string }[] = [];
    seeds.forEach(s => {
      selected.forEach(type => {
        (modifiers as Record<string, string[]>)[type]?.forEach(mod => {
          if (type === "Comparison") {
            result.push({ keyword: `${s} ${mod}`, type });
          } else if (type === "Questions") {
            result.push({ keyword: `${mod} ${s}`, type });
          } else if (type === "Long-tail") {
            result.push({ keyword: `${s} ${mod}`, type });
          } else {
            result.push({ keyword: `${mod} ${s}`, type });
          }
        });
      });
    });
    setKeywords(result);
  };

  const toggleType = (type: string) => {
    setSelected(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const exportAll = () => {
    navigator.clipboard.writeText(keywords.map(k => k.keyword).join("\n"));
    toast({ title: `${keywords.length} keywords copied to clipboard!` });
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Enter seed keywords (comma-separated, e.g., react, nextjs, tailwind)" value={seed} onChange={e => setSeed(e.target.value)} />
      <div>
        <p className="text-xs text-muted-foreground mb-2">Modifier Types</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(modifiers).map(type => (
            <button key={type} onClick={() => toggleType(type)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selected.includes(type) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
              {type}
            </button>
          ))}
        </div>
      </div>
      <Button onClick={generate} disabled={!seed.trim()}>Generate Keywords</Button>

      {keywords.length > 0 && (
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{keywords.length} keywords generated</p>
            <Button variant="outline" size="sm" onClick={exportAll}>Copy All</Button>
          </div>
          <div className="max-h-96 overflow-y-auto space-y-1">
            {keywords.map((k, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors group">
                <span className="text-sm text-foreground">{k.keyword}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{k.type}</Badge>
                  <button onClick={() => { navigator.clipboard.writeText(k.keyword); toast({ title: "Copied!" }); }}
                    className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary">
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkKeywordGenerator;
