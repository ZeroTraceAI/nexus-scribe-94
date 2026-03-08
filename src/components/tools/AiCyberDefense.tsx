import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface ThreatAnalysis {
  threatType: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  description: string;
  aiDefense: string;
  mitigations: string[];
  tools: string[];
}

const threatDatabase: ThreatAnalysis[] = [
  { threatType: "Phishing Attack", severity: "High", description: "AI-crafted spear phishing emails using LLMs to personalize content", aiDefense: "NLP-based email analysis with intent classification and sender behavior anomaly detection", mitigations: ["Deploy AI email gateway filters", "Implement DMARC/DKIM/SPF", "User awareness training with AI-generated simulations", "Real-time URL sandboxing"], tools: ["Microsoft Defender for O365", "Abnormal Security", "Tessian", "Cofense"] },
  { threatType: "Ransomware", severity: "Critical", description: "AI-polymorphic ransomware that mutates to evade signature-based detection", aiDefense: "Behavioral analysis using ML models to detect encryption patterns and file access anomalies", mitigations: ["Deploy EDR with ML-based detection", "Immutable backup strategy", "Network micro-segmentation", "AI-powered deception technology"], tools: ["CrowdStrike Falcon", "SentinelOne", "Darktrace", "Cybereason"] },
  { threatType: "Zero-Day Exploit", severity: "Critical", description: "Previously unknown vulnerabilities exploited before patches are available", aiDefense: "AI-powered fuzzing, binary analysis, and runtime behavior monitoring to detect anomalous execution", mitigations: ["Virtual patching with WAF/RASP", "AI-based vulnerability prediction", "Runtime application self-protection", "Threat intelligence feeds"], tools: ["Palo Alto Cortex", "Qualys", "Tenable", "Google Project Zero"] },
  { threatType: "DDoS Attack", severity: "High", description: "Distributed denial of service using AI-coordinated botnets", aiDefense: "ML traffic classification to distinguish legitimate traffic from attack patterns in real-time", mitigations: ["AI-adaptive rate limiting", "Anycast network distribution", "Bot detection with browser fingerprinting", "Auto-scaling defenses"], tools: ["Cloudflare", "AWS Shield", "Akamai", "Fastly"] },
  { threatType: "Insider Threat", severity: "High", description: "Malicious or negligent insiders exfiltrating sensitive data", aiDefense: "UEBA (User Entity Behavior Analytics) using ML to baseline and detect anomalous user activity", mitigations: ["Implement UEBA platform", "DLP with AI classification", "Zero trust access controls", "Privileged access management"], tools: ["Exabeam", "Securonix", "Microsoft Sentinel", "Varonis"] },
  { threatType: "Supply Chain Attack", severity: "Critical", description: "Compromised dependencies, build tools, or vendor access", aiDefense: "AI-powered SBOM analysis, dependency scanning, and build integrity verification", mitigations: ["Software composition analysis", "Build provenance verification", "Vendor risk scoring with AI", "Code signing enforcement"], tools: ["Snyk", "Socket.dev", "Chainguard", "Sigstore"] },
  { threatType: "API Abuse", severity: "Medium", description: "Automated attacks against APIs: credential stuffing, scraping, injection", aiDefense: "ML-based API behavior analysis with request pattern fingerprinting and anomaly scoring", mitigations: ["AI-powered API gateway", "Adaptive rate limiting", "Bot detection middleware", "Schema validation enforcement"], tools: ["Salt Security", "Noname Security", "42Crunch", "Traceable"] },
  { threatType: "Data Poisoning", severity: "High", description: "Adversarial manipulation of ML training data to corrupt model behavior", aiDefense: "Statistical analysis of training distributions, outlier detection, and data provenance tracking", mitigations: ["Training data validation pipelines", "Federated learning with verification", "Model robustness testing", "Data lineage tracking"], tools: ["IBM ART", "Microsoft Counterfit", "Google Vertex AI", "Robust Intelligence"] },
];

const AiCyberDefense = () => {
  const [scenario, setScenario] = useState("");
  const [results, setResults] = useState<ThreatAnalysis[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const analyze = () => {
    if (!scenario.trim()) { toast({ title: "Please describe a scenario" }); return; }
    const q = scenario.toLowerCase();
    const matched = threatDatabase.filter(t =>
      t.threatType.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.mitigations.some(m => m.toLowerCase().includes(q)) ||
      t.tools.some(tool => tool.toLowerCase().includes(q))
    );
    setResults(matched.length > 0 ? matched : threatDatabase.slice(0, 4));
    setExpanded(null);
  };

  const severityColor = (s: string) => {
    switch (s) { case "Critical": return "destructive"; case "High": return "default"; case "Medium": return "secondary"; default: return "outline"; }
  };

  const exportReport = () => {
    const report = results.map(r => `## ${r.threatType} [${r.severity}]\n${r.description}\n\n**AI Defense:** ${r.aiDefense}\n\n**Mitigations:**\n${r.mitigations.map(m => `- ${m}`).join("\n")}\n\n**Tools:** ${r.tools.join(", ")}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(`# AI Cybersecurity Defense Report\n\nScenario: ${scenario}\n\n${report}`);
    toast({ title: "Report copied to clipboard!" });
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Describe your threat scenario or infrastructure (e.g., 'cloud API handling financial data', 'e-commerce platform', 'ransomware protection')..." value={scenario} onChange={e => setScenario(e.target.value)} rows={3} />
      <Button onClick={analyze} className="w-full">Analyze Threats & AI Defenses</Button>

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{results.length} threat vectors analyzed</p>
            <Button variant="outline" size="sm" onClick={exportReport}>Export Report</Button>
          </div>
          {results.map((threat, i) => (
            <div key={i} className="bg-muted/50 rounded-xl border overflow-hidden">
              <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full text-left p-4 flex items-start justify-between hover:bg-muted/80 transition-colors">
                <div>
                  <h3 className="font-bold text-foreground">{threat.threatType}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{threat.description}</p>
                </div>
                <Badge variant={severityColor(threat.severity)}>{threat.severity}</Badge>
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 space-y-3 border-t pt-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">AI Defense Strategy</p>
                    <p className="text-sm text-foreground bg-card p-3 rounded-lg border">{threat.aiDefense}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Mitigations</p>
                    <ul className="space-y-1">{threat.mitigations.map((m, j) => <li key={j} className="text-sm text-foreground flex items-center gap-2"><span className="text-primary">✓</span> {m}</li>)}</ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Recommended Tools</p>
                    <div className="flex flex-wrap gap-2">{threat.tools.map(t => <Badge key={t} variant="outline">{t}</Badge>)}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiCyberDefense;
