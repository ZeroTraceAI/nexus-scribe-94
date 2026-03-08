import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface VideoScript {
  title: string;
  hook: string;
  sections: { timestamp: string; heading: string; narration: string; visual: string }[];
  cta: string;
  thumbnail: { title: string; subtitle: string; style: string };
  seo: { description: string; tags: string[] };
  duration: string;
}

const styles = ["Tutorial", "Explainer", "Review", "Listicle", "Case Study", "Comparison"];
const durations = ["Short (2-5 min)", "Medium (5-10 min)", "Long (10-20 min)"];

const generateScript = (topic: string, style: string, duration: string): VideoScript => {
  const sectionCount = duration.includes("Short") ? 3 : duration.includes("Medium") ? 5 : 7;
  const minPerSection = duration.includes("Short") ? 1 : duration.includes("Medium") ? 1.5 : 2;

  const hooks: Record<string, string> = {
    "Tutorial": `Most developers get ${topic} completely wrong. Here's the right way to do it, step by step.`,
    "Explainer": `${topic} is changing everything — but 90% of people don't understand how it actually works.`,
    "Review": `I tested ${topic} for 30 days. Here's my brutally honest review.`,
    "Listicle": `${sectionCount} ${topic} tricks that will 10x your productivity. Number ${sectionCount} is a game-changer.`,
    "Case Study": `How one company used ${topic} to go from zero to $1M. Let me break down exactly what they did.`,
    "Comparison": `${topic}: I compared every option so you don't have to. Here's the clear winner.`,
  };

  const sections = Array.from({ length: sectionCount }, (_, i) => {
    const mins = Math.round(i * minPerSection);
    const secs = Math.round((i * minPerSection % 1) * 60);
    return {
      timestamp: `${mins}:${secs.toString().padStart(2, "0")}`,
      heading: i === 0 ? "Introduction & Hook" : i === sectionCount - 1 ? "Summary & CTA" : `Key Point ${i}: ${topic} - Aspect ${i}`,
      narration: i === 0
        ? `Open with the hook. Introduce yourself and what viewers will learn about ${topic}.`
        : i === sectionCount - 1
        ? `Recap the key takeaways. Ask viewers to subscribe and comment their experience with ${topic}.`
        : `Deep dive into aspect ${i} of ${topic}. Include real examples, data points, and actionable tips. Transition smoothly to the next section.`,
      visual: i === 0 ? "Animated title card → face to camera" : i === sectionCount - 1 ? "Summary slide → subscribe animation" : `Screen recording / B-roll of ${topic} in action. Add text overlays for key stats.`,
    };
  });

  return {
    title: style === "Listicle" ? `${sectionCount} ${topic} Tips You Need to Know in 2025` : `${topic}: The Complete ${style} Guide (2025)`,
    hook: hooks[style] || hooks["Explainer"],
    sections,
    cta: `If this helped you understand ${topic}, smash that subscribe button and drop a comment below!`,
    thumbnail: {
      title: topic.toUpperCase(),
      subtitle: style === "Tutorial" ? "STEP BY STEP" : style === "Review" ? "HONEST REVIEW" : "COMPLETE GUIDE",
      style: "Bold text, contrasting colors, expressive face shot",
    },
    seo: {
      description: `Learn everything about ${topic} in this comprehensive ${style.toLowerCase()}. We cover key concepts, best practices, and real-world examples to help you master ${topic} quickly.`,
      tags: [topic, style.toLowerCase(), `${topic} tutorial`, `${topic} 2025`, `learn ${topic}`, `${topic} guide`, "tech", "developer"],
    },
    duration: duration.includes("Short") ? `${sectionCount * 1} min` : duration.includes("Medium") ? `${Math.round(sectionCount * 1.5)} min` : `${sectionCount * 2} min`,
  };
};

const AiVideoGenerator = () => {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("Tutorial");
  const [duration, setDuration] = useState("Medium (5-10 min)");
  const [result, setResult] = useState<VideoScript | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) { toast({ title: "Enter a topic" }); return; }
    setResult(generateScript(topic, style, duration));
  };

  const exportScript = () => {
    if (!result) return;
    const md = `# ${result.title}\n\nDuration: ${result.duration}\nStyle: ${style}\n\n## Hook\n${result.hook}\n\n## Script\n\n${result.sections.map(s => `### [${s.timestamp}] ${s.heading}\n**Narration:** ${s.narration}\n**Visual:** ${s.visual}`).join("\n\n")}\n\n## CTA\n${result.cta}\n\n## Thumbnail\nTitle: ${result.thumbnail.title}\nSubtitle: ${result.thumbnail.subtitle}\nStyle: ${result.thumbnail.style}\n\n## SEO\nDescription: ${result.seo.description}\nTags: ${result.seo.tags.join(", ")}`;
    navigator.clipboard.writeText(md);
    toast({ title: "Script exported!" });
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Video topic (e.g., 'Docker for Beginners', 'AI in Healthcare')..." value={topic} onChange={e => setTopic(e.target.value)} />
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Style</p>
        <div className="flex flex-wrap gap-2">
          {styles.map(s => (
            <button key={s} onClick={() => setStyle(s)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${style === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{s}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Duration</p>
        <div className="flex flex-wrap gap-2">
          {durations.map(d => (
            <button key={d} onClick={() => setDuration(d)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${duration === d ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{d}</button>
          ))}
        </div>
      </div>
      <Button onClick={handleGenerate} className="w-full">Generate Video Script</Button>

      {result && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-foreground">{result.title}</h3>
            <Button variant="outline" size="sm" onClick={exportScript}>Export</Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Duration</span><p className="text-sm font-bold text-foreground">{result.duration}</p></div>
            <div className="bg-muted/50 rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Sections</span><p className="text-sm font-bold text-foreground">{result.sections.length}</p></div>
          </div>
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <p className="text-xs font-semibold text-primary uppercase mb-1">Hook</p>
            <p className="text-sm text-foreground italic">"{result.hook}"</p>
          </div>
          <div className="space-y-3">
            {result.sections.map((s, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="font-mono text-xs">{s.timestamp}</Badge>
                  <h4 className="font-medium text-foreground">{s.heading}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{s.narration}</p>
                <p className="text-xs text-muted-foreground"><span className="font-semibold">🎬 Visual:</span> {s.visual}</p>
              </div>
            ))}
          </div>
          <div className="bg-muted/50 rounded-xl p-4 border">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Thumbnail</p>
            <div className="bg-card rounded-lg p-6 border text-center">
              <p className="text-2xl font-black text-foreground">{result.thumbnail.title}</p>
              <p className="text-sm font-bold text-primary mt-1">{result.thumbnail.subtitle}</p>
              <p className="text-xs text-muted-foreground mt-2">{result.thumbnail.style}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">SEO Tags</p>
            <div className="flex flex-wrap gap-1">{result.seo.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiVideoGenerator;
