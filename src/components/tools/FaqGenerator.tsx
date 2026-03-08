import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FaqItem {
  question: string;
  answer: string;
}

const generateFaqs = (topic: string, keyword: string, count: number): FaqItem[] => {
  const kw = keyword || topic;
  const templates: FaqItem[] = [
    { question: `What is ${kw}?`, answer: `${kw} is a ${topic.toLowerCase().includes("tool") ? "tool" : "concept"} that helps professionals and developers ${topic.toLowerCase().includes("security") ? "secure their applications and infrastructure" : "improve their workflows and achieve better results"}. It encompasses best practices, methodologies, and technologies designed to address common challenges in the field.` },
    { question: `How does ${kw} work?`, answer: `${kw} works by ${topic.toLowerCase().includes("ai") ? "leveraging machine learning algorithms and natural language processing to analyze and generate" : "applying systematic processes and frameworks to analyze, optimize, and implement"} solutions. The process typically involves data collection, analysis, and actionable recommendations tailored to your specific use case.` },
    { question: `Why is ${kw} important in ${new Date().getFullYear()}?`, answer: `In ${new Date().getFullYear()}, ${kw} has become critical because of rapidly evolving technology landscapes, increasing competition, and growing user expectations. Organizations that invest in ${kw} see measurable improvements in efficiency, security, and ROI compared to those that rely on outdated approaches.` },
    { question: `What are the benefits of using ${kw}?`, answer: `Key benefits of ${kw} include improved efficiency, reduced costs, better scalability, enhanced security, and data-driven decision making. Organizations typically see a 20-40% improvement in relevant metrics after implementing ${kw} best practices.` },
    { question: `How do I get started with ${kw}?`, answer: `To get started with ${kw}, begin by assessing your current setup, identifying key areas for improvement, and setting measurable goals. Start with foundational best practices, then gradually implement more advanced strategies. Many free tools and resources are available to help you learn ${kw} fundamentals.` },
    { question: `Is ${kw} suitable for beginners?`, answer: `Yes, ${kw} is accessible to beginners with the right resources. Start with introductory guides and tutorials, practice with hands-on projects, and gradually build your expertise. Many online courses and communities offer structured learning paths for ${kw}.` },
    { question: `What tools are recommended for ${kw}?`, answer: `Popular tools for ${kw} include both free and premium options. For beginners, start with free tools to learn fundamentals. As you advance, consider investing in professional tools that offer advanced analytics, automation, and integration capabilities.` },
    { question: `How much does ${kw} cost?`, answer: `${kw} costs vary widely depending on your needs and scale. Many foundational tools and resources are free. Professional solutions typically range from $20-500/month. Enterprise solutions may require custom pricing. The ROI usually justifies the investment within 3-6 months.` },
    { question: `What are common mistakes to avoid with ${kw}?`, answer: `Common mistakes include neglecting fundamentals, over-automating without understanding the process, failing to measure results, ignoring best practices, and not staying updated with industry changes. Start with a solid foundation and iterate based on data.` },
    { question: `How long does it take to see results from ${kw}?`, answer: `Results from ${kw} typically become visible within 2-4 weeks for basic implementations, 1-3 months for intermediate strategies, and 3-6 months for comprehensive programs. Consistency and continuous optimization are key factors in achieving long-term success.` },
  ];

  return templates.slice(0, count);
};

const FaqGenerator = () => {
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [count, setCount] = useState(5);
  const [faqs, setFaqs] = useState<FaqItem[] | null>(null);

  const generate = () => {
    if (!topic.trim()) {
      toast({ title: "Enter a topic", variant: "destructive" });
      return;
    }
    setFaqs(generateFaqs(topic, keyword, count));
  };

  const removeFaq = (idx: number) => {
    if (!faqs) return;
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const updateFaq = (idx: number, field: "question" | "answer", value: string) => {
    if (!faqs) return;
    setFaqs(faqs.map((f, i) => (i === idx ? { ...f, [field]: value } : f)));
  };

  const copyAsSchema = () => {
    if (!faqs) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    };
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    toast({ title: "FAQ Schema JSON-LD copied!" });
  };

  const copyAsHtml = () => {
    if (!faqs) return;
    const html = `<script type="application/ld+json">\n${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    }, null, 2)}\n</script>\n\n` +
      faqs.map((f) => `<details>\n  <summary>${f.question}</summary>\n  <p>${f.answer}</p>\n</details>`).join("\n\n");
    navigator.clipboard.writeText(html);
    toast({ title: "HTML + Schema copied!" });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Topic</label>
          <Input placeholder="e.g., Cloud Security Best Practices" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Target Keyword</label>
          <Input placeholder="e.g., cloud security" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Number of FAQs ({count})</label>
        <input type="range" min="3" max="10" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <Button onClick={generate} className="w-full">Generate FAQs</Button>

      {faqs && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-foreground">{faqs.length} FAQs Generated</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyAsSchema}><Copy className="h-3.5 w-3.5 mr-1" />Schema</Button>
              <Button size="sm" variant="outline" onClick={copyAsHtml}><Copy className="h-3.5 w-3.5 mr-1" />HTML</Button>
            </div>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-muted/50 border rounded-lg p-4 group">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <input
                    className="font-semibold text-foreground text-sm bg-transparent border-none outline-none w-full focus:ring-1 focus:ring-primary rounded px-1"
                    value={faq.question}
                    onChange={(e) => updateFaq(i, "question", e.target.value)}
                  />
                  <Button size="sm" variant="ghost" onClick={() => removeFaq(i)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <textarea
                  className="text-xs text-muted-foreground bg-transparent border-none outline-none w-full resize-none focus:ring-1 focus:ring-primary rounded px-1"
                  value={faq.answer}
                  onChange={(e) => updateFaq(i, "answer", e.target.value)}
                  rows={3}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqGenerator;
