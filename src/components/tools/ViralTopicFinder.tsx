import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, TrendingUp, Flame, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TopicIdea {
  title: string;
  angle: string;
  viralScore: number;
  platform: string;
  contentType: string;
  hook: string;
}

const platforms = ["Twitter/X", "LinkedIn", "Reddit", "YouTube", "TikTok", "Blog/SEO"];
const niches = ["Tech & AI", "Cybersecurity", "SaaS & Startups", "Web Development", "Blockchain & Crypto", "DevOps & Cloud", "Data Science", "Career & Freelancing"];

const topicTemplates: Record<string, { titles: string[]; angles: string[]; hooks: string[] }> = {
  "Tech & AI": {
    titles: ["Why {tool} Will Replace {job} by 2027", "I Built a {product} Using Only AI — Here's What Happened", "The {concept} Nobody Is Talking About", "{number} AI Tools That Actually Save Me {time} Hours/Week", "Stop Using {old_tool} — Try {new_approach} Instead"],
    angles: ["Contrarian take on mainstream AI hype", "Personal experiment with measurable results", "Hidden trend analysis with data", "Practical tool roundup with real use cases", "Industry shift prediction backed by evidence"],
    hooks: ["Most people don't realize this yet, but...", "I spent 30 days testing this and the results shocked me", "Everyone is focused on X while Y is quietly changing everything", "Here's the exact workflow I use to...", "This one change doubled my productivity"],
  },
  "Cybersecurity": {
    titles: ["{number} Security Mistakes {audience} Make Daily", "This {vulnerability} Took Down a {size} Company", "How I Found a Critical Bug in {product}", "Your {system} Is Probably Vulnerable — Here's Why", "The Real Cost of Ignoring {security_topic}"],
    angles: ["Post-mortem analysis of real incidents", "Step-by-step vulnerability walkthrough", "Security audit checklist for non-experts", "Comparison of security tools with benchmarks", "Behind-the-scenes of bug bounty hunting"],
    hooks: ["I just discovered something alarming about...", "This vulnerability has been hiding in plain sight", "Most companies fail this basic security check", "After analyzing 1000+ breaches, here's the pattern", "Your security is only as strong as..."],
  },
  "SaaS & Startups": {
    titles: ["From $0 to ${revenue} MRR in {time}", "Why {percentage}% of SaaS Startups Fail at {stage}", "The {metric} That Predicts SaaS Success", "I Bootstrapped a {product} — Lessons After {time}", "Stop Building Features — Do This Instead"],
    angles: ["Revenue growth breakdown with exact numbers", "Failure analysis with actionable takeaways", "Counter-intuitive metric deep dive", "Transparent journey with wins and losses", "Strategic pivot story with before/after data"],
    hooks: ["Everyone told me this was a bad idea, but...", "The single metric that changed how I build products", "I almost gave up at month 3, here's what saved us", "This unconventional strategy grew us 10x", "The hardest lesson I learned building my SaaS"],
  },
  "Web Development": {
    titles: ["{framework} vs {framework}: The Real Benchmark", "Stop Writing {pattern} — Use {alternative}", "{number} CSS Tricks Senior Devs Actually Use", "Why I Switched From {old} to {new} (After {time})", "The {concept} Every Developer Should Know in {year}"],
    angles: ["Performance benchmark with reproducible tests", "Code refactoring before/after comparison", "Advanced techniques with visual demos", "Migration story with pros, cons, and metrics", "Fundamental concept explained with modern context"],
    hooks: ["After building 50+ projects, this is what I always reach for", "This pattern will save you hours of debugging", "Most tutorials teach this wrong — here's the better way", "I benchmarked these frameworks and the winner surprised me", "The one thing I wish I learned earlier"],
  },
  "Blockchain & Crypto": {
    titles: ["This Smart Contract Bug Cost ${amount}", "{protocol} Just Changed Everything About {concept}", "{number} Web3 Projects Actually Solving Real Problems", "DeFi in {year}: What's Actually Working", "Why {concept} Will Matter More Than {hype_topic}"],
    angles: ["Technical audit of smart contract vulnerabilities", "Protocol analysis with economic implications", "Curated list with adoption metrics", "Data-driven DeFi landscape overview", "Long-term value thesis vs short-term speculation"],
    hooks: ["The code looked fine until we found this...", "While everyone watches prices, the real innovation is...", "I analyzed on-chain data and found something interesting", "This protocol is quietly building the future of...", "Most people misunderstand what blockchain actually solves"],
  },
  "DevOps & Cloud": {
    titles: ["We Cut Our AWS Bill by {percentage}%", "{number} Kubernetes Mistakes That Cost Real Money", "The {tool} Pipeline That Deploys in {time}", "Why Your {system} Monitoring Is Lying to You", "From {old_setup} to {new_setup}: A Migration Story"],
    angles: ["Cost optimization case study with specifics", "Production incident post-mortem", "CI/CD pipeline architecture breakdown", "Observability deep-dive with tooling comparison", "Cloud migration with timeline and lessons"],
    hooks: ["Our infrastructure was bleeding money until...", "This outage taught us everything about...", "After migrating 200+ services, here's my playbook", "The monitoring gap nobody talks about", "One configuration change saved us thousands"],
  },
  "Data Science": {
    titles: ["{model} vs {model}: Which One Actually Wins?", "The {technique} That Improved Our Accuracy by {percentage}%", "{number} Datasets Every Data Scientist Should Know", "Why Your ML Model Works in Notebooks But Fails in Production", "Feature Engineering Tricks That Actually Matter"],
    angles: ["Model comparison with reproducible benchmarks", "Technique deep-dive with code and results", "Curated resource list with use cases", "MLOps reality check with solutions", "Practical feature engineering with case studies"],
    hooks: ["Everyone uses the default settings but...", "This simple preprocessing step changed everything", "After deploying 20+ models to production, here's what I learned", "The gap between notebook and production is...", "Most tutorials skip this critical step"],
  },
  "Career & Freelancing": {
    titles: ["How I Went From ${salary_low} to ${salary_high} in {time}", "The {skill} That Tripled My Freelance Rate", "{number} Portfolio Mistakes Killing Your Applications", "Why {traditional_advice} Is Outdated in {year}", "I Hired {number}+ Developers — Here's What Stood Out"],
    angles: ["Salary negotiation framework with scripts", "Skill acquisition roadmap with ROI analysis", "Portfolio review with specific improvements", "Hiring manager perspective with examples", "Career pivot story with decision framework"],
    hooks: ["The advice that changed my career trajectory", "After reviewing 500+ resumes, I noticed a pattern", "This skill has the highest ROI for developers right now", "The job market has changed — here's how to adapt", "I turned down a FAANG offer because..."],
  },
};

const generateTopics = (niche: string, seedKeyword: string): TopicIdea[] => {
  const templates = topicTemplates[niche] || topicTemplates["Tech & AI"];
  const ideas: TopicIdea[] = [];

  const shuffled = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

  const titles = shuffled(templates.titles);
  const angles = shuffled(templates.angles);
  const hooks = shuffled(templates.hooks);

  for (let i = 0; i < Math.min(5, titles.length); i++) {
    let title = titles[i];
    // Fill in placeholders with seed keyword context
    title = title
      .replace("{tool}", seedKeyword || "This AI Tool")
      .replace("{job}", "Junior Developers")
      .replace("{product}", seedKeyword || "a SaaS App")
      .replace("{concept}", seedKeyword || "Edge Computing")
      .replace("{number}", String(Math.floor(Math.random() * 7) + 3))
      .replace("{time}", ["3 Months", "6 Months", "1 Year"][Math.floor(Math.random() * 3)])
      .replace("{old_tool}", "Legacy Tools")
      .replace("{new_approach}", seedKeyword || "Modern Alternatives")
      .replace("{audience}", "Developers")
      .replace("{vulnerability}", seedKeyword || "API Vulnerability")
      .replace("{size}", ["Fortune 500", "Mid-size", "Growing"][Math.floor(Math.random() * 3)])
      .replace("{system}", seedKeyword || "Cloud")
      .replace("{security_topic}", seedKeyword || "API Security")
      .replace("{revenue}", String(Math.floor(Math.random() * 50 + 10)) + "K")
      .replace("{percentage}", String(Math.floor(Math.random() * 60 + 20)))
      .replace("{stage}", ["Scaling", "Product-Market Fit", "Fundraising"][Math.floor(Math.random() * 3)])
      .replace("{metric}", seedKeyword || "Net Revenue Retention")
      .replace("{framework}", seedKeyword || "React")
      .replace("{pattern}", "Prop Drilling")
      .replace("{alternative}", "Composition Patterns")
      .replace("{old}", "Webpack")
      .replace("{new}", "Vite")
      .replace("{year}", "2026")
      .replace("{protocol}", seedKeyword || "Ethereum L2")
      .replace("{amount}", String(Math.floor(Math.random() * 900 + 100)) + "K")
      .replace("{hype_topic}", "Token Speculation")
      .replace("{old_setup}", "Monolith")
      .replace("{new_setup}", "Microservices")
      .replace("{model}", seedKeyword || "GPT-5")
      .replace("{technique}", seedKeyword || "Data Augmentation")
      .replace("{salary_low}", "60K")
      .replace("{salary_high}", "180K")
      .replace("{skill}", seedKeyword || "System Design")
      .replace("{traditional_advice}", "Getting a CS Degree")
      .replace(/{[^}]+}/g, seedKeyword || "This");

    ideas.push({
      title,
      angle: angles[i % angles.length],
      viralScore: Math.floor(Math.random() * 30 + 70),
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      contentType: ["Thread", "Long-form Article", "Short Video", "Case Study", "Tutorial"][Math.floor(Math.random() * 5)],
      hook: hooks[i % hooks.length],
    });
  }

  return ideas.sort((a, b) => b.viralScore - a.viralScore);
};

const ViralTopicFinder = () => {
  const [niche, setNiche] = useState("");
  const [keyword, setKeyword] = useState("");
  const [topics, setTopics] = useState<TopicIdea[] | null>(null);

  const generate = () => {
    if (!niche) {
      toast({ title: "Select a niche", description: "Choose your content niche to generate viral topics.", variant: "destructive" });
      return;
    }
    const results = generateTopics(niche, keyword);
    setTopics(results);
  };

  const copyAll = () => {
    if (!topics) return;
    const text = topics.map((t, i) => `${i + 1}. ${t.title}\n   Angle: ${t.angle}\n   Hook: ${t.hook}\n   Platform: ${t.platform} | Type: ${t.contentType} | Score: ${t.viralScore}/100`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Topics copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Content Niche</label>
        <Select onValueChange={setNiche} value={niche}>
          <SelectTrigger><SelectValue placeholder="Select your niche" /></SelectTrigger>
          <SelectContent>
            {niches.map((n) => (
              <SelectItem key={n} value={n}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Seed Keyword (optional)</label>
        <Input placeholder="e.g., Kubernetes, GPT-5, React Server Components" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </div>
      <Button onClick={generate} className="w-full"><Flame className="h-4 w-4 mr-2" /> Find Viral Topics</Button>

      {topics && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">🔥 {topics.length} Viral Topic Ideas</h3>
            <Button size="sm" variant="outline" onClick={copyAll}><Copy className="h-3.5 w-3.5 mr-1" /> Copy All</Button>
          </div>
          <div className="space-y-3">
            {topics.map((topic, i) => (
              <div key={i} className="bg-muted/50 border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-foreground leading-snug">{topic.title}</h4>
                  <div className="flex items-center gap-1 shrink-0">
                    {topic.viralScore >= 90 ? <Flame className="h-4 w-4 text-orange-500" /> : <TrendingUp className="h-4 w-4 text-green-500" />}
                    <span className="text-sm font-bold text-foreground">{topic.viralScore}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground"><strong>Angle:</strong> {topic.angle}</p>
                <p className="text-xs text-muted-foreground italic">"{topic.hook}"</p>
                <div className="flex gap-2">
                  <Badge variant="outline">{topic.platform}</Badge>
                  <Badge variant="secondary">{topic.contentType}</Badge>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full" onClick={generate}><Zap className="h-4 w-4 mr-2" /> Regenerate Ideas</Button>
        </div>
      )}
    </div>
  );
};

export default ViralTopicFinder;
