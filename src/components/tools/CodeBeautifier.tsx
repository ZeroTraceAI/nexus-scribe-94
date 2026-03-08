import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const beautifyJS = (code: string, indent: number): string => {
  let result = "";
  let depth = 0;
  let inString = false;
  let stringChar = "";
  const tab = " ".repeat(indent);

  const addLine = () => { result += "\n" + tab.repeat(depth); };

  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    const prev = code[i - 1] || "";
    const next = code[i + 1] || "";

    if ((c === '"' || c === "'" || c === "`") && prev !== "\\") {
      if (!inString) { inString = true; stringChar = c; }
      else if (c === stringChar) { inString = false; }
      result += c;
      continue;
    }
    if (inString) { result += c; continue; }

    if (c === "{" || c === "[") { result += c; depth++; addLine(); }
    else if (c === "}" || c === "]") { depth = Math.max(0, depth - 1); addLine(); result += c; }
    else if (c === ";") { result += c; if (next && next !== "}" && next !== "\n") addLine(); }
    else if (c === ",") { result += c; addLine(); }
    else if (c === "\n" || c === "\r") { /* skip existing newlines */ }
    else { result += c; }
  }
  return result.trim();
};

const beautifyCSS = (code: string, indent: number): string => {
  const tab = " ".repeat(indent);
  let result = code
    .replace(/\s*{\s*/g, " {\n" + tab)
    .replace(/\s*}\s*/g, "\n}\n\n")
    .replace(/;\s*/g, ";\n" + tab)
    .replace(/,\s*/g, ",\n")
    .replace(new RegExp(`${tab}$`, "gm"), "")
    .replace(/\n{3,}/g, "\n\n");
  return result.trim();
};

const beautifyHTML = (code: string, indent: number): string => {
  const tab = " ".repeat(indent);
  let depth = 0;
  const selfClosing = new Set(["br", "hr", "img", "input", "meta", "link", "area", "base", "col", "embed", "source", "track", "wbr"]);

  // Simple HTML formatter
  const tags = code.replace(/>\s*</g, ">\n<").split("\n");
  const lines: string[] = [];

  tags.forEach((tag) => {
    const trimmed = tag.trim();
    if (!trimmed) return;

    const isClosing = /^<\//.test(trimmed);
    const isSelfClosing = /\/>$/.test(trimmed) || selfClosing.has((trimmed.match(/<(\w+)/)?.[1] || "").toLowerCase());
    const isOpening = /^<[^/]/.test(trimmed) && !isSelfClosing;

    if (isClosing) depth = Math.max(0, depth - 1);
    lines.push(tab.repeat(depth) + trimmed);
    if (isOpening) depth++;
  });

  return lines.join("\n");
};

const languages: Record<string, string> = {
  javascript: "JavaScript",
  css: "CSS",
  html: "HTML",
};

const CodeBeautifier = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [indent, setIndent] = useState(2);

  const beautify = () => {
    if (!input.trim()) {
      toast({ title: "Paste code to beautify", variant: "destructive" });
      return;
    }

    let result = "";
    switch (language) {
      case "javascript": result = beautifyJS(input, indent); break;
      case "css": result = beautifyCSS(input, indent); break;
      case "html": result = beautifyHTML(input, indent); break;
      default: result = input;
    }
    setOutput(result);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Beautified code copied!" });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(languages).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Indent Size</label>
          <div className="flex gap-2">
            {[2, 4].map((size) => (
              <Button key={size} size="sm" variant={indent === size ? "default" : "outline"} onClick={() => setIndent(size)} className="flex-1">{size} spaces</Button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Code Input</label>
        <Textarea placeholder="Paste your messy code here..." value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="font-mono text-sm" />
      </div>

      <Button onClick={beautify} className="w-full"><Sparkles className="h-4 w-4 mr-2" />Beautify Code</Button>

      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">Beautified Output</h3>
            <Button size="sm" variant="outline" onClick={copyOutput}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
          </div>
          <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre text-foreground max-h-96 overflow-y-auto">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeBeautifier;
