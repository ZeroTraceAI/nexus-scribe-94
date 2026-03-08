import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const PlagiarismChecker = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | {
    uniqueScore: number;
    fragments: { text: string; status: string; similarity: number }[];
    stats: { totalSentences: number; uniqueSentences: number; flagged: number };
  }>(null);

  const check = () => {
    if (!text.trim()) return;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const commonPhrases = [
      "in today's digital age", "it is important to note", "in conclusion",
      "plays a crucial role", "has become increasingly", "in the modern world",
      "this article will explore", "studies have shown that", "according to research",
      "as we can see", "on the other hand", "in recent years",
      "it goes without saying", "needless to say", "at the end of the day",
    ];

    const fragments = sentences.map(s => {
      const trimmed = s.trim();
      const lower = trimmed.toLowerCase();
      let similarity = 0;
      const matchedPhrases = commonPhrases.filter(p => lower.includes(p));
      similarity += matchedPhrases.length * 20;

      const words = lower.split(/\s+/);
      const nGrams: string[] = [];
      for (let i = 0; i < words.length - 3; i++) {
        nGrams.push(words.slice(i, i + 4).join(" "));
      }
      const genericPatterns = [/^the .+ is .+ that/, /^it is .+ to .+/, /^there are .+ ways to/];
      genericPatterns.forEach(p => { if (p.test(lower)) similarity += 10; });

      similarity = Math.min(95, similarity);
      const status = similarity > 50 ? "Flagged" : similarity > 20 ? "Review" : "Unique";
      return { text: trimmed, status, similarity };
    });

    const flagged = fragments.filter(f => f.status === "Flagged").length;
    const uniqueSentences = fragments.filter(f => f.status === "Unique").length;
    const uniqueScore = Math.round((uniqueSentences / fragments.length) * 100);

    setResult({
      uniqueScore,
      fragments,
      stats: { totalSentences: fragments.length, uniqueSentences, flagged },
    });
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste your content to check for potential plagiarism..." value={text} onChange={e => setText(e.target.value)} rows={8} />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{text.split(/\s+/).filter(Boolean).length} words</span>
        <Button onClick={check} disabled={text.trim().length < 50}>Check Plagiarism</Button>
      </div>

      {result && (
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-muted/50 border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Uniqueness Score</p>
              <p className={`text-3xl font-bold ${result.uniqueScore > 70 ? "text-secondary" : "text-destructive"}`}>{result.uniqueScore}%</p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Unique Sentences</p>
              <p className="text-3xl font-bold text-foreground">{result.stats.uniqueSentences}/{result.stats.totalSentences}</p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Flagged</p>
              <p className="text-3xl font-bold text-destructive">{result.stats.flagged}</p>
            </div>
          </div>

          <div>
            <Progress value={result.uniqueScore} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Plagiarized</span><span>Unique</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Sentence Analysis</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {result.fragments.map((f, i) => (
                <div key={i} className={`p-3 rounded-lg border ${f.status === "Flagged" ? "border-destructive/30 bg-destructive/5" : f.status === "Review" ? "border-yellow-500/30 bg-yellow-500/5" : "bg-muted/30"}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm text-foreground flex-1">{f.text}</p>
                    <Badge variant={f.status === "Flagged" ? "destructive" : f.status === "Review" ? "secondary" : "outline"} className="text-xs shrink-0">{f.status}</Badge>
                  </div>
                  <Progress value={100 - f.similarity} className="h-1" />
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">⚠️ This tool uses heuristic pattern matching. For comprehensive plagiarism checking, use a dedicated plagiarism service with a web index.</p>
        </div>
      )}
    </div>
  );
};

export default PlagiarismChecker;
