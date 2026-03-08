import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const LogAnalyzer = () => {
  const [logs, setLogs] = useState("");
  const [result, setResult] = useState<null | {
    total: number;
    levels: Record<string, number>;
    patterns: { pattern: string; count: number; severity: string }[];
    timeline: { time: string; count: number }[];
    topErrors: { message: string; count: number }[];
  }>(null);

  const analyze = () => {
    if (!logs.trim()) return;
    const lines = logs.split("\n").filter(l => l.trim());
    const levels: Record<string, number> = { ERROR: 0, WARN: 0, INFO: 0, DEBUG: 0, FATAL: 0 };
    const errorMessages: Record<string, number> = {};
    const hours: Record<string, number> = {};

    lines.forEach(line => {
      const upper = line.toUpperCase();
      if (upper.includes("FATAL")) levels.FATAL++;
      else if (upper.includes("ERROR") || upper.includes("ERR")) levels.ERROR++;
      else if (upper.includes("WARN") || upper.includes("WARNING")) levels.WARN++;
      else if (upper.includes("DEBUG")) levels.DEBUG++;
      else levels.INFO++;

      const timeMatch = line.match(/(\d{2}):(\d{2})/);
      if (timeMatch) {
        const hour = timeMatch[1] + ":00";
        hours[hour] = (hours[hour] || 0) + 1;
      }

      if (upper.includes("ERROR") || upper.includes("EXCEPTION") || upper.includes("FATAL")) {
        const msg = line.slice(0, 80).trim();
        errorMessages[msg] = (errorMessages[msg] || 0) + 1;
      }
    });

    const patterns = [
      { pattern: "NullPointerException / TypeError", count: lines.filter(l => /null|undefined|typeerror/i.test(l)).length, severity: "High" },
      { pattern: "Connection timeout / refused", count: lines.filter(l => /timeout|refused|connection/i.test(l)).length, severity: "High" },
      { pattern: "Authentication failures", count: lines.filter(l => /auth|401|403|forbidden|unauthorized/i.test(l)).length, severity: "Critical" },
      { pattern: "Out of memory", count: lines.filter(l => /memory|heap|oom/i.test(l)).length, severity: "Critical" },
      { pattern: "Slow queries / performance", count: lines.filter(l => /slow|latency|performance|timeout/i.test(l)).length, severity: "Medium" },
      { pattern: "Disk space warnings", count: lines.filter(l => /disk|storage|space/i.test(l)).length, severity: "Medium" },
    ].filter(p => p.count > 0);

    const timeline = Object.entries(hours).sort().map(([time, count]) => ({ time, count }));
    const topErrors = Object.entries(errorMessages).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([message, count]) => ({ message, count }));

    setResult({ total: lines.length, levels, patterns, timeline, topErrors });
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste your log output here (supports JSON logs, syslog, application logs)..." value={logs} onChange={e => setLogs(e.target.value)} rows={8} className="font-mono text-xs" />
      <Button onClick={analyze} disabled={!logs.trim()}>Analyze Logs</Button>

      {result && (
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(result.levels).map(([level, count]) => (
              <div key={level} className={`border rounded-lg p-3 text-center ${level === "ERROR" || level === "FATAL" ? "border-destructive/30 bg-destructive/5" : "bg-muted/50"}`}>
                <p className="text-xs text-muted-foreground">{level}</p>
                <p className={`text-2xl font-bold ${level === "ERROR" || level === "FATAL" ? "text-destructive" : "text-foreground"}`}>{count}</p>
              </div>
            ))}
          </div>

          {result.patterns.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Detected Patterns</h3>
              <div className="space-y-2">
                {result.patterns.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <span className="text-sm text-foreground">{p.pattern}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={p.severity === "Critical" ? "destructive" : p.severity === "High" ? "destructive" : "secondary"} className="text-xs">{p.severity}</Badge>
                      <Badge variant="outline" className="text-xs">{p.count}×</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.timeline.length > 0 && (
            <div className="bg-muted/30 border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Log Volume Timeline</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={result.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {result.topErrors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Top Errors</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {result.topErrors.map((e, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg border bg-destructive/5 border-destructive/20">
                    <span className="text-xs font-mono text-foreground truncate flex-1 mr-2">{e.message}</span>
                    <Badge variant="destructive" className="text-xs shrink-0">{e.count}×</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">Analyzed {result.total} log lines</p>
        </div>
      )}
    </div>
  );
};

export default LogAnalyzer;
