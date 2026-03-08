import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SerpResult {
  position: number;
  ctr: number;
  probability: number;
  monthlyClicks: number;
  difficulty: string;
}

const baseCTR = [0.396, 0.188, 0.103, 0.074, 0.053, 0.038, 0.028, 0.022, 0.018, 0.015];

const calculateSerp = (
  keyword: string,
  searchVolume: number,
  domainAuthority: number,
  contentQuality: number,
  backlinks: number,
  competitionLevel: string
): SerpResult[] => {
  const competitionMultiplier: Record<string, number> = { low: 1.3, medium: 1.0, high: 0.7, "very-high": 0.5 };
  const compMult = competitionMultiplier[competitionLevel] || 1.0;

  // Calculate a composite score
  const daScore = Math.min(domainAuthority / 100, 1);
  const qualityScore = contentQuality / 10;
  const backlinkScore = Math.min(Math.log10(backlinks + 1) / 4, 1);
  const compositeScore = (daScore * 0.4 + qualityScore * 0.3 + backlinkScore * 0.3) * compMult;

  return baseCTR.map((ctr, i) => {
    const position = i + 1;
    // Higher composite score = higher probability for top positions
    const rawProb = compositeScore * (1 - i * 0.08);
    const probability = Math.max(0, Math.min(100, rawProb * 100));
    const adjustedCTR = ctr * (1 + (compositeScore - 0.5) * 0.2);
    const monthlyClicks = Math.round(searchVolume * adjustedCTR);

    let difficulty = "Easy";
    if (position <= 3 && compositeScore < 0.5) difficulty = "Hard";
    else if (position <= 3 && compositeScore < 0.7) difficulty = "Moderate";
    else if (position <= 5 && compositeScore < 0.4) difficulty = "Hard";
    else if (position <= 5 && compositeScore < 0.6) difficulty = "Moderate";
    else if (position > 5) difficulty = "Easy";

    return { position, ctr: Math.round(adjustedCTR * 1000) / 10, probability: Math.round(probability * 10) / 10, monthlyClicks, difficulty };
  });
};

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-500/10",
  Moderate: "text-yellow-600 bg-yellow-500/10",
  Hard: "text-red-600 bg-red-500/10",
};

const SerpCalculator = () => {
  const [keyword, setKeyword] = useState("");
  const [volume, setVolume] = useState("1000");
  const [da, setDa] = useState("30");
  const [quality, setQuality] = useState("7");
  const [backlinks, setBacklinks] = useState("50");
  const [competition, setCompetition] = useState("medium");
  const [results, setResults] = useState<SerpResult[] | null>(null);

  const calculate = () => {
    if (!keyword.trim()) {
      toast({ title: "Enter a keyword", variant: "destructive" });
      return;
    }
    const data = calculateSerp(keyword, Number(volume) || 1000, Number(da) || 30, Number(quality) || 7, Number(backlinks) || 50, competition);
    setResults(data);
  };

  const copyResults = () => {
    if (!results) return;
    const text = `SERP Ranking Probability for "${keyword}"\n\n` +
      results.map((r) => `#${r.position}: ${r.probability}% chance | CTR: ${r.ctr}% | ~${r.monthlyClicks} clicks/mo | ${r.difficulty}`).join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Results copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Target Keyword</label>
        <Input placeholder="e.g., best project management tools" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Monthly Search Volume</label>
          <Input type="number" placeholder="1000" value={volume} onChange={(e) => setVolume(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Domain Authority (0-100)</label>
          <Input type="number" placeholder="30" min="0" max="100" value={da} onChange={(e) => setDa(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Content Quality (1-10)</label>
          <Input type="number" placeholder="7" min="1" max="10" value={quality} onChange={(e) => setQuality(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Backlinks Count</label>
          <Input type="number" placeholder="50" value={backlinks} onChange={(e) => setBacklinks(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Competition Level</label>
        <Select onValueChange={setCompetition} value={competition}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="very-high">Very High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={calculate} className="w-full">Calculate Ranking Probability</Button>

      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">Ranking Predictions for "{keyword}"</h3>
            <Button size="sm" variant="outline" onClick={copyResults}><Copy className="h-3.5 w-3.5 mr-1" /> Copy</Button>
          </div>
          <div className="space-y-2">
            {results.map((r) => (
              <div key={r.position} className="bg-muted/50 border rounded-lg p-3 flex items-center gap-4">
                <span className="text-lg font-bold text-foreground w-8 text-center">#{r.position}</span>
                <div className="flex-1">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${r.probability}%` }} />
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground w-16 text-right">{r.probability}%</span>
                <span className="text-xs text-muted-foreground w-16 text-right">CTR {r.ctr}%</span>
                <span className="text-xs text-muted-foreground w-20 text-right">~{r.monthlyClicks}/mo</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[r.difficulty]}`}>{r.difficulty}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Estimates based on domain authority, content quality, backlink profile, and competition level. Actual rankings depend on many additional factors.</p>
        </div>
      )}
    </div>
  );
};

export default SerpCalculator;
