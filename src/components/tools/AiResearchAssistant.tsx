import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface ResearchPlan {
  topic: string;
  objectives: string[];
  methodology: string[];
  sources: { name: string; type: string; reliability: string }[];
  outline: { section: string; keyQuestions: string[] }[];
  timeline: { phase: string; duration: string; deliverable: string }[];
}

const generateResearchPlan = (topic: string, depth: string): ResearchPlan => {
  const isDeep = depth === "deep";
  return {
    topic,
    objectives: [
      `Define and scope the current state of ${topic}`,
      `Identify key players, frameworks, and technologies`,
      `Analyze trends, challenges, and opportunities`,
      ...(isDeep ? [`Compare methodologies and approaches`, `Forecast future developments (2025-2030)`] : []),
    ],
    methodology: [
      "Systematic literature review (academic papers, whitepapers)",
      "Analysis of industry reports (Gartner, McKinsey, IEEE)",
      "Open-source project & GitHub trend analysis",
      ...(isDeep ? ["Expert interviews / survey data", "Competitive landscape mapping", "Patent analysis for innovation tracking"] : []),
    ],
    sources: [
      { name: "arXiv", type: "Academic", reliability: "High" },
      { name: "Google Scholar", type: "Academic", reliability: "High" },
      { name: "IEEE Xplore", type: "Academic", reliability: "High" },
      { name: "GitHub Trending", type: "Open Source", reliability: "Medium" },
      { name: "Hacker News", type: "Community", reliability: "Medium" },
      { name: "Industry Reports", type: "Commercial", reliability: "High" },
      ...(isDeep ? [
        { name: "Patent databases (USPTO)", type: "Legal", reliability: "High" },
        { name: "Conference proceedings", type: "Academic", reliability: "High" },
      ] : []),
    ],
    outline: [
      { section: "Executive Summary", keyQuestions: ["What is the core thesis?", "What are the key findings?"] },
      { section: "Introduction & Background", keyQuestions: [`What is ${topic}?`, "Why does it matter now?", "What problem does it solve?"] },
      { section: "Current State of the Art", keyQuestions: ["What are the leading approaches?", "Who are the key players?", "What tools and frameworks exist?"] },
      { section: "Technical Deep Dive", keyQuestions: ["How does the technology work?", "What are the architectural patterns?", "What are the performance benchmarks?"] },
      { section: "Challenges & Limitations", keyQuestions: ["What are the known limitations?", "What ethical concerns exist?", "What are the scalability issues?"] },
      { section: "Future Outlook", keyQuestions: ["What trends are emerging?", "What breakthroughs are expected?", "How will the landscape change?"] },
      { section: "Conclusions & Recommendations", keyQuestions: ["What should practitioners focus on?", "What are the best resources?"] },
    ],
    timeline: [
      { phase: "Topic Scoping", duration: "1 day", deliverable: "Research questions & scope document" },
      { phase: "Literature Review", duration: isDeep ? "1 week" : "3 days", deliverable: "Annotated bibliography" },
      { phase: "Data Collection", duration: isDeep ? "1 week" : "2 days", deliverable: "Raw data & notes" },
      { phase: "Analysis & Synthesis", duration: isDeep ? "5 days" : "2 days", deliverable: "Key findings document" },
      { phase: "Writing & Review", duration: isDeep ? "1 week" : "3 days", deliverable: "Final research report" },
    ],
  };
};

const AiResearchAssistant = () => {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("standard");
  const [result, setResult] = useState<ResearchPlan | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) { toast({ title: "Enter a research topic" }); return; }
    setResult(generateResearchPlan(topic, depth));
  };

  const exportPlan = () => {
    if (!result) return;
    const md = `# Research Plan: ${result.topic}\n\n## Objectives\n${result.objectives.map(o => `- ${o}`).join("\n")}\n\n## Methodology\n${result.methodology.map(m => `- ${m}`).join("\n")}\n\n## Sources\n${result.sources.map(s => `- ${s.name} (${s.type}) — Reliability: ${s.reliability}`).join("\n")}\n\n## Outline\n${result.outline.map(o => `### ${o.section}\n${o.keyQuestions.map(q => `- ${q}`).join("\n")}`).join("\n\n")}\n\n## Timeline\n${result.timeline.map(t => `- **${t.phase}** (${t.duration}): ${t.deliverable}`).join("\n")}`;
    navigator.clipboard.writeText(md);
    toast({ title: "Research plan exported!" });
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Research topic (e.g., 'LLM fine-tuning techniques', 'Zero-knowledge proofs')..." value={topic} onChange={e => setTopic(e.target.value)} />
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Depth</p>
        <div className="flex gap-2">
          {["standard", "deep"].map(d => (
            <button key={d} onClick={() => setDepth(d)} className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${depth === d ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{d} Research</button>
          ))}
        </div>
      </div>
      <Button onClick={handleGenerate} className="w-full">Generate Research Plan</Button>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Research Plan: {result.topic}</h3>
            <Button variant="outline" size="sm" onClick={exportPlan}>Export</Button>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Objectives</p>
            <ul className="space-y-1">{result.objectives.map((o, i) => <li key={i} className="text-sm text-foreground flex items-center gap-2"><span className="text-primary">🎯</span> {o}</li>)}</ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Recommended Sources</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{result.sources.map((s, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3 border">
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <div className="flex gap-1 mt-1"><Badge variant="outline" className="text-xs">{s.type}</Badge><Badge variant={s.reliability === "High" ? "secondary" : "outline"} className="text-xs">{s.reliability}</Badge></div>
              </div>
            ))}</div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Research Outline</p>
            <div className="space-y-3">{result.outline.map((o, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-4 border">
                <h4 className="font-medium text-foreground mb-2">{i + 1}. {o.section}</h4>
                <ul className="space-y-1">{o.keyQuestions.map((q, j) => <li key={j} className="text-sm text-muted-foreground">• {q}</li>)}</ul>
              </div>
            ))}</div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Timeline</p>
            <div className="space-y-2">{result.timeline.map((t, i) => (
              <div key={i} className="flex gap-3 items-center">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <div className="flex-1 flex items-center justify-between bg-muted/50 rounded-lg p-3 border">
                  <div><p className="text-sm font-medium text-foreground">{t.phase}</p><p className="text-xs text-muted-foreground">{t.deliverable}</p></div>
                  <Badge variant="outline">{t.duration}</Badge>
                </div>
              </div>
            ))}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiResearchAssistant;
