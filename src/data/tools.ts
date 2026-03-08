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
  { id: "20", name: "AI Meta Description Generator", slug: "meta-description-generator", description: "Generate SEO-optimized meta descriptions in multiple tones with character count validation and quality scoring.", category: "SEO", icon: "📝", isClientOnly: true },
  { id: "21", name: "AI Blog Outline Generator", slug: "blog-outline-generator", description: "Generate structured blog outlines with H2/H3 headings, bullet points, and Markdown export for any topic.", category: "AI", icon: "📋", isClientOnly: true },
  { id: "22", name: "Keyword Difficulty Checker", slug: "keyword-difficulty-checker", description: "Analyze keyword ranking difficulty based on domain authority, content velocity, and backlink profile.", category: "SEO", icon: "🎯", isClientOnly: true },
  { id: "23", name: "Backlink Opportunity Finder", slug: "backlink-finder", description: "Discover backlink strategies with actionable steps: guest posting, broken link building, HARO, and more.", category: "SEO", icon: "🔗", isClientOnly: true },
  { id: "24", name: "SERP Snippet Preview Tool", slug: "serp-snippet-preview", description: "Preview how your page appears in Google search results on desktop and mobile with real-time character counters.", category: "SEO", icon: "👁️", isClientOnly: true },
  { id: "25", name: "AI FAQ Generator for SEO", slug: "faq-generator", description: "Generate SEO-friendly FAQs with editable Q&As and one-click JSON-LD schema markup export.", category: "SEO", icon: "❓", isClientOnly: true },
  { id: "26", name: "Internal Linking Suggestion Tool", slug: "internal-linking-tool", description: "Paste your content and target pages to find internal linking opportunities with relevance scoring.", category: "SEO", icon: "🔀", isClientOnly: true },
  { id: "27", name: "SEO Content Gap Analyzer", slug: "content-gap-analyzer", description: "Compare your keywords against competitors to find content gaps prioritized by impact.", category: "SEO", icon: "🎯", isClientOnly: true },
  { id: "28", name: "Readability Score Analyzer", slug: "readability-analyzer", description: "Analyze Flesch Reading Ease, grade level, sentence complexity, and passive voice usage in your content.", category: "Content", icon: "📖", isClientOnly: true },
  { id: "29", name: "Keyword Intent Classifier", slug: "keyword-intent-classifier", description: "Classify keywords by search intent (informational, transactional, navigational, commercial) with content suggestions.", category: "SEO", icon: "🏷️", isClientOnly: true },
  { id: "30", name: "AI Content Rewriter", slug: "content-rewriter", description: "Rewrite content in multiple styles (formal, concise, engaging) while keeping it SEO-safe with uniqueness scoring.", category: "AI", icon: "✍️", isClientOnly: true },
  { id: "31", name: "Schema Markup Generator", slug: "schema-markup-generator", description: "Generate JSON-LD structured data for Articles, Products, FAQs, Organizations, and more with HTML export.", category: "SEO", icon: "📐", isClientOnly: true },
  { id: "32", name: "Robots.txt Generator", slug: "robots-txt-generator", description: "Build robots.txt files with user-agent rules, AI bot blocking, sitemap references, and crawl delay settings.", category: "SEO", icon: "🤖", isClientOnly: true },
  { id: "33", name: "Sitemap Generator", slug: "sitemap-generator", description: "Create XML sitemaps with configurable URLs, priorities, change frequencies, and last modified dates.", category: "SEO", icon: "🗺️", isClientOnly: true },
  { id: "34", name: "Website Speed Analyzer", slug: "website-speed-analyzer", description: "Run a checklist-based performance audit with scoring, grade, and prioritized optimization recommendations.", category: "Performance", icon: "⚡", isClientOnly: true },
  { id: "35", name: "JavaScript Minifier / Formatter", slug: "js-minifier", description: "Minify JavaScript to reduce file size or format/beautify it for readability with size comparison.", category: "Coding", icon: "📦", isClientOnly: true },
  { id: "36", name: "JSON Formatter", slug: "json-formatter", description: "Format, minify, and validate JSON with syntax checking, configurable indentation, and structure stats.", category: "Coding", icon: "📋", isClientOnly: true },
  { id: "37", name: "Markdown to HTML Converter", slug: "markdown-to-html", description: "Convert Markdown to clean HTML with live preview, supporting headings, lists, code blocks, links, and images.", category: "Coding", icon: "📄", isClientOnly: true },
  { id: "38", name: "Code Beautifier", slug: "code-beautifier", description: "Beautify and format JavaScript, CSS, and HTML code with configurable indentation.", category: "Coding", icon: "✨", isClientOnly: true },
];
