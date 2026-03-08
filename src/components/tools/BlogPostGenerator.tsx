import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Copy, RefreshCw } from "lucide-react";

const tones = ["Professional", "Casual", "Technical", "Beginner-Friendly", "Persuasive"];
const lengths = [
  { label: "Short (~500 words)", sections: 3 },
  { label: "Medium (~1000 words)", sections: 5 },
  { label: "Long (~2000 words)", sections: 7 },
];

const introHooks = [
  (topic: string) => `Have you ever struggled with ${topic}? You're not alone. In this guide, we'll break down everything you need to know to master ${topic} — from fundamental concepts to advanced techniques.`,
  (topic: string) => `${topic} is transforming how developers build modern applications. Whether you're a seasoned engineer or just starting out, understanding ${topic} is no longer optional — it's essential.`,
  (topic: string) => `The landscape of ${topic} has evolved dramatically in recent years. What worked yesterday may not work today. This comprehensive guide covers the current best practices, common pitfalls, and proven strategies for ${topic}.`,
];

const sectionTemplates = [
  (topic: string) => ({ heading: `What Is ${topic}?`, content: `Begin with a clear, concise definition of ${topic}. Explain the core concept in 2-3 sentences, then provide context about why it matters in today's technology landscape. Include a brief history or evolution to ground the reader.` }),
  (topic: string) => ({ heading: `Why ${topic} Matters`, content: `Discuss the practical importance of ${topic}. Include statistics, real-world use cases, and industry trends. Explain the problems it solves and the benefits it provides. Address common misconceptions.` }),
  (topic: string) => ({ heading: "Key Concepts and Fundamentals", content: `Break down the essential building blocks of ${topic}. Use bullet points or numbered lists for clarity. Each concept should have a brief explanation and, where applicable, a code example or diagram reference.` }),
  (topic: string) => ({ heading: "Step-by-Step Implementation", content: `Walk through a practical implementation of ${topic}. Include code snippets, configuration examples, and screenshots where helpful. Address common setup issues and troubleshooting tips.` }),
  (topic: string) => ({ heading: "Best Practices", content: `List 5-7 best practices for ${topic}. For each practice, explain the "why" behind it, provide a do/don't example, and reference any industry standards or guidelines (e.g., OWASP, NIST, AWS Well-Architected).` }),
  (topic: string) => ({ heading: "Common Mistakes to Avoid", content: `Identify 3-5 frequent mistakes developers make with ${topic}. For each mistake, describe the anti-pattern, explain why it's problematic, and provide the correct approach.` }),
  (topic: string) => ({ heading: `Advanced ${topic} Techniques`, content: `Cover advanced patterns and techniques for experienced developers. Include performance optimization strategies, scaling considerations, and integration patterns with other technologies.` }),
  (topic: string) => ({ heading: "Tools and Resources", content: `Curate a list of recommended tools, libraries, documentation, and learning resources related to ${topic}. Organize by category (e.g., development tools, monitoring, learning).` }),
  (topic: string) => ({ heading: "Real-World Case Study", content: `Present a real-world scenario or case study demonstrating ${topic} in action. Include the problem statement, approach taken, implementation details, and measurable results.` }),
];

const BlogPostGenerator = () => {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState(1);
  const [generated, setGenerated] = useState<string | null>(null);

  const generate = () => {
    if (!topic.trim()) {
      toast({ title: "Enter a topic", description: "Please provide a blog post topic.", variant: "destructive" });
      return;
    }

    const numSections = lengths[length].sections;
    const hook = introHooks[Math.floor(Math.random() * introHooks.length)];
    const keywordList = keywords.split(",").map(k => k.trim()).filter(Boolean);

    // Shuffle and pick sections
    const shuffled = [...sectionTemplates].sort(() => Math.random() - 0.5);
    const sections = shuffled.slice(0, numSections).map(fn => fn(topic));

    let output = `# ${topic}\n\n`;
    output += `**Tone:** ${tone} | **Target Length:** ${lengths[length].label}\n`;
    if (keywordList.length > 0) output += `**Target Keywords:** ${keywordList.join(", ")}\n`;
    output += `\n---\n\n`;
    output += `## Introduction\n\n${hook(topic)}\n\n`;
    if (keywordList.length > 0) {
      output += `> **SEO Note:** Naturally weave these keywords throughout: ${keywordList.join(", ")}\n\n`;
    }
    sections.forEach(s => {
      output += `## ${s.heading}\n\n${s.content}\n\n`;
    });
    output += `## Conclusion\n\nSummarize the key takeaways from this guide on ${topic}. Reinforce the most important points, provide actionable next steps for the reader, and include a call-to-action (e.g., subscribe for more, try the implementation, share feedback).\n\n`;
    output += `---\n\n`;
    output += `**Meta Title:** ${topic} — A Complete Guide (${new Date().getFullYear()})\n`;
    output += `**Meta Description:** Learn everything about ${topic} — from fundamentals to advanced techniques. Practical examples, best practices, and expert tips included.\n`;

    setGenerated(output);
    toast({ title: "Generated!", description: "Your blog post outline is ready." });
  };

  const copyOutput = () => {
    if (generated) {
      navigator.clipboard.writeText(generated);
      toast({ title: "Copied!", description: "Blog post outline copied to clipboard." });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Blog Post Topic *</label>
        <Input placeholder="e.g., How to Implement JWT Authentication in Node.js" value={topic} onChange={e => setTopic(e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Target Keywords (comma-separated)</label>
        <Input placeholder="e.g., JWT, authentication, Node.js, security" value={keywords} onChange={e => setKeywords(e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Tone</label>
        <div className="flex flex-wrap gap-2">
          {tones.map(t => (
            <Button key={t} size="sm" variant={tone === t ? "default" : "outline"} onClick={() => setTone(t)}>{t}</Button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Length</label>
        <div className="flex flex-wrap gap-2">
          {lengths.map((l, i) => (
            <Button key={l.label} size="sm" variant={length === i ? "default" : "outline"} onClick={() => setLength(i)}>{l.label}</Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={generate} className="flex-1">Generate Blog Post Outline</Button>
        {generated && (
          <Button variant="outline" onClick={generate}><RefreshCw className="h-4 w-4" /></Button>
        )}
      </div>

      {generated && (
        <div className="bg-card border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">Generated Outline</p>
            <Button size="sm" variant="outline" onClick={copyOutput}><Copy className="h-3.5 w-3.5 mr-1" /> Copy</Button>
          </div>
          <pre className="text-sm font-mono bg-muted rounded-lg p-4 overflow-auto max-h-[500px] whitespace-pre-wrap text-muted-foreground">{generated}</pre>
        </div>
      )}
    </div>
  );
};

export default BlogPostGenerator;
