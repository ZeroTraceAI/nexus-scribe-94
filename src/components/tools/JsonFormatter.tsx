import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  const format = () => {
    if (!input.trim()) {
      toast({ title: "Paste JSON data", variant: "destructive" });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indentSize));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const minify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const validate = () => {
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      setError("");
      toast({ title: "Valid JSON!", description: "The JSON is well-formed." });
    } catch (e: any) {
      setError(e.message);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!" });
  };

  const inputSize = new Blob([input]).size;
  const outputSize = output ? new Blob([output]).size : 0;

  // Count keys/values
  const countElements = (str: string): { keys: number; values: number; depth: number } => {
    try {
      const parsed = JSON.parse(str);
      let keys = 0;
      let values = 0;
      let maxDepth = 0;
      const traverse = (obj: any, depth: number) => {
        maxDepth = Math.max(maxDepth, depth);
        if (Array.isArray(obj)) {
          values += obj.length;
          obj.forEach((item) => { if (typeof item === "object" && item !== null) traverse(item, depth + 1); });
        } else if (typeof obj === "object" && obj !== null) {
          const objKeys = Object.keys(obj);
          keys += objKeys.length;
          objKeys.forEach((k) => {
            if (typeof obj[k] === "object" && obj[k] !== null) traverse(obj[k], depth + 1);
            else values++;
          });
        }
      };
      traverse(parsed, 0);
      return { keys, values, depth: maxDepth };
    } catch {
      return { keys: 0, values: 0, depth: 0 };
    }
  };

  const stats = input ? countElements(input) : null;

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">JSON Input</label>
        <Textarea placeholder='{"name": "John", "age": 30, "hobbies": ["coding", "reading"]}' value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="font-mono text-sm" />
        <div className="flex items-center gap-3 mt-1">
          {input && <span className="text-xs text-muted-foreground">{inputSize} bytes</span>}
          {stats && stats.keys > 0 && <span className="text-xs text-muted-foreground">{stats.keys} keys · {stats.values} values · depth {stats.depth}</span>}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 font-mono">{error}</p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <Button onClick={format} className="flex-1">Format (Pretty)</Button>
        <Button onClick={minify} variant="outline" className="flex-1">Minify</Button>
        <Button onClick={validate} variant="outline" className="flex-1">Validate</Button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-foreground">Indent:</label>
        {[2, 4].map((size) => (
          <Button key={size} size="sm" variant={indentSize === size ? "default" : "outline"} onClick={() => setIndentSize(size)} className="w-10">{size}</Button>
        ))}
      </div>

      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <h3 className="font-bold text-foreground">Output</h3>
              <span className="text-xs text-muted-foreground">{outputSize} bytes</span>
            </div>
            <Button size="sm" variant="outline" onClick={copyOutput}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
          </div>
          <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre text-foreground max-h-96 overflow-y-auto">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default JsonFormatter;
