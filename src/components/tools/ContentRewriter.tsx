import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const synonyms: Record<string, string[]> = {
  important: ["crucial", "essential", "vital", "significant", "critical"],
  good: ["excellent", "outstanding", "effective", "high-quality", "superior"],
  bad: ["poor", "inadequate", "subpar", "ineffective", "problematic"],
  use: ["utilize", "leverage", "employ", "implement", "apply"],
  help: ["assist", "support", "facilitate", "enable", "aid"],
  make: ["create", "develop", "build", "establish", "generate"],
  show: ["demonstrate", "illustrate", "reveal", "display", "indicate"],
  big: ["substantial", "significant", "considerable", "extensive", "major"],
  small: ["minimal", "compact", "modest", "limited", "minor"],
  fast: ["rapid", "swift", "efficient", "streamlined", "accelerated"],
  new: ["innovative", "modern", "cutting-edge", "emerging", "novel"],
  old: ["legacy", "traditional", "established", "conventional", "outdated"],
  get: ["obtain", "acquire", "achieve", "secure", "gain"],
  need: ["require", "demand", "necessitate", "call for", "depend on"],
  think: ["consider", "believe", "evaluate", "assess", "determine"],
  very: ["extremely", "highly", "remarkably", "exceptionally", "particularly"],
  many: ["numerous", "multiple", "various", "several", "diverse"],
  easy: ["straightforward", "simple", "accessible", "user-friendly", "intuitive"],
  hard: ["challenging", "complex", "demanding", "difficult", "rigorous"],
  start: ["initiate", "launch", "begin", "commence", "kick off"],
  change: ["modify", "adjust", "transform", "alter", "revise"],
  improve: ["enhance", "optimize", "upgrade", "strengthen", "refine"],
  increase: ["boost", "expand", "amplify", "escalate", "maximize"],
  decrease: ["reduce", "minimize", "lower", "diminish", "curtail"],
  problem: ["challenge", "issue", "obstacle", "bottleneck", "concern"],
  thing: ["element", "component", "factor", "aspect", "feature"],
};

const transitionPhrases = [
  "Additionally", "Furthermore", "Moreover", "In contrast", "Similarly",
  "Consequently", "As a result", "For instance", "Specifically", "In particular",
  "On the other hand", "Nevertheless", "Meanwhile", "Subsequently", "Ultimately",
];

const rewriteContent = (content: string, mode: string): string => {
  let result = content;

  // Replace common words with synonyms
  Object.entries(synonyms).forEach(([word, syns]) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    let matchIndex = 0;
    result = result.replace(regex, (match) => {
      const replacement = syns[matchIndex % syns.length];
      matchIndex++;
      // Preserve capitalization
      if (match[0] === match[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  });

  if (mode === "formal") {
    result = result
      .replace(/\bdon't\b/gi, "do not")
      .replace(/\bcan't\b/gi, "cannot")
      .replace(/\bwon't\b/gi, "will not")
      .replace(/\bisn't\b/gi, "is not")
      .replace(/\baren't\b/gi, "are not")
      .replace(/\bdidn't\b/gi, "did not")
      .replace(/\bwouldn't\b/gi, "would not")
      .replace(/\bit's\b/gi, "it is")
      .replace(/\bthat's\b/gi, "that is")
      .replace(/\bthey're\b/gi, "they are")
      .replace(/\bwe're\b/gi, "we are")
      .replace(/\byou're\b/gi, "you are");
  }

  if (mode === "concise") {
    result = result
      .replace(/\bin order to\b/gi, "to")
      .replace(/\bdue to the fact that\b/gi, "because")
      .replace(/\bat this point in time\b/gi, "now")
      .replace(/\bin the event that\b/gi, "if")
      .replace(/\bfor the purpose of\b/gi, "to")
      .replace(/\bwith regard to\b/gi, "regarding")
      .replace(/\bin spite of the fact that\b/gi, "although")
      .replace(/\bas a matter of fact\b/gi, "in fact")
      .replace(/\bit is important to note that\b/gi, "notably")
      .replace(/\bbasically\b/gi, "")
      .replace(/\bactually\b/gi, "")
      .replace(/\breally\b/gi, "")
      .replace(/\bjust\b/gi, "")
      .replace(/\s{2,}/g, " ");
  }

  // Add transition variety
  if (mode === "engaging") {
    const sentences = result.split(/(?<=[.!?])\s+/);
    let transIdx = 0;
    result = sentences.map((s, i) => {
      if (i > 0 && i % 3 === 0 && !s.match(/^(Additionally|Furthermore|Moreover|However|In contrast)/)) {
        const transition = transitionPhrases[transIdx % transitionPhrases.length];
        transIdx++;
        return `${transition}, ${s.charAt(0).toLowerCase()}${s.slice(1)}`;
      }
      return s;
    }).join(" ");
  }

  return result.trim();
};

const ContentRewriter = () => {
  const [content, setContent] = useState("");
  const [mode, setMode] = useState("balanced");
  const [rewritten, setRewritten] = useState("");

  const rewrite = () => {
    if (!content.trim()) {
      toast({ title: "Paste content to rewrite", variant: "destructive" });
      return;
    }
    setRewritten(rewriteContent(content, mode));
  };

  const copyResult = () => {
    navigator.clipboard.writeText(rewritten);
    toast({ title: "Rewritten content copied!" });
  };

  const originalWords = content.trim().split(/\s+/).filter(Boolean).length;
  const rewrittenWords = rewritten.trim().split(/\s+/).filter(Boolean).length;

  // Calculate uniqueness
  const originalSet = new Set(content.toLowerCase().split(/\s+/).filter(Boolean));
  const rewrittenArr = rewritten.toLowerCase().split(/\s+/).filter(Boolean);
  const changedWords = rewrittenArr.filter((w) => !originalSet.has(w)).length;
  const uniqueness = rewrittenArr.length > 0 ? Math.round((changedWords / rewrittenArr.length) * 100) : 0;

  const modeLabels: Record<string, string> = { balanced: "Balanced", formal: "Formal / Academic", concise: "Concise / Shorter", engaging: "Engaging / Dynamic" };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Original Content</label>
        <Textarea placeholder="Paste your content here to rewrite it while keeping it SEO-safe..." value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
        {content && <p className="text-xs text-muted-foreground mt-1">{originalWords} words</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Rewriting Style</label>
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(modeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={rewrite} className="w-full"><RefreshCw className="h-4 w-4 mr-2" />Rewrite Content</Button>

      {rewritten && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{rewrittenWords} words</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${uniqueness >= 30 ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                {uniqueness}% unique
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={rewrite}><RefreshCw className="h-3.5 w-3.5 mr-1" />Rewrite Again</Button>
              <Button size="sm" variant="outline" onClick={copyResult}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
            </div>
          </div>
          <div className="bg-muted/50 border rounded-lg p-4">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{rewritten}</p>
          </div>
          <p className="text-xs text-muted-foreground">This tool rewrites content by replacing words with synonyms, adjusting tone, and restructuring sentences. Always review the output to ensure accuracy and natural flow.</p>
        </div>
      )}
    </div>
  );
};

export default ContentRewriter;
