import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const AiContentDetector = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | {
    aiScore: number;
    humanScore: number;
    verdict: string;
    signals: { label: string; weight: string; detected: boolean }[];
    sentences: { text: string; aiProb: number }[];
  }>(null);

  const analyze = () => {
    if (!text.trim()) return;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const signals = [
      { label: "Uniform sentence length", weight: "High", detected: false },
      { label: "Low lexical diversity", weight: "Medium", detected: false },
      { label: "Repetitive transition words", weight: "Medium", detected: false },
      { label: "Absence of personal anecdotes", weight: "Low", detected: false },
      { label: "Overly formal tone", weight: "Medium", detected: false },
      { label: "Perfect grammar throughout", weight: "Low", detected: false },
      { label: "Predictable paragraph structure", weight: "High", detected: false },
      { label: "Generic filler phrases", weight: "Medium", detected: false },
    ];

    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const lexicalDiversity = uniqueWords.size / words.length;
    if (lexicalDiversity < 0.55) signals[1].detected = true;

    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + Math.pow(b - avgLen, 2), 0) / lengths.length;
    if (variance < 15) signals[0].detected = true;

    const transitions = ["however", "moreover", "furthermore", "additionally", "consequently", "therefore", "in conclusion"];
    const transCount = words.filter(w => transitions.includes(w)).length;
    if (transCount > sentences.length * 0.3) signals[2].detected = true;

    const personalWords = ["i", "my", "me", "we", "personally"];
    const hasPersonal = words.some(w => personalWords.includes(w));
    if (!hasPersonal) signals[3].detected = true;

    const formalWords = ["utilize", "facilitate", "implement", "leverage", "optimize", "encompasses"];
    const formalCount = words.filter(w => formalWords.includes(w)).length;
    if (formalCount >= 2) signals[4].detected = true;

    const fillers = ["it is important to note", "in today's world", "it's worth mentioning", "when it comes to", "at the end of the day"];
    const lowerText = text.toLowerCase();
    const fillerCount = fillers.filter(f => lowerText.includes(f)).length;
    if (fillerCount >= 1) signals[7].detected = true;

    if (text.length > 200 && !/[^a-zA-Z0-9\s.,;:!?'"()\-–—]/.test(text)) signals[5].detected = true;

    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    if (paragraphs.length >= 3) {
      const pLengths = paragraphs.map(p => p.length);
      const pVariance = pLengths.reduce((a, b) => a + Math.pow(b - pLengths.reduce((x, y) => x + y, 0) / pLengths.length, 2), 0) / pLengths.length;
      if (pVariance < 2000) signals[6].detected = true;
    }

    const detectedCount = signals.filter(s => s.detected).length;
    const weightedScore = signals.reduce((acc, s) => {
      if (!s.detected) return acc;
      return acc + (s.weight === "High" ? 18 : s.weight === "Medium" ? 12 : 6);
    }, 0);
    const aiScore = Math.min(98, Math.max(5, weightedScore + (detectedCount > 4 ? 15 : 0)));
    const humanScore = 100 - aiScore;

    const sentenceResults = sentences.map(s => {
      const trimmed = s.trim();
      const sWords = trimmed.split(/\s+/);
      let prob = 30;
      if (sWords.length > 10 && sWords.length < 25) prob += 10;
      if (transitions.some(t => trimmed.toLowerCase().includes(t))) prob += 15;
      if (!personalWords.some(p => trimmed.toLowerCase().includes(p))) prob += 5;
      if (formalWords.some(f => trimmed.toLowerCase().includes(f))) prob += 15;
      return { text: trimmed, aiProb: Math.min(95, prob) };
    });

    const verdict = aiScore > 70 ? "Likely AI-Generated" : aiScore > 40 ? "Mixed / Partially AI" : "Likely Human-Written";
    setResult({ aiScore, humanScore, verdict, signals, sentences: sentenceResults.slice(0, 10) });
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste your content here to check if it was AI-generated..." value={text} onChange={e => setText(e.target.value)} rows={8} />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{text.split(/\s+/).filter(Boolean).length} words</span>
        <Button onClick={analyze} disabled={text.trim().length < 50}>Analyze Content</Button>
      </div>

      {result && (
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-muted/50 border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">AI Probability</p>
              <p className="text-3xl font-bold text-destructive">{result.aiScore}%</p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Human Probability</p>
              <p className="text-3xl font-bold text-secondary">{result.humanScore}%</p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Verdict</p>
              <p className="text-lg font-bold text-foreground">{result.verdict}</p>
            </div>
          </div>

          <div>
            <Progress value={result.aiScore} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Human</span><span>AI</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Detection Signals</h3>
            <div className="space-y-2">
              {result.signals.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.detected ? "bg-destructive" : "bg-secondary"}`} />
                    <span className="text-sm text-foreground">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{s.weight}</Badge>
                    <Badge variant={s.detected ? "destructive" : "secondary"} className="text-xs">{s.detected ? "Detected" : "Clear"}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Sentence Analysis</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {result.sentences.map((s, i) => (
                <div key={i} className="p-3 rounded-lg border bg-muted/30">
                  <p className="text-sm text-foreground mb-2">{s.text}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={s.aiProb} className="h-1.5 flex-1" />
                    <span className={`text-xs font-mono font-bold ${s.aiProb > 60 ? "text-destructive" : "text-secondary"}`}>{s.aiProb}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiContentDetector;
