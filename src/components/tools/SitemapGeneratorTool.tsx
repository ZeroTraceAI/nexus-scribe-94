import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

const SitemapGenerator = () => {
  const [baseUrl, setBaseUrl] = useState("");
  const [urls, setUrls] = useState<SitemapUrl[]>([
    { loc: "/", lastmod: new Date().toISOString().split("T")[0], changefreq: "daily", priority: "1.0" },
    { loc: "/about", lastmod: new Date().toISOString().split("T")[0], changefreq: "monthly", priority: "0.8" },
    { loc: "/blog", lastmod: new Date().toISOString().split("T")[0], changefreq: "daily", priority: "0.9" },
    { loc: "/contact", lastmod: new Date().toISOString().split("T")[0], changefreq: "monthly", priority: "0.5" },
  ]);

  const addUrl = () => {
    setUrls([...urls, { loc: "/new-page", lastmod: new Date().toISOString().split("T")[0], changefreq: "weekly", priority: "0.5" }]);
  };

  const removeUrl = (idx: number) => {
    setUrls(urls.filter((_, i) => i !== idx));
  };

  const updateUrl = (idx: number, field: keyof SitemapUrl, value: string) => {
    setUrls(urls.map((u, i) => (i === idx ? { ...u, [field]: value } : u)));
  };

  const base = baseUrl.trim().replace(/\/$/, "") || "https://example.com";

  const generateXml = (): string => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    urls.forEach((u) => {
      xml += `  <url>\n`;
      xml += `    <loc>${base}${u.loc}</loc>\n`;
      xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
      xml += `    <priority>${u.priority}</priority>\n`;
      xml += `  </url>\n`;
    });
    xml += `</urlset>`;
    return xml;
  };

  const copyXml = () => {
    navigator.clipboard.writeText(generateXml());
    toast({ title: "sitemap.xml copied!" });
  };

  const changefreqOptions = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
  const priorityOptions = ["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Base URL</label>
        <Input placeholder="https://example.com" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm">{urls.length} URLs</h3>
          <Button size="sm" variant="outline" onClick={addUrl}><Plus className="h-3.5 w-3.5 mr-1" />Add URL</Button>
        </div>
        {urls.map((u, i) => (
          <div key={i} className="bg-muted/50 border rounded-lg p-3 grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Input value={u.loc} onChange={(e) => updateUrl(i, "loc", e.target.value)} className="h-8 text-xs font-mono" placeholder="/path" />
            </div>
            <div className="col-span-3">
              <Input type="date" value={u.lastmod} onChange={(e) => updateUrl(i, "lastmod", e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="col-span-2">
              <Select value={u.changefreq} onValueChange={(v) => updateUrl(i, "changefreq", v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{changefreqOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Select value={u.priority} onValueChange={(v) => updateUrl(i, "priority", v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{priorityOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-1 flex justify-end">
              <Button size="sm" variant="ghost" onClick={() => removeUrl(i)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">XML Output</h3>
          <Button size="sm" variant="outline" onClick={copyXml}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
        </div>
        <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre text-foreground">{generateXml()}</pre>
        <p className="text-xs text-muted-foreground">Save this as <code className="bg-muted px-1 rounded">sitemap.xml</code> in your website's root directory and submit it to Google Search Console.</p>
      </div>
    </div>
  );
};

export default SitemapGenerator;
