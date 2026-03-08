import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const convertMarkdownToHtml = (md: string): string => {
  let html = md;

  // Code blocks (must come before inline code)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr />");
  html = html.replace(/^\*\*\*$/gm, "<hr />");

  // Unordered lists
  html = html.replace(/^[\-\*]\s+(.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>\n${match}</ul>\n`);

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");

  // Paragraphs (lines that aren't already wrapped in tags)
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, "<p>$1</p>");

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, "");

  // Clean up double newlines
  html = html.replace(/\n{3,}/g, "\n\n");

  return html.trim();
};

const MarkdownToHtml = () => {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [activeTab, setActiveTab] = useState("code");

  const convert = () => {
    if (!markdown.trim()) {
      toast({ title: "Enter Markdown content", variant: "destructive" });
      return;
    }
    setHtml(convertMarkdownToHtml(markdown));
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    toast({ title: "HTML copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Markdown Input</label>
        <Textarea
          placeholder={"# Hello World\n\nThis is a **bold** and *italic* text.\n\n## Features\n\n- Item 1\n- Item 2\n- Item 3\n\n```javascript\nconsole.log('Hello!');\n```\n\n[Visit our site](https://example.com)"}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          rows={12}
          className="font-mono text-sm"
        />
      </div>

      <Button onClick={convert} className="w-full">Convert to HTML</Button>

      {html && (
        <div className="space-y-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="code">HTML Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <Button size="sm" variant="outline" onClick={copyHtml}><Copy className="h-3.5 w-3.5 mr-1" />Copy HTML</Button>
            </div>

            <TabsContent value="code">
              <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap text-foreground max-h-96 overflow-y-auto">{html}</pre>
            </TabsContent>

            <TabsContent value="preview">
              <div className="bg-background border rounded-lg p-6 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default MarkdownToHtml;
