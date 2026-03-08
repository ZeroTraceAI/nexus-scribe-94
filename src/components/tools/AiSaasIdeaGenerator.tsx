import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface SaasIdea {
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  targetAudience: string;
  revenueModel: string;
  pricing: string;
  techStack: string[];
  mvpFeatures: string[];
  competitors: string[];
  moat: string;
  marketSize: string;
  viabilityScore: number;
}

const niches = ["Developer Tools", "Marketing", "Healthcare", "Education", "Finance", "HR/Recruiting", "E-commerce", "Productivity", "AI/ML", "Cybersecurity"];
const models = ["Subscription", "Usage-based", "Freemium", "Marketplace", "API-first"];

const generateIdeas = (niche: string, model: string): SaasIdea[] => {
  const ideaPool: Record<string, SaasIdea[]> = {
    "Developer Tools": [
      { name: "CodePulse", tagline: "Real-time code health monitoring for engineering teams", problem: "Teams don't know their codebase health until tech debt becomes critical", solution: "Continuous code quality monitoring with trend analysis, debt scoring, and automated refactoring suggestions", targetAudience: "Engineering managers & tech leads at 50-500 person companies", revenueModel: model, pricing: "$29/mo per repo, $199/mo team plan", techStack: ["React", "Node.js", "PostgreSQL", "AST parsers", "GitHub API"], mvpFeatures: ["GitHub/GitLab integration", "Code health dashboard", "Tech debt score", "Weekly reports", "Slack alerts"], competitors: ["SonarQube", "CodeClimate", "Codacy"], moat: "AI-powered auto-fix suggestions + team productivity correlation", marketSize: "$4.2B (Code Quality Tools)", viabilityScore: 85 },
      { name: "DevEnvCloud", tagline: "One-click reproducible dev environments", problem: "New developer onboarding takes days; 'works on my machine' wastes hours weekly", solution: "Cloud-based dev environments defined as code, spinning up in seconds with full IDE access", targetAudience: "Dev teams with 10+ engineers, especially remote-first", revenueModel: model, pricing: "$19/dev/mo, $149/mo team", techStack: ["Kubernetes", "Nix", "VS Code Server", "Terraform"], mvpFeatures: ["GitHub-connected workspace", "Prebuilt templates", "Env-as-code config", "Shared workspaces", "Resource dashboard"], competitors: ["Gitpod", "GitHub Codespaces", "Coder"], moat: "Nix-based deterministic builds + cost optimization engine", marketSize: "$2.8B (Cloud IDE)", viabilityScore: 72 },
    ],
    "AI/ML": [
      { name: "PromptOps", tagline: "Version control and A/B testing for AI prompts", problem: "Teams iterate on prompts in spreadsheets with no versioning, testing, or collaboration", solution: "Git-like prompt management with A/B testing, performance metrics, and team collaboration", targetAudience: "AI product teams and prompt engineers", revenueModel: model, pricing: "$49/mo team, $299/mo enterprise", techStack: ["React", "Python", "FastAPI", "PostgreSQL", "Redis"], mvpFeatures: ["Prompt versioning", "A/B test framework", "Performance metrics", "Team sharing", "API integration"], competitors: ["PromptLayer", "Humanloop", "LangSmith"], moat: "Cross-model optimization + automatic prompt regression testing", marketSize: "$1.5B (AI Tooling)", viabilityScore: 88 },
      { name: "DataForge", tagline: "Synthetic training data generation platform", problem: "ML teams spend 60% of time collecting and labeling training data", solution: "Generate high-quality synthetic training data with built-in bias detection and privacy compliance", targetAudience: "ML engineers and data science teams", revenueModel: model, pricing: "$99/mo starter, $499/mo pro", techStack: ["Python", "PyTorch", "Diffusion models", "React", "FastAPI"], mvpFeatures: ["Text/image/tabular data generation", "Bias detection", "Privacy compliance", "Data quality scoring", "Export to ML frameworks"], competitors: ["Gretel.ai", "Mostly AI", "Hazy"], moat: "Domain-specific fine-tuned generators + automated quality validation", marketSize: "$3.1B (Synthetic Data)", viabilityScore: 82 },
    ],
    "Marketing": [
      { name: "ContentQ", tagline: "AI content pipeline from ideation to publication", problem: "Content teams juggle 5+ tools for research, writing, editing, SEO, and publishing", solution: "Unified platform: AI-assisted research → writing → SEO optimization → scheduling → analytics", targetAudience: "Content marketing teams at B2B SaaS companies", revenueModel: model, pricing: "$79/mo per seat, $399/mo team", techStack: ["Next.js", "Node.js", "PostgreSQL", "OpenAI API", "Stripe"], mvpFeatures: ["AI topic research", "Draft generation", "SEO scorer", "Editorial calendar", "Multi-channel publishing"], competitors: ["Jasper", "Surfer SEO", "ContentStudio"], moat: "End-to-end workflow + learning from your brand voice over time", marketSize: "$5.7B (Content Marketing)", viabilityScore: 78 },
    ],
  };

  const ideas = ideaPool[niche] || ideaPool["Developer Tools"];
  return ideas.map(idea => ({ ...idea, revenueModel: model }));
};

const AiSaasIdeaGenerator = () => {
  const [niche, setNiche] = useState("Developer Tools");
  const [model, setModel] = useState("Subscription");
  const [ideas, setIdeas] = useState<SaasIdea[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleGenerate = () => { setIdeas(generateIdeas(niche, model)); setExpanded(null); };

  const exportIdea = (idea: SaasIdea) => {
    const md = `# ${idea.name}\n> ${idea.tagline}\n\n## Problem\n${idea.problem}\n\n## Solution\n${idea.solution}\n\n## Target Audience\n${idea.targetAudience}\n\n## Revenue Model\n${idea.revenueModel} — ${idea.pricing}\n\n## MVP Features\n${idea.mvpFeatures.map(f => `- ${f}`).join("\n")}\n\n## Tech Stack\n${idea.techStack.join(", ")}\n\n## Competitors\n${idea.competitors.join(", ")}\n\n## Competitive Moat\n${idea.moat}\n\n## Market Size\n${idea.marketSize}\n\n## Viability Score: ${idea.viabilityScore}/100`;
    navigator.clipboard.writeText(md);
    toast({ title: `${idea.name} idea exported!` });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Niche</p>
        <div className="flex flex-wrap gap-2">
          {niches.map(n => <button key={n} onClick={() => setNiche(n)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${niche === n ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{n}</button>)}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Revenue Model</p>
        <div className="flex flex-wrap gap-2">
          {models.map(m => <button key={m} onClick={() => setModel(m)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${model === m ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{m}</button>)}
        </div>
      </div>
      <Button onClick={handleGenerate} className="w-full">Generate SaaS Ideas</Button>

      {ideas.length > 0 && (
        <div className="space-y-3">
          {ideas.map((idea, i) => (
            <div key={i} className="bg-muted/50 rounded-xl border overflow-hidden">
              <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full text-left p-4 hover:bg-muted/80 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{idea.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{idea.tagline}</p>
                  </div>
                  <Badge variant={idea.viabilityScore >= 80 ? "default" : "secondary"}>{idea.viabilityScore}%</Badge>
                </div>
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 space-y-3 border-t pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Problem</span><p className="text-sm text-foreground">{idea.problem}</p></div>
                    <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Solution</span><p className="text-sm text-foreground">{idea.solution}</p></div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Market Size</span><p className="text-sm font-bold text-primary">{idea.marketSize}</p></div>
                    <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Revenue</span><p className="text-sm font-medium text-foreground">{idea.revenueModel}</p></div>
                    <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Pricing</span><p className="text-sm font-medium text-foreground">{idea.pricing}</p></div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">MVP Features</p>
                    <ul className="space-y-1">{idea.mvpFeatures.map((f, j) => <li key={j} className="text-sm text-foreground flex gap-2"><span className="text-primary">✓</span> {f}</li>)}</ul>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground self-center">Tech:</span>
                    {idea.techStack.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                    <p className="text-xs font-semibold text-primary uppercase mb-1">Competitive Moat</p>
                    <p className="text-sm text-foreground">{idea.moat}</p>
                  </div>
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

export default AiSaasIdeaGenerator;
