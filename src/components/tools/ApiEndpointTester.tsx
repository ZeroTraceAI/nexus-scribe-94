import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ApiEndpointTester = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    status: number; statusText: string; time: number;
    headers: Record<string, string>; body: string; size: number;
  }>(null);
  const [error, setError] = useState("");

  const send = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    const start = performance.now();
    try {
      let parsedHeaders: Record<string, string> = {};
      try { parsedHeaders = JSON.parse(headers); } catch {}

      const opts: RequestInit = {
        method,
        headers: parsedHeaders,
      };
      if (["POST", "PUT", "PATCH"].includes(method) && body.trim()) {
        opts.body = body;
      }

      const resp = await fetch(url, opts);
      const elapsed = Math.round(performance.now() - start);
      const text = await resp.text();

      const respHeaders: Record<string, string> = {};
      resp.headers.forEach((v, k) => { respHeaders[k] = v; });

      let formattedBody = text;
      try { formattedBody = JSON.stringify(JSON.parse(text), null, 2); } catch {}

      setResult({
        status: resp.status,
        statusText: resp.statusText,
        time: elapsed,
        headers: respHeaders,
        body: formattedBody,
        size: new Blob([text]).size,
      });
    } catch (e: any) {
      setError(e.message || "Request failed");
      const elapsed = Math.round(performance.now() - start);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s: number) => s < 300 ? "secondary" : s < 400 ? "outline" : "destructive";

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>{["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
        </Select>
        <Input placeholder="https://api.example.com/endpoint" value={url} onChange={e => setUrl(e.target.value)} className="flex-1 font-mono" onKeyDown={e => e.key === "Enter" && send()} />
        <Button onClick={send} disabled={loading || !url.trim()}>{loading ? "Sending..." : "Send"}</Button>
      </div>

      <details className="border rounded-lg">
        <summary className="p-3 text-sm font-medium text-foreground cursor-pointer">Headers</summary>
        <div className="p-3 pt-0"><Textarea value={headers} onChange={e => setHeaders(e.target.value)} rows={3} className="font-mono text-xs" /></div>
      </details>

      {["POST", "PUT", "PATCH"].includes(method) && (
        <details className="border rounded-lg" open>
          <summary className="p-3 text-sm font-medium text-foreground cursor-pointer">Request Body</summary>
          <div className="p-3 pt-0"><Textarea value={body} onChange={e => setBody(e.target.value)} rows={5} className="font-mono text-xs" placeholder='{"key": "value"}' /></div>
        </details>
      )}

      {error && <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">{error}</div>}

      {result && (
        <div className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={statusColor(result.status)} className="text-sm">{result.status} {result.statusText}</Badge>
            <Badge variant="outline" className="text-xs">⏱ {result.time}ms</Badge>
            <Badge variant="outline" className="text-xs">📦 {result.size > 1024 ? `${(result.size / 1024).toFixed(1)} KB` : `${result.size} B`}</Badge>
          </div>

          <details className="border rounded-lg">
            <summary className="p-3 text-sm font-medium text-foreground cursor-pointer">Response Headers ({Object.keys(result.headers).length})</summary>
            <div className="p-3 pt-0 space-y-1">
              {Object.entries(result.headers).map(([k, v], i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="font-semibold text-primary font-mono">{k}:</span>
                  <span className="text-muted-foreground font-mono break-all">{v}</span>
                </div>
              ))}
            </div>
          </details>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Response Body</h3>
            <pre className="bg-muted/50 border rounded-xl p-4 text-xs font-mono text-foreground whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">{result.body}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiEndpointTester;
