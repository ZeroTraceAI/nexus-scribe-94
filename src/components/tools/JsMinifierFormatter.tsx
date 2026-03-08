import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Minimize2, Maximize2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const minifyJS = (code: string): string => {
  let result = code;
  // Remove single-line comments (but not URLs with //)
  result = result.replace(/(?<!:)\/\/(?![\/:]).*$/gm, "");
  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove leading/trailing whitespace from lines
  result = result.replace(/^\s+/gm, "").replace(/\s+$/gm, "");
  // Collapse multiple spaces to one
  result = result.replace(/\s{2,}/g, " ");
  // Remove newlines
  result = result.replace(/\n+/g, "");
  // Remove spaces around operators
  result = result.replace(/\s*([{}()=;,:<>+\-*/%!&|?])\s*/g, "$1");
  return result.trim();
};

const formatJS = (code: string): string => {
  let result = "";
  let indent = 0;
  const chars = code.trim().split("");
  let inString = false;
  let stringChar = "";
  let i = 0;

  const addNewline = () => { result += "\n" + "  ".repeat(indent); };

  while (i < chars.length) {
    const c = chars[i];
    const next = chars[i + 1] || "";

    // Handle strings
    if ((c === '"' || c === "'" || c === "`") && (i === 0 || chars[i - 1] !== "\\")) {
      if (!inString) { inString = true; stringChar = c; }
      else if (c === stringChar) { inString = false; }
      result += c;
      i++;
      continue;
    }

    if (inString) { result += c; i++; continue; }

    if (c === "{" || c === "[") {
      result += c;
      indent++;
      addNewline();
    } else if (c === "}" || c === "]") {
      indent = Math.max(0, indent - 1);
      addNewline();
      result += c;
    } else if (c === ";") {
      result += c;
      if (next !== "}" && next !== "]") addNewline();
    } else if (c === ",") {
      result += c;
      if (next !== "\n") addNewline();
    } else {
      result += c;
    }
    i++;
  }

  return result.trim();
};

const JsMinifierFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"minify" | "format">("minify");

  const process = (m: "minify" | "format") => {
    if (!input.trim()) {
      toast({ title: "Paste JavaScript code", variant: "destructive" });
      return;
    }
    setMode(m);
    setOutput(m === "minify" ? minifyJS(input) : formatJS(input));
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!" });
  };

  const inputSize = new Blob([input]).size;
  const outputSize = output ? new Blob([output]).size : 0;
  const savings = inputSize > 0 && outputSize > 0 ? Math.round((1 - outputSize / inputSize) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">JavaScript Code</label>
        <Textarea placeholder="Paste your JavaScript code here..." value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="font-mono text-sm" />
        {input && <p className="text-xs text-muted-foreground mt-1">{inputSize} bytes · {input.split("\n").length} lines</p>}
      </div>

      <div className="flex gap-2">
        <Button onClick={() => process("minify")} className="flex-1"><Minimize2 className="h-4 w-4 mr-2" />Minify</Button>
        <Button onClick={() => process("format")} variant="outline" className="flex-1"><Maximize2 className="h-4 w-4 mr-2" />Format / Beautify</Button>
      </div>

      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-foreground">{mode === "minify" ? "Minified" : "Formatted"} Output</h3>
              {mode === "minify" && savings > 0 && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">{savings}% smaller</span>
              )}
            </div>
            <Button size="sm" variant="outline" onClick={copyOutput}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
          </div>
          <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap text-foreground max-h-96 overflow-y-auto">{output}</pre>
          <p className="text-xs text-muted-foreground">{outputSize} bytes · {output.split("\n").length} lines</p>
        </div>
      )}
    </div>
  );
};

export default JsMinifierFormatter;
