// Build-time sitemap generator - imported as Vite plugin
import type { Plugin } from "vite";

const BASE_URL = "https://codesecai.com";

// Static pages with their priorities and change frequencies
const staticPages = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/blog", priority: "0.9", changefreq: "daily" },
  { path: "/tools", priority: "0.8", changefreq: "weekly" },
  { path: "/about", priority: "0.6", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
  { path: "/subscribe", priority: "0.5", changefreq: "monthly" },
  { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms-of-service", priority: "0.3", changefreq: "yearly" },
  { path: "/disclaimer", priority: "0.3", changefreq: "yearly" },
  { path: "/cookie-policy", priority: "0.3", changefreq: "yearly" },
];

// Category slugs
const categorySlugs = [
  "cyber-security",
  "artificial-intelligence",
  "cloud-computing",
  "blockchain",
  "programming",
];

// Tool slugs
const toolSlugs = [
  "blog-post-generator",
  "code-generator",
  "vuln-explainer",
  "cloud-arch-helper",
  "smart-contract-auditor",
  "seo-meta-generator",
  "regex-tester",
  "password-checker",
  "code-explainer",
  "prompt-templates",
];

// Post slugs - extracted from data
const postSlugs = [
  "how-to-prevent-sql-injection-attacks",
  "building-production-rag-systems-langchain",
  "kubernetes-cost-optimization-strategies",
  "smart-contract-security-audit-checklist",
  "rust-vs-go-performance-comparison",
  "zero-trust-architecture-implementation-guide",
  "fine-tuning-llms-custom-data-workshop",
];

function buildUrl(path: string, priority: string, changefreq: string, lastmod?: string) {
  return `  <url>
    <loc>${BASE_URL}${path}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : `<lastmod>${new Date().toISOString().split("T")[0]}</lastmod>`}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function generateSitemap(): string {
  const urls: string[] = [];

  // Static pages
  for (const page of staticPages) {
    urls.push(buildUrl(page.path, page.priority, page.changefreq));
  }

  // Categories
  for (const slug of categorySlugs) {
    urls.push(buildUrl(`/category/${slug}`, "0.7", "weekly"));
  }

  // Tools
  for (const slug of toolSlugs) {
    urls.push(buildUrl(`/tools/${slug}`, "0.6", "monthly"));
  }

  // Blog posts
  for (const slug of postSlugs) {
    urls.push(buildUrl(`/blog/${slug}`, "0.8", "monthly"));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export function sitemapPlugin(): Plugin {
  return {
    name: "generate-sitemap",
    closeBundle() {
      const fs = require("fs");
      const path = require("path");
      const sitemap = generateSitemap();
      fs.writeFileSync(path.resolve("dist/sitemap.xml"), sitemap);
      console.log("✅ sitemap.xml generated");
    },
  };
}

// Also write a static version for dev/preview
import { writeFileSync } from "fs";
try {
  writeFileSync("public/sitemap.xml", generateSitemap());
} catch {}
