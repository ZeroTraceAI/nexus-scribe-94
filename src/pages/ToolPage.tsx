import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { tools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";

import PromptTemplates from "@/components/tools/PromptTemplates";
import SeoMetaGenerator from "@/components/tools/SeoMetaGenerator";
import BlogPostGenerator from "@/components/tools/BlogPostGenerator";
import CodeSnippetGenerator from "@/components/tools/CodeSnippetGenerator";
import VulnExplainer from "@/components/tools/VulnExplainer";
import CloudArchHelper from "@/components/tools/CloudArchHelper";
import SmartContractAuditor from "@/components/tools/SmartContractAuditor";
import CodeExplainer from "@/components/tools/CodeExplainer";
import KeywordClusterGenerator from "@/components/tools/KeywordClusterGenerator";
import ViralTopicFinder from "@/components/tools/ViralTopicFinder";
import SerpCalculator from "@/components/tools/SerpCalculator";
import SeoTagGenerator from "@/components/tools/SeoTagGenerator";
import SlugOptimizer from "@/components/tools/SlugOptimizer";
import BlogTitleGenerator from "@/components/tools/BlogTitleGenerator";
import ContentSeoAnalyzer from "@/components/tools/ContentSeoAnalyzer";
import CyberRiskScanner from "@/components/tools/CyberRiskScanner";
import SaasRevenueCalculator from "@/components/tools/SaasRevenueCalculator";
import MetaDescriptionGenerator from "@/components/tools/MetaDescriptionGenerator";
import BlogOutlineGenerator from "@/components/tools/BlogOutlineGenerator";
import KeywordDifficultyChecker from "@/components/tools/KeywordDifficultyChecker";
import BacklinkOpportunityFinder from "@/components/tools/BacklinkOpportunityFinder";
import SerpSnippetPreview from "@/components/tools/SerpSnippetPreview";
import FaqGenerator from "@/components/tools/FaqGenerator";
import InternalLinkingSuggester from "@/components/tools/InternalLinkingSuggester";
import ContentGapAnalyzer from "@/components/tools/ContentGapAnalyzer";
import ReadabilityAnalyzer from "@/components/tools/ReadabilityAnalyzer";
import KeywordIntentClassifier from "@/components/tools/KeywordIntentClassifier";
import ContentRewriter from "@/components/tools/ContentRewriter";
import SchemaMarkupGenerator from "@/components/tools/SchemaMarkupGenerator";
import RobotsTxtGenerator from "@/components/tools/RobotsTxtGenerator";
import SitemapGeneratorTool from "@/components/tools/SitemapGeneratorTool";
import WebsiteSpeedAnalyzer from "@/components/tools/WebsiteSpeedAnalyzer";
import JsMinifierFormatter from "@/components/tools/JsMinifierFormatter";
import JsonFormatter from "@/components/tools/JsonFormatter";
import MarkdownToHtml from "@/components/tools/MarkdownToHtml";
import CodeBeautifier from "@/components/tools/CodeBeautifier";
import AiContentDetector from "@/components/tools/AiContentDetector";
import PlagiarismChecker from "@/components/tools/PlagiarismChecker";
import DomainAuthorityChecker from "@/components/tools/DomainAuthorityChecker";
import BulkKeywordGenerator from "@/components/tools/BulkKeywordGenerator";
import GoogleTrendsVisualizer from "@/components/tools/GoogleTrendsVisualizer";
import AiPromptGenerator from "@/components/tools/AiPromptGenerator";
import AiPromptLibrary from "@/components/tools/AiPromptLibrary";
import SecurityHeaderChecker from "@/components/tools/SecurityHeaderChecker";
import WhoisLookup from "@/components/tools/WhoisLookup";
import DnsLookup from "@/components/tools/DnsLookup";
import SslChecker from "@/components/tools/SslChecker";
import UptimeChecker from "@/components/tools/UptimeChecker";
import IpLookup from "@/components/tools/IpLookup";
import SubdomainFinder from "@/components/tools/SubdomainFinder";
import CloudCostCalculator from "@/components/tools/CloudCostCalculator";
import DockerfileGenerator from "@/components/tools/DockerfileGenerator";
import KubernetesYamlGenerator from "@/components/tools/KubernetesYamlGenerator";
import ApiEndpointTester from "@/components/tools/ApiEndpointTester";
import SqlQueryFormatter from "@/components/tools/SqlQueryFormatter";
import LogAnalyzer from "@/components/tools/LogAnalyzer";
import CodeComplexityAnalyzer from "@/components/tools/CodeComplexityAnalyzer";
import ApiRateLimitTester from "@/components/tools/ApiRateLimitTester";
import CodingInterviewGenerator from "@/components/tools/CodingInterviewGenerator";
import WebTechDetector from "@/components/tools/WebTechDetector";
import AiAgentsExplorer from "@/components/tools/AiAgentsExplorer";
import AiCyberDefense from "@/components/tools/AiCyberDefense";
import AiMalwareDetector from "@/components/tools/AiMalwareDetector";
import AiPromptEngineer from "@/components/tools/AiPromptEngineer";
import AiCodeGenerator from "@/components/tools/AiCodeGenerator";
import AiContentAutomation from "@/components/tools/AiContentAutomation";
import AiVideoGenerator from "@/components/tools/AiVideoGenerator";
import AiSaasAutomation from "@/components/tools/AiSaasAutomation";
import AiResearchAssistant from "@/components/tools/AiResearchAssistant";
import AiDevCopilot from "@/components/tools/AiDevCopilot";
import ViralTopicGenerator from "@/components/tools/ViralTopicGenerator";
import AiResearchSummarizer from "@/components/tools/AiResearchSummarizer";
import AiSaasIdeaGenerator from "@/components/tools/AiSaasIdeaGenerator";
import AiStartupIdeaGenerator from "@/components/tools/AiStartupIdeaGenerator";
import AiCodeSecurityScanner from "@/components/tools/AiCodeSecurityScanner";
import AiModelComparison from "@/components/tools/AiModelComparison";
import AiWorkflowBuilder from "@/components/tools/AiWorkflowBuilder";

const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [testStr, setTestStr] = useState("");
  const [flags, setFlags] = useState("g");

  let matches: RegExpMatchArray[] = [];
  let error = "";
  try {
    if (pattern) {
      const re = new RegExp(pattern, flags);
      matches = [...testStr.matchAll(re)];
    }
  } catch (e: any) {
    error = e.message;
  }

  const getHighlightedText = () => {
    if (!pattern || !testStr || error || matches.length === 0) return null;
    try {
      const re = new RegExp(pattern, flags);
      const parts = testStr.split(re);
      const matched = testStr.match(re) || [];
      const result: JSX.Element[] = [];
      parts.forEach((part, i) => {
        result.push(<span key={`p${i}`}>{part}</span>);
        if (i < matched.length) {
          result.push(<mark key={`m${i}`} className="bg-primary/30 text-primary font-semibold rounded px-0.5">{matched[i]}</mark>);
        }
      });
      return result;
    } catch { return null; }
  };

  const commonPatterns = [
    { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
    { label: "URL", pattern: "https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=]+" },
    { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
    { label: "Phone", pattern: "\\+?[1-9]\\d{1,14}" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="text-xs text-muted-foreground mr-1 self-center">Quick patterns:</span>
        {commonPatterns.map(p => (
          <button key={p.label} onClick={() => setPattern(p.pattern)} className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">{p.label}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input placeholder="Enter regex pattern..." value={pattern} onChange={e => setPattern(e.target.value)} className="font-mono" />
        <Input placeholder="Flags" value={flags} onChange={e => setFlags(e.target.value)} className="w-20 font-mono" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Textarea placeholder="Enter test string..." value={testStr} onChange={e => setTestStr(e.target.value)} rows={5} className="font-mono" />
      {getHighlightedText() && (
        <div className="bg-muted/50 rounded-lg p-4 border">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Live Preview</p>
          <div className="text-sm font-mono whitespace-pre-wrap break-all">{getHighlightedText()}</div>
        </div>
      )}
      {matches.length > 0 && (
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">{matches.length} match{matches.length !== 1 ? "es" : ""} found</p>
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(matches.map(m => m[0]).join("\n")); toast({ title: "Matches copied!" }); }}>Export matches</Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matches.map((m, i) => (
              <span key={i} className="text-sm font-mono text-primary bg-primary/10 rounded px-2 py-0.5">"{m[0]}" <span className="text-muted-foreground text-xs">@{m.index}</span></span>
            ))}
          </div>
        </div>
      )}
      {pattern && testStr && matches.length === 0 && !error && <p className="text-sm text-muted-foreground">No matches found.</p>}
    </div>
  );
};

const PasswordChecker = () => {
  const [password, setPassword] = useState("");
  const getStrength = (pw: string) => { let s = 0; if (pw.length >= 8) s++; if (pw.length >= 12) s++; if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++; if (/\d/.test(pw)) s++; if (/[^a-zA-Z0-9]/.test(pw)) s++; return s; };
  const getCrackTime = (pw: string) => { const cs = (/[a-z]/.test(pw)?26:0)+(/[A-Z]/.test(pw)?26:0)+(/\d/.test(pw)?10:0)+(/[^a-zA-Z0-9]/.test(pw)?33:0); if(!cs||!pw.length)return"Instant"; const c=Math.pow(cs,pw.length); const g=1e10; const s=c/g; if(s<1)return"< 1 second"; if(s<60)return`${Math.round(s)} seconds`; if(s<3600)return`${Math.round(s/60)} minutes`; if(s<86400)return`${Math.round(s/3600)} hours`; if(s<31536000)return`${Math.round(s/86400)} days`; if(s<31536000*1000)return`${Math.round(s/31536000)} years`; if(s<31536000*1e6)return`${Math.round(s/31536000/1000)}K years`; return`${(s/31536000/1e6).toFixed(0)}M+ years`; };
  const strength = getStrength(password);
  const labels = ["Very Weak","Weak","Fair","Strong","Very Strong"];
  const colors = ["bg-destructive","bg-destructive/70","bg-yellow-500","bg-secondary","bg-secondary"];
  const entropy = password.length > 0 ? (Math.log2(Math.pow((/[a-z]/.test(password)?26:0)+(/[A-Z]/.test(password)?26:0)+(/\d/.test(password)?10:0)+(/[^a-zA-Z0-9]/.test(password)?33:0)||1,password.length))).toFixed(1) : "0";
  const generatePassword = () => { const chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-="; let pw=""; const arr=new Uint32Array(16); crypto.getRandomValues(arr); for(let i=0;i<16;i++)pw+=chars[arr[i]%chars.length]; setPassword(pw); };
  return (
    <div className="space-y-4">
      <div className="flex gap-2"><Input type="text" placeholder="Enter password to check..." value={password} onChange={e=>setPassword(e.target.value)} className="font-mono" /><Button variant="outline" size="sm" onClick={generatePassword} className="shrink-0">Generate</Button></div>
      {password && (<div className="space-y-4"><div className="flex gap-1">{Array.from({length:5}).map((_,i)=>(<div key={i} className={`h-2.5 flex-1 rounded-full transition-all ${i<strength?colors[strength-1]:"bg-muted"}`}/>))}</div><div className="flex items-center justify-between"><p className="text-sm font-bold text-foreground">{labels[strength-1]||"Too Short"}</p><Badge variant={strength>=4?"default":strength>=3?"secondary":"destructive"}>{getCrackTime(password)} to crack</Badge></div><div className="grid grid-cols-2 gap-3 text-sm"><div className="bg-muted/50 rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Length</span><p className="font-bold text-foreground">{password.length} characters</p></div><div className="bg-muted/50 rounded-lg p-3 border"><span className="text-xs text-muted-foreground">Entropy</span><p className="font-bold text-foreground">{entropy} bits</p></div></div><ul className="text-sm space-y-1.5">{[[password.length>=8,"At least 8 characters"],[password.length>=12,"At least 12 characters (recommended)"],[/[a-z]/.test(password)&&/[A-Z]/.test(password),"Mixed case letters"],[/\d/.test(password),"Contains numbers"],[/[^a-zA-Z0-9]/.test(password),"Contains special characters"]].map(([pass,label],i)=>(<li key={i} className={`flex items-center gap-2 ${pass?"text-secondary":"text-muted-foreground"}`}>{pass?<CheckCircle2 className="h-4 w-4"/>:<span className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 inline-block"/>}{label as string}</li>))}</ul></div>)}
      <p className="text-xs text-muted-foreground flex items-center gap-1"><Info className="h-3 w-3" /> This check runs entirely in your browser. No data is sent anywhere.</p>
    </div>
  );
};

const toolComponentMap: Record<string, React.ComponentType> = {
  "regex-tester": RegexTester,
  "password-checker": PasswordChecker,
  "prompt-templates": PromptTemplates,
  "seo-meta-generator": SeoMetaGenerator,
  "blog-post-generator": BlogPostGenerator,
  "code-generator": CodeSnippetGenerator,
  "vuln-explainer": VulnExplainer,
  "cloud-arch-helper": CloudArchHelper,
  "smart-contract-auditor": SmartContractAuditor,
  "code-explainer": CodeExplainer,
  "keyword-cluster-generator": KeywordClusterGenerator,
  "viral-topic-finder": ViralTopicFinder,
  "serp-calculator": SerpCalculator,
  "seo-tag-generator": SeoTagGenerator,
  "slug-optimizer": SlugOptimizer,
  "blog-title-generator": BlogTitleGenerator,
  "content-seo-analyzer": ContentSeoAnalyzer,
  "cyber-risk-scanner": CyberRiskScanner,
  "saas-revenue-calculator": SaasRevenueCalculator,
  "meta-description-generator": MetaDescriptionGenerator,
  "blog-outline-generator": BlogOutlineGenerator,
  "keyword-difficulty-checker": KeywordDifficultyChecker,
  "backlink-finder": BacklinkOpportunityFinder,
  "serp-snippet-preview": SerpSnippetPreview,
  "faq-generator": FaqGenerator,
  "internal-linking-tool": InternalLinkingSuggester,
  "content-gap-analyzer": ContentGapAnalyzer,
  "readability-analyzer": ReadabilityAnalyzer,
  "keyword-intent-classifier": KeywordIntentClassifier,
  "content-rewriter": ContentRewriter,
  "schema-markup-generator": SchemaMarkupGenerator,
  "robots-txt-generator": RobotsTxtGenerator,
  "sitemap-generator": SitemapGeneratorTool,
  "website-speed-analyzer": WebsiteSpeedAnalyzer,
  "js-minifier": JsMinifierFormatter,
  "json-formatter": JsonFormatter,
  "markdown-to-html": MarkdownToHtml,
  "code-beautifier": CodeBeautifier,
  "ai-content-detector": AiContentDetector,
  "plagiarism-checker": PlagiarismChecker,
  "domain-authority-checker": DomainAuthorityChecker,
  "bulk-keyword-generator": BulkKeywordGenerator,
  "google-trends-visualizer": GoogleTrendsVisualizer,
  "ai-prompt-generator": AiPromptGenerator,
  "ai-prompt-library": AiPromptLibrary,
  "security-header-checker": SecurityHeaderChecker,
  "whois-lookup": WhoisLookup,
  "dns-lookup": DnsLookup,
  "ssl-checker": SslChecker,
  "uptime-checker": UptimeChecker,
  "ip-lookup": IpLookup,
  "subdomain-finder": SubdomainFinder,
  "cloud-cost-calculator": CloudCostCalculator,
  "dockerfile-generator": DockerfileGenerator,
  "kubernetes-yaml-generator": KubernetesYamlGenerator,
  "api-endpoint-tester": ApiEndpointTester,
  "sql-query-formatter": SqlQueryFormatter,
  "log-analyzer": LogAnalyzer,
  "code-complexity-analyzer": CodeComplexityAnalyzer,
  "api-rate-limit-tester": ApiRateLimitTester,
  "coding-interview-generator": CodingInterviewGenerator,
  "web-tech-detector": WebTechDetector,
  "ai-agents-explorer": AiAgentsExplorer,
  "ai-cyber-defense": AiCyberDefense,
  "ai-malware-detector": AiMalwareDetector,
  "ai-prompt-engineer": AiPromptEngineer,
  "ai-code-templates": AiCodeGenerator,
  "ai-content-automation": AiContentAutomation,
  "ai-video-generator": AiVideoGenerator,
  "ai-saas-automation": AiSaasAutomation,
  "ai-research-assistant": AiResearchAssistant,
  "ai-dev-copilot": AiDevCopilot,
  "viral-topic-generator": ViralTopicGenerator,
  "ai-research-summarizer": AiResearchSummarizer,
  "ai-saas-idea-generator": AiSaasIdeaGenerator,
  "ai-startup-idea-generator": AiStartupIdeaGenerator,
  "ai-code-security-scanner": AiCodeSecurityScanner,
  "ai-model-comparison": AiModelComparison,
  "ai-workflow-builder": AiWorkflowBuilder,
};

const ToolPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = tools.find(t => t.slug === slug);

  if (!tool) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Tool Not Found</h1>
          <Link to="/tools"><Button variant="outline">Back to Tools</Button></Link>
        </div>
      </Layout>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied!" });
  };

  const ToolComponent = toolComponentMap[tool.slug];

  return (
    <Layout>
      <SEO
        title={tool.name}
        description={tool.description}
        canonical={`/tools/${tool.slug}`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: tool.name, path: `/tools/${tool.slug}` },
        ]}
        softwareAppJsonLd={{
          name: tool.name,
          description: tool.description,
          category: tool.category,
          url: `https://codesecai.com/tools/${tool.slug}`,
        }}
      />
      <div className="container py-12 max-w-3xl mx-auto">
        <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </Link>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tool.icon}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{tool.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                {tool.isClientOnly && <Badge variant="outline" className="text-xs text-secondary border-secondary/30">🔒 Client-side only</Badge>}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleShare} className="text-muted-foreground hover:text-foreground">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-muted-foreground mb-8">{tool.description}</p>

        <div className="bg-card border rounded-xl p-6">
          {ToolComponent ? <ToolComponent /> : null}
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-bold text-foreground mb-4">More Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tools.filter(t => t.id !== tool.id && t.category === tool.category).slice(0, 4).map(t => (
              <Link key={t.id} to={`/tools/${t.slug}`} className="flex items-center gap-3 p-3 bg-card border rounded-lg hover:border-primary/30 transition-all group">
                <span className="text-xl">{t.icon}</span>
                <div>
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ToolPage;
