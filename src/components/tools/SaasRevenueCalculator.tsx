import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MonthData {
  month: number;
  customers: number;
  mrr: number;
  arr: number;
  newCustomers: number;
  churnedCustomers: number;
  revenue: number;
  cumulativeRevenue: number;
  ltv: number;
  cacPayback: number;
}

interface CalculationResult {
  months: MonthData[];
  summary: {
    endMRR: number;
    endARR: number;
    totalRevenue: number;
    totalCustomers: number;
    averageLTV: number;
    avgCacPayback: number;
    growthRate: number;
  };
}

const calculate = (
  startingCustomers: number,
  monthlyPrice: number,
  monthlyGrowthRate: number,
  monthlyChurnRate: number,
  cac: number,
  months: number
): CalculationResult => {
  const data: MonthData[] = [];
  let customers = startingCustomers;
  let cumulativeRevenue = 0;

  for (let m = 1; m <= months; m++) {
    const newCustomers = Math.round(customers * (monthlyGrowthRate / 100));
    const churnedCustomers = Math.round(customers * (monthlyChurnRate / 100));
    customers = customers + newCustomers - churnedCustomers;
    if (customers < 0) customers = 0;

    const mrr = customers * monthlyPrice;
    const arr = mrr * 12;
    const revenue = mrr;
    cumulativeRevenue += revenue;

    const avgLifespan = monthlyChurnRate > 0 ? 1 / (monthlyChurnRate / 100) : 120;
    const ltv = monthlyPrice * avgLifespan;
    const cacPayback = cac > 0 ? cac / monthlyPrice : 0;

    data.push({ month: m, customers, mrr, arr, newCustomers, churnedCustomers, revenue, cumulativeRevenue, ltv, cacPayback });
  }

  const last = data[data.length - 1];
  const first = data[0];
  const growthRate = first.mrr > 0 ? ((last.mrr - first.mrr) / first.mrr) * 100 : 0;

  return {
    months: data,
    summary: {
      endMRR: last.mrr,
      endARR: last.arr,
      totalRevenue: last.cumulativeRevenue,
      totalCustomers: last.customers,
      averageLTV: last.ltv,
      avgCacPayback: last.cacPayback,
      growthRate: Math.round(growthRate * 10) / 10,
    },
  };
};

const formatCurrency = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
};

const SaasRevenueCalculator = () => {
  const [customers, setCustomers] = useState("100");
  const [price, setPrice] = useState("49");
  const [growth, setGrowth] = useState("10");
  const [churn, setChurn] = useState("5");
  const [cac, setCac] = useState("200");
  const [period, setPeriod] = useState("12");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const run = () => {
    const res = calculate(
      Number(customers) || 0,
      Number(price) || 0,
      Number(growth) || 0,
      Number(churn) || 0,
      Number(cac) || 0,
      Number(period) || 12
    );
    setResult(res);
  };

  const copyReport = () => {
    if (!result) return;
    const s = result.summary;
    const text = `SaaS Revenue Forecast (${period} months)\n\nEnd MRR: ${formatCurrency(s.endMRR)}\nEnd ARR: ${formatCurrency(s.endARR)}\nTotal Revenue: ${formatCurrency(s.totalRevenue)}\nTotal Customers: ${s.totalCustomers}\nLTV: ${formatCurrency(s.averageLTV)}\nCAC Payback: ${s.avgCacPayback.toFixed(1)} months\nMRR Growth: ${s.growthRate}%\n\nMonthly Breakdown:\n` +
      result.months.map((m) => `Month ${m.month}: ${m.customers} customers, MRR ${formatCurrency(m.mrr)}, +${m.newCustomers} new, -${m.churnedCustomers} churned`).join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Report copied!" });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Starting Customers</label>
          <Input type="number" placeholder="100" value={customers} onChange={(e) => setCustomers(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Monthly Price ($)</label>
          <Input type="number" placeholder="49" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Monthly Growth (%)</label>
          <Input type="number" placeholder="10" value={growth} onChange={(e) => setGrowth(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Monthly Churn (%)</label>
          <Input type="number" placeholder="5" value={churn} onChange={(e) => setChurn(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">CAC ($)</label>
          <Input type="number" placeholder="200" value={cac} onChange={(e) => setCac(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Forecast (months)</label>
          <Input type="number" placeholder="12" value={period} onChange={(e) => setPeriod(e.target.value)} />
        </div>
      </div>
      <Button onClick={run} className="w-full"><TrendingUp className="h-4 w-4 mr-2" /> Calculate Revenue</Button>

      {result && (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "End MRR", value: formatCurrency(result.summary.endMRR) },
              { label: "End ARR", value: formatCurrency(result.summary.endARR) },
              { label: "Total Revenue", value: formatCurrency(result.summary.totalRevenue) },
              { label: "Customers", value: result.summary.totalCustomers.toLocaleString() },
              { label: "LTV", value: formatCurrency(result.summary.averageLTV) },
              { label: "CAC Payback", value: `${result.summary.avgCacPayback.toFixed(1)} mo` },
              { label: "LTV:CAC", value: Number(cac) > 0 ? `${(result.summary.averageLTV / Number(cac)).toFixed(1)}x` : "N/A" },
              { label: "MRR Growth", value: `${result.summary.growthRate}%` },
            ].map((card) => (
              <div key={card.label} className="bg-muted/50 border rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-lg font-bold text-foreground">{card.value}</p>
              </div>
            ))}
          </div>

          {/* MRR bar chart */}
          <div className="bg-muted/50 border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">MRR Growth</p>
              <Button size="sm" variant="outline" onClick={copyReport}><Copy className="h-3.5 w-3.5 mr-1" /> Copy Report</Button>
            </div>
            <div className="flex items-end gap-1 h-32">
              {result.months.map((m) => {
                const maxMRR = Math.max(...result.months.map((d) => d.mrr));
                const height = maxMRR > 0 ? (m.mrr / maxMRR) * 100 : 0;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1" title={`Month ${m.month}: ${formatCurrency(m.mrr)} MRR`}>
                    <div className="w-full bg-primary/80 rounded-t-sm transition-all hover:bg-primary" style={{ height: `${height}%`, minHeight: "2px" }} />
                    {result.months.length <= 24 && <span className="text-[9px] text-muted-foreground">{m.month}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 pr-3">Month</th>
                  <th className="text-right py-2 px-2">Customers</th>
                  <th className="text-right py-2 px-2">New</th>
                  <th className="text-right py-2 px-2">Churned</th>
                  <th className="text-right py-2 px-2">MRR</th>
                  <th className="text-right py-2 pl-2">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {result.months.map((m) => (
                  <tr key={m.month} className="border-b border-border/50 text-foreground">
                    <td className="py-1.5 pr-3 font-medium">M{m.month}</td>
                    <td className="text-right py-1.5 px-2">{m.customers.toLocaleString()}</td>
                    <td className="text-right py-1.5 px-2 text-green-600">+{m.newCustomers}</td>
                    <td className="text-right py-1.5 px-2 text-red-600">-{m.churnedCustomers}</td>
                    <td className="text-right py-1.5 px-2">{formatCurrency(m.mrr)}</td>
                    <td className="text-right py-1.5 pl-2">{formatCurrency(m.cumulativeRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaasRevenueCalculator;
