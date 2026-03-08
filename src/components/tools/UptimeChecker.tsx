import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const UptimeChecker = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<null | {
    status: string; responseTime: number; uptime: number; statusCode: number;
    history: { time: string; responseTime: number; status: string }[];
  }>(null);

  const check = () => {
    if (!url.trim()) return;
    let hash = 0;
    for (let i = 0; i < url.length; i++) hash = ((hash << 5) - hash + url.charCodeAt(i)) | 0;
    const seed = Math.abs(hash);

    const history = Array.from({ length: 24 }, (_, i) => {
      const rt = 50 + (((seed * (i + 1)) % 300));
      const down = ((seed + i * 13) % 50) === 0;
      return { time: `${String(i).padStart(2, "0")}:00`, responseTime: down ? 0 : rt, status: down ? "Down" : "Up" };
    });

    const upCount = history.filter(h => h.status === "Up").length;

    setResult({
      status: "Up",
      responseTime: 80 + (seed % 200),
      uptime: parseFloat(((upCount / 24) * 100).toFixed(2)),
      statusCode: 200,
      history,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Enter website URL (e.g., https://example.com)" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && check()} />
        <Button onClick={check} disabled={!url.trim()}>Check</Button>
      </div>

      {result && (
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-xl font-bold text-secondary">{result.status}</p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">Response Time</p>
              <p className="text-xl font-bold text-foreground">{result.responseTime}ms</p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">Uptime (24h)</p>
              <p className="text-xl font-bold text-foreground">{result.uptime}%</p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">Status Code</p>
              <p className="text-xl font-bold text-foreground">{result.statusCode}</p>
            </div>
          </div>

          <div className="bg-muted/30 border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Response Time (24h)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={result.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={3} />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="responseTime" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-1">
            {result.history.map((h, i) => (
              <div key={i} className={`w-5 h-5 rounded-sm ${h.status === "Up" ? "bg-secondary" : "bg-destructive"}`} title={`${h.time}: ${h.status} (${h.responseTime}ms)`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">⚠️ Simulated uptime data. Use a monitoring service for real uptime tracking.</p>
        </div>
      )}
    </div>
  );
};

export default UptimeChecker;
