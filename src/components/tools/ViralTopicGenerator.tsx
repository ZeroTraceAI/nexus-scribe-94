import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ViralTopic {
  title: string;
  hook: string;
  angle: string;
  platform: string;
  viralScore: number;
  format: string;
  hashtags: string[];
  contentPlan: string;
}

const platforms = ["Twitter/X", "LinkedIn", "YouTube", "TikTok", "Reddit", "Blog"];
const niches = ["AI/ML", "Cybersecurity", "Web3", "SaaS", "DevOps", "Frontend"];

const generateTopics = (niche: string, platform: string): ViralTopic[] => {
  const topicTemplates: Record<string, { titles: string[]; hooks: string[]; angles: string[] }> = {
    "AI/ML": {
      titles: [`Why ${niche} engineers will be replaced — and what to do about it`, `I built an AI agent that ${niche} in 24 hours`, `The ${niche} tool that nobody talks about (yet)`, `${niche} predictions that sound insane but are already happening`, `Stop using ChatGPT wrong — ${niche} pro tips`, `The ${niche} stack I wish I knew about 2 years ago`],
      hooks: ["This might be controversial, but...", "I spent 100 hours testing this so you don't have to.", "Everyone is sleeping on this.", "Unpopular opinion:", "The data doesn't lie:"],
      angles: ["Contrarian take", "Personal experiment", "Data-driven analysis", "Behind the scenes", "Prediction / forecast", "Tool comparison"],
    },
    "Cybersecurity": {
      titles: ["The hack that cost $100M — and how 3 lines of code could have prevented it", "Your API is leaking data right now. Here's how to check.", "Zero-day exploits: What nobody tells you", "I hacked my own app — here's what I found", "The security tool every developer needs (it's free)", "Why your .env file is your biggest vulnerability"],
      hooks: ["This vulnerability affects 80% of web apps.", "I found this in a Fortune 500 company's code.", "This took me 5 minutes to exploit.", "Most developers get this wrong:", "Breaking: new vulnerability disclosed —"],
      angles: ["Live demo / exploit", "Post-mortem analysis", "Security audit results", "Tool review", "Vulnerability disclosure", "Best practices guide"],
    },
    "Web3": {
      titles: ["The smart contract bug that drained $50M", "Web3 vs Web2: An honest comparison from a developer who's built both", "Why 90% of NFT projects fail (technical analysis)", "Building a DApp in 2025: The honest truth", "Solidity patterns that will save you millions in gas", "The future of DeFi: What the data shows"],
      hooks: ["This exploit is still active.", "I analyzed 1000 smart contracts.", "The numbers are shocking:", "Nobody is talking about this risk:", "Here's what really happened:"],
      angles: ["Technical deep dive", "Market analysis", "Security audit", "Tutorial", "Industry analysis", "Prediction"],
    },
  };

  const template = topicTemplates[niche] || topicTemplates["AI/ML"];

  return template.titles.map((title, i) => ({
    title,
    hook: template.hooks[i % template.hooks.length],
    angle: template.angles[i % template.angles.length],
    platform,
    viralScore: Math.floor(Math.random() * 30) + 70,
    format: ["Thread", "Short-form video", "Long-form article", "Carousel", "Live stream", "Case study"][i % 6],
    hashtags: [`#${niche.replace("/", "")}`, "#tech", "#developer", `#${platform.toLowerCase().replace("/", "")}`, "#viral"],
    contentPlan: `Day 1: Teaser post → Day 2: Full content → Day 3: Follow-up thread with community reactions → Day 5: Reformat for ${platform === "Twitter/X" ? "LinkedIn" : "Twitter/X"}`,
  }));
};

const ViralTopicGenerator = () => {
  const [niche, setNiche] = useState("AI/ML");
  const [platform, setPlatform] = useState("Twitter/X");
  const [topics, setTopics] = useState<ViralTopic[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleGenerate = () => { setTopics(generateTopics(niche, platform)); setExpanded(null); };

  const exportTopics = () => {
    const md = topics.map(t => `## ${t.title}\nHook: ${t.hook}\nAngle: ${t.angle}\nFormat: ${t.format}\nViral Score: ${t.viralScore}/100\nPlan: ${t.contentPlan}\nHashtags: ${t.hashtags.join(" ")}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(`# Viral Topics: ${niche} on ${platform}\n\n${md}`);
    toast({ title: "Topics exported!" });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Niche</p>
        <div className="flex flex-wrap gap-2">
          {niches.map(n => (
            <button key={n} onClick={() => setNiche(n)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${niche === n ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{n}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Platform</p>
        <div className="flex flex-wrap gap-2">
          {platforms.map(p => (
            <button key={p} onClick={() => setPlatform(p)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${platform === p ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{p}</button>
          ))}
        </div>
      </div>
      <Button onClick={handleGenerate} className="w-full">Generate Viral Topics</Button>

      {topics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{topics.length} viral topics generated</p>
            <Button variant="outline" size="sm" onClick={exportTopics}>Export All</Button>
          </div>
          {topics.map((topic, i) => (
            <div key={i} className="bg-muted/50 rounded-xl border overflow-hidden">
              <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full text-left p-4 hover:bg-muted/80 transition-colors">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-foreground pr-4">{topic.title}</h3>
                  <div className="flex gap-2 shrink-0">
                    <Badge variant={topic.viralScore >= 85 ? "default" : "secondary"}>{topic.viralScore}%</Badge>
                  </div>
                </div>
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 space-y-3 border-t pt-3">
                  <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                    <p className="text-xs font-semibold text-primary uppercase mb-1">Hook</p>
                    <p className="text-sm text-foreground italic">"{topic.hook}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Angle</span><p className="text-sm font-medium text-foreground">{topic.angle}</p></div>
                    <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Format</span><p className="text-sm font-medium text-foreground">{topic.format}</p></div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Content Plan</p>
                    <p className="text-sm text-muted-foreground">{topic.contentPlan}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">{topic.hashtags.map(h => <Badge key={h} variant="outline" className="text-xs">{h}</Badge>)}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViralTopicGenerator;
