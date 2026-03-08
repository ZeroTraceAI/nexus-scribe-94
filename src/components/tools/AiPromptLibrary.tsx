import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const prompts = [
  { category: "Coding", title: "Debug Code", prompt: "I have the following code that's producing an error. Please identify the bug, explain why it occurs, and provide a corrected version:\n\n```\n[paste code here]\n```\n\nError message: [paste error]", tags: ["debug", "code review"] },
  { category: "Coding", title: "Code Review", prompt: "Review the following code for:\n1. Security vulnerabilities\n2. Performance issues\n3. Code style and best practices\n4. Potential bugs\n\nProvide specific line-by-line feedback:\n\n```\n[paste code]\n```", tags: ["review", "security"] },
  { category: "Coding", title: "API Design", prompt: "Design a RESTful API for [describe your application]. Include:\n- Endpoint paths and HTTP methods\n- Request/response schemas (JSON)\n- Authentication strategy\n- Error handling patterns\n- Rate limiting considerations", tags: ["api", "architecture"] },
  { category: "SEO", title: "Keyword Research", prompt: "Act as an SEO specialist. For the topic '[your topic]', provide:\n1. 20 primary keywords with estimated search volume\n2. 20 long-tail keyword variations\n3. 10 question-based keywords\n4. Keyword difficulty assessment\n5. Content cluster strategy", tags: ["keywords", "research"] },
  { category: "SEO", title: "Content Brief", prompt: "Create a comprehensive content brief for the keyword '[keyword]':\n- Target word count\n- H1, H2, H3 structure\n- Key topics to cover\n- Internal linking opportunities\n- Featured snippet optimization\n- Competitor analysis points", tags: ["content", "brief"] },
  { category: "Marketing", title: "Landing Page Copy", prompt: "Write high-converting landing page copy for [product/service]:\n- Hero headline + subheadline (3 variations)\n- Value proposition bullets (5)\n- Social proof section\n- FAQ section (5 questions)\n- CTA variations (3)\n\nTarget audience: [describe]", tags: ["copywriting", "conversion"] },
  { category: "Marketing", title: "Email Sequence", prompt: "Create a 5-email welcome sequence for [product/service]:\n\nFor each email provide:\n- Subject line (A/B versions)\n- Preview text\n- Body copy\n- CTA\n- Sending delay from previous email\n\nGoal: [describe conversion goal]", tags: ["email", "automation"] },
  { category: "Security", title: "Threat Model", prompt: "Create a threat model for [describe your application/system]:\n1. Identify assets and trust boundaries\n2. Enumerate threats using STRIDE methodology\n3. Rate each threat (likelihood × impact)\n4. Propose mitigations for high-risk threats\n5. Recommend security testing approaches", tags: ["threat modeling", "STRIDE"] },
  { category: "Security", title: "Incident Response", prompt: "Create an incident response playbook for a [type of incident, e.g., data breach]:\n1. Detection and identification steps\n2. Containment procedures\n3. Eradication checklist\n4. Recovery steps\n5. Post-incident review template\n6. Communication templates (internal + external)", tags: ["incident", "playbook"] },
  { category: "DevOps", title: "CI/CD Pipeline", prompt: "Design a CI/CD pipeline for a [tech stack] application:\n- Source control branching strategy\n- Build and test stages\n- Security scanning steps\n- Deployment strategy (blue/green, canary, etc.)\n- Rollback procedures\n- Monitoring and alerting", tags: ["ci/cd", "deployment"] },
  { category: "DevOps", title: "Infrastructure as Code", prompt: "Write Terraform/Pulumi code to provision:\n- [describe infrastructure]\n\nRequirements:\n- High availability across 2+ AZs\n- Auto-scaling configuration\n- Security groups and network ACLs\n- Monitoring and logging setup\n- Cost optimization considerations", tags: ["terraform", "IaC"] },
  { category: "Data", title: "SQL Query Optimization", prompt: "Optimize the following SQL query for performance:\n\n```sql\n[paste query]\n```\n\nTable schemas:\n[describe tables]\n\nProvide:\n1. Optimized query\n2. Suggested indexes\n3. Execution plan analysis\n4. Alternative approaches", tags: ["sql", "performance"] },
];

const categories = [...new Set(prompts.map(p => p.category))];

const AiPromptLibrary = () => {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const filtered = prompts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.prompt.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase()));
    const matchCat = !selectedCat || p.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-4">
      <Input placeholder="Search prompts..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedCat(null)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!selectedCat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>All</button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCat(selectedCat === cat ? null : cat)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedCat === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{cat}</button>
        ))}
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filtered.map((p, i) => (
          <div key={i} className="border rounded-xl p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{p.category}</Badge>
                  {p.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(p.prompt); toast({ title: "Prompt copied!" }); }}>Copy</Button>
            </div>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono mt-2 max-h-32 overflow-y-auto bg-muted/50 rounded-lg p-3">{p.prompt}</pre>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No prompts found matching your search.</p>}
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} of {prompts.length} prompts shown</p>
    </div>
  );
};

export default AiPromptLibrary;
