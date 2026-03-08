import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Cluster {
  name: string;
  keywords: string[];
  intent: "informational" | "transactional" | "navigational" | "commercial";
  volume: "high" | "medium" | "low";
}

const intentColors: Record<string, string> = {
  informational: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  transactional: "bg-green-500/10 text-green-600 border-green-500/20",
  navigational: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  commercial: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const classifyIntent = (kw: string): Cluster["intent"] => {
  const lower = kw.toLowerCase();
  if (/buy|price|cheap|deal|discount|coupon|order|purchase|subscription/.test(lower)) return "transactional";
  if (/best|top|review|compare|vs|alternative|recommend/.test(lower)) return "commercial";
  if (/login|sign in|website|official|dashboard|app/.test(lower)) return "navigational";
  return "informational";
};

const estimateVolume = (kw: string): Cluster["volume"] => {
  const words = kw.trim().split(/\s+/).length;
  if (words <= 2) return "high";
  if (words <= 4) return "medium";
  return "low";
};

const clusterKeywords = (keywords: string[], niche: string): Cluster[] => {
  const groups: Record<string, string[]> = {};

  keywords.forEach((kw) => {
    const words = kw.toLowerCase().split(/\s+/);
    let groupKey = "";

    // Group by common root words
    const stopWords = new Set(["the", "a", "an", "is", "are", "for", "to", "in", "of", "and", "or", "how", "what", "why", "with"]);
    const meaningful = words.filter((w) => !stopWords.has(w) && w.length > 2);

    if (meaningful.length >= 2) {
      groupKey = meaningful.slice(0, 2).sort().join(" ");
    } else if (meaningful.length === 1) {
      groupKey = meaningful[0];
    } else {
      groupKey = "general";
    }

    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(kw);
  });

  return Object.entries(groups).map(([name, kws]) => {
    const primaryIntent = classifyIntent(kws[0]);
    const primaryVolume = estimateVolume(kws[0]);
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      keywords: kws,
      intent: primaryIntent,
      volume: primaryVolume,
    };
  });
};

const KeywordClusterGenerator = () => {
  const [input, setInput] = useState("");
  const [niche, setNiche] = useState("");
  const [clusters, setClusters] = useState<Cluster[] | null>(null);

  const generate = () => {
    const keywords = input
      .split("\n")
      .map((k) => k.trim())
      .filter(Boolean);
    if (keywords.length < 2) {
      toast({ title: "Add more keywords", description: "Enter at least 2 keywords, one per line.", variant: "destructive" });
      return;
    }
    const result = clusterKeywords(keywords, niche);
    setClusters(result);
  };

  const copyAll = () => {
    if (!clusters) return;
    const text = clusters
      .map((c) => `## ${c.name} (${c.intent} | ${c.volume} volume)\n${c.keywords.map((k) => `- ${k}`).join("\n")}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Clusters copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Your Niche / Topic (optional)</label>
        <Input placeholder="e.g., SaaS marketing, cybersecurity, AI tools" value={niche} onChange={(e) => setNiche(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Keywords (one per line)</label>
        <Textarea
          placeholder={"best project management tools\nproject management software pricing\nhow to manage remote teams\nteam collaboration tools\nagile project management\nfree project tracker"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
        />
      </div>
      <Button onClick={generate} className="w-full">Generate Keyword Clusters</Button>

      {clusters && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">{clusters.length} Clusters Found</h3>
            <Button size="sm" variant="outline" onClick={copyAll}><Copy className="h-3.5 w-3.5 mr-1" /> Copy All</Button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {(["informational", "transactional", "navigational", "commercial"] as const).map((intent) => (
              <span key={intent} className={`px-2 py-0.5 rounded-full border ${intentColors[intent]}`}>{intent}</span>
            ))}
          </div>

          <div className="space-y-3">
            {clusters.map((cluster, i) => (
              <div key={i} className="bg-muted/50 border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h4 className="font-semibold text-foreground">{cluster.name}</h4>
                  <Badge variant="outline" className={intentColors[cluster.intent]}>{cluster.intent}</Badge>
                  <Badge variant="outline">{cluster.volume} volume</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cluster.keywords.map((kw, j) => (
                    <span key={j} className="text-xs bg-background border rounded-md px-2 py-1 text-muted-foreground">{kw}</span>
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

export default KeywordClusterGenerator;
