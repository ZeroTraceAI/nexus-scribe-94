import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface StartupIdea {
  name: string;
  oneLiner: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  unfairAdvantage: string;
  keyMetrics: string[];
  firstSteps: string[];
  risks: string[];
  fundingStrategy: string;
  score: number;
}

const industries = ["B2B SaaS", "Consumer App", "FinTech", "HealthTech", "EdTech", "Climate Tech", "Web3/Crypto", "AI/ML", "Hardware", "Marketplace"];

const generateStartupIdeas = (industry: string, passion: string): StartupIdea[] => {
  const ideasByIndustry: Record<string, StartupIdea[]> = {
    "B2B SaaS": [
      { name: "MetricMesh", oneLiner: "Unified business metrics dashboard that actually makes sense", problem: "SMBs use 15+ tools but have no single view of business health", solution: "One dashboard connecting all business tools with AI-generated insights and anomaly alerts", targetMarket: "SMBs with 10-200 employees, $5M-$50M revenue", businessModel: "Subscription: $49-$299/mo tiered by integrations", unfairAdvantage: "AI correlation engine that finds hidden relationships between metrics", keyMetrics: ["MRR", "Integrations per customer", "DAU/MAU ratio", "NPS"], firstSteps: ["Build 5 key integrations (Stripe, HubSpot, GA, QuickBooks, Slack)", "Launch on Product Hunt", "Get 20 beta customers through cold outreach", "Iterate on dashboard UX weekly"], risks: ["Integration maintenance overhead", "Competing with established BI tools", "SMB churn rates typically high"], fundingStrategy: "Bootstrap to $10K MRR, then raise $1.5M seed", score: 82 },
    ],
    "AI/ML": [
      { name: "EvalBench", oneLiner: "Automated evaluation platform for LLM applications", problem: "Teams deploy LLM features with no systematic way to measure quality or detect regressions", solution: "CI/CD-integrated LLM evaluation with custom benchmarks, human feedback loops, and regression detection", targetMarket: "AI product teams at Series A+ startups and enterprises", businessModel: "Usage-based: $0.01/eval + $199/mo platform fee", unfairAdvantage: "Proprietary evaluation models trained on 100K+ human preference judgments", keyMetrics: ["Evals per month", "Teams onboarded", "Regression catch rate", "NDR"], firstSteps: ["Build core eval framework", "Integrate with LangChain + OpenAI", "Get 5 design partners from AI Twitter", "Publish benchmark comparisons"], risks: ["Fast-moving space with new entrants weekly", "LLM providers building native eval tools", "Evaluation itself is subjective"], fundingStrategy: "Raise $2M pre-seed on team + thesis, target $3M seed at 18 months", score: 88 },
    ],
    "FinTech": [
      { name: "SplitStack", oneLiner: "Revenue sharing infrastructure for modern partnerships", problem: "Revenue sharing between business partners requires manual tracking and trust issues", solution: "Automated rev-share platform: define splits, track revenue, auto-distribute payments with audit trails", targetMarket: "Agencies, affiliates, creator collabs, franchise models", businessModel: "0.5% of processed volume + $99/mo base", unfairAdvantage: "Real-time ledger with smart contract-like immutable audit trails", keyMetrics: ["GTV processed", "Partners onboarded", "Settlement time", "Revenue per customer"], firstSteps: ["Build Stripe Connect integration", "Launch with 3 agency partners", "Add PayPal + Wise support", "Create self-serve onboarding"], risks: ["Regulatory complexity across jurisdictions", "Cash flow timing issues", "Trust building takes time"], fundingStrategy: "Bootstrap with agency revenue, raise $3M seed with traction", score: 76 },
    ],
    "HealthTech": [
      { name: "SymptomPath", oneLiner: "AI triage assistant for clinic waiting rooms", problem: "Patients wait 45+ min to describe symptoms that could be pre-screened", solution: "Tablet-based AI symptom collection that generates structured intake forms for doctors", targetMarket: "Primary care clinics, urgent care centers", businessModel: "Per-provider: $149/mo per practitioner", unfairAdvantage: "Medical ontology trained on 10M+ clinical encounters", keyMetrics: ["Time saved per visit", "Clinics onboarded", "Diagnostic accuracy", "Provider satisfaction"], firstSteps: ["HIPAA compliance setup", "Build symptom decision tree", "Partner with 3 local clinics", "Clinical validation study"], risks: ["HIPAA/regulatory burden", "Liability concerns", "Doctor adoption resistance"], fundingStrategy: "Apply to health-focused accelerators, raise $2M seed", score: 71 },
    ],
  };

  const ideas = ideasByIndustry[industry] || ideasByIndustry["B2B SaaS"];
  if (passion) {
    return ideas.map(idea => ({
      ...idea,
      solution: idea.solution + `. Specifically focused on ${passion} use cases.`,
    }));
  }
  return ideas;
};

const AiStartupIdeaGenerator = () => {
  const [industry, setIndustry] = useState("AI/ML");
  const [passion, setPassion] = useState("");
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleGenerate = () => { setIdeas(generateStartupIdeas(industry, passion)); setExpanded(0); };

  const exportIdea = (idea: StartupIdea) => {
    const md = `# ${idea.name}\n> ${idea.oneLiner}\n\n## Problem\n${idea.problem}\n\n## Solution\n${idea.solution}\n\n## Target Market\n${idea.targetMarket}\n\n## Business Model\n${idea.businessModel}\n\n## Unfair Advantage\n${idea.unfairAdvantage}\n\n## Key Metrics\n${idea.keyMetrics.map(m => `- ${m}`).join("\n")}\n\n## First Steps\n${idea.firstSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n## Risks\n${idea.risks.map(r => `- ⚠ ${r}`).join("\n")}\n\n## Funding Strategy\n${idea.fundingStrategy}\n\n## Viability: ${idea.score}/100`;
    navigator.clipboard.writeText(md);
    toast({ title: `${idea.name} exported!` });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Industry</p>
        <div className="flex flex-wrap gap-2">
          {industries.map(ind => <button key={ind} onClick={() => setIndustry(ind)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${industry === ind ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{ind}</button>)}
        </div>
      </div>
      <Input placeholder="Your passion or expertise (optional, e.g., 'developer productivity', 'mental health')..." value={passion} onChange={e => setPassion(e.target.value)} />
      <Button onClick={handleGenerate} className="w-full">Generate Startup Ideas</Button>

      {ideas.length > 0 && (
        <div className="space-y-3">
          {ideas.map((idea, i) => (
            <div key={i} className="bg-muted/50 rounded-xl border overflow-hidden">
              <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full text-left p-4 hover:bg-muted/80 transition-colors">
                <div className="flex items-start justify-between">
                  <div><h3 className="font-bold text-foreground">{idea.name}</h3><p className="text-sm text-muted-foreground mt-1">{idea.oneLiner}</p></div>
                  <Badge variant={idea.score >= 80 ? "default" : "secondary"}>{idea.score}/100</Badge>
                </div>
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 space-y-3 border-t pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Problem</span><p className="text-sm text-foreground">{idea.problem}</p></div>
                    <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Solution</span><p className="text-sm text-foreground">{idea.solution}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Target Market</span><p className="text-sm text-foreground">{idea.targetMarket}</p></div>
                    <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Business Model</span><p className="text-sm text-foreground">{idea.businessModel}</p></div>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                    <p className="text-xs font-semibold text-primary uppercase mb-1">Unfair Advantage</p>
                    <p className="text-sm text-foreground">{idea.unfairAdvantage}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Key Metrics</p><ul className="space-y-1">{idea.keyMetrics.map((m, j) => <li key={j} className="text-sm text-foreground flex gap-2"><span className="text-primary">📊</span> {m}</li>)}</ul></div>
                    <div><p className="text-xs font-semibold text-muted-foreground uppercase mb-2">First Steps</p><ol className="space-y-1">{idea.firstSteps.map((s, j) => <li key={j} className="text-sm text-foreground flex gap-2"><span className="shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">{j + 1}</span> {s}</li>)}</ol></div>
                  </div>
                  <div><p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Risks</p><ul className="space-y-1">{idea.risks.map((r, j) => <li key={j} className="text-sm text-muted-foreground flex gap-2"><span className="text-yellow-500">⚠</span> {r}</li>)}</ul></div>
                  <div className="bg-muted/50 rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Funding Strategy</span><p className="text-sm font-medium text-foreground">{idea.fundingStrategy}</p></div>
                  <Button variant="outline" className="w-full" onClick={() => exportIdea(idea)}>Export Idea</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiStartupIdeaGenerator;
