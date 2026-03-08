import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Copy, Search } from "lucide-react";

interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  platform: string;
  prompt: string;
  variables: string[];
}

const templates: PromptTemplate[] = [
  // Coding
  { id: "c1", title: "Debug This Code", category: "Coding", platform: "ChatGPT / Claude", prompt: "I have the following code that's producing an error. Please identify the bug, explain why it happens, and provide the corrected code with comments.\n\nLanguage: [LANGUAGE]\nCode:\n```\n[YOUR CODE]\n```\nError message: [ERROR]", variables: ["LANGUAGE", "YOUR CODE", "ERROR"] },
  { id: "c2", title: "Refactor for Clean Code", category: "Coding", platform: "ChatGPT / Claude", prompt: "Refactor the following code to follow SOLID principles, improve readability, and reduce complexity. Explain each change you make.\n\nLanguage: [LANGUAGE]\n```\n[YOUR CODE]\n```", variables: ["LANGUAGE", "YOUR CODE"] },
  { id: "c3", title: "Write Unit Tests", category: "Coding", platform: "ChatGPT / Claude", prompt: "Write comprehensive unit tests for the following function. Include edge cases, happy paths, and error scenarios. Use [FRAMEWORK] as the testing framework.\n\nFunction:\n```[LANGUAGE]\n[YOUR CODE]\n```", variables: ["LANGUAGE", "YOUR CODE", "FRAMEWORK"] },
  { id: "c4", title: "Convert Between Languages", category: "Coding", platform: "ChatGPT / Claude", prompt: "Convert the following [SOURCE_LANG] code to idiomatic [TARGET_LANG]. Preserve the logic and add comments explaining any language-specific differences.\n\n```[SOURCE_LANG]\n[YOUR CODE]\n```", variables: ["SOURCE_LANG", "TARGET_LANG", "YOUR CODE"] },
  // Security
  { id: "s1", title: "Security Code Review", category: "Security", platform: "ChatGPT / Claude", prompt: "Perform a security-focused code review on the following code. Identify vulnerabilities (OWASP Top 10), suggest fixes, and rate the overall security posture (1-10).\n\nLanguage: [LANGUAGE]\n```\n[YOUR CODE]\n```", variables: ["LANGUAGE", "YOUR CODE"] },
  { id: "s2", title: "Threat Model Analysis", category: "Security", platform: "ChatGPT / Claude", prompt: "Create a threat model for the following system architecture using STRIDE methodology. Identify threats, attack vectors, and recommended mitigations.\n\nSystem: [SYSTEM_DESCRIPTION]\nComponents: [COMPONENTS]\nData flows: [DATA_FLOWS]", variables: ["SYSTEM_DESCRIPTION", "COMPONENTS", "DATA_FLOWS"] },
  { id: "s3", title: "Incident Response Plan", category: "Security", platform: "ChatGPT / Claude", prompt: "Create a detailed incident response plan for a [INCIDENT_TYPE] affecting a [SYSTEM_TYPE]. Include detection, containment, eradication, recovery, and lessons learned phases. Follow NIST SP 800-61 guidelines.", variables: ["INCIDENT_TYPE", "SYSTEM_TYPE"] },
  // AI/ML
  { id: "a1", title: "Design ML Pipeline", category: "AI/ML", platform: "ChatGPT / Claude", prompt: "Design a machine learning pipeline for the following problem. Include data preprocessing, feature engineering, model selection, training strategy, evaluation metrics, and deployment considerations.\n\nProblem: [PROBLEM]\nData: [DATA_DESCRIPTION]\nConstraints: [CONSTRAINTS]", variables: ["PROBLEM", "DATA_DESCRIPTION", "CONSTRAINTS"] },
  { id: "a2", title: "Explain AI Concept Simply", category: "AI/ML", platform: "ChatGPT / Claude", prompt: "Explain [AI_CONCEPT] as if I'm a [AUDIENCE_LEVEL]. Use analogies, avoid jargon, and provide a practical example of how it's used in real applications.", variables: ["AI_CONCEPT", "AUDIENCE_LEVEL"] },
  { id: "a3", title: "Fine-tuning Strategy", category: "AI/ML", platform: "ChatGPT / Claude", prompt: "Recommend a fine-tuning strategy for [BASE_MODEL] to accomplish [TASK]. Include dataset preparation, hyperparameters, evaluation approach, and estimated compute requirements.", variables: ["BASE_MODEL", "TASK"] },
  // Cloud
  { id: "cl1", title: "Infrastructure as Code", category: "Cloud", platform: "ChatGPT / Claude", prompt: "Write [IAC_TOOL] code to provision the following cloud infrastructure on [CLOUD_PROVIDER]:\n\n[REQUIREMENTS]\n\nInclude security best practices, tagging strategy, and cost optimization notes.", variables: ["IAC_TOOL", "CLOUD_PROVIDER", "REQUIREMENTS"] },
  { id: "cl2", title: "Optimize Cloud Costs", category: "Cloud", platform: "ChatGPT / Claude", prompt: "Analyze the following cloud architecture and suggest cost optimizations without sacrificing reliability or performance.\n\nProvider: [CLOUD_PROVIDER]\nServices used: [SERVICES]\nMonthly spend: [SPEND]\nTraffic pattern: [PATTERN]", variables: ["CLOUD_PROVIDER", "SERVICES", "SPEND", "PATTERN"] },
  // Writing
  { id: "w1", title: "Technical Blog Post Outline", category: "Writing", platform: "ChatGPT / Claude", prompt: "Create a detailed outline for a technical blog post about [TOPIC] targeting [AUDIENCE]. Include H2/H3 headings, key points per section, code examples to include, and a compelling hook. Target word count: [WORD_COUNT].", variables: ["TOPIC", "AUDIENCE", "WORD_COUNT"] },
  { id: "w2", title: "API Documentation", category: "Writing", platform: "ChatGPT / Claude", prompt: "Write comprehensive API documentation for the following endpoint. Include description, parameters, request/response examples, error codes, rate limits, and usage notes.\n\nEndpoint: [METHOD] [PATH]\nPurpose: [PURPOSE]\nAuth: [AUTH_TYPE]", variables: ["METHOD", "PATH", "PURPOSE", "AUTH_TYPE"] },
  { id: "w3", title: "README Generator", category: "Writing", platform: "ChatGPT / Claude", prompt: "Generate a professional README.md for a [PROJECT_TYPE] project called [PROJECT_NAME]. Include: badges, description, features, installation, usage, API reference, contributing guidelines, and license.\n\nTech stack: [TECH_STACK]\nDescription: [DESCRIPTION]", variables: ["PROJECT_TYPE", "PROJECT_NAME", "TECH_STACK", "DESCRIPTION"] },
  // DevOps
  { id: "d1", title: "CI/CD Pipeline Design", category: "DevOps", platform: "ChatGPT / Claude", prompt: "Design a CI/CD pipeline for a [PROJECT_TYPE] project using [CI_TOOL]. Include build, test, security scan, staging deploy, and production deploy stages. Add rollback strategy and notification setup.\n\nRepo structure: [STRUCTURE]", variables: ["PROJECT_TYPE", "CI_TOOL", "STRUCTURE"] },
  { id: "d2", title: "Docker Optimization", category: "DevOps", platform: "ChatGPT / Claude", prompt: "Optimize the following Dockerfile for production. Reduce image size, improve build speed with layer caching, add security hardening, and follow best practices.\n\n```dockerfile\n[DOCKERFILE]\n```", variables: ["DOCKERFILE"] },
];

const categories = ["All", ...Array.from(new Set(templates.map(t => t.category)))];

const PromptTemplates = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = templates.filter(t => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.prompt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyPrompt = (prompt: string, title: string) => {
    navigator.clipboard.writeText(prompt);
    toast({ title: "Copied!", description: `"${title}" prompt copied to clipboard.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <Button key={cat} size="sm" variant={activeCategory === cat ? "default" : "outline"} onClick={() => setActiveCategory(cat)}>
            {cat}
          </Button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} template{filtered.length !== 1 ? "s" : ""} found</p>

      <div className="space-y-4">
        {filtered.map(t => (
          <div key={t.id} className="bg-card border rounded-lg p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-semibold text-foreground">{t.title}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{t.category}</span>
                  <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">{t.platform}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => copyPrompt(t.prompt, t.title)}>
                <Copy className="h-3.5 w-3.5 mr-1" /> Copy
              </Button>
            </div>
            <pre className="text-sm text-muted-foreground bg-muted rounded-lg p-4 mt-3 whitespace-pre-wrap font-mono overflow-auto max-h-48">{t.prompt}</pre>
            {t.variables.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                <span className="text-xs text-muted-foreground">Variables:</span>
                {t.variables.map(v => (
                  <span key={v} className="text-xs bg-accent text-accent-foreground rounded px-1.5 py-0.5 font-mono">[{v}]</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptTemplates;
