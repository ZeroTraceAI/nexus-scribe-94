import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Workflow {
  name: string;
  trigger: string;
  steps: { action: string; tool: string; output: string }[];
  estimatedTime: string;
  category: string;
}

const workflows: Workflow[] = [
  { name: "Blog Post Pipeline", trigger: "Keyword input", steps: [
    { action: "Research trending topics", tool: "Google Trends API", output: "Topic clusters with volume" },
    { action: "Generate outline", tool: "GPT-4 / Claude", output: "H2/H3 structure with key points" },
    { action: "Write draft", tool: "LLM with brand voice", output: "2000+ word article" },
    { action: "SEO optimization", tool: "Content analyzer", output: "Optimized title, meta, headers" },
    { action: "Generate images", tool: "DALL-E / Midjourney", output: "Featured + section images" },
    { action: "Publish & distribute", tool: "CMS API + social scheduler", output: "Published post + tweets" },
  ], estimatedTime: "15 min (automated)", category: "Blog" },
  { name: "Social Media Calendar", trigger: "Monthly schedule", steps: [
    { action: "Content ideation", tool: "AI topic generator", output: "30 post ideas with hooks" },
    { action: "Copy generation", tool: "Claude / GPT-4", output: "Platform-specific copy" },
    { action: "Visual creation", tool: "Canva API / DALL-E", output: "Branded graphics" },
    { action: "Schedule posts", tool: "Buffer / Hootsuite API", output: "Scheduled queue" },
    { action: "Analytics collection", tool: "Platform APIs", output: "Engagement metrics" },
  ], estimatedTime: "30 min for a month", category: "Social" },
  { name: "Email Newsletter", trigger: "Weekly / bi-weekly", steps: [
    { action: "Curate content", tool: "RSS + AI summarizer", output: "Top stories + summaries" },
    { action: "Write editorial", tool: "LLM with editor persona", output: "Newsletter sections" },
    { action: "Personalize segments", tool: "ML audience clustering", output: "3-5 personalized versions" },
    { action: "A/B test subjects", tool: "Subject line optimizer", output: "Winner subject line" },
    { action: "Send & track", tool: "Email service API", output: "Delivery + open rate stats" },
  ], estimatedTime: "20 min per issue", category: "Email" },
  { name: "Product Description Generator", trigger: "Product data upload", steps: [
    { action: "Extract features", tool: "Data parser", output: "Structured feature list" },
    { action: "Generate descriptions", tool: "LLM with brand tone", output: "SEO-friendly descriptions" },
    { action: "Create bullet points", tool: "AI summarizer", output: "Key selling points" },
    { action: "Optimize for search", tool: "Keyword injector", output: "Keyword-rich content" },
    { action: "Bulk publish", tool: "E-commerce API", output: "Updated product pages" },
  ], estimatedTime: "100 products / 10 min", category: "E-commerce" },
  { name: "Video Script Pipeline", trigger: "Topic input", steps: [
    { action: "Research & outline", tool: "AI researcher", output: "Script outline with timestamps" },
    { action: "Write script", tool: "LLM with video persona", output: "Full narration script" },
    { action: "Generate B-roll prompts", tool: "Visual AI", output: "Scene descriptions for editing" },
    { action: "Create thumbnail text", tool: "Title optimizer", output: "Click-worthy thumbnail copy" },
    { action: "SEO metadata", tool: "YouTube SEO tool", output: "Title, description, tags" },
  ], estimatedTime: "10 min per video", category: "Video" },
];

const AiContentAutomation = () => {
  const [search, setSearch] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(workflows.map(w => w.category))];
  const filtered = workflows.filter(w => {
    const matchCat = !selectedCategory || w.category === selectedCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || w.name.toLowerCase().includes(q) || w.steps.some(s => s.action.toLowerCase().includes(q) || s.tool.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const exportWorkflow = (w: Workflow) => {
    const md = `# ${w.name}\n\nTrigger: ${w.trigger}\nEstimated Time: ${w.estimatedTime}\n\n## Steps\n\n${w.steps.map((s, i) => `### Step ${i + 1}: ${s.action}\n- Tool: ${s.tool}\n- Output: ${s.output}`).join("\n\n")}`;
    navigator.clipboard.writeText(md);
    toast({ title: "Workflow exported!" });
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Search workflows (e.g., blog, email, video)..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedCategory(null)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${!selectedCategory ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setSelectedCategory(selectedCategory === c ? null : c)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedCategory === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{c}</button>
        ))}
      </div>

      {selectedWorkflow ? (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedWorkflow(null)}>← Back</Button>
          <div className="bg-muted/50 rounded-xl p-6 border space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-foreground">{selectedWorkflow.name}</h3>
              <Button variant="outline" size="sm" onClick={() => exportWorkflow(selectedWorkflow)}>Export</Button>
            </div>
            <div className="flex gap-4">
              <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Trigger</span><p className="text-sm font-medium text-foreground">{selectedWorkflow.trigger}</p></div>
              <div className="bg-card rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Time</span><p className="text-sm font-medium text-foreground">{selectedWorkflow.estimatedTime}</p></div>
            </div>
            <div className="space-y-3">
              {selectedWorkflow.steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{i + 1}</div>
                  <div className="flex-1 bg-card rounded-lg p-4 border">
                    <h4 className="font-medium text-foreground">{step.action}</h4>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>🔧 {step.tool}</span>
                      <span>→ {step.output}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((w, i) => (
            <button key={i} onClick={() => setSelectedWorkflow(w)} className="text-left bg-muted/50 rounded-xl p-4 border hover:border-primary/40 transition-all group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{w.name}</h3>
                <div className="flex gap-2">
                  <Badge variant="outline">{w.category}</Badge>
                  <Badge variant="secondary">{w.estimatedTime}</Badge>
                </div>
              </div>
              <div className="flex gap-2 mt-2">{w.steps.slice(0, 3).map((s, j) => <span key={j} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{s.action}</span>)}<span className="text-xs text-muted-foreground self-center">+{w.steps.length - 3} more</span></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiContentAutomation;
