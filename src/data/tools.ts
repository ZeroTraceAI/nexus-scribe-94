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
  { id: "11", name: "AI Keyword Cluster Generator", slug: "keyword-cluster-generator", description: "Paste a list of keywords and instantly group them into topical clusters with search intent and volume estimates.", category: "SEO", icon: "🔗", isClientOnly: true },
  { id: "12", name: "Viral Topic Finder", slug: "viral-topic-finder", description: "Generate viral content ideas with hooks, angles, and viral scores based on your niche and trending patterns.", category: "AI", icon: "🔥", isClientOnly: true },
  { id: "13", name: "SERP Ranking Probability Calculator", slug: "serp-calculator", description: "Estimate your ranking probability for any keyword based on domain authority, content quality, and competition.", category: "SEO", icon: "📊", isClientOnly: true },
  { id: "14", name: "SEO Tag Generator", slug: "seo-tag-generator", description: "Generate optimized title tags, meta descriptions, Open Graph, and Twitter Card tags with a live Google preview.", category: "SEO", icon: "🏷️", isClientOnly: true },
  { id: "15", name: "SEO URL Slug Optimizer", slug: "slug-optimizer", description: "Paste any title or URL and get an SEO-optimized slug with stop word removal, scoring, and alternatives.", category: "SEO", icon: "🔗", isClientOnly: true },
  { id: "16", name: "AI Blog Title Generator", slug: "blog-title-generator", description: "Generate click-worthy, SEO-optimized blog titles in multiple styles: how-to, listicle, comparison, and more.", category: "AI", icon: "✏️", isClientOnly: true },
  { id: "17", name: "Content SEO Score Analyzer", slug: "content-seo-analyzer", description: "Paste your article content and get a comprehensive SEO score with keyword density, readability, and actionable tips.", category: "SEO", icon: "📈", isClientOnly: true },
  { id: "18", name: "Cybersecurity Risk Scanner", slug: "cyber-risk-scanner", description: "Run a checklist-based security assessment of your application and get a risk score with prioritized recommendations.", category: "Security", icon: "🔒", isClientOnly: true },
  { id: "19", name: "SaaS Revenue Calculator", slug: "saas-revenue-calculator", description: "Forecast MRR, ARR, LTV, CAC payback, and customer growth with a visual monthly breakdown chart.", category: "Business", icon: "💰", isClientOnly: true },
];
