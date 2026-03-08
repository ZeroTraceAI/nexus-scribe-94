import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TitleResult {
  title: string;
  score: number;
  type: string;
  charCount: number;
}

const templates: Record<string, string[]> = {
  "how-to": [
    "How to {keyword} in {year} (Step-by-Step Guide)",
    "How to {keyword}: A Complete Beginner's Guide",
    "How to {keyword} Like a Pro — {number} Proven Methods",
    "The Ultimate Guide to {keyword} (With Examples)",
    "How to {keyword} in {number} Simple Steps",
    "A Developer's Guide to {keyword} in {year}",
  ],
  listicle: [
    "{number} Best {keyword} Tools You Need in {year}",
    "{number} {keyword} Tips That Actually Work",
    "Top {number} {keyword} Mistakes (And How to Fix Them)",
    "{number} {keyword} Strategies Experts Swear By",
    "{number} Things Nobody Tells You About {keyword}",
    "{number} {keyword} Hacks to Save Time and Money",
  ],
  comparison: [
    "{keyword} vs {alt}: Which Is Better in {year}?",
    "{keyword} Compared: The Definitive {year} Breakdown",
    "Is {keyword} Still Worth It? An Honest Review",
    "{keyword}: Pros, Cons, and Everything You Need to Know",
    "Why {keyword} Beats {alt} (And When It Doesn't)",
  ],
  emotional: [
    "Why {keyword} Will Change Everything in {year}",
    "Stop Doing {keyword} Wrong — Here's the Fix",
    "The {keyword} Secret Nobody Is Sharing",
    "Warning: Your {keyword} Strategy Is Costing You",
    "I Tried {keyword} for 30 Days — The Results Were Shocking",
    "The Truth About {keyword} That Experts Won't Tell You",
  ],
  seo: [
    "{keyword}: The Complete {year} Guide",
    "What Is {keyword}? Definition, Examples & Best Practices",
    "{keyword} Explained: Everything You Need to Know",
    "{keyword} for Beginners: Start Here in {year}",
    "The Complete {keyword} Cheat Sheet ({year} Edition)",
    "{keyword} Best Practices: An Expert Roundup",
  ],
};

const scoreTitle = (title: string, keyword: string): number => {
  let score = 50;
  if (title.length >= 40 && title.length <= 65) score += 15;
  else if (title.length >= 30 && title.length <= 75) score += 8;
  if (title.toLowerCase().startsWith(keyword.toLowerCase().split(" ")[0])) score += 10;
  if (/\d/.test(title)) score += 8;
  if (/[\(\)\[\]—:]/.test(title)) score += 5;
  if (/\?|!/.test(title)) score += 3;
  if (title.toLowerCase().includes(keyword.toLowerCase())) score += 9;
  return Math.min(100, score);
};

const BlogTitleGenerator = () => {
  const [keyword, setKeyword] = useState("");
  const [style, setStyle] = useState("how-to");
  const [altKeyword, setAltKeyword] = useState("");
  const [results, setResults] = useState<TitleResult[] | null>(null);

  const generate = () => {
    if (!keyword.trim()) {
      toast({ title: "Enter a topic keyword", variant: "destructive" });
      return;
    }
    const year = new Date().getFullYear().toString();
    const number = String(Math.floor(Math.random() * 8) + 3);
    const alt = altKeyword.trim() || "Traditional Methods";

    const selectedTemplates = templates[style] || templates["how-to"];
    const titles = selectedTemplates.map((tpl) => {
      const title = tpl
        .replace(/{keyword}/g, keyword.trim())
        .replace(/{year}/g, year)
        .replace(/{number}/g, number)
        .replace(/{alt}/g, alt);
      return {
        title,
        score: scoreTitle(title, keyword),
        type: style,
        charCount: title.length,
      };
    });

    // Add a few from other styles for variety
    const otherStyles = Object.keys(templates).filter((s) => s !== style);
    const bonus = otherStyles.flatMap((s) => {
      const tpl = templates[s][Math.floor(Math.random() * templates[s].length)];
      const title = tpl
        .replace(/{keyword}/g, keyword.trim())
        .replace(/{year}/g, year)
        .replace(/{number}/g, number)
        .replace(/{alt}/g, alt);
      return [{ title, score: scoreTitle(title, keyword), type: s, charCount: title.length }];
    });

    setResults([...titles, ...bonus].sort((a, b) => b.score - a.score));
  };

  const copyTitle = (title: string) => {
    navigator.clipboard.writeText(title);
    toast({ title: "Title copied!" });
  };

  const styleLabels: Record<string, string> = {
    "how-to": "How-To Guide",
    listicle: "Listicle",
    comparison: "Comparison",
    emotional: "Emotional / Clickworthy",
    seo: "SEO-Optimized",
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Topic / Keyword</label>
        <Input placeholder="e.g., React Server Components, API Security, Kubernetes" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Title Style</label>
          <Select onValueChange={setStyle} value={style}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(styleLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Comparison Term (optional)</label>
          <Input placeholder="e.g., REST APIs, AWS" value={altKeyword} onChange={(e) => setAltKeyword(e.target.value)} />
        </div>
      </div>
      <Button onClick={generate} className="w-full">Generate Blog Titles</Button>

      {results && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">{results.length} Title Ideas</h3>
            <Button size="sm" variant="outline" onClick={generate}><RefreshCw className="h-3.5 w-3.5 mr-1" /> Regenerate</Button>
          </div>
          {results.map((r, i) => (
            <div key={i} className="bg-muted/50 border rounded-lg p-3 flex items-start gap-3 group">
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <Star className={`h-4 w-4 ${r.score >= 85 ? "text-yellow-500 fill-yellow-500" : r.score >= 70 ? "text-yellow-500" : "text-muted-foreground"}`} />
                <span className="text-xs font-bold text-foreground">{r.score}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm leading-snug">{r.title}</p>
                <div className="flex gap-2 mt-1.5">
                  <Badge variant="outline" className="text-xs">{styleLabels[r.type]}</Badge>
                  <span className="text-xs text-muted-foreground">{r.charCount} chars</span>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => copyTitle(r.title)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogTitleGenerator;
