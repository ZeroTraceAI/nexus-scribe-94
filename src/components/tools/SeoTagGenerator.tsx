import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeneratedTags {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  robots: string;
  htmlCode: string;
  score: number;
  tips: string[];
}

const generateTags = (
  pageTitle: string,
  pageDescription: string,
  targetKeyword: string,
  pageUrl: string,
  pageType: string
): GeneratedTags => {
  const keyword = targetKeyword.trim();
  const title = pageTitle.trim().length > 0 ? pageTitle.trim() : `${keyword} — Complete Guide ${new Date().getFullYear()}`;
  
  // Optimize title to ~60 chars
  let seoTitle = title;
  if (seoTitle.length > 60) seoTitle = seoTitle.substring(0, 57) + "...";

  // Optimize description to ~155 chars
  let desc = pageDescription.trim();
  if (!desc) desc = `Learn everything about ${keyword}. Comprehensive guide covering best practices, tips, and expert insights for ${new Date().getFullYear()}.`;
  if (desc.length > 155) desc = desc.substring(0, 152) + "...";

  // Generate related keywords
  const relatedKeywords = [
    keyword,
    `${keyword} guide`,
    `${keyword} tutorial`,
    `best ${keyword}`,
    `${keyword} ${new Date().getFullYear()}`,
  ].filter(Boolean).join(", ");

  const canonical = pageUrl.trim() || `https://example.com/${keyword.toLowerCase().replace(/\s+/g, "-")}`;
  const ogType = pageType === "article" ? "article" : "website";

  // Score calculation
  let score = 0;
  const tips: string[] = [];
  if (seoTitle.length >= 30 && seoTitle.length <= 60) score += 20;
  else tips.push("Title should be 30-60 characters for optimal display.");
  if (seoTitle.toLowerCase().includes(keyword.toLowerCase())) score += 20;
  else tips.push("Include your target keyword in the title.");
  if (desc.length >= 120 && desc.length <= 155) score += 20;
  else tips.push("Description should be 120-155 characters.");
  if (desc.toLowerCase().includes(keyword.toLowerCase())) score += 15;
  else tips.push("Include your target keyword in the description.");
  if (pageUrl.trim()) score += 10;
  else tips.push("Add a canonical URL for better SEO.");
  if (keyword) score += 15;
  else tips.push("Specify a target keyword for better optimization.");
  if (tips.length === 0) tips.push("All SEO tags look well-optimized!");

  const htmlCode = `<!-- Primary Meta Tags -->
<title>${seoTitle}</title>
<meta name="description" content="${desc}" />
<meta name="keywords" content="${relatedKeywords}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${canonical}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${ogType}" />
<meta property="og:title" content="${seoTitle}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${canonical}" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${seoTitle}" />
<meta name="twitter:description" content="${desc}" />`;

  return {
    title: seoTitle,
    description: desc,
    keywords: relatedKeywords,
    canonical,
    ogTitle: seoTitle,
    ogDescription: desc,
    ogType,
    twitterCard: "summary_large_image",
    twitterTitle: seoTitle,
    twitterDescription: desc,
    robots: "index, follow",
    htmlCode,
    score,
    tips,
  };
};

const SeoTagGenerator = () => {
  const [pageTitle, setPageTitle] = useState("");
  const [pageDesc, setPageDesc] = useState("");
  const [keyword, setKeyword] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [pageType, setPageType] = useState("article");
  const [result, setResult] = useState<GeneratedTags | null>(null);

  const generate = () => {
    if (!keyword.trim() && !pageTitle.trim()) {
      toast({ title: "Enter a keyword or title", variant: "destructive" });
      return;
    }
    setResult(generateTags(pageTitle, pageDesc, keyword, pageUrl, pageType));
  };

  const copyCode = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.htmlCode);
    toast({ title: "HTML tags copied!" });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Page Title</label>
          <Input placeholder="My Awesome Blog Post" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Target Keyword</label>
          <Input placeholder="e.g., react hooks tutorial" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Page Description</label>
        <Textarea placeholder="Brief description of your page content..." value={pageDesc} onChange={(e) => setPageDesc(e.target.value)} rows={3} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Page URL</label>
          <Input placeholder="https://example.com/my-post" value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Page Type</label>
          <Select onValueChange={setPageType} value={pageType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="product">Product</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={generate} className="w-full">Generate SEO Tags</Button>

      {result && (
        <div className="space-y-4">
          {/* Score */}
          <div className="bg-muted/50 border rounded-lg p-4 flex items-center gap-4">
            <div className={`text-3xl font-bold ${result.score >= 80 ? "text-green-600" : result.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>
              {result.score}/100
            </div>
            <div>
              <p className="font-semibold text-foreground">SEO Tag Score</p>
              <ul className="text-xs text-muted-foreground space-y-0.5 mt-1">
                {result.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-muted/50 border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Google Preview</p>
            <div className="space-y-0.5">
              <p className="text-blue-600 text-lg leading-snug cursor-pointer hover:underline">{result.title}</p>
              <p className="text-green-700 text-xs">{result.canonical}</p>
              <p className="text-sm text-muted-foreground">{result.description}</p>
            </div>
          </div>

          {/* HTML Code */}
          <div className="relative">
            <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap text-foreground">{result.htmlCode}</pre>
            <Button size="sm" variant="outline" onClick={copyCode} className="absolute top-2 right-2">
              <Copy className="h-3.5 w-3.5 mr-1" /> Copy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoTagGenerator;
