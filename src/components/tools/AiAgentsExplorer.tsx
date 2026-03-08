import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Agent {
  name: string;
  type: string;
  architecture: string;
  capabilities: string[];
  useCases: string[];
  frameworks: string[];
  complexity: "Beginner" | "Intermediate" | "Advanced";
  autonomyLevel: number;
}

const agentDatabase: Agent[] = [
  { name: "ReAct Agent", type: "Reasoning + Acting", architecture: "LLM → Think → Act → Observe loop", capabilities: ["Tool usage", "Multi-step reasoning", "Self-correction"], useCases: ["Research automation", "Data analysis", "Customer support"], frameworks: ["LangChain", "LlamaIndex", "AutoGen"], complexity: "Intermediate", autonomyLevel: 70 },
  { name: "Plan-and-Execute Agent", type: "Planning", architecture: "Planner LLM → Executor LLM → Replanner", capabilities: ["Long-horizon planning", "Task decomposition", "Adaptive replanning"], useCases: ["Project management", "Content pipelines", "DevOps automation"], frameworks: ["LangGraph", "CrewAI", "AutoGPT"], complexity: "Advanced", autonomyLevel: 85 },
  { name: "Multi-Agent System", type: "Collaborative", architecture: "Supervisor → Worker agents with shared memory", capabilities: ["Role specialization", "Parallel execution", "Consensus building"], useCases: ["Software development", "Research teams", "Business analysis"], frameworks: ["CrewAI", "AutoGen", "MetaGPT"], complexity: "Advanced", autonomyLevel: 90 },
  { name: "Tool-Calling Agent", type: "Function Calling", architecture: "LLM with tool definitions → API calls", capabilities: ["API integration", "Database queries", "Web browsing"], useCases: ["Data retrieval", "E-commerce", "System monitoring"], frameworks: ["OpenAI Functions", "Anthropic Tools", "Gemini"], complexity: "Beginner", autonomyLevel: 50 },
  { name: "Reflexion Agent", type: "Self-Improving", architecture: "Actor → Evaluator → Self-reflection → Memory", capabilities: ["Self-evaluation", "Learning from mistakes", "Performance improvement"], useCases: ["Code generation", "Writing improvement", "Decision optimization"], frameworks: ["LangChain", "Custom implementations"], complexity: "Advanced", autonomyLevel: 80 },
  { name: "RAG Agent", type: "Retrieval-Augmented", architecture: "Query → Retrieve → Generate with context", capabilities: ["Knowledge grounding", "Reduced hallucination", "Dynamic knowledge"], useCases: ["Enterprise search", "Documentation Q&A", "Legal research"], frameworks: ["LlamaIndex", "LangChain", "Haystack"], complexity: "Intermediate", autonomyLevel: 40 },
  { name: "Workflow Agent", type: "State Machine", architecture: "Nodes → Edges → Conditional routing", capabilities: ["Structured flows", "Human-in-the-loop", "Error handling"], useCases: ["Approval systems", "Content review", "Onboarding flows"], frameworks: ["LangGraph", "Temporal", "Prefect"], complexity: "Intermediate", autonomyLevel: 60 },
  { name: "Autonomous Coding Agent", type: "Code Generation", architecture: "Spec → Plan → Code → Test → Debug loop", capabilities: ["Full-stack development", "Bug fixing", "Code review"], useCases: ["Feature development", "Legacy modernization", "Test generation"], frameworks: ["Devin", "SWE-Agent", "OpenHands"], complexity: "Advanced", autonomyLevel: 95 },
];

const AiAgentsExplorer = () => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const types = [...new Set(agentDatabase.map(a => a.type))];
  const filtered = agentDatabase.filter(a => {
    const matchType = !selectedType || a.type === selectedType;
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) || a.capabilities.some(c => c.toLowerCase().includes(q));
    return matchType && matchSearch;
  });

  const generateBlueprint = (agent: Agent) => {
    const blueprint = `# ${agent.name} Blueprint\n\n## Architecture\n${agent.architecture}\n\n## Type\n${agent.type}\n\n## Capabilities\n${agent.capabilities.map(c => `- ${c}`).join("\n")}\n\n## Use Cases\n${agent.useCases.map(u => `- ${u}`).join("\n")}\n\n## Recommended Frameworks\n${agent.frameworks.join(", ")}\n\n## Complexity: ${agent.complexity}\n## Autonomy Level: ${agent.autonomyLevel}%`;
    navigator.clipboard.writeText(blueprint);
    toast({ title: "Blueprint copied to clipboard!" });
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Search agents by name, type, or capability..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedType(null)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${!selectedType ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>All</button>
        {types.map(t => (
          <button key={t} onClick={() => setSelectedType(selectedType === t ? null : t)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedType === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{t}</button>
        ))}
      </div>

      {selectedAgent ? (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedAgent(null)}>← Back to list</Button>
          <div className="bg-muted/50 rounded-xl p-6 border space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedAgent.name}</h3>
                <Badge variant="secondary" className="mt-1">{selectedAgent.type}</Badge>
              </div>
              <Badge variant={selectedAgent.complexity === "Advanced" ? "destructive" : selectedAgent.complexity === "Intermediate" ? "default" : "secondary"}>{selectedAgent.complexity}</Badge>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Architecture</p>
              <p className="text-sm text-foreground font-mono bg-card p-3 rounded-lg border">{selectedAgent.architecture}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Autonomy Level</p>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${selectedAgent.autonomyLevel}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{selectedAgent.autonomyLevel}% autonomous</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Capabilities</p>
                <ul className="space-y-1">{selectedAgent.capabilities.map((c, i) => <li key={i} className="text-sm text-foreground flex items-center gap-2"><span className="text-primary">✓</span> {c}</li>)}</ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Use Cases</p>
                <ul className="space-y-1">{selectedAgent.useCases.map((u, i) => <li key={i} className="text-sm text-foreground flex items-center gap-2"><span className="text-secondary">→</span> {u}</li>)}</ul>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Frameworks</p>
              <div className="flex flex-wrap gap-2">{selectedAgent.frameworks.map(f => <Badge key={f} variant="outline">{f}</Badge>)}</div>
            </div>
            <Button onClick={() => generateBlueprint(selectedAgent)} className="w-full">Copy Blueprint</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((agent, i) => (
            <button key={i} onClick={() => setSelectedAgent(agent)} className="text-left bg-muted/50 rounded-xl p-4 border hover:border-primary/40 transition-all group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{agent.name}</h3>
                <Badge variant="outline" className="text-xs shrink-0">{agent.complexity}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{agent.type}</p>
              <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${agent.autonomyLevel}%` }} />
              </div>
              <div className="flex flex-wrap gap-1">{agent.capabilities.slice(0, 2).map(c => <span key={c} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{c}</span>)}</div>
            </button>
          ))}
        </div>
      )}
      {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No agents match your search.</p>}
    </div>
  );
};

export default AiAgentsExplorer;
