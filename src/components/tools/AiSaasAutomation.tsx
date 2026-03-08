import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Automation {
  name: string;
  category: string;
  trigger: string;
  actions: string[];
  tools: string[];
  impact: string;
  complexity: "Easy" | "Medium" | "Advanced";
  timeToSetup: string;
}

const automations: Automation[] = [
  { name: "User Onboarding Flow", category: "Growth", trigger: "New user signup", actions: ["Send welcome email sequence", "Create user workspace", "Trigger product tour", "Assign to CRM segment", "Notify sales if enterprise domain"], tools: ["Intercom", "Customer.io", "Segment"], impact: "40% higher activation rate", complexity: "Medium", timeToSetup: "2 hours" },
  { name: "Churn Prediction & Prevention", category: "Retention", trigger: "Usage drop detected", actions: ["ML model scores churn probability", "Trigger re-engagement email", "Assign CSM for high-value accounts", "Offer targeted discount/feature", "Log intervention in CRM"], tools: ["Mixpanel", "ChurnZero", "ProfitWell"], impact: "25% reduction in churn", complexity: "Advanced", timeToSetup: "1 week" },
  { name: "AI Customer Support Triage", category: "Support", trigger: "New support ticket", actions: ["AI classifies ticket priority & category", "Auto-respond to common questions", "Route to specialized agent", "Suggest knowledge base articles", "Escalate critical issues to Slack"], tools: ["Zendesk", "Intercom", "OpenAI API"], impact: "60% faster first response", complexity: "Medium", timeToSetup: "4 hours" },
  { name: "Revenue Analytics Pipeline", category: "Finance", trigger: "Daily / real-time", actions: ["Aggregate subscription data", "Calculate MRR/ARR/NRR", "Detect anomalies in revenue", "Generate investor-ready reports", "Forecast next quarter"], tools: ["Stripe", "ChartMogul", "Baremetrics"], impact: "Real-time revenue visibility", complexity: "Easy", timeToSetup: "1 hour" },
  { name: "Lead Scoring & Routing", category: "Sales", trigger: "Lead activity event", actions: ["Score lead based on behavior + firmographics", "Enrich with company data", "Route to appropriate AE", "Create personalized outreach sequence", "Sync to CRM pipeline"], tools: ["Clearbit", "Apollo", "HubSpot"], impact: "3x qualified pipeline", complexity: "Medium", timeToSetup: "3 hours" },
  { name: "Feature Flag Rollout", category: "Product", trigger: "Release deployment", actions: ["Deploy behind feature flag", "Roll out to 5% → 25% → 100%", "Monitor error rates & performance", "Auto-rollback on anomaly", "Notify team of completion"], tools: ["LaunchDarkly", "Statsig", "PostHog"], impact: "Zero-downtime releases", complexity: "Easy", timeToSetup: "30 min" },
  { name: "Invoice & Billing Automation", category: "Finance", trigger: "Subscription event", actions: ["Generate invoice from usage data", "Apply prorations & discounts", "Process payment via gateway", "Send receipt & update CRM", "Handle failures with retry + dunning"], tools: ["Stripe Billing", "Chargebee", "Recurly"], impact: "99% payment success rate", complexity: "Medium", timeToSetup: "4 hours" },
  { name: "Content & SEO Autopilot", category: "Marketing", trigger: "Weekly schedule", actions: ["AI generates keyword-targeted articles", "Internal linking automation", "Auto-publish to CMS", "Share across social channels", "Track rankings & adjust strategy"], tools: ["Surfer SEO", "Jasper", "Webflow API"], impact: "5x organic traffic growth", complexity: "Advanced", timeToSetup: "1 day" },
];

const AiSaasAutomation = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const categories = [...new Set(automations.map(a => a.category))];
  const filtered = automations.filter(a => {
    const matchCat = !selectedCategory || a.category === selectedCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.actions.some(act => act.toLowerCase().includes(q)) || a.tools.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const exportAll = () => {
    const md = filtered.map(a => `## ${a.name}\nCategory: ${a.category} | Complexity: ${a.complexity} | Setup: ${a.timeToSetup}\nTrigger: ${a.trigger}\nImpact: ${a.impact}\n\nSteps:\n${a.actions.map((act, i) => `${i + 1}. ${act}`).join("\n")}\n\nTools: ${a.tools.join(", ")}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(`# SaaS Automation Playbook\n\n${md}`);
    toast({ title: "Playbook exported!" });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Search automations..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1" />
        <Button variant="outline" onClick={exportAll}>Export All</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedCategory(null)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${!selectedCategory ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setSelectedCategory(selectedCategory === c ? null : c)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedCategory === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{c}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((auto, i) => (
          <div key={i} className="bg-muted/50 rounded-xl border overflow-hidden">
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full text-left p-4 flex items-start justify-between hover:bg-muted/80 transition-colors">
              <div>
                <h3 className="font-bold text-foreground">{auto.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">Trigger: {auto.trigger}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Badge variant="outline">{auto.category}</Badge>
                <Badge variant={auto.complexity === "Easy" ? "secondary" : auto.complexity === "Medium" ? "default" : "destructive"}>{auto.complexity}</Badge>
              </div>
            </button>
            {expanded === i && (
              <div className="px-4 pb-4 space-y-3 border-t pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Impact</span><p className="text-sm font-bold text-primary">{auto.impact}</p></div>
                  <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Setup Time</span><p className="text-sm font-bold text-foreground">{auto.timeToSetup}</p></div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Automation Steps</p>
                  <ol className="space-y-2">{auto.actions.map((act, j) => (
                    <li key={j} className="flex gap-3 items-start">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{j + 1}</span>
                      <span className="text-sm text-foreground">{act}</span>
                    </li>
                  ))}</ol>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Tools</p>
                  <div className="flex flex-wrap gap-2">{auto.tools.map(t => <Badge key={t} variant="outline">{t}</Badge>)}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No automations found.</p>}
    </div>
  );
};

export default AiSaasAutomation;
