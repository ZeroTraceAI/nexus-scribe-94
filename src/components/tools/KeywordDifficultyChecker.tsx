import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DifficultyResult {
  keyword: string;
  difficulty: number;
  label: string;
  factors: { name: string; score: number; detail: string }[];
  recommendation: string;
  estimatedTimeToRank: string;
}

const analyze = (keyword: string, da: number, monthlyContent: number, backlinks: number): DifficultyResult => {
  const words = keyword.trim().split(/\s+/);
  const wordCount = words.length;
  
  let baseDifficulty = 50;
  
  // Shorter keywords = harder
  if (wordCount <= 1) baseDifficulty += 30;
  else if (wordCount === 2) baseDifficulty += 15;
  else if (wordCount >= 4) baseDifficulty -= 15;
  else if (wordCount >= 6) baseDifficulty -= 25;

  // Commercial intent keywords are harder
  if (/best|top|buy|price|review|vs|cheap|deal/i.test(keyword)) baseDifficulty += 10;
  if (/how to|what is|guide|tutorial|learn/i.test(keyword)) baseDifficulty -= 5;

  // Domain authority factor
  const daFactor = Math.round((1 - da / 100) * 20);
  baseDifficulty += daFactor;

  // Content production factor
  const contentFactor = monthlyContent >= 10 ? -10 : monthlyContent >= 4 ? -5 : 5;
  baseDifficulty += contentFactor;

  // Backlinks factor
  const blFactor = backlinks >= 100 ? -15 : backlinks >= 30 ? -8 : backlinks >= 10 ? -3 : 10;
  baseDifficulty += blFactor;

  const difficulty = Math.max(0, Math.min(100, baseDifficulty));

  let label = "Easy";
  let recommendation = "";
  let estimatedTimeToRank = "";

  if (difficulty >= 80) {
    label = "Very Hard";
    recommendation = "This keyword is extremely competitive. Focus on long-tail variations first, build topical authority, and invest in high-quality backlinks over 6-12 months.";
    estimatedTimeToRank = "6-12+ months";
  } else if (difficulty >= 60) {
    label = "Hard";
    recommendation = "Competitive keyword. Create comprehensive, expert-level content. Build relevant backlinks and supporting content around this topic cluster.";
    estimatedTimeToRank = "3-6 months";
  } else if (difficulty >= 40) {
    label = "Moderate";
    recommendation = "Achievable with good content. Focus on creating the best resource available, include visuals, and build 5-15 quality backlinks.";
    estimatedTimeToRank = "2-4 months";
  } else if (difficulty >= 20) {
    label = "Easy";
    recommendation = "Good opportunity. Publish well-optimized, comprehensive content and you should rank within weeks. Minimal backlinks needed.";
    estimatedTimeToRank = "2-6 weeks";
  } else {
    label = "Very Easy";
    recommendation = "Low competition — publish quality content and you'll likely rank quickly. Great for building initial traffic and authority.";
    estimatedTimeToRank = "1-3 weeks";
  }

  const factors = [
    { name: "Keyword Length", score: wordCount <= 1 ? 90 : wordCount <= 2 ? 60 : wordCount <= 3 ? 40 : 20, detail: `${wordCount} word(s) — ${wordCount <= 2 ? "short, more competitive" : "long-tail, less competitive"}` },
    { name: "Search Intent", score: /best|top|buy|price|review/i.test(keyword) ? 75 : /how to|what is|guide/i.test(keyword) ? 30 : 50, detail: /best|top|buy/i.test(keyword) ? "Commercial intent — higher competition" : /how to|what is/i.test(keyword) ? "Informational intent — moderate competition" : "Mixed intent" },
    { name: "Domain Authority", score: Math.round((1 - da / 100) * 100), detail: `DA ${da} — ${da >= 50 ? "strong authority advantage" : da >= 25 ? "moderate authority" : "low authority, needs more links"}` },
    { name: "Content Velocity", score: monthlyContent >= 10 ? 20 : monthlyContent >= 4 ? 50 : 80, detail: `${monthlyContent} posts/month — ${monthlyContent >= 10 ? "high output" : "consider publishing more"}` },
    { name: "Backlink Profile", score: backlinks >= 100 ? 15 : backlinks >= 30 ? 40 : backlinks >= 10 ? 65 : 85, detail: `${backlinks} backlinks — ${backlinks >= 30 ? "solid profile" : "needs more link building"}` },
  ];

  return { keyword, difficulty, label, factors, recommendation, estimatedTimeToRank };
};

const diffColors: Record<string, string> = {
  "Very Easy": "text-green-600 bg-green-500/10",
  Easy: "text-green-600 bg-green-500/10",
  Moderate: "text-yellow-600 bg-yellow-500/10",
  Hard: "text-orange-600 bg-orange-500/10",
  "Very Hard": "text-red-600 bg-red-500/10",
};

const KeywordDifficultyChecker = () => {
  const [keyword, setKeyword] = useState("");
  const [da, setDa] = useState("30");
  const [content, setContent] = useState("4");
  const [backlinks, setBacklinks] = useState("20");
  const [result, setResult] = useState<DifficultyResult | null>(null);

  const check = () => {
    if (!keyword.trim()) {
      toast({ title: "Enter a keyword", variant: "destructive" });
      return;
    }
    setResult(analyze(keyword, Number(da) || 30, Number(content) || 4, Number(backlinks) || 20));
  };

  const copyReport = () => {
    if (!result) return;
    const text = `Keyword: ${result.keyword}\nDifficulty: ${result.difficulty}/100 (${result.label})\nEst. Time to Rank: ${result.estimatedTimeToRank}\n\n${result.recommendation}\n\nFactors:\n${result.factors.map((f) => `- ${f.name}: ${f.detail}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Report copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Target Keyword</label>
        <Input placeholder="e.g., best react frameworks 2026" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Your DA (0-100)</label>
          <Input type="number" min="0" max="100" value={da} onChange={(e) => setDa(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Posts/Month</label>
          <Input type="number" min="0" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Backlinks</label>
          <Input type="number" min="0" value={backlinks} onChange={(e) => setBacklinks(e.target.value)} />
        </div>
      </div>
      <Button onClick={check} className="w-full">Check Keyword Difficulty</Button>

      {result && (
        <div className="space-y-4">
          <div className="bg-muted/50 border rounded-lg p-4 flex items-center gap-4">
            <div className={`text-4xl font-bold ${diffColors[result.label]?.split(" ")[0]}`}>{result.difficulty}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{result.keyword}</span>
                <Badge className={diffColors[result.label]}>{result.label}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Est. time to rank: <strong>{result.estimatedTimeToRank}</strong></p>
            </div>
            <Button size="sm" variant="outline" onClick={copyReport}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
          </div>

          <div className="bg-muted/50 border rounded-lg p-4">
            <p className="text-sm text-foreground">{result.recommendation}</p>
          </div>

          <div className="space-y-2">
            {result.factors.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 border rounded-lg">
                <div className="w-12 text-center">
                  <span className={`text-sm font-bold ${f.score <= 30 ? "text-green-600" : f.score <= 60 ? "text-yellow-600" : "text-red-600"}`}>{f.score}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordDifficultyChecker;
