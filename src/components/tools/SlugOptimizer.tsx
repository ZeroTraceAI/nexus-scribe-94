import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SlugAnalysis {
  original: string;
  optimized: string;
  score: number;
  issues: string[];
  improvements: string[];
  alternatives: string[];
  length: number;
  wordCount: number;
}

const stopWords = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
  "be", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need", "dare",
  "ought", "used", "it", "its", "this", "that", "these", "those",
  "i", "me", "my", "myself", "we", "our", "ours", "you", "your",
  "he", "him", "his", "she", "her", "they", "them", "their",
  "what", "which", "who", "whom", "how", "when", "where", "why",
  "not", "no", "nor", "so", "very", "just", "about", "up", "out",
]);

const analyzeSlug = (input: string): SlugAnalysis => {
  const original = input.trim();
  const issues: string[] = [];
  const improvements: string[] = [];

  // Generate slug from input
  let slug = original
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // Check for issues
  if (original !== original.toLowerCase()) issues.push("Contains uppercase characters");
  if (/[^a-z0-9\s\-/]/.test(original.toLowerCase())) issues.push("Contains special characters");
  if (/\s/.test(original)) issues.push("Contains spaces (should use hyphens)");
  if (/_/.test(original)) issues.push("Contains underscores (hyphens are preferred for SEO)");
  if (/--+/.test(original)) issues.push("Contains consecutive hyphens");
  if (original.startsWith("-") || original.endsWith("-")) issues.push("Starts or ends with a hyphen");

  // Remove stop words for optimized version
  const words = slug.split("-").filter(Boolean);
  const meaningfulWords = words.filter((w) => !stopWords.has(w));
  const optimized = meaningfulWords.length > 0 ? meaningfulWords.join("-") : slug;

  // Word count check
  if (words.length > 8) issues.push("Too many words (aim for 3-6 words)");
  if (words.length < 2) issues.push("Too short — may lack context for SEO");

  // Length check
  if (slug.length > 75) issues.push("Too long (keep under 75 characters)");

  // Stop words detected
  const foundStopWords = words.filter((w) => stopWords.has(w));
  if (foundStopWords.length > 0) {
    issues.push(`Contains stop words: ${foundStopWords.join(", ")}`);
    improvements.push("Remove unnecessary stop words for cleaner URLs");
  }

  // Generate improvements
  if (optimized.length < slug.length) improvements.push(`Shortened from ${slug.length} to ${optimized.length} characters`);
  if (meaningfulWords.length >= 2 && meaningfulWords.length <= 6) improvements.push("Good keyword density in URL");
  if (issues.length === 0) improvements.push("This slug is already well-optimized!");

  // Score
  let score = 100;
  if (words.length > 8) score -= 15;
  if (words.length < 2) score -= 10;
  if (slug.length > 75) score -= 20;
  if (foundStopWords.length > 0) score -= foundStopWords.length * 5;
  if (/[^a-z0-9-]/.test(slug)) score -= 15;
  score = Math.max(0, Math.min(100, score));

  // Alternatives
  const alternatives: string[] = [];
  if (meaningfulWords.length > 3) {
    alternatives.push(meaningfulWords.slice(0, 3).join("-"));
  }
  if (meaningfulWords.length > 2) {
    alternatives.push(meaningfulWords.slice(0, 4).join("-"));
  }
  const yearSlug = `${optimized}-${new Date().getFullYear()}`;
  if (yearSlug.length < 75) alternatives.push(yearSlug);

  return {
    original,
    optimized,
    score,
    issues,
    improvements,
    alternatives: [...new Set(alternatives)].filter((a) => a !== optimized),
    length: optimized.length,
    wordCount: optimized.split("-").length,
  };
};

const SlugOptimizer = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<SlugAnalysis | null>(null);

  const optimize = () => {
    if (!input.trim()) {
      toast({ title: "Enter a title or URL slug", variant: "destructive" });
      return;
    }
    setResult(analyzeSlug(input));
  };

  const copySlug = (slug: string) => {
    navigator.clipboard.writeText(slug);
    toast({ title: "Slug copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Page Title or URL Slug</label>
        <Input
          placeholder="e.g., How to Build a REST API with Node.js and Express in 2026"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <Button onClick={optimize} className="w-full">Optimize Slug</Button>

      {result && (
        <div className="space-y-4">
          {/* Score */}
          <div className="bg-muted/50 border rounded-lg p-4 flex items-center gap-4">
            <div className={`text-3xl font-bold ${result.score >= 80 ? "text-green-600" : result.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>
              {result.score}/100
            </div>
            <div>
              <p className="font-semibold text-foreground">Slug SEO Score</p>
              <p className="text-xs text-muted-foreground">{result.length} chars · {result.wordCount} words</p>
            </div>
          </div>

          {/* Before / After */}
          <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-red-600 bg-red-500/10 border-red-500/20">Before</Badge>
              <code className="text-sm font-mono text-muted-foreground break-all">/{result.original.toLowerCase().replace(/\s+/g, "-")}</code>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-green-600 bg-green-500/10 border-green-500/20">After</Badge>
              <code className="text-sm font-mono text-foreground font-bold break-all">/{result.optimized}</code>
              <Button size="sm" variant="ghost" onClick={() => copySlug(result.optimized)}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Issues */}
          {result.issues.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground">Issues Found</p>
              {result.issues.map((issue, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" /> {issue}
                </p>
              ))}
            </div>
          )}

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground">Improvements Applied</p>
              {result.improvements.map((imp, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" /> {imp}
                </p>
              ))}
            </div>
          )}

          {/* Alternatives */}
          {result.alternatives.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Alternative Slugs</p>
              {result.alternatives.map((alt, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <code className="font-mono text-muted-foreground">/{alt}</code>
                  <Button size="sm" variant="ghost" onClick={() => copySlug(alt)}><Copy className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SlugOptimizer;
