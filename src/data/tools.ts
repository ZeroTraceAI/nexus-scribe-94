export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  isClientOnly: boolean;
}

export const tools: Tool[] = [
  { id: "1", name: "AI Blog Post Generator", slug: "blog-post-generator", description: "Generate full blog posts with headings, intro, body, and conclusion powered by AI.", category: "AI", icon: "✍️", isClientOnly: false },
  { id: "2", name: "Code Snippet Generator", slug: "code-generator", description: "Describe what your code should do and get syntax-highlighted, copyable code with explanations.", category: "Coding", icon: "💻", isClientOnly: false },
  { id: "3", name: "Vulnerability Explainer", slug: "vuln-explainer", description: "Enter a CVE ID or vulnerability name and get a plain-English explanation with mitigation steps.", category: "Security", icon: "🛡️", isClientOnly: false },
  { id: "4", name: "Cloud Architecture Helper", slug: "cloud-arch-helper", description: "Describe your app requirements and get recommended cloud architecture with services and cost notes.", category: "Cloud", icon: "☁️", isClientOnly: false },
  { id: "5", name: "Smart Contract Auditor", slug: "smart-contract-auditor", description: "Paste Solidity code to identify potential vulnerabilities and get gas optimization suggestions.", category: "Blockchain", icon: "📜", isClientOnly: false },
  { id: "6", name: "SEO Meta Tag Generator", slug: "seo-meta-generator", description: "Generate optimized meta titles, descriptions, OG tags, and JSON-LD schema suggestions.", category: "SEO", icon: "🔍", isClientOnly: false },
  { id: "7", name: "Regex Builder & Tester", slug: "regex-tester", description: "Build and test regular expressions with real-time match highlighting and pattern explanations.", category: "Coding", icon: "🔤", isClientOnly: true },
  { id: "8", name: "Password Strength Analyzer", slug: "password-checker", description: "Check password strength with crack time estimation and improvement suggestions. 100% client-side.", category: "Security", icon: "🔐", isClientOnly: true },
  { id: "9", name: "Code Explainer", slug: "code-explainer", description: "Paste any code and get a line-by-line plain-English explanation of what it does.", category: "AI", icon: "📖", isClientOnly: false },
  { id: "10", name: "Prompt Engineering Templates", slug: "prompt-templates", description: "Categorized library of copy-paste prompt templates for ChatGPT, Claude, Gemini, and more.", category: "AI", icon: "🎯", isClientOnly: true },
];
