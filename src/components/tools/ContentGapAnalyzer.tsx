import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Copy, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface GapResult {
  keyword: string;
  yourCoverage: "none" | "partial" | "full";
  competitorCoverage: "partial" | "full";
  priority: "high" | "medium" | "low";
  suggestion: string;
}

const analyzeGaps = (yourKeywords: string[], competitorKeywords: string[], yourContent: string): GapResult[] => {
  const yourSet = new Set(yourKeywords.map((k) => k.toLowerCase().trim()));
  const yourContentLower = yourContent.toLowerCase();

  const gaps: GapResult[] = [];

  competitorKeywords.forEach((ck) => {
    const keyword = ck.trim();
    if (!keyword) return;
    const lowerKw = keyword.toLowerCase();

    let yourCoverage: GapResult["yourCoverage"] = "none";
    if (yourSet.has(lowerKw)) {
      yourCoverage = "full";
    } else if (yourContentLower.includes(lowerKw)) {
      yourCoverage = "partial";
    } else {
      // Check for partial word matches
      const words = lowerKw.split(/\s+/);
      const matchedWords = words.filter((w) => yourContentLower.includes(w) || [...yourSet].some((yk) => yk.includes(w)));
      if (matchedWords.length >= words.length * 0.5) {
        yourCoverage = "partial";
      }
    }

    if (yourCoverage === "full") return; // No gap

    const wordCount = keyword.split(/\s+/).length;
    let priority: GapResult["priority"] = "medium";
    if (yourCoverage === "none" && wordCount <= 3) priority = "high";
    else if (yourCoverage === "none") priority = "medium";
    else priority = "low";

    const suggestions: Record<string, string> = {
      high: `Create a dedicated, comprehensive article targeting "${keyword}". This is a significant gap your competitors are capitalizing on.`,
      medium: `Add a section about "${keyword}" to an existing relevant article, or create a new piece if the topic warrants standalone coverage.`,
      low: `Expand your existing coverage of "${keyword}" with more depth, examples, and updated information.`,
    };

    gaps.push({
      keyword,
      yourCoverage,
      competitorCoverage: "full",
      priority,
      suggestion: suggestions[priority],
    });
  });

  return gaps.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
};

const priorityColors: Record<string, string> = {
  high: "bg-red-500/10 text-red-600 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  low: "bg-green-500/10 text-green-600 border-green-500/20",
};

const coverageColors: Record<string, string> = {
  none: "bg-red-500/10 text-red-600",
  partial: "bg-yellow-500/10 text-yellow-600",
  full: "bg-green-500/10 text-green-600",
};

const ContentGapAnalyzer = () => {
  const [yourKeywords, setYourKeywords] = useState("");
  const [competitorKeywords, setCompetitorKeywords] = useState("");
  const [yourContent, setYourContent] = useState("");
  const [results, setResults] = useState<GapResult[] | null>(null);

  const analyze = () => {
    const compKws = competitorKeywords.split("\n").map((k) => k.trim()).filter(Boolean);
    if (compKws.length === 0) {
      toast({ title: "Add competitor keywords", variant: "destructive" });
      return;
    }
    const yourKws = yourKeywords.split("\n").map((k) => k.trim()).filter(Boolean);
    setResults(analyzeGaps(yourKws, compKws, yourContent));
  };

  const copyReport = () => {
    if (!results) return;
    const text = `Content Gap Analysis Report\n\n${results.length} gaps found\n\n` +
      results.map((r) => `[${r.priority.toUpperCase()}] "${r.keyword}" — Coverage: ${r.yourCoverage}\n${r.suggestion}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Report copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Your Keywords (one per line)</label>
        <Textarea placeholder={"react hooks\nnext.js tutorial\ntailwind css guide\ntypescript patterns"} value={yourKeywords} onChange={(e) => setYourKeywords(e.target.value)} rows={4} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Competitor Keywords (one per line)</label>
        <Textarea placeholder={"react hooks guide\nreact server components\nnext.js middleware\ntailwind animations\nreact testing library\ntypescript generics"} value={competitorKeywords} onChange={(e) => setCompetitorKeywords(e.target.value)} rows={4} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Your Existing Content (optional — paste for deeper analysis)</label>
        <Textarea placeholder="Paste your existing content to check for partial keyword coverage..." value={yourContent} onChange={(e) => setYourContent(e.target.value)} rows={4} />
      </div>
      <Button onClick={analyze} className="w-full"><Target className="h-4 w-4 mr-2" />Analyze Content Gaps</Button>

      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">{results.length} Content Gaps Found</h3>
            <Button size="sm" variant="outline" onClick={copyReport}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
          </div>

          {results.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No content gaps found — great coverage!</p>}

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-red-500/10 rounded-lg p-2">
              <p className="font-bold text-red-600 text-lg">{results.filter((r) => r.priority === "high").length}</p>
              <p className="text-muted-foreground">High Priority</p>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-2">
              <p className="font-bold text-yellow-600 text-lg">{results.filter((r) => r.priority === "medium").length}</p>
              <p className="text-muted-foreground">Medium</p>
            </div>
            <div className="bg-green-500/10 rounded-lg p-2">
              <p className="font-bold text-green-600 text-lg">{results.filter((r) => r.priority === "low").length}</p>
              <p className="text-muted-foreground">Low</p>
            </div>
          </div>

          <div className="space-y-2">
            {results.map((gap, i) => (
              <div key={i} className="bg-muted/50 border rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground text-sm">"{gap.keyword}"</span>
                  <Badge className={priorityColors[gap.priority]}>{gap.priority}</Badge>
                  <Badge className={coverageColors[gap.yourCoverage]}>Your coverage: {gap.yourCoverage}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{gap.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGapAnalyzer;
