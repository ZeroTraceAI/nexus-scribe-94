import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OutlineSection {
  heading: string;
  type: "h2" | "h3";
  bullets: string[];
}

const generateOutline = (topic: string, keyword: string, depth: string, audience: string): OutlineSection[] => {
  const kw = keyword || topic;
  const sections: OutlineSection[] = [];

  const introHeadings = [`What Is ${kw}?`, `Introduction to ${kw}`, `Understanding ${kw}: An Overview`];
  const whyHeadings = [`Why ${kw} Matters in ${new Date().getFullYear()}`, `Benefits of ${kw}`, `Why You Should Care About ${kw}`];
  const howHeadings = [`How ${kw} Works`, `How to Implement ${kw}`, `Getting Started with ${kw}`];
  const bestPractice = [`${kw} Best Practices`, `Top ${kw} Strategies`, `Proven ${kw} Techniques`];
  const mistakes = [`Common ${kw} Mistakes to Avoid`, `${kw} Pitfalls and How to Fix Them`];
  const tools = [`Best ${kw} Tools and Resources`, `Top Tools for ${kw} in ${new Date().getFullYear()}`];
  const advanced = [`Advanced ${kw} Techniques`, `Taking ${kw} to the Next Level`, `Expert-Level ${kw} Strategies`];
  const comparison = [`${kw} vs Alternatives: A Comparison`, `Comparing ${kw} Approaches`];
  const faq = [`Frequently Asked Questions About ${kw}`, `${kw} FAQ`];
  const conclusion = [`Conclusion: Key Takeaways on ${kw}`, `Final Thoughts on ${kw}`, `Summary and Next Steps`];

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const audienceBullets: Record<string, string[]> = {
    beginners: ["Define key terminology", "Explain prerequisites", "Include step-by-step walkthrough", "Add visual examples", "Link to foundational resources"],
    intermediate: ["Skip basic definitions", "Focus on practical implementation", "Include code examples", "Compare different approaches", "Address common edge cases"],
    advanced: ["Deep dive into architecture", "Performance optimization tips", "Real-world case studies", "Scaling considerations", "Cutting-edge developments"],
    general: ["Balance theory and practice", "Use clear, accessible language", "Include relevant examples", "Cover both basics and tips", "Provide actionable next steps"],
  };

  const bullets = audienceBullets[audience] || audienceBullets.general;

  // Introduction
  sections.push({ heading: pick(introHeadings), type: "h2", bullets: [bullets[0], bullets[1], `Brief overview of ${topic}`] });

  // Why it matters
  sections.push({ heading: pick(whyHeadings), type: "h2", bullets: [`Key advantages of ${kw}`, `Real-world impact and use cases`, `Industry trends supporting ${kw}`] });

  // How it works
  sections.push({ heading: pick(howHeadings), type: "h2", bullets: [`Core concepts and fundamentals`, `Step-by-step implementation guide`, bullets[2]] });

  if (depth === "detailed" || depth === "comprehensive") {
    sections.push({ heading: "Key Components and Features", type: "h3", bullets: [`Feature breakdown of ${kw}`, `Component architecture overview`, `Integration points and APIs`] });
  }

  // Best practices
  sections.push({ heading: pick(bestPractice), type: "h2", bullets: [`Proven strategies for ${kw}`, bullets[3], `Performance and optimization tips`] });

  // Common mistakes
  sections.push({ heading: pick(mistakes), type: "h2", bullets: [`Top mistakes developers make`, `How to identify and fix issues`, bullets[4] || `Prevention strategies`] });

  if (depth === "comprehensive") {
    sections.push({ heading: pick(advanced), type: "h2", bullets: [`Advanced optimization techniques`, `Scaling for production`, `Expert tips and tricks`] });
    sections.push({ heading: pick(comparison), type: "h2", bullets: [`Pros and cons analysis`, `When to use each approach`, `Decision framework`] });
  }

  // Tools
  sections.push({ heading: pick(tools), type: "h2", bullets: [`Curated list of tools for ${kw}`, `Free vs paid options`, `Tool comparison table`] });

  // FAQ
  sections.push({ heading: pick(faq), type: "h2", bullets: [`Address 5-8 common questions`, `Include schema markup for FAQ`, `Link to detailed answers`] });

  // Conclusion
  sections.push({ heading: pick(conclusion), type: "h2", bullets: [`Summarize key points`, `Actionable next steps`, `Call to action`] });

  return sections;
};

const BlogOutlineGenerator = () => {
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [depth, setDepth] = useState("detailed");
  const [audience, setAudience] = useState("general");
  const [outline, setOutline] = useState<OutlineSection[] | null>(null);

  const generate = () => {
    if (!topic.trim()) {
      toast({ title: "Enter a blog topic", variant: "destructive" });
      return;
    }
    setOutline(generateOutline(topic, keyword, depth, audience));
  };

  const copyOutline = () => {
    if (!outline) return;
    const md = outline.map((s) => `${s.type === "h2" ? "##" : "###"} ${s.heading}\n${s.bullets.map((b) => `- ${b}`).join("\n")}`).join("\n\n");
    navigator.clipboard.writeText(md);
    toast({ title: "Outline copied as Markdown!" });
  };

  const removeSection = (idx: number) => {
    if (!outline) return;
    setOutline(outline.filter((_, i) => i !== idx));
  };

  const addSection = () => {
    if (!outline) return;
    setOutline([...outline, { heading: "New Section", type: "h2", bullets: ["Point 1", "Point 2"] }]);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Blog Topic</label>
        <Input placeholder="e.g., Kubernetes Security Best Practices" value={topic} onChange={(e) => setTopic(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Target Keyword</label>
          <Input placeholder="e.g., Kubernetes security" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Depth</label>
          <Select value={depth} onValueChange={setDepth}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="brief">Brief (5-7 sections)</SelectItem>
              <SelectItem value="detailed">Detailed (8-10 sections)</SelectItem>
              <SelectItem value="comprehensive">Comprehensive (10+ sections)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Audience</label>
          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="beginners">Beginners</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={generate} className="w-full">Generate Blog Outline</Button>

      {outline && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">{outline.length} Sections</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={addSection}><Plus className="h-3.5 w-3.5 mr-1" />Add</Button>
              <Button size="sm" variant="outline" onClick={copyOutline}><Copy className="h-3.5 w-3.5 mr-1" />Copy MD</Button>
            </div>
          </div>
          <div className="space-y-2">
            {outline.map((section, i) => (
              <div key={i} className={`border rounded-lg p-4 group ${section.type === "h3" ? "ml-6 bg-muted/30" : "bg-muted/50"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground uppercase">{section.type}</span>
                    <h4 className="font-semibold text-foreground text-sm">{section.heading}</h4>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeSection(i)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <ul className="mt-2 space-y-1">
                  {section.bullets.map((b, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogOutlineGenerator;
