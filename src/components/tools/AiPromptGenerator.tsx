import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const frameworks: Record<string, { template: (topic: string, tone: string) => string; label: string }> = {
  RISEN: {
    label: "R.I.S.E.N.",
    template: (topic, tone) => `**Role:** You are an expert ${topic} specialist with 10+ years of experience.\n\n**Instructions:** Provide a comprehensive, ${tone} analysis of ${topic}. Include actionable insights and real-world examples.\n\n**Steps:**\n1. Define the core concept of ${topic}\n2. Explain key principles and best practices\n3. Provide practical examples and use cases\n4. List common mistakes to avoid\n5. Summarize with actionable takeaways\n\n**End Goal:** A thorough, well-structured guide that helps the reader understand and apply ${topic} effectively.\n\n**Narrowing:** Focus specifically on practical implementation rather than theoretical concepts.`,
  },
  COSTAR: {
    label: "CO-STAR",
    template: (topic, tone) => `**Context:** I need expert guidance on ${topic} for a professional audience.\n\n**Objective:** Create a comprehensive, ${tone} guide that covers all essential aspects of ${topic}.\n\n**Style:** Write in a clear, ${tone} style with structured sections and bullet points.\n\n**Tone:** ${tone.charAt(0).toUpperCase() + tone.slice(1)} and authoritative.\n\n**Audience:** Professionals and practitioners who want to deepen their understanding.\n\n**Response:** Provide a detailed breakdown with examples, best practices, and common pitfalls.`,
  },
  CHAIN: {
    label: "Chain of Thought",
    template: (topic, tone) => `Let's think about ${topic} step by step in a ${tone} manner:\n\n1. **First**, let's understand what ${topic} fundamentally is and why it matters.\n2. **Then**, let's explore the key components and how they interconnect.\n3. **Next**, let's examine real-world applications and case studies.\n4. **After that**, let's identify best practices and optimization strategies.\n5. **Finally**, let's synthesize everything into actionable recommendations.\n\nFor each step, provide detailed explanations with examples. Think carefully before moving to the next step.`,
  },
  TREE: {
    label: "Tree of Thought",
    template: (topic, tone) => `Explore ${topic} using multiple reasoning paths in a ${tone} style:\n\n**Branch 1 - Technical Perspective:**\nAnalyze ${topic} from a technical implementation standpoint. What are the core mechanisms? What tools and technologies are involved?\n\n**Branch 2 - Business Perspective:**\nEvaluate ${topic} from a business value standpoint. What's the ROI? How does it impact growth?\n\n**Branch 3 - User Perspective:**\nConsider ${topic} from the end-user experience. How does it affect usability and satisfaction?\n\n**Synthesis:**\nCombine insights from all branches to form a comprehensive, balanced recommendation.`,
  },
};

const tones = ["professional", "casual", "technical", "persuasive", "educational"];

const AiPromptGenerator = () => {
  const [topic, setTopic] = useState("");
  const [framework, setFramework] = useState("RISEN");
  const [tone, setTone] = useState("professional");
  const [prompt, setPrompt] = useState("");

  const generate = () => {
    if (!topic.trim()) return;
    const result = frameworks[framework].template(topic, tone);
    setPrompt(result);
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Enter your topic or task (e.g., 'Kubernetes deployment strategies')" value={topic} onChange={e => setTopic(e.target.value)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Framework</p>
          <Select value={framework} onValueChange={setFramework}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(frameworks).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Tone</p>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {tones.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={generate} disabled={!topic.trim()}>Generate Prompt</Button>

      {prompt && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{frameworks[framework].label}</Badge>
              <Badge variant="outline">{tone}</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(prompt); toast({ title: "Prompt copied!" }); }}>Copy</Button>
          </div>
          <div className="bg-muted/50 border rounded-xl p-4 whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed max-h-96 overflow-y-auto">
            {prompt}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiPromptGenerator;
