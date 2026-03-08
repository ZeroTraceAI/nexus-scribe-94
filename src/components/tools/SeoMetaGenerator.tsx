import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Copy, Check, AlertTriangle } from "lucide-react";

const SeoMetaGenerator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pageType, setPageType] = useState<"website" | "article">("website");
  const [authorName, setAuthorName] = useState("");
  const [publishDate, setPublishDate] = useState("");

  const titleLen = title.length;
  const descLen = description.length;

  const generateMetaTags = () => {
    let html = `<!-- Primary Meta Tags -->\n`;
    html += `<title>${title}</title>\n`;
    html += `<meta name="description" content="${description}" />\n`;
    if (url) html += `<link rel="canonical" href="${url}" />\n`;
    html += `\n<!-- Open Graph / Facebook -->\n`;
    html += `<meta property="og:type" content="${pageType}" />\n`;
    html += `<meta property="og:title" content="${title}" />\n`;
    html += `<meta property="og:description" content="${description}" />\n`;
    if (url) html += `<meta property="og:url" content="${url}" />\n`;
    if (siteName) html += `<meta property="og:site_name" content="${siteName}" />\n`;
    if (imageUrl) html += `<meta property="og:image" content="${imageUrl}" />\n`;
    if (pageType === "article" && publishDate) {
      html += `<meta property="article:published_time" content="${publishDate}" />\n`;
      if (authorName) html += `<meta property="article:author" content="${authorName}" />\n`;
    }
    html += `\n<!-- Twitter -->\n`;
    html += `<meta name="twitter:card" content="summary_large_image" />\n`;
    html += `<meta name="twitter:title" content="${title}" />\n`;
    html += `<meta name="twitter:description" content="${description}" />\n`;
    if (imageUrl) html += `<meta name="twitter:image" content="${imageUrl}" />\n`;
    return html;
  };

  const generateJsonLd = () => {
    if (pageType === "article") {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description,
        ...(imageUrl && { image: imageUrl }),
        ...(authorName && { author: { "@type": "Person", name: authorName } }),
        ...(publishDate && { datePublished: publishDate }),
        ...(url && { mainEntityOfPage: { "@type": "WebPage", "@id": url } }),
      }, null, 2);
    }
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: description,
      ...(url && { url }),
      ...(imageUrl && { image: imageUrl }),
    }, null, 2);
  };

  const copyAll = () => {
    const jsonLd = `\n<!-- JSON-LD Structured Data -->\n<script type="application/ld+json">\n${generateJsonLd()}\n</script>`;
    navigator.clipboard.writeText(generateMetaTags() + jsonLd);
    toast({ title: "Copied!", description: "All meta tags and JSON-LD copied to clipboard." });
  };

  const hasOutput = title.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Page Title *</label>
          <Input placeholder="My Awesome Page Title" value={title} onChange={e => setTitle(e.target.value)} />
          <p className={`text-xs mt-1 ${titleLen > 60 ? "text-destructive" : titleLen > 50 ? "text-yellow-500" : "text-muted-foreground"}`}>
            {titleLen}/60 characters {titleLen > 60 && <AlertTriangle className="inline h-3 w-3" />}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Page Type</label>
          <div className="flex gap-2">
            <Button size="sm" variant={pageType === "website" ? "default" : "outline"} onClick={() => setPageType("website")}>Website</Button>
            <Button size="sm" variant={pageType === "article" ? "default" : "outline"} onClick={() => setPageType("article")}>Article</Button>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Meta Description *</label>
        <Textarea placeholder="A compelling description of your page..." value={description} onChange={e => setDescription(e.target.value)} rows={3} />
        <p className={`text-xs mt-1 ${descLen > 160 ? "text-destructive" : descLen > 140 ? "text-yellow-500" : "text-muted-foreground"}`}>
          {descLen}/160 characters {descLen > 160 && <AlertTriangle className="inline h-3 w-3" />}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Canonical URL</label>
          <Input placeholder="https://example.com/page" value={url} onChange={e => setUrl(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Site Name</label>
          <Input placeholder="My Website" value={siteName} onChange={e => setSiteName(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">OG Image URL</label>
        <Input placeholder="https://example.com/og-image.png" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        <p className="text-xs text-muted-foreground mt-1">Recommended: 1200×630 pixels</p>
      </div>

      {pageType === "article" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Author Name</label>
            <Input placeholder="John Doe" value={authorName} onChange={e => setAuthorName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Publish Date</label>
            <Input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} />
          </div>
        </div>
      )}

      {hasOutput && (
        <>
          {/* Google Preview */}
          <div className="bg-card border rounded-lg p-5">
            <p className="text-xs text-muted-foreground mb-3 font-medium">Google Search Preview</p>
            <div className="space-y-1">
              {url && <p className="text-xs text-muted-foreground truncate">{url}</p>}
              <p className="text-lg text-blue-600 dark:text-blue-400 font-medium truncate">{title || "Page Title"}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{description || "Page description will appear here..."}</p>
            </div>
          </div>

          {/* Meta Tags Output */}
          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">Meta Tags</p>
              <Button size="sm" variant="outline" onClick={copyAll}><Copy className="h-3.5 w-3.5 mr-1" /> Copy All</Button>
            </div>
            <pre className="text-xs font-mono bg-muted rounded-lg p-4 overflow-auto max-h-60 whitespace-pre-wrap text-muted-foreground">{generateMetaTags()}</pre>
          </div>

          {/* JSON-LD Output */}
          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">JSON-LD Structured Data</p>
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(`<script type="application/ld+json">\n${generateJsonLd()}\n</script>`); toast({ title: "Copied!" }); }}>
                <Copy className="h-3.5 w-3.5 mr-1" /> Copy
              </Button>
            </div>
            <pre className="text-xs font-mono bg-muted rounded-lg p-4 overflow-auto max-h-60 whitespace-pre-wrap text-muted-foreground">{generateJsonLd()}</pre>
          </div>

          {/* SEO Tips */}
          <div className="bg-muted/50 border rounded-lg p-5">
            <p className="text-sm font-medium text-foreground mb-2">SEO Checklist</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>{titleLen > 0 && titleLen <= 60 ? "✅" : "❌"} Title under 60 characters</li>
              <li>{descLen > 0 && descLen <= 160 ? "✅" : "❌"} Description under 160 characters</li>
              <li>{url ? "✅" : "⚠️"} Canonical URL {!url && "(recommended)"}</li>
              <li>{imageUrl ? "✅" : "⚠️"} OG Image {!imageUrl && "(recommended for social sharing)"}</li>
              <li>{siteName ? "✅" : "⚠️"} Site name {!siteName && "(recommended)"}</li>
              {pageType === "article" && <li>{authorName ? "✅" : "⚠️"} Author name {!authorName && "(recommended for articles)"}</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SeoMetaGenerator;
