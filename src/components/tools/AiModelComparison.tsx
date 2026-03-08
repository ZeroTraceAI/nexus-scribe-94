import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Model {
  name: string;
  provider: string;
  contextWindow: string;
  pricing: { input: string; output: string };
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
  speed: number;
  reasoning: number;
  coding: number;
  creative: number;
  multimodal: boolean;
  openSource: boolean;
  released: string;
}

const models: Model[] = [
  { name: "GPT-5", provider: "OpenAI", contextWindow: "256K", pricing: { input: "$5/1M", output: "$15/1M" }, strengths: ["Superior reasoning", "Excellent instruction following", "Strong coding", "Multimodal"], weaknesses: ["Expensive", "Slower than smaller models", "Rate limits"], bestFor: ["Complex reasoning", "Code generation", "Content creation", "Analysis"], speed: 70, reasoning: 95, coding: 93, creative: 90, multimodal: true, openSource: false, released: "2025" },
  { name: "GPT-5 Mini", provider: "OpenAI", contextWindow: "128K", pricing: { input: "$0.40/1M", output: "$1.60/1M" }, strengths: ["Great cost-performance ratio", "Fast", "Strong reasoning for size"], weaknesses: ["Less nuanced than GPT-5", "Weaker on edge cases"], bestFor: ["Production apps", "Chat", "Summarization", "Classification"], speed: 88, reasoning: 82, coding: 80, creative: 78, multimodal: true, openSource: false, released: "2025" },
  { name: "Gemini 2.5 Pro", provider: "Google", contextWindow: "1M", pricing: { input: "$1.25/1M", output: "$5/1M" }, strengths: ["Massive context window", "Strong multimodal", "Good reasoning", "Competitive pricing"], weaknesses: ["Occasional inconsistencies", "Less refined than GPT-5 for code"], bestFor: ["Long document analysis", "Multimodal tasks", "Research", "Video understanding"], speed: 75, reasoning: 90, coding: 85, creative: 85, multimodal: true, openSource: false, released: "2025" },
  { name: "Gemini 2.5 Flash", provider: "Google", contextWindow: "1M", pricing: { input: "$0.15/1M", output: "$0.60/1M" }, strengths: ["Very fast", "Cheap", "Good quality for price", "1M context"], weaknesses: ["Less precise on hard reasoning", "Weaker creative writing"], bestFor: ["High-volume tasks", "Real-time apps", "Classification", "Extraction"], speed: 95, reasoning: 75, coding: 72, creative: 70, multimodal: true, openSource: false, released: "2025" },
  { name: "Claude 4 Opus", provider: "Anthropic", contextWindow: "200K", pricing: { input: "$15/1M", output: "$75/1M" }, strengths: ["Best creative writing", "Excellent safety", "Strong analysis", "Nuanced understanding"], weaknesses: ["Most expensive", "Slower", "Smaller context than Gemini"], bestFor: ["Long-form writing", "Analysis", "Research", "Sensitive topics"], speed: 60, reasoning: 92, coding: 88, creative: 96, multimodal: true, openSource: false, released: "2025" },
  { name: "Claude 4 Sonnet", provider: "Anthropic", contextWindow: "200K", pricing: { input: "$3/1M", output: "$15/1M" }, strengths: ["Best balance of quality/speed/cost", "Strong coding", "Reliable"], weaknesses: ["Not the absolute best at anything", "Smaller context"], bestFor: ["Production coding", "Business apps", "Content", "Customer support"], speed: 82, reasoning: 88, coding: 90, creative: 88, multimodal: true, openSource: false, released: "2025" },
  { name: "Llama 4 405B", provider: "Meta", contextWindow: "128K", pricing: { input: "$0/self-host", output: "$0/self-host" }, strengths: ["Open source", "Self-hostable", "No vendor lock-in", "Customizable"], weaknesses: ["Requires infrastructure", "Slower without optimization", "No official support"], bestFor: ["Privacy-sensitive apps", "Custom fine-tuning", "On-premise", "Research"], speed: 65, reasoning: 82, coding: 80, creative: 78, multimodal: true, openSource: true, released: "2025" },
  { name: "Mistral Large 3", provider: "Mistral", contextWindow: "128K", pricing: { input: "$2/1M", output: "$6/1M" }, strengths: ["Strong European alternative", "Good multilingual", "Fast", "Open weights available"], weaknesses: ["Smaller ecosystem", "Less refined tool use"], bestFor: ["Multilingual apps", "European compliance", "Code", "Analysis"], speed: 80, reasoning: 84, coding: 82, creative: 80, multimodal: true, openSource: true, released: "2025" },
];

const AiModelComparison = () => {
  const [selected, setSelected] = useState<string[]>(["GPT-5", "Gemini 2.5 Pro", "Claude 4 Sonnet"]);
  const [sortBy, setSortBy] = useState<keyof Model>("reasoning");

  const toggleModel = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : prev.length < 4 ? [...prev, name] : prev);
  };

  const compared = models.filter(m => selected.includes(m.name));

  const renderBar = (value: number, label: string) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="text-foreground font-medium">{value}/100</span></div>
      <div className="w-full bg-muted rounded-full h-2"><div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${value}%` }} /></div>
    </div>
  );

  const exportComparison = () => {
    const md = `# AI Model Comparison\n\n| Model | Provider | Context | Speed | Reasoning | Coding | Creative | Price (In/Out) |\n|-------|----------|---------|-------|-----------|--------|----------|----------------|\n${compared.map(m => `| ${m.name} | ${m.provider} | ${m.contextWindow} | ${m.speed} | ${m.reasoning} | ${m.coding} | ${m.creative} | ${m.pricing.input} / ${m.pricing.output} |`).join("\n")}`;
    navigator.clipboard.writeText(md);
    toast({ title: "Comparison exported!" });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Select Models to Compare (max 4)</p>
        <div className="flex flex-wrap gap-2">
          {models.map(m => (
            <button key={m.name} onClick={() => toggleModel(m.name)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selected.includes(m.name) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
              {m.name} <span className="opacity-60">({m.provider})</span>
            </button>
          ))}
        </div>
      </div>

      {compared.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Comparing {compared.length} models</p>
            <Button variant="outline" size="sm" onClick={exportComparison}>Export</Button>
          </div>

          {/* Overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {compared.map(m => (
              <div key={m.name} className="bg-muted/50 rounded-xl p-4 border space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{m.name}</h3>
                    <p className="text-xs text-muted-foreground">{m.provider} · {m.released}</p>
                  </div>
                  <div className="flex gap-1">
                    {m.openSource && <Badge variant="secondary" className="text-xs">OSS</Badge>}
                    {m.multimodal && <Badge variant="outline" className="text-xs">🖼️</Badge>}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Context:</span> {m.contextWindow} · <span className="font-medium">Price:</span> {m.pricing.input} in / {m.pricing.output} out
                </div>
                {renderBar(m.speed, "Speed")}
                {renderBar(m.reasoning, "Reasoning")}
                {renderBar(m.coding, "Coding")}
                {renderBar(m.creative, "Creative")}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Best For</p>
                  <div className="flex flex-wrap gap-1">{m.bestFor.map(b => <span key={b} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{b}</span>)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Side-by-side stats */}
          <div className="bg-muted/50 rounded-xl p-4 border">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Head-to-Head</p>
            {(["speed", "reasoning", "coding", "creative"] as const).map(metric => (
              <div key={metric} className="mb-3">
                <p className="text-xs text-muted-foreground capitalize mb-1">{metric}</p>
                <div className="space-y-1">
                  {compared.sort((a, b) => b[metric] - a[metric]).map(m => (
                    <div key={m.name} className="flex items-center gap-2">
                      <span className="text-xs text-foreground w-28 truncate">{m.name}</span>
                      <div className="flex-1 bg-muted rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: `${m[metric]}%` }} /></div>
                      <span className="text-xs font-mono text-foreground w-8 text-right">{m[metric]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiModelComparison;
