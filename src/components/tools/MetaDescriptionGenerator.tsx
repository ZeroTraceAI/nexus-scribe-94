import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface MetaResult {
  descriptions: string[];
  charCounts: number[];
  scores: number[];
}

const toneTemplates: Record<string, (topic: string, kw: string) => string[]> = {
  professional: (topic, kw) => [
    `Discover expert insights on ${topic}. Learn proven strategies for ${kw} with actionable tips and best practices.`,
    `Master ${kw} with our comprehensive guide on ${topic}. Professional analysis, real-world examples, and data-driven recommendations.`,
    `Explore ${topic}: in-depth coverage of ${kw} fundamentals, advanced techniques, and industry benchmarks for professionals.`,
    `${topic} explained — unlock the full potential of ${kw} with expert-curated strategies, frameworks, and implementation guides.`,
    `Your definitive resource for ${topic}. Understand ${kw} through detailed analysis, case studies, and actionable next steps.`,
  ],
  casual: (topic, kw) => [
    `Everything you need to know about ${topic}. We break down ${kw} in plain English — no jargon, just practical advice.`,
    `Curious about ${kw}? Here's our friendly guide to ${topic} with tips that actually work in the real world.`,
    `${topic} doesn't have to be complicated. Get the lowdown on ${kw} with easy-to-follow tips and honest advice.`,
    `Let's talk ${kw}! Our guide to ${topic} covers what matters most — simple, straightforward, and actually useful.`,
    `Ready to level up your ${kw} game? Dive into ${topic} with practical tips, real examples, and zero fluff.`,
  ],
  persuasive: (topic, kw) => [
    `Don't miss out on ${topic}. Discover why ${kw} is transforming the industry and how you can stay ahead of the curve.`,
    `${kw} can make or break your success. Learn the proven ${topic} strategies top performers use to get results fast.`,
    `Stop guessing with ${kw}. Our ${topic} guide gives you the exact playbook used by industry leaders to drive results.`,
    `Transform your approach to ${kw}. This ${topic} guide reveals strategies that deliver measurable, lasting impact.`,
    `Struggling with ${kw}? Our battle-tested ${topic} strategies have helped thousands achieve breakthrough results.`,
  ],
  seo: (topic, kw) => [
    `Learn about ${kw} in our complete ${topic} guide. Step-by-step tutorials, expert tips & best practices for ${new Date().getFullYear()}.`,
    `${topic}: your #1 resource for ${kw}. Covers everything from basics to advanced strategies. Updated for ${new Date().getFullYear()}.`,
    `Complete ${topic} guide — master ${kw} with tutorials, examples & proven strategies. Free resource, no signup required.`,
    `${kw} made simple. Our ${topic} guide covers tools, techniques & real-world examples to help you succeed in ${new Date().getFullYear()}.`,
    `The ultimate ${topic} resource for ${kw}. Actionable tips, expert analysis & step-by-step guides. Start learning today.`,
  ],
};

const scoreMeta = (desc: string, kw: string): number => {
  let score = 0;
  if (desc.length >= 120 && desc.length <= 160) score += 30;
  else if (desc.length >= 100 && desc.length <= 170) score += 15;
  if (kw && desc.toLowerCase().includes(kw.toLowerCase())) score += 25;
  if (/\d/.test(desc)) score += 10;
  if (desc.endsWith(".")) score += 5;
  if (!/[A-Z]/.test(desc.charAt(0))) score -= 5;
  if (desc.charAt(0) === desc.charAt(0).toUpperCase()) score += 10;
  const words = desc.split(/\s+/).length;
  if (words >= 15 && words <= 30) score += 10;
  if (/action|learn|discover|explore|master|guide|tips|proven|free/i.test(desc)) score += 10;
  return Math.max(0, Math.min(100, score));
};

const MetaDescriptionGenerator = () => {
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState<MetaResult | null>(null);

  const generate = () => {
    if (!topic.trim()) {
      toast({ title: "Enter a page topic", variant: "destructive" });
      return;
    }
    const kw = keyword.trim() || topic.trim();
    const fn = toneTemplates[tone] || toneTemplates.professional;
    const descriptions = fn(topic.trim(), kw);
    const charCounts = descriptions.map((d) => d.length);
    const scores = descriptions.map((d) => scoreMeta(d, kw));
    setResult({ descriptions, charCounts, scores });
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  const toneLabels: Record<string, string> = { professional: "Professional", casual: "Casual & Friendly", persuasive: "Persuasive", seo: "SEO-Optimized" };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Page Topic</label>
          <Input placeholder="e.g., React Server Components Guide" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Target Keyword</label>
          <Input placeholder="e.g., React Server Components" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Tone</label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(toneLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={generate} className="w-full"><Sparkles className="h-4 w-4 mr-2" />Generate Meta Descriptions</Button>

      {result && (
        <div className="space-y-3">
          <h3 className="font-bold text-foreground">{result.descriptions.length} Variations</h3>
          {result.descriptions.map((desc, i) => (
            <div key={i} className="bg-muted/50 border rounded-lg p-4 group">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-foreground leading-relaxed flex-1">{desc}</p>
                <Button size="sm" variant="ghost" onClick={() => copy(desc)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${result.charCounts[i] >= 120 && result.charCounts[i] <= 160 ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                  {result.charCounts[i]} chars
                </span>
                <Badge variant="outline">{result.scores[i]}/100</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MetaDescriptionGenerator;
