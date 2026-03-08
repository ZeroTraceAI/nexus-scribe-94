import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const providers: Record<string, { compute: number; storage: number; bandwidth: number; db: number }> = {
  AWS: { compute: 0.0464, storage: 0.023, bandwidth: 0.09, db: 0.017 },
  GCP: { compute: 0.0440, storage: 0.020, bandwidth: 0.085, db: 0.015 },
  Azure: { compute: 0.0496, storage: 0.0208, bandwidth: 0.087, db: 0.018 },
};

const CloudCostCalculator = () => {
  const [instances, setInstances] = useState("2");
  const [hoursPerDay, setHoursPerDay] = useState("24");
  const [storageGb, setStorageGb] = useState("100");
  const [bandwidthGb, setBandwidthGb] = useState("500");
  const [dbGb, setDbGb] = useState("50");
  const [result, setResult] = useState<null | { provider: string; compute: number; storage: number; bandwidth: number; db: number; total: number }[]>(null);

  const calculate = () => {
    const inst = parseInt(instances) || 1;
    const hrs = parseInt(hoursPerDay) || 24;
    const stor = parseInt(storageGb) || 0;
    const bw = parseInt(bandwidthGb) || 0;
    const database = parseInt(dbGb) || 0;

    const res = Object.entries(providers).map(([name, rates]) => {
      const compute = inst * hrs * 30 * rates.compute;
      const storage = stor * rates.storage;
      const bandwidth = bw * rates.bandwidth;
      const db = database * rates.db * 30;
      return { provider: name, compute: Math.round(compute * 100) / 100, storage: Math.round(storage * 100) / 100, bandwidth: Math.round(bandwidth * 100) / 100, db: Math.round(db * 100) / 100, total: Math.round((compute + storage + bandwidth + db) * 100) / 100 };
    });

    setResult(res);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div><p className="text-xs text-muted-foreground mb-1">Compute Instances</p><Input type="number" value={instances} onChange={e => setInstances(e.target.value)} min="1" /></div>
        <div><p className="text-xs text-muted-foreground mb-1">Hours/Day</p><Input type="number" value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)} min="1" max="24" /></div>
        <div><p className="text-xs text-muted-foreground mb-1">Storage (GB)</p><Input type="number" value={storageGb} onChange={e => setStorageGb(e.target.value)} min="0" /></div>
        <div><p className="text-xs text-muted-foreground mb-1">Bandwidth (GB/mo)</p><Input type="number" value={bandwidthGb} onChange={e => setBandwidthGb(e.target.value)} min="0" /></div>
        <div><p className="text-xs text-muted-foreground mb-1">Database (GB)</p><Input type="number" value={dbGb} onChange={e => setDbGb(e.target.value)} min="0" /></div>
      </div>
      <Button onClick={calculate}>Calculate Costs</Button>

      {result && (
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {result.map((r, i) => (
              <div key={i} className={`border rounded-xl p-4 text-center ${i === result.indexOf(result.reduce((a, b) => a.total < b.total ? a : b)) ? "border-secondary bg-secondary/5" : "bg-muted/50"}`}>
                <p className="text-sm font-semibold text-foreground mb-1">{r.provider}</p>
                <p className="text-3xl font-bold text-primary">${r.total}</p>
                <p className="text-xs text-muted-foreground">/month</p>
                {i === result.indexOf(result.reduce((a, b) => a.total < b.total ? a : b)) && <Badge variant="secondary" className="mt-2">Best Value</Badge>}
              </div>
            ))}
          </div>

          <div className="bg-muted/30 border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Cost Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={result}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="provider" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Legend />
                <Bar dataKey="compute" fill="hsl(var(--primary))" name="Compute" radius={[2, 2, 0, 0]} />
                <Bar dataKey="storage" fill="hsl(var(--secondary))" name="Storage" radius={[2, 2, 0, 0]} />
                <Bar dataKey="bandwidth" fill="#f97316" name="Bandwidth" radius={[2, 2, 0, 0]} />
                <Bar dataKey="db" fill="#8b5cf6" name="Database" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border rounded-xl overflow-hidden">
            <div className="grid grid-cols-5 gap-2 p-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
              <span>Provider</span><span>Compute</span><span>Storage</span><span>Bandwidth</span><span>Database</span>
            </div>
            {result.map((r, i) => (
              <div key={i} className={`grid grid-cols-5 gap-2 p-3 text-sm ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                <span className="font-semibold text-foreground">{r.provider}</span>
                <span className="text-muted-foreground">${r.compute}</span>
                <span className="text-muted-foreground">${r.storage}</span>
                <span className="text-muted-foreground">${r.bandwidth}</span>
                <span className="text-muted-foreground">${r.db}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudCostCalculator;
