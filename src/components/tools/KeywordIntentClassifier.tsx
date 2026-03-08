import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ClassifiedKeyword {
  keyword: string;
  intent: "informational" | "navigational" | "transactional" | "commercial";
  confidence: number;
  explanation: string;
  suggestedContentType: string;
}

const intentPatterns: Record<string, { patterns: RegExp[]; contentType: string; explanation: string }> = {
  transactional: {
    patterns: [/\b(buy|purchase|order|subscribe|sign up|register|download|get|price|pricing|cost|cheap|deal|discount|coupon|free trial|demo)\b/i],
    contentType: "Landing page, Product page, Pricing page",
    explanation: "User wants to complete a specific action or transaction.",
  },
  commercial: {
    patterns: [/\b(best|top|review|compare|comparison|vs|versus|alternative|recommend|which|pros and cons|worth it)\b/i],
    contentType: "Comparison article, Review, Listicle",
    explanation: "User is researching before making a purchase decision.",
  },
  navigational: {
    patterns: [/\b(login|sign in|dashboard|official|website|app|platform|portal|account|support|contact|docs|documentation)\b/i],
    contentType: "Brand page, Documentation, Support page",
    explanation: "User is looking for a specific website or page.",
  },
  informational: {
    patterns: [/\b(how|what|why|when|where|who|guide|tutorial|learn|example|explain|definition|meaning|tips|ways|steps|basics|introduction|beginner)\b/i],
    contentType: "Blog post, Tutorial, Guide, FAQ",
    explanation: "User is seeking knowledge or answers to questions.",
  },
};

const classifyKeyword = (keyword: string): ClassifiedKeyword => {
  const lower = keyword.toLowerCase().trim();
  let bestIntent: ClassifiedKeyword["intent"] = "informational";
  let bestConfidence = 40;
  let explanation = "General informational query — user is seeking knowledge.";
  let contentType = "Blog post, Guide";

  for (const [intent, data] of Object.entries(intentPatterns)) {
    for (const pattern of data.patterns) {
      if (pattern.test(lower)) {
        const words = lower.split(/\s+/);
        const matchCount = words.filter((w) => pattern.test(w)).length;
        const confidence = Math.min(95, 60 + matchCount * 15);

        if (confidence > bestConfidence) {
          bestConfidence = confidence;
          bestIntent = intent as ClassifiedKeyword["intent"];
          explanation = data.explanation;
          contentType = data.contentType;
        }
      }
    }
  }

  // Boost confidence for very clear signals
  if (/^how to /i.test(lower)) { bestConfidence = Math.max(bestConfidence, 90); bestIntent = "informational"; }
  if (/^buy |^order |^subscribe/i.test(lower)) { bestConfidence = Math.max(bestConfidence, 90); bestIntent = "transactional"; }
  if (/\bvs\b|versus| compared to /i.test(lower)) { bestConfidence = Math.max(bestConfidence, 85); bestIntent = "commercial"; }

  return { keyword, intent: bestIntent, confidence: bestConfidence, explanation, suggestedContentType: contentType };
};

const intentColors: Record<string, string> = {
  informational: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  transactional: "bg-green-500/10 text-green-600 border-green-500/20",
  navigational: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  commercial: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const intentEmojis: Record<string, string> = {
  informational: "📚",
  transactional: "🛒",
  navigational: "🧭",
  commercial: "🔍",
};

const KeywordIntentClassifier = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ClassifiedKeyword[] | null>(null);

  const classify = () => {
    const keywords = input.split("\n").map((k) => k.trim()).filter(Boolean);
    if (keywords.length === 0) {
      toast({ title: "Enter keywords", description: "Add one keyword per line.", variant: "destructive" });
      return;
    }
    setResults(keywords.map(classifyKeyword));
  };

  const copyAll = () => {
    if (!results) return;
    const text = results.map((r) => `${r.keyword} → ${r.intent} (${r.confidence}%) — ${r.suggestedContentType}`).join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Classifications copied!" });
  };

  const intentCounts = results ? results.reduce((acc, r) => {
    acc[r.intent] = (acc[r.intent] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) : {};

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Keywords (one per line)</label>
        <Textarea
          placeholder={"how to learn react\nbest react frameworks 2026\nreact login page\nbuy react course\nreact vs vue comparison\nwhat is server side rendering"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
        />
      </div>
      <Button onClick={classify} className="w-full">Classify Intent</Button>

      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">{results.length} Keywords Classified</h3>
            <Button size="sm" variant="outline" onClick={copyAll}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(["informational", "commercial", "transactional", "navigational"] as const).map((intent) => (
              <div key={intent} className={`rounded-lg p-2 text-center border ${intentColors[intent]}`}>
                <p className="text-lg font-bold">{intentCounts[intent] || 0}</p>
                <p className="text-xs capitalize">{intent}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="bg-muted/50 border rounded-lg p-3 flex items-start gap-3">
                <span className="text-lg">{intentEmojis[r.intent]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{r.keyword}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.explanation}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">📝 {r.suggestedContentType}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge className={intentColors[r.intent]}>{r.intent}</Badge>
                  <span className="text-xs text-muted-foreground">{r.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordIntentClassifier;
