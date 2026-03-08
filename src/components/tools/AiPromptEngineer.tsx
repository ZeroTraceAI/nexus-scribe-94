import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface PromptResult {
  framework: string;
  prompt: string;
  tokens: number;
  tips: string[];
}

const frameworks = [
  { name: "RISEN", parts: ["Role", "Instructions", "Steps", "End goal", "Narrowing"] },
  { name: "CO-STAR", parts: ["Context", "Objective", "Style", "Tone", "Audience", "Response format"] },
  { name: "Chain of Thought", parts: ["Problem statement", "Step-by-step reasoning", "Conclusion"] },
  { name: "Few-Shot", parts: ["Task description", "Example 1", "Example 2", "New input"] },
  { name: "Tree of Thought", parts: ["Problem", "Branch 1", "Branch 2", "Branch 3", "Evaluation", "Best path"] },
];

const generatePrompt = (task: string, context: string, framework: string): PromptResult => {
  const tips: string[] = [];
  let prompt = "";

  switch (framework) {
    case "RISEN":
      prompt = `**Role:** You are an expert ${context || "AI assistant"} specializing in ${task}.\n\n**Instructions:** ${task}. Provide comprehensive, actionable guidance.\n\n**Steps:**\n1. Analyze the requirements thoroughly\n2. Break down the solution into clear components\n3. Provide implementation details with examples\n4. Include best practices and potential pitfalls\n\n**End Goal:** Deliver a complete, production-ready solution for ${task}.\n\n**Narrowing:** Focus specifically on practical implementation. Avoid theoretical overviews. Include code examples where relevant.`;
      tips.push("RISEN works best for complex, multi-step tasks", "Customize the 'Narrowing' section to avoid generic responses");
      break;
    case "CO-STAR":
      prompt = `**Context:** I am working on ${context || "a project"} and need help with ${task}.\n\n**Objective:** ${task}\n\n**Style:** Technical and precise, with practical examples\n\n**Tone:** Professional but approachable\n\n**Audience:** Experienced developers and technical professionals\n\n**Response Format:** Structured with headings, bullet points, and code blocks where applicable`;
      tips.push("CO-STAR excels at content creation and writing tasks", "Adjust 'Audience' to match your actual target readers");
      break;
    case "Chain of Thought":
      prompt = `I need to ${task}${context ? ` in the context of ${context}` : ""}.\n\nPlease think through this step-by-step:\n\n1. First, analyze what is being asked and identify the core requirements\n2. Then, consider the best approach and any constraints\n3. Next, outline the solution with specific details\n4. Finally, provide the complete implementation with explanations\n\nShow your reasoning at each step.`;
      tips.push("CoT improves accuracy on reasoning-heavy tasks by 40%+", "Add 'Let's think step by step' for simpler prompts");
      break;
    case "Few-Shot":
      prompt = `Task: ${task}\n${context ? `Context: ${context}\n` : ""}\n**Example 1:**\nInput: [Provide a sample input]\nOutput: [Provide the expected output]\n\n**Example 2:**\nInput: [Provide another sample input]\nOutput: [Provide the expected output]\n\n**Now complete this:**\nInput: [Your actual input]\nOutput:`;
      tips.push("Include 2-5 diverse examples for best results", "Examples should cover edge cases");
      break;
    case "Tree of Thought":
      prompt = `Problem: ${task}\n${context ? `Context: ${context}\n` : ""}\nExplore multiple solution paths:\n\n**Path A:** [First approach - describe strategy]\n- Pros: \n- Cons: \n- Feasibility: \n\n**Path B:** [Second approach - describe strategy]\n- Pros: \n- Cons: \n- Feasibility: \n\n**Path C:** [Third approach - describe strategy]\n- Pros: \n- Cons: \n- Feasibility: \n\n**Evaluation:** Compare all paths and recommend the best approach with justification.\n\n**Selected Solution:** Implement the best path with full details.`;
      tips.push("ToT is ideal for complex decisions with multiple valid approaches", "Force the model to evaluate trade-offs explicitly");
      break;
    default:
      prompt = task;
  }

  const tokens = Math.round(prompt.length / 4);
  tips.push("Always test prompts with multiple inputs", "Iterate on specificity — vague prompts get vague results");

  return { framework, prompt, tokens, tips };
};

const AiPromptEngineer = () => {
  const [task, setTask] = useState("");
  const [context, setContext] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("RISEN");
  const [result, setResult] = useState<PromptResult | null>(null);

  const handleGenerate = () => {
    if (!task.trim()) { toast({ title: "Please enter a task" }); return; }
    setResult(generatePrompt(task, context, selectedFramework));
  };

  const copyPrompt = () => {
    if (result) { navigator.clipboard.writeText(result.prompt); toast({ title: "Prompt copied!" }); }
  };

  return (
    <div className="space-y-4">
      <Input placeholder="What do you want the AI to do? (e.g., 'Write a REST API in Go')" value={task} onChange={e => setTask(e.target.value)} />
      <Input placeholder="Context (optional): project type, constraints, audience..." value={context} onChange={e => setContext(e.target.value)} />

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Framework</p>
        <div className="flex flex-wrap gap-2">
          {frameworks.map(f => (
            <button key={f.name} onClick={() => setSelectedFramework(f.name)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedFramework === f.name ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
              {f.name}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {frameworks.find(f => f.name === selectedFramework)?.parts.map(p => (
            <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
          ))}
        </div>
      </div>

      <Button onClick={handleGenerate} className="w-full">Generate Engineered Prompt</Button>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{result.framework}</Badge>
              <span className="text-xs text-muted-foreground">~{result.tokens} tokens</span>
            </div>
            <Button variant="outline" size="sm" onClick={copyPrompt}>Copy Prompt</Button>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 border">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">{result.prompt}</pre>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Pro Tips</p>
            <ul className="space-y-1">{result.tips.map((tip, i) => <li key={i} className="text-sm text-muted-foreground flex items-center gap-2"><span className="text-primary">💡</span> {tip}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiPromptEngineer;
