import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Copy, Link2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface LinkSuggestion {
  anchorText: string;
  targetPage: string;
  context: string;
  relevanceScore: number;
  position: number;
}

const findLinkOpportunities = (content: string, pages: string[]): LinkSuggestion[] => {
  const suggestions: LinkSuggestion[] = [];
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  const lowerContent = content.toLowerCase();

  pages.forEach((page) => {
    const pageName = page.trim();
    if (!pageName) return;

    const pageKeywords = pageName.toLowerCase().split(/[\s\-_/]+/).filter((w) => w.length > 3);

    sentences.forEach((sentence, idx) => {
      const lowerSentence = sentence.toLowerCase();
      const matchedKeywords = pageKeywords.filter((kw) => lowerSentence.includes(kw));

      if (matchedKeywords.length >= 1) {
        // Find the best anchor text
        const words = sentence.trim().split(/\s+/);
        let bestAnchor = "";
        let bestStart = 0;

        for (let i = 0; i < words.length; i++) {
          for (let len = 2; len <= Math.min(6, words.length - i); len++) {
            const phrase = words.slice(i, i + len).join(" ");
            const phraseKeywords = pageKeywords.filter((kw) => phrase.toLowerCase().includes(kw));
            if (phraseKeywords.length > 0 && phrase.length > bestAnchor.length) {
              bestAnchor = phrase;
              bestStart = i;
            }
          }
        }

        if (bestAnchor && bestAnchor.length > 5) {
          const relevance = Math.min(100, matchedKeywords.length * 30 + (bestAnchor.split(/\s+/).length >= 3 ? 20 : 0) + 20);
          suggestions.push({
            anchorText: bestAnchor.replace(/[,;:]/g, "").trim(),
            targetPage: pageName,
            context: sentence.trim(),
            relevanceScore: relevance,
            position: idx + 1,
          });
        }
      }
    });
  });

  // Deduplicate and sort by relevance
  const unique = suggestions.reduce((acc, s) => {
    const key = `${s.anchorText.toLowerCase()}-${s.targetPage.toLowerCase()}`;
    if (!acc.has(key) || acc.get(key)!.relevanceScore < s.relevanceScore) {
      acc.set(key, s);
    }
    return acc;
  }, new Map<string, LinkSuggestion>());

  return [...unique.values()].sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 15);
};

const InternalLinkingSuggester = () => {
  const [content, setContent] = useState("");
  const [pages, setPages] = useState("");
  const [suggestions, setSuggestions] = useState<LinkSuggestion[] | null>(null);

  const analyze = () => {
    if (!content.trim()) {
      toast({ title: "Paste your content", variant: "destructive" });
      return;
    }
    if (!pages.trim()) {
      toast({ title: "Add target pages", description: "Enter pages/URLs you want to link to.", variant: "destructive" });
      return;
    }
    const pageList = pages.split("\n").map((p) => p.trim()).filter(Boolean);
    setSuggestions(findLinkOpportunities(content, pageList));
  };

  const copyAll = () => {
    if (!suggestions) return;
    const text = suggestions.map((s) => `Anchor: "${s.anchorText}"\nTarget: ${s.targetPage}\nContext: ${s.context}\nRelevance: ${s.relevanceScore}%`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Suggestions copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Your Article Content</label>
        <Textarea placeholder="Paste your blog post or article content here..." value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Target Pages (one per line)</label>
        <Textarea
          placeholder={"React Hooks Guide\nJavaScript Performance Tips\nWeb Security Best Practices\n/blog/css-grid-tutorial"}
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          rows={4}
        />
      </div>
      <Button onClick={analyze} className="w-full"><Link2 className="h-4 w-4 mr-2" />Find Internal Link Opportunities</Button>

      {suggestions && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">{suggestions.length} Link Opportunities</h3>
            <Button size="sm" variant="outline" onClick={copyAll}><Copy className="h-3.5 w-3.5 mr-1" />Copy All</Button>
          </div>
          {suggestions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No linking opportunities found. Try adding more target pages or longer content.</p>
          )}
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="bg-muted/50 border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono text-xs">"{s.anchorText}"</Badge>
                  <span className="text-xs text-muted-foreground">→</span>
                  <Badge variant="secondary">{s.targetPage}</Badge>
                  <span className={`ml-auto text-xs font-bold ${s.relevanceScore >= 70 ? "text-green-600" : s.relevanceScore >= 40 ? "text-yellow-600" : "text-muted-foreground"}`}>{s.relevanceScore}%</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">...{s.context.substring(0, 200)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalLinkingSuggester;
