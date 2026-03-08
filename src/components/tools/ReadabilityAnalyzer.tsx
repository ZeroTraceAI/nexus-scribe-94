import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReadabilityResult {
  score: number;
  grade: string;
  level: string;
  metrics: { name: string; value: string; status: "good" | "ok" | "bad" }[];
  suggestions: string[];
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  paragraphCount: number;
  readingTime: number;
}

const countSyllables = (word: string): number => {
  const w = word.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const matches = w.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
};

const analyze = (text: string): ReadabilityResult => {
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const totalSyllables = words.reduce((acc, w) => acc + countSyllables(w), 0);
  const avgSyllablesPerWord = wordCount > 0 ? totalSyllables / wordCount : 0;

  // Flesch Reading Ease
  const fleschScore = Math.round(206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord);
  const score = Math.max(0, Math.min(100, fleschScore));

  // Grade level (Flesch-Kincaid)
  const gradeLevel = Math.round(0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59);
  const grade = gradeLevel <= 5 ? "5th Grade" : gradeLevel <= 8 ? `${gradeLevel}th Grade` : gradeLevel <= 12 ? `${gradeLevel}th Grade` : "College Level";

  let level = "Very Easy";
  if (score >= 90) level = "Very Easy";
  else if (score >= 80) level = "Easy";
  else if (score >= 70) level = "Fairly Easy";
  else if (score >= 60) level = "Standard";
  else if (score >= 50) level = "Fairly Difficult";
  else if (score >= 30) level = "Difficult";
  else level = "Very Difficult";

  const readingTime = Math.ceil(wordCount / 200);

  // Complex words (3+ syllables)
  const complexWords = words.filter((w) => countSyllables(w) >= 3);
  const complexPct = wordCount > 0 ? Math.round((complexWords.length / wordCount) * 100) : 0;

  // Long sentences
  const longSentences = sentences.filter((s) => s.trim().split(/\s+/).length > 25);
  const longSentencePct = sentenceCount > 0 ? Math.round((longSentences.length / sentenceCount) * 100) : 0;

  // Passive voice (simple detection)
  const passiveMatches = text.match(/\b(is|was|were|are|been|being|be)\s+\w+ed\b/gi) || [];
  const passivePct = sentenceCount > 0 ? Math.round((passiveMatches.length / sentenceCount) * 100) : 0;

  const metrics = [
    { name: "Avg. Words/Sentence", value: avgWordsPerSentence.toFixed(1), status: (avgWordsPerSentence <= 20 ? "good" : avgWordsPerSentence <= 25 ? "ok" : "bad") as "good" | "ok" | "bad" },
    { name: "Avg. Syllables/Word", value: avgSyllablesPerWord.toFixed(2), status: (avgSyllablesPerWord <= 1.5 ? "good" : avgSyllablesPerWord <= 1.8 ? "ok" : "bad") as "good" | "ok" | "bad" },
    { name: "Complex Words", value: `${complexPct}%`, status: (complexPct <= 10 ? "good" : complexPct <= 20 ? "ok" : "bad") as "good" | "ok" | "bad" },
    { name: "Long Sentences", value: `${longSentencePct}%`, status: (longSentencePct <= 15 ? "good" : longSentencePct <= 30 ? "ok" : "bad") as "good" | "ok" | "bad" },
    { name: "Passive Voice", value: `${passivePct}%`, status: (passivePct <= 10 ? "good" : passivePct <= 20 ? "ok" : "bad") as "good" | "ok" | "bad" },
  ];

  const suggestions: string[] = [];
  if (avgWordsPerSentence > 20) suggestions.push("Break up long sentences — aim for an average of 15-20 words per sentence.");
  if (complexPct > 15) suggestions.push("Reduce complex words (3+ syllables) — use simpler alternatives where possible.");
  if (longSentencePct > 20) suggestions.push(`${longSentences.length} sentences are over 25 words. Split them into shorter, clearer sentences.`);
  if (passivePct > 15) suggestions.push("Reduce passive voice usage. Rewrite passive sentences to active voice for clarity.");
  if (paragraphCount <= 1 && wordCount > 100) suggestions.push("Break your content into multiple paragraphs for better readability.");
  if (suggestions.length === 0) suggestions.push("Your content has excellent readability — well done!");

  return { score, grade, level, metrics, suggestions, wordCount, sentenceCount, avgWordsPerSentence, avgSyllablesPerWord, paragraphCount, readingTime };
};

const statusIcons = { good: <CheckCircle2 className="h-4 w-4 text-green-500" />, ok: <AlertTriangle className="h-4 w-4 text-yellow-500" />, bad: <XCircle className="h-4 w-4 text-red-500" /> };

const ReadabilityAnalyzer = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReadabilityResult | null>(null);

  const run = () => {
    if (text.trim().split(/\s+/).length < 10) {
      toast({ title: "Add more text", description: "Enter at least 10 words for accurate analysis.", variant: "destructive" });
      return;
    }
    setResult(analyze(text));
  };

  const copyReport = () => {
    if (!result) return;
    const report = `Readability Score: ${result.score}/100 (${result.level})\nGrade Level: ${result.grade}\nWords: ${result.wordCount} | Sentences: ${result.sentenceCount} | Reading Time: ${result.readingTime} min\n\nMetrics:\n${result.metrics.map((m) => `- ${m.name}: ${m.value}`).join("\n")}\n\nSuggestions:\n${result.suggestions.map((s) => `- ${s}`).join("\n")}`;
    navigator.clipboard.writeText(report);
    toast({ title: "Report copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Paste Your Content</label>
        <Textarea placeholder="Paste your article, blog post, or any text to analyze readability..." value={text} onChange={(e) => setText(e.target.value)} rows={10} />
      </div>
      <Button onClick={run} className="w-full">Analyze Readability</Button>

      {result && (
        <div className="space-y-4">
          <div className="bg-muted/50 border rounded-lg p-4 flex items-center gap-4">
            <div className={`text-4xl font-bold ${result.score >= 70 ? "text-green-600" : result.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>{result.score}</div>
            <div className="flex-1">
              <p className="font-bold text-foreground">{result.level}</p>
              <p className="text-xs text-muted-foreground">{result.grade} · {result.wordCount} words · {result.sentenceCount} sentences · {result.readingTime} min read</p>
            </div>
            <Button size="sm" variant="outline" onClick={copyReport}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
          </div>

          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${result.score >= 70 ? "bg-green-500" : result.score >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${result.score}%` }} />
          </div>

          <div className="space-y-2">
            {result.metrics.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 border rounded-lg">
                {statusIcons[m.status]}
                <span className="text-sm font-medium text-foreground flex-1">{m.name}</span>
                <span className="text-sm font-bold text-foreground">{m.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-foreground">Suggestions</p>
            {result.suggestions.map((s, i) => (
              <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-primary">💡</span> {s}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadabilityAnalyzer;
