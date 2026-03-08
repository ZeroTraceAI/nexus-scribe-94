import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Summary {
  title: string;
  abstract: string;
  keyFindings: string[];
  methodology: string;
  limitations: string[];
  implications: string[];
  readingTime: string;
  complexityLevel: "Beginner" | "Intermediate" | "Advanced";
  citations: string[];
}

const summarizeResearch = (text: string, style: string): Summary => {
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());

  // Extract key terms by frequency
  const stopWords = new Set(["the","a","an","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","shall","should","may","might","can","could","must","need","dare","ought","used","to","of","in","for","on","with","at","by","from","as","into","through","during","before","after","above","below","between","out","off","over","under","again","further","then","once","here","there","when","where","why","how","all","each","every","both","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very","just","because","but","and","or","if","while","that","this","these","those","it","its","i","we","they","them","their","my","our","your","his","her","what","which","who","whom"]);
  const termFreq: Record<string, number> = {};
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, "");
    if (clean.length > 3 && !stopWords.has(clean)) {
      termFreq[clean] = (termFreq[clean] || 0) + 1;
    }
  });
  const topTerms = Object.entries(termFreq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t);

  // Score sentences by key term density
  const scoredSentences = sentences.map((s, i) => {
    const sWords = s.toLowerCase().split(/\s+/);
    const score = topTerms.reduce((acc, term) => acc + (sWords.filter(w => w.includes(term)).length * 2), 0) + (i < 3 ? 3 : 0) + (i === sentences.length - 1 ? 2 : 0);
    return { text: s.trim(), score, index: i };
  }).sort((a, b) => b.score - a.score);

  const keyFindings = scoredSentences.slice(0, 5).sort((a, b) => a.index - b.index).map(s => s.text.length > 200 ? s.text.slice(0, 200) + "..." : s.text);

  const hasNumbers = /\d+%|\d+\.\d+|p\s*[<>=]|n\s*=\s*\d/.test(text);
  const hasMethodology = /method|approach|experiment|survey|interview|sample|participant|dataset/i.test(text);
  const complexity = words.length > 3000 && hasNumbers ? "Advanced" : words.length > 1000 ? "Intermediate" : "Beginner";

  const abstractLength = style === "brief" ? 2 : style === "detailed" ? 5 : 3;
  const abstract = scoredSentences.slice(0, abstractLength).sort((a, b) => a.index - b.index).map(s => s.text).join(". ") + ".";

  return {
    title: topTerms.slice(0, 4).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ") + ": Research Summary",
    abstract,
    keyFindings,
    methodology: hasMethodology ? "Empirical study with quantitative/qualitative methods detected" : "Theoretical or review-based approach",
    limitations: [
      "Auto-generated summary may miss nuanced arguments",
      ...(words.length < 500 ? ["Source text is relatively short — may lack full context"] : []),
      ...(hasNumbers ? [] : ["No quantitative data detected — findings may be qualitative"]),
    ],
    implications: topTerms.slice(0, 3).map(t => `Further research on "${t}" could yield actionable insights`),
    readingTime: `${Math.ceil(words.length / 250)} min (original) → ${Math.ceil(keyFindings.join(" ").split(/\s+/).length / 250)} min (summary)`,
    complexityLevel: complexity,
    citations: topTerms.slice(0, 5).map(t => `[${t}] — referenced ${termFreq[t]} times`),
  };
};

const AiResearchSummarizer = () => {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("standard");
  const [result, setResult] = useState<Summary | null>(null);

  const handleSummarize = () => {
    if (text.trim().split(/\s+/).length < 50) { toast({ title: "Please paste at least 50 words of research text" }); return; }
    setResult(summarizeResearch(text, style));
  };

  const exportSummary = () => {
    if (!result) return;
    const md = `# ${result.title}\n\n## Abstract\n${result.abstract}\n\n## Key Findings\n${result.keyFindings.map(f => `- ${f}`).join("\n")}\n\n## Methodology\n${result.methodology}\n\n## Limitations\n${result.limitations.map(l => `- ${l}`).join("\n")}\n\n## Implications\n${result.implications.map(i => `- ${i}`).join("\n")}\n\n## Key Terms\n${result.citations.map(c => `- ${c}`).join("\n")}\n\n---\nReading Time: ${result.readingTime}\nComplexity: ${result.complexityLevel}`;
    navigator.clipboard.writeText(md);
    toast({ title: "Summary copied!" });
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste your research paper, article, or academic text here (min 50 words)..." value={text} onChange={e => setText(e.target.value)} rows={8} className="text-sm" />
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Summary Style</p>
        <div className="flex gap-2">
          {["brief", "standard", "detailed"].map(s => (
            <button key={s} onClick={() => setStyle(s)} className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${style === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{s}</button>
          ))}
        </div>
      </div>
      <Button onClick={handleSummarize} className="w-full">Summarize Research</Button>

      {result && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-foreground">{result.title}</h3>
            <Button variant="outline" size="sm" onClick={exportSummary}>Export</Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Reading Time</span><p className="text-sm font-bold text-foreground">{result.readingTime}</p></div>
            <div className="bg-muted/50 rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Complexity</span><p className="text-sm font-bold text-foreground">{result.complexityLevel}</p></div>
          </div>
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <p className="text-xs font-semibold text-primary uppercase mb-1">Abstract</p>
            <p className="text-sm text-foreground">{result.abstract}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Key Findings</p>
            <ul className="space-y-2">{result.keyFindings.map((f, i) => <li key={i} className="text-sm text-foreground bg-muted/50 rounded-lg p-3 border flex gap-2"><span className="text-primary shrink-0">📌</span> {f}</li>)}</ul>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Methodology</p>
            <p className="text-sm text-foreground">{result.methodology}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Limitations</p>
              <ul className="space-y-1">{result.limitations.map((l, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-yellow-500">⚠</span> {l}</li>)}</ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Implications</p>
              <ul className="space-y-1">{result.implications.map((imp, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-primary">→</span> {imp}</li>)}</ul>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Key Terms</p>
            <div className="flex flex-wrap gap-2">{result.citations.map((c, i) => <Badge key={i} variant="outline" className="text-xs">{c}</Badge>)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiResearchSummarizer;
