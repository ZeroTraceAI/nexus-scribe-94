import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Opportunity {
  type: string;
  source: string;
  strategy: string;
  difficulty: "Easy" | "Medium" | "Hard";
  impact: "High" | "Medium" | "Low";
  actionSteps: string[];
}

const generateOpportunities = (niche: string, competitors: string[], contentTypes: string[]): Opportunity[] => {
  const opportunities: Opportunity[] = [
    { type: "Guest Posting", source: `${niche} industry blogs`, strategy: `Write expert guest posts about ${niche} for authoritative blogs in your space. Include a contextual backlink in the author bio or within the content.`, difficulty: "Medium", impact: "High", actionSteps: [`Search "${niche} write for us" or "${niche} guest post guidelines"`, "Pitch 3-5 relevant blogs with unique topic ideas", "Write 1500+ word in-depth articles", "Include a natural contextual link to your best content"] },
    { type: "Broken Link Building", source: "Competitor backlink profiles", strategy: `Find broken links pointing to competitors' content about ${niche} and offer your content as a replacement.`, difficulty: "Medium", impact: "High", actionSteps: ["Use a backlink checker to find competitors' backlinks", "Filter for 404/broken destination pages", "Create equivalent or better content on your site", "Email linking sites offering your content as replacement"] },
    { type: "Resource Page Links", source: `${niche} resource directories`, strategy: `Get listed on curated resource pages and directories related to ${niche}.`, difficulty: "Easy", impact: "Medium", actionSteps: [`Search "${niche} resources" or "${niche} useful links"`, "Identify pages that list tools, guides, or references", "Reach out with a personalized email", "Highlight what makes your resource uniquely valuable"] },
    { type: "HARO / Expert Quotes", source: "Journalist query platforms", strategy: `Respond to journalist queries about ${niche} to earn authoritative media backlinks.`, difficulty: "Easy", impact: "High", actionSteps: ["Sign up for HARO, Qwoted, or Help a B2B Writer", `Set alerts for ${niche}-related queries`, "Respond within 2 hours with expert-quality quotes", "Include credentials and a link to your most relevant page"] },
    { type: "Skyscraper Technique", source: "Top-ranking competitor content", strategy: `Find the best-performing content about ${niche}, create something significantly better, and reach out to sites linking to the original.`, difficulty: "Hard", impact: "High", actionSteps: ["Find top-ranking content for your target keywords", "Create a 10x better version (more data, visuals, depth)", "Use a backlink tool to find who links to the original", "Send personalized outreach emails to those sites"] },
    { type: "Unlinked Mentions", source: "Brand & product mentions", strategy: `Find websites that mention ${niche} topics you've covered but don't link to your content. Request a link.`, difficulty: "Easy", impact: "Medium", actionSteps: [`Search for your brand name or unique ${niche} terms`, "Filter out results that don't already link to you", "Send a friendly email asking to add a link", "Make it easy by providing the exact URL and anchor text"] },
    { type: "Community & Forum Links", source: `${niche} communities`, strategy: `Participate genuinely in ${niche} communities and share your content when it adds value.`, difficulty: "Easy", impact: "Low", actionSteps: [`Join relevant ${niche} subreddits, forums, and Discord servers`, "Provide valuable answers and insights regularly", "Share your content only when directly relevant", "Build reputation before dropping links"] },
    { type: "Data-Driven Content", source: "Original research & studies", strategy: `Publish original data, surveys, or case studies about ${niche} that others will naturally cite and link to.`, difficulty: "Hard", impact: "High", actionSteps: ["Conduct a survey or analyze unique data", "Create visually compelling charts and infographics", "Write up findings in a comprehensive report", "Promote via PR, social media, and email outreach"] },
  ];

  // Add competitor-specific opportunities
  competitors.forEach((comp) => {
    if (comp.trim()) {
      opportunities.push({
        type: "Competitor Gap Analysis",
        source: comp.trim(),
        strategy: `Analyze ${comp.trim()}'s backlink profile to find linking sites that don't link to you yet.`,
        difficulty: "Medium",
        impact: "High",
        actionSteps: [`Run ${comp.trim()} through a backlink analysis tool`, "Export their top referring domains", "Filter for relevant, high-authority sites", "Create targeted content and outreach campaigns"],
      });
    }
  });

  return opportunities;
};

const diffColors: Record<string, string> = { Easy: "bg-green-500/10 text-green-600", Medium: "bg-yellow-500/10 text-yellow-600", Hard: "bg-red-500/10 text-red-600" };
const impactColors: Record<string, string> = { High: "bg-primary/10 text-primary", Medium: "bg-blue-500/10 text-blue-600", Low: "bg-muted text-muted-foreground" };

const BacklinkOpportunityFinder = () => {
  const [niche, setNiche] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [results, setResults] = useState<Opportunity[] | null>(null);

  const generate = () => {
    if (!niche.trim()) {
      toast({ title: "Enter your niche", variant: "destructive" });
      return;
    }
    const comps = competitors.split("\n").map((c) => c.trim()).filter(Boolean);
    setResults(generateOpportunities(niche, comps, []));
  };

  const copyAll = () => {
    if (!results) return;
    const text = results.map((r) => `## ${r.type}\nSource: ${r.source}\nDifficulty: ${r.difficulty} | Impact: ${r.impact}\n\n${r.strategy}\n\nAction Steps:\n${r.actionSteps.map((s) => `- ${s}`).join("\n")}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Opportunities copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Your Niche / Industry</label>
        <Input placeholder="e.g., SaaS project management, cybersecurity, AI development" value={niche} onChange={(e) => setNiche(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Competitor Domains (one per line, optional)</label>
        <Textarea placeholder={"competitor1.com\ncompetitor2.com\ncompetitor3.com"} value={competitors} onChange={(e) => setCompetitors(e.target.value)} rows={3} />
      </div>
      <Button onClick={generate} className="w-full">Find Backlink Opportunities</Button>

      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">{results.length} Opportunities Found</h3>
            <Button size="sm" variant="outline" onClick={copyAll}><Copy className="h-3.5 w-3.5 mr-1" />Copy All</Button>
          </div>
          <div className="space-y-3">
            {results.map((opp, i) => (
              <div key={i} className="bg-muted/50 border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-foreground">{opp.type}</h4>
                  <Badge className={diffColors[opp.difficulty]}>{opp.difficulty}</Badge>
                  <Badge className={impactColors[opp.impact]}>{opp.impact} Impact</Badge>
                </div>
                <p className="text-xs text-muted-foreground"><strong>Source:</strong> {opp.source}</p>
                <p className="text-sm text-foreground">{opp.strategy}</p>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action Steps</p>
                  {opp.actionSteps.map((step, j) => (
                    <p key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="font-bold text-primary">{j + 1}.</span> {step}
                    </p>
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

export default BacklinkOpportunityFinder;
