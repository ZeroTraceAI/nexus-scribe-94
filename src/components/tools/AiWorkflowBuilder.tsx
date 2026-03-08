import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition" | "output";
  label: string;
  config: string;
}

interface WorkflowTemplate {
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  estimatedTime: string;
  tools: string[];
}

const templates: WorkflowTemplate[] = [
  { name: "Lead Qualification Pipeline", description: "Auto-qualify leads from form submissions with scoring and CRM routing", category: "Sales", nodes: [
    { id: "1", type: "trigger", label: "Form Submission", config: "Webhook: POST /api/leads" },
    { id: "2", type: "action", label: "Enrich Lead Data", config: "Clearbit API → company size, industry, funding" },
    { id: "3", type: "condition", label: "Score ≥ 70?", config: "Score based on: company size (30%), role (25%), industry (25%), engagement (20%)" },
    { id: "4", type: "action", label: "Route to Sales", config: "Create deal in CRM, assign to AE by territory" },
    { id: "5", type: "action", label: "Nurture Sequence", config: "Add to email drip campaign, retarget ads" },
    { id: "6", type: "output", label: "Slack Notification", config: "Alert #sales-leads with lead summary" },
  ], estimatedTime: "3 hours to set up", tools: ["Clearbit", "HubSpot", "Slack", "Zapier"] },
  { name: "Content Publishing Pipeline", description: "Automate content from draft to multi-channel publication", category: "Marketing", nodes: [
    { id: "1", type: "trigger", label: "Draft Approved", config: "CMS webhook on status change to 'approved'" },
    { id: "2", type: "action", label: "SEO Optimization", config: "Auto-add meta tags, schema markup, internal links" },
    { id: "3", type: "action", label: "Image Processing", config: "Resize, compress, generate alt text with AI" },
    { id: "4", type: "action", label: "Publish to CMS", config: "Set live, update sitemap, ping search engines" },
    { id: "5", type: "action", label: "Social Distribution", config: "Post to Twitter, LinkedIn, newsletter queue" },
    { id: "6", type: "output", label: "Analytics Setup", config: "Create UTM links, set up conversion tracking" },
  ], estimatedTime: "4 hours to set up", tools: ["WordPress/Ghost", "Buffer", "Cloudinary", "Google Analytics"] },
  { name: "Customer Feedback Loop", description: "Collect, analyze, and action customer feedback automatically", category: "Product", nodes: [
    { id: "1", type: "trigger", label: "Feedback Received", config: "NPS survey, support ticket, app review" },
    { id: "2", type: "action", label: "Sentiment Analysis", config: "AI classifies: positive, neutral, negative, urgent" },
    { id: "3", type: "condition", label: "Sentiment = Negative?", config: "Route based on sentiment + customer tier" },
    { id: "4", type: "action", label: "Alert CS Team", config: "Create priority ticket, notify CSM" },
    { id: "5", type: "action", label: "Tag & Categorize", config: "Auto-tag: bug, feature request, UX, pricing" },
    { id: "6", type: "output", label: "Weekly Digest", config: "Aggregate trends, top requests, sentiment chart" },
  ], estimatedTime: "2 hours to set up", tools: ["Intercom", "OpenAI", "Linear", "Slack"] },
  { name: "CI/CD Security Gate", description: "Automated security scanning in your deployment pipeline", category: "DevOps", nodes: [
    { id: "1", type: "trigger", label: "PR Opened", config: "GitHub webhook on pull_request.opened" },
    { id: "2", type: "action", label: "SAST Scan", config: "Run Semgrep/CodeQL static analysis" },
    { id: "3", type: "action", label: "Dependency Scan", config: "Check npm audit / Snyk for vulnerabilities" },
    { id: "4", type: "condition", label: "Critical Issues?", config: "Block merge if critical/high severity found" },
    { id: "5", type: "action", label: "Generate Report", config: "Comment scan results on PR" },
    { id: "6", type: "output", label: "Update Dashboard", config: "Track security posture over time" },
  ], estimatedTime: "2 hours to set up", tools: ["GitHub Actions", "Semgrep", "Snyk", "Grafana"] },
  { name: "Invoice Processing", description: "Extract, validate, and process invoices automatically", category: "Finance", nodes: [
    { id: "1", type: "trigger", label: "Email with Attachment", config: "Monitor invoices@ inbox for PDF attachments" },
    { id: "2", type: "action", label: "OCR Extraction", config: "Extract vendor, amount, date, line items" },
    { id: "3", type: "condition", label: "Amount > $5K?", config: "Route high-value invoices for manual approval" },
    { id: "4", type: "action", label: "Match to PO", config: "Cross-reference with purchase orders in ERP" },
    { id: "5", type: "action", label: "Queue for Payment", config: "Add to AP batch with payment terms" },
    { id: "6", type: "output", label: "Audit Log", config: "Record full processing trail" },
  ], estimatedTime: "6 hours to set up", tools: ["Google Vision", "QuickBooks", "Slack", "Zapier"] },
];

const AiWorkflowBuilder = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [customNodes, setCustomNodes] = useState<WorkflowNode[]>([]);

  const categories = [...new Set(templates.map(t => t.category))];
  const filtered = templates.filter(t => {
    const matchCat = !selectedCategory || t.category === selectedCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const nodeTypeColor = (type: string) => {
    switch (type) { case "trigger": return "bg-green-500/10 border-green-500/30 text-green-600"; case "condition": return "bg-yellow-500/10 border-yellow-500/30 text-yellow-600"; case "output": return "bg-blue-500/10 border-blue-500/30 text-blue-600"; default: return "bg-primary/10 border-primary/30 text-primary"; }
  };
  const nodeTypeIcon = (type: string) => { switch (type) { case "trigger": return "⚡"; case "condition": return "🔀"; case "output": return "📤"; default: return "⚙️"; } };

  const exportWorkflow = (wf: WorkflowTemplate) => {
    const md = `# ${wf.name}\n${wf.description}\n\nCategory: ${wf.category}\nSetup Time: ${wf.estimatedTime}\nTools: ${wf.tools.join(", ")}\n\n## Workflow Steps\n\n${wf.nodes.map((n, i) => `### Step ${i + 1}: ${n.label} [${n.type}]\n${n.config}`).join("\n\n")}`;
    navigator.clipboard.writeText(md);
    toast({ title: "Workflow exported!" });
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Search workflows..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedCategory(null)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${!selectedCategory ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setSelectedCategory(selectedCategory === c ? null : c)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedCategory === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{c}</button>
        ))}
      </div>

      {selectedWorkflow ? (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedWorkflow(null)}>← Back</Button>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">{selectedWorkflow.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedWorkflow.description}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => exportWorkflow(selectedWorkflow)}>Export</Button>
          </div>
          <div className="flex gap-4">
            <div className="bg-muted/50 rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Setup</span><p className="text-sm font-medium text-foreground">{selectedWorkflow.estimatedTime}</p></div>
            <div className="bg-muted/50 rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Steps</span><p className="text-sm font-medium text-foreground">{selectedWorkflow.nodes.length}</p></div>
          </div>

          {/* Visual flow */}
          <div className="space-y-2">
            {selectedWorkflow.nodes.map((node, i) => (
              <div key={node.id}>
                <div className={`rounded-xl p-4 border ${nodeTypeColor(node.type)}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{nodeTypeIcon(node.type)}</span>
                    <span className="font-medium text-foreground">{node.label}</span>
                    <Badge variant="outline" className="text-xs capitalize">{node.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-7">{node.config}</p>
                </div>
                {i < selectedWorkflow.nodes.length - 1 && (
                  <div className="flex justify-center py-1"><span className="text-muted-foreground text-lg">↓</span></div>
                )}
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Required Tools</p>
            <div className="flex flex-wrap gap-2">{selectedWorkflow.tools.map(t => <Badge key={t} variant="outline">{t}</Badge>)}</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((wf, i) => (
            <button key={i} onClick={() => setSelectedWorkflow(wf)} className="text-left bg-muted/50 rounded-xl p-4 border hover:border-primary/40 transition-all group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{wf.name}</h3>
                <div className="flex gap-2 shrink-0">
                  <Badge variant="outline">{wf.category}</Badge>
                  <Badge variant="secondary">{wf.nodes.length} steps</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{wf.description}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">⏱ {wf.estimatedTime}</span>
                <div className="flex gap-1">{wf.tools.slice(0, 3).map(t => <span key={t} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{t}</span>)}</div>
              </div>
            </button>
          ))}
        </div>
      )}
      {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No workflows found.</p>}
    </div>
  );
};

export default AiWorkflowBuilder;
