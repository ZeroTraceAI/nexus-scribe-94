import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ApiRateLimitTester = () => {
  const [url, setUrl] = useState("");
  const [requests, setRequests] = useState("10");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<null | {
    total: number; successful: number; rateLimited: number; failed: number;
    avgTime: number; minTime: number; maxTime: number;
    responses: { index: number; status: number; time: number }[];
    headers: Record<string, string>;
  }>(null);

  const test = async () => {
    if (!url.trim()) return;
    setLoading(true);
    const count = Math.min(parseInt(requests) || 5, 20);
    const responses: { index: number; status: number; time: number }[] = [];
    let rateLimitHeaders: Record<string, string> = {};

    for (let i = 0; i < count; i++) {
      const start = performance.now();
      try {
        const resp = await fetch(url, { method: "HEAD", mode: "no-cors" });
        const time = Math.round(performance.now() - start);
        responses.push({ index: i + 1, status: resp.status || 200, time });

        // Capture rate limit headers from first response
        if (i === 0) {
          resp.headers.forEach((v, k) => {
            if (k.toLowerCase().includes("rate") || k.toLowerCase().includes("limit") || k.toLowerCase().includes("retry")) {
              rateLimitHeaders[k] = v;
            }
          });
        }
      } catch {
        responses.push({ index: i + 1, status: 0, time: Math.round(performance.now() - start) });
      }
    }

    const times = responses.filter(r => r.status > 0).map(r => r.time);
    const successful = responses.filter(r => r.status >= 200 && r.status < 400).length;
    const rateLimited = responses.filter(r => r.status === 429).length;
    const failed = responses.filter(r => r.status === 0 || r.status >= 500).length;

    setResults({
      total: responses.length,
      successful,
      rateLimited,
      failed,
      avgTime: times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0,
      minTime: times.length ? Math.min(...times) : 0,
      maxTime: times.length ? Math.max(...times) : 0,
      responses,
      headers: rateLimitHeaders,
    });
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="https://api.example.com/endpoint" value={url} onChange={e => setUrl(e.target.value)} className="flex-1 font-mono" />
        <Input type="number" value={requests} onChange={e => setRequests(e.target.value)} className="w-20" min="1" max="20" />
        <Button onClick={test} disabled={loading || !url.trim()}>{loading ? "Testing..." : "Test"}</Button>
      </div>

      {results && (
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-muted/50 border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Successful</p>
              <p className="text-2xl font-bold text-secondary">{results.successful}</p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Rate Limited</p>
              <p className="text-2xl font-bold text-destructive">{results.rateLimited}</p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Avg Response</p>
              <p className="text-2xl font-bold text-foreground">{results.avgTime}ms</p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-foreground">{results.failed}</p>
            </div>
          </div>

          <div className="bg-muted/30 border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Response Times</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={results.responses}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="index" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" label={{ value: "Request #", position: "insideBottom", offset: -5 }} />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" label={{ value: "ms", angle: -90, position: "insideLeft" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="time" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {Object.keys(results.headers).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Rate Limit Headers</h3>
              <div className="border rounded-lg overflow-hidden">
                {Object.entries(results.headers).map(([k, v], i) => (
                  <div key={i} className={`flex gap-2 p-2 text-xs ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                    <span className="font-semibold text-primary font-mono">{k}:</span>
                    <span className="text-foreground font-mono">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1 max-h-48 overflow-y-auto">
            {results.responses.map((r, i) => (
              <div key={i} className="flex items-center gap-3 text-xs p-2 rounded bg-muted/20">
                <span className="text-muted-foreground w-6">#{r.index}</span>
                <Badge variant={r.status >= 200 && r.status < 300 ? "secondary" : r.status === 429 ? "destructive" : "outline"} className="text-xs">{r.status || "ERR"}</Badge>
                <span className="text-muted-foreground">{r.time}ms</span>
                <Progress value={Math.min(100, (r.time / results.maxTime) * 100)} className="h-1 flex-1" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiRateLimitTester;
