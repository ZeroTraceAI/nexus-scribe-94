import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Enter regex pattern..." value={pattern} onChange={e => setPattern(e.target.value)} className="font-mono" />
        <Input placeholder="Flags" value={flags} onChange={e => setFlags(e.target.value)} className="w-20 font-mono" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Textarea placeholder="Enter test string..." value={testStr} onChange={e => setTestStr(e.target.value)} rows={5} className="font-mono" />
      {matches.length > 0 && (
        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm font-medium text-foreground mb-2">{matches.length} match{matches.length !== 1 ? "es" : ""} found:</p>
          {matches.map((m, i) => (
            <div key={i} className="text-sm font-mono text-primary bg-primary/10 inline-block rounded px-2 py-0.5 mr-2 mb-1">
              "{m[0]}" <span className="text-muted-foreground">at index {m.index}</span>
            </div>
          ))}
        </div>
      )}
      {pattern && testStr && matches.length === 0 && !error && <p className="text-sm text-muted-foreground">No matches found.</p>}
    </div>
  );
};

const PasswordChecker = () => {
  const [password, setPassword] = useState("");

  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(password);
  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["bg-destructive", "bg-destructive/70", "bg-yellow-500", "bg-secondary", "bg-secondary"];

  return (
    <div className="space-y-4">
      <Input type="text" placeholder="Enter password to check..." value={password} onChange={e => setPassword(e.target.value)} className="font-mono" />
      {password && (
        <div className="space-y-3">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i < strength ? colors[strength - 1] : "bg-muted"}`} />
            ))}
          </div>
          <p className="text-sm font-medium text-foreground">{labels[strength - 1] || "Too Short"}</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>{password.length >= 8 ? "✅" : "❌"} At least 8 characters</li>
            <li>{password.length >= 12 ? "✅" : "❌"} At least 12 characters</li>
            <li>{/[a-z]/.test(password) && /[A-Z]/.test(password) ? "✅" : "❌"} Mixed case letters</li>
            <li>{/\d/.test(password) ? "✅" : "❌"} Contains numbers</li>
            <li>{/[^a-zA-Z0-9]/.test(password) ? "✅" : "❌"} Contains special characters</li>
          </ul>
        </div>
      )}
      <p className="text-xs text-muted-foreground">🔒 This check runs entirely in your browser. No data is sent anywhere.</p>
    </div>
  );
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

  const renderTool = () => {
    switch (tool.slug) {
      case "regex-tester": return <RegexTester />;
      case "password-checker": return <PasswordChecker />;
      case "prompt-templates": return <PromptTemplates />;
      case "seo-meta-generator": return <SeoMetaGenerator />;
      case "blog-post-generator": return <BlogPostGenerator />;
      case "code-generator": return <CodeSnippetGenerator />;
      case "vuln-explainer": return <VulnExplainer />;
      case "cloud-arch-helper": return <CloudArchHelper />;
      case "smart-contract-auditor": return <SmartContractAuditor />;
      case "code-explainer": return <CodeExplainer />;
      default: return null;
    }
  };

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
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{tool.icon}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{tool.name}</h1>
        </div>
        <p className="text-muted-foreground mb-8">{tool.description}</p>
        {renderTool()}
      </div>
    </Layout>
  );
};

export default ToolPage;
