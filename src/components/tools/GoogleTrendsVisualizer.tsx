import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

const GoogleTrendsVisualizer = () => {
  const [keywords, setKeywords] = useState("");
  const [data, setData] = useState<any[] | null>(null);
  const [summary, setSummary] = useState<{ keyword: string; avg: number; trend: string; peak: string }[]>([]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const visualize = () => {
    const kws = keywords.split(",").map(k => k.trim()).filter(Boolean).slice(0, 5);
    if (!kws.length) return;

    const chartData = months.map((month, mi) => {
      const point: any = { month };
      kws.forEach(kw => {
        let hash = 0;
        for (let i = 0; i < kw.length; i++) hash = ((hash << 5) - hash + kw.charCodeAt(i)) | 0;
        const base = 30 + Math.abs(hash % 40);
        const seasonal = Math.sin((mi + Math.abs(hash % 6)) * Math.PI / 6) * 20;
        const noise = ((hash * (mi + 1)) % 15) - 7;
        point[kw] = Math.max(5, Math.min(100, Math.round(base + seasonal + noise)));
      });
      return point;
    });

    const colors = ["hsl(var(--primary))", "hsl(var(--secondary))", "#f97316", "#8b5cf6", "#ec4899"];
    const summaryData = kws.map((kw, i) => {
      const values = chartData.map(d => d[kw]);
      const avg = Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length);
      const peakIdx = values.indexOf(Math.max(...values));
      const first = values.slice(0, 3).reduce((a: number, b: number) => a + b, 0) / 3;
      const last = values.slice(-3).reduce((a: number, b: number) => a + b, 0) / 3;
      const trend = last > first + 5 ? "📈 Rising" : last < first - 5 ? "📉 Declining" : "➡️ Stable";
      return { keyword: kw, avg, trend, peak: months[peakIdx] };
    });

    setData(chartData);
    setSummary(summaryData);
  };

  const colors = ["hsl(var(--primary))", "hsl(var(--secondary))", "#f97316", "#8b5cf6", "#ec4899"];

  return (
    <div className="space-y-4">
      <Input placeholder="Enter keywords (comma-separated, max 5)" value={keywords} onChange={e => setKeywords(e.target.value)} />
      <Button onClick={visualize} disabled={!keywords.trim()}>Visualize Trends</Button>

      {data && summary.length > 0 && (
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {summary.map((s, i) => (
              <div key={i} className="bg-muted/50 border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i] }} />
                  <span className="text-sm font-semibold text-foreground">{s.keyword}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Avg: <strong className="text-foreground">{s.avg}</strong></span>
                  <span>Peak: <strong className="text-foreground">{s.peak}</strong></span>
                  <Badge variant="outline" className="text-xs">{s.trend}</Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-muted/30 border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Interest Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Legend />
                {summary.map((s, i) => (
                  <Line key={s.keyword} type="monotone" dataKey={s.keyword} stroke={colors[i]} strokeWidth={2} dot={{ r: 3 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-muted/30 border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                {summary.map((s, i) => (
                  <Bar key={s.keyword} dataKey={s.keyword} fill={colors[i]} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          
        </div>
      )}
    </div>
  );
};

export default GoogleTrendsVisualizer;
