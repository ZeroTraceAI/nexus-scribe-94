import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SnippetPreview {
  title: string;
  url: string;
  description: string;
  titlePixelWidth: number;
  descPixelWidth: number;
  titleTruncated: boolean;
  descTruncated: boolean;
}

const estimatePixelWidth = (text: string, fontSize: number): number => {
  // Approximate pixel width based on average character widths
  const avgCharWidth = fontSize * 0.6;
  return Math.round(text.length * avgCharWidth);
};

const SerpSnippetPreview = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const displayTitle = title.length > 60 ? title.substring(0, 57) + "..." : title;
  const displayDesc = description.length > 160 ? description.substring(0, 157) + "..." : description;
  const displayUrl = url || "https://example.com/your-page";

  const breadcrumbUrl = (() => {
    try {
      const parsed = new URL(displayUrl.startsWith("http") ? displayUrl : `https://${displayUrl}`);
      const pathParts = parsed.pathname.split("/").filter(Boolean);
      return `${parsed.hostname}${pathParts.length > 0 ? " › " + pathParts.join(" › ") : ""}`;
    } catch {
      return displayUrl;
    }
  })();

  const copySnippet = () => {
    const text = `Title: ${title}\nURL: ${url}\nDescription: ${description}\n\nTitle chars: ${title.length}/60\nDescription chars: ${description.length}/160`;
    navigator.clipboard.writeText(text);
    toast({ title: "Snippet data copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-foreground">SEO Title</label>
          <span className={`text-xs ${title.length > 60 ? "text-red-500" : title.length >= 30 ? "text-green-600" : "text-muted-foreground"}`}>{title.length}/60</span>
        </div>
        <Input placeholder="Your SEO page title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${title.length > 60 ? "bg-red-500" : title.length >= 30 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${Math.min(100, (title.length / 60) * 100)}%` }} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Page URL</label>
        <Input placeholder="https://example.com/your-page" value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-foreground">Meta Description</label>
          <span className={`text-xs ${description.length > 160 ? "text-red-500" : description.length >= 120 ? "text-green-600" : "text-muted-foreground"}`}>{description.length}/160</span>
        </div>
        <Textarea placeholder="Your meta description..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${description.length > 160 ? "bg-red-500" : description.length >= 120 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${Math.min(100, (description.length / 160) * 100)}%` }} />
        </div>
      </div>

      {/* Desktop Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2"><Eye className="h-4 w-4" /> SERP Preview</h3>
          <Button size="sm" variant="outline" onClick={copySnippet}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
        </div>

        {/* Desktop */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Desktop</p>
          <div className="bg-background border rounded-lg p-4 max-w-[600px]">
            <p className="text-xs text-muted-foreground mb-0.5">{breadcrumbUrl}</p>
            <p className="text-blue-600 text-xl leading-snug cursor-pointer hover:underline font-medium">{displayTitle || "Page Title"}</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{displayDesc || "Your meta description will appear here..."}</p>
          </div>
        </div>

        {/* Mobile */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Mobile</p>
          <div className="bg-background border rounded-lg p-3 max-w-[360px]">
            <p className="text-xs text-muted-foreground mb-0.5 truncate">{breadcrumbUrl}</p>
            <p className="text-blue-600 text-base leading-snug cursor-pointer hover:underline font-medium line-clamp-2">{displayTitle || "Page Title"}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{displayDesc || "Your meta description will appear here..."}</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-muted/50 border rounded-lg p-4 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground text-sm mb-1">Optimization Tips</p>
        {title.length === 0 && <p>• Add a title tag to see the preview</p>}
        {title.length > 0 && title.length < 30 && <p>• Title is too short — aim for 30-60 characters</p>}
        {title.length > 60 && <p>• ⚠️ Title will be truncated in search results (currently {title.length} chars)</p>}
        {description.length === 0 && <p>• Add a meta description — Google may auto-generate one otherwise</p>}
        {description.length > 0 && description.length < 120 && <p>• Description is short — aim for 120-160 characters for maximum visibility</p>}
        {description.length > 160 && <p>• ⚠️ Description will be truncated (currently {description.length} chars)</p>}
        {title.length >= 30 && title.length <= 60 && description.length >= 120 && description.length <= 160 && <p>• ✅ Both title and description are optimally sized!</p>}
      </div>
    </div>
  );
};

export default SerpSnippetPreview;
