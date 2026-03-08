import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SeoCheck {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

interface AnalysisResult {
  score: number;
  grade: string;
  checks: SeoCheck[];
  wordCount: number;
  readingTime: number;
  keywordDensity: number;
  readabilityScore: number;
}

const analyzeContent = (content: string, keyword: string, title: string): AnalysisResult => {
  const text = content.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTime = Math.ceil(wordCount / 200);
  const lowerContent = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase().trim();

  // Keyword density
  const keywordCount = lowerKeyword ? (lowerContent.match(new RegExp(lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length : 0;
  const keywordDensity = wordCount > 0 ? Math.round((keywordCount / wordCount) * 1000) / 10 : 0;

  // Readability (simple Flesch-Kincaid approximation)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : wordCount;
  const syllableCount = words.reduce((acc, w) => acc + Math.max(1, w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").match(/[aeiouy]{1,2}/g)?.length || 1), 0);
  const avgSyllablesPerWord = wordCount > 0 ? syllableCount / wordCount : 0;
  const readabilityScore = Math.round(Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord)));

  const checks: SeoCheck[] = [];

  // Word count
  if (wordCount >= 1500) checks.push({ label: "Content Length", status: "pass", detail: `${wordCount} words — excellent for SEO ranking.` });
  else if (wordCount >= 800) checks.push({ label: "Content Length", status: "warn", detail: `${wordCount} words — aim for 1500+ for competitive keywords.` });
  else checks.push({ label: "Content Length", status: "fail", detail: `${wordCount} words — too short. Aim for at least 800-1500 words.` });

  // Title
  if (title.trim()) {
    if (title.length >= 30 && title.length <= 60) checks.push({ label: "Title Length", status: "pass", detail: `${title.length} characters — optimal for search results.` });
    else if (title.length > 60) checks.push({ label: "Title Length", status: "warn", detail: `${title.length} characters — may be truncated in SERPs. Keep under 60.` });
    else checks.push({ label: "Title Length", status: "warn", detail: `${title.length} characters — consider making it longer (30-60 chars).` });

    if (lowerKeyword && title.toLowerCase().includes(lowerKeyword)) {
      checks.push({ label: "Keyword in Title", status: "pass", detail: "Target keyword found in the title." });
    } else if (lowerKeyword) {
      checks.push({ label: "Keyword in Title", status: "fail", detail: "Target keyword not found in the title. Add it for better rankings." });
    }
  } else {
    checks.push({ label: "Title", status: "fail", detail: "No title provided. Every page needs an optimized title tag." });
  }

  // Keyword density
  if (lowerKeyword) {
    if (keywordDensity >= 1 && keywordDensity <= 3) checks.push({ label: "Keyword Density", status: "pass", detail: `${keywordDensity}% — well within the optimal 1-3% range.` });
    else if (keywordDensity > 3) checks.push({ label: "Keyword Density", status: "warn", detail: `${keywordDensity}% — may be seen as keyword stuffing. Aim for 1-3%.` });
    else checks.push({ label: "Keyword Density", status: "fail", detail: `${keywordDensity}% — too low. Use your keyword more naturally throughout the content.` });

    // Keyword in first 100 words
    const first100 = words.slice(0, 100).join(" ").toLowerCase();
    if (first100.includes(lowerKeyword)) checks.push({ label: "Keyword in Introduction", status: "pass", detail: "Keyword appears in the first 100 words." });
    else checks.push({ label: "Keyword in Introduction", status: "warn", detail: "Keyword not found in the first 100 words. Place it early for better SEO." });
  }

  // Headings
  const headingCount = (text.match(/^#{1,6}\s/gm) || []).length + (text.match(/<h[1-6]/gi) || []).length;
  if (headingCount >= 3) checks.push({ label: "Headings Structure", status: "pass", detail: `${headingCount} headings found — good content structure.` });
  else if (headingCount >= 1) checks.push({ label: "Headings Structure", status: "warn", detail: `Only ${headingCount} heading(s). Add more for better structure and SEO.` });
  else checks.push({ label: "Headings Structure", status: "fail", detail: "No headings detected. Use H2-H6 tags to structure your content." });

  // Links
  const linkCount = (text.match(/https?:\/\//g) || []).length + (text.match(/\[.*?\]\(.*?\)/g) || []).length;
  if (linkCount >= 3) checks.push({ label: "Internal/External Links", status: "pass", detail: `${linkCount} links found — good for SEO authority signals.` });
  else if (linkCount >= 1) checks.push({ label: "Internal/External Links", status: "warn", detail: `Only ${linkCount} link(s). Add more relevant internal and external links.` });
  else checks.push({ label: "Internal/External Links", status: "fail", detail: "No links found. Add internal and external links for better SEO." });

  // Readability
  if (readabilityScore >= 60) checks.push({ label: "Readability", status: "pass", detail: `Score: ${readabilityScore}/100 — easy to read.` });
  else if (readabilityScore >= 40) checks.push({ label: "Readability", status: "warn", detail: `Score: ${readabilityScore}/100 — consider simplifying sentences.` });
  else checks.push({ label: "Readability", status: "fail", detail: `Score: ${readabilityScore}/100 — content is too complex. Use shorter sentences.` });

  // Paragraphs
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const longParagraphs = paragraphs.filter((p) => p.split(/\s+/).length > 150);
  if (longParagraphs.length === 0) checks.push({ label: "Paragraph Length", status: "pass", detail: "All paragraphs are a reasonable length." });
  else checks.push({ label: "Paragraph Length", status: "warn", detail: `${longParagraphs.length} paragraph(s) are too long. Break them up for better readability.` });

  // Score
  const passCount = checks.filter((c) => c.status === "pass").length;
  const score = Math.round((passCount / checks.length) * 100);
  const grade = score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D";

  return { score, grade, checks, wordCount, readingTime, keywordDensity, readabilityScore };
};

const statusIcons: Record<string, JSX.Element> = {
  pass: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  warn: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  fail: <XCircle className="h-4 w-4 text-red-500" />,
};

const ContentSeoAnalyzer = () => {
  const [content, setContent] = useState("");
  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = () => {
    if (!content.trim()) {
      toast({ title: "Paste your content", description: "Enter the content you want to analyze.", variant: "destructive" });
      return;
    }
    setResult(analyzeContent(content, keyword, title));
  };

  const copyReport = () => {
    if (!result) return;
    const text = `Content SEO Score: ${result.score}/100 (Grade: ${result.grade})\n\n` +
      result.checks.map((c) => `[${c.status.toUpperCase()}] ${c.label}: ${c.detail}`).join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Report copied!" });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Page Title</label>
          <Input placeholder="Your SEO title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Target Keyword</label>
          <Input placeholder="e.g., react hooks tutorial" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Content (paste your article)</label>
        <Textarea placeholder="Paste your blog post or article content here..." value={content} onChange={(e) => setContent(e.target.value)} rows={12} />
      </div>
      <Button onClick={analyze} className="w-full">Analyze Content SEO</Button>

      {result && (
        <div className="space-y-4">
          {/* Score header */}
          <div className="bg-muted/50 border rounded-lg p-4 flex items-center gap-4">
            <div className={`text-4xl font-bold ${result.score >= 80 ? "text-green-600" : result.score >= 60 ? "text-yellow-600" : "text-red-600"}`}>
              {result.grade}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">SEO Score: {result.score}/100</p>
              <p className="text-xs text-muted-foreground">{result.wordCount} words · {result.readingTime} min read · {result.keywordDensity}% keyword density · Readability: {result.readabilityScore}/100</p>
            </div>
            <Button size="sm" variant="outline" onClick={copyReport}><Copy className="h-3.5 w-3.5 mr-1" /> Copy</Button>
          </div>

          {/* Checks */}
          <div className="space-y-2">
            {result.checks.map((check, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 border rounded-lg">
                <div className="shrink-0 mt-0.5">{statusIcons[check.status]}</div>
                <div>
                  <p className="text-sm font-medium text-foreground">{check.label}</p>
                  <p className="text-xs text-muted-foreground">{check.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentSeoAnalyzer;
