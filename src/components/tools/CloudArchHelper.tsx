import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Copy, Cloud } from "lucide-react";

const appTypes = ["Web Application", "REST API", "Mobile Backend", "Data Pipeline", "E-commerce", "Real-time Chat", "IoT Platform", "ML/AI Service"];
const scaleOptions = ["Small (< 1K users)", "Medium (1K–100K users)", "Large (100K–1M users)", "Enterprise (1M+ users)"];
const priorities = ["Low cost", "High availability", "Low latency", "Easy to manage", "Security-first"];

interface ArchRecommendation {
  tier: string;
  services: { name: string; purpose: string; alternative: string }[];
  notes: string[];
  estimatedCost: string;
}

const generateArchitecture = (appType: string, scale: string, selectedPriorities: string[]): ArchRecommendation => {
  const isSmall = scale.includes("Small");
  const isMedium = scale.includes("Medium");
  const isLarge = scale.includes("Large") && !scale.includes("Enterprise");
  const isEnterprise = scale.includes("Enterprise");
  const wantsCheap = selectedPriorities.includes("Low cost");
  const wantsHA = selectedPriorities.includes("High availability");
  const wantsSecurity = selectedPriorities.includes("Security-first");

  const services: { name: string; purpose: string; alternative: string }[] = [];
  const notes: string[] = [];

  // Compute
  if (isSmall || wantsCheap) {
    services.push({ name: "AWS Lambda / Cloud Functions", purpose: "Serverless compute — pay per invocation, zero idle cost", alternative: "Vercel Functions, Cloudflare Workers" });
  } else if (isMedium) {
    services.push({ name: "AWS ECS Fargate / Cloud Run", purpose: "Container-based compute with auto-scaling, no server management", alternative: "AWS App Runner, Azure Container Apps" });
  } else {
    services.push({ name: "Kubernetes (EKS / GKE)", purpose: "Full container orchestration for microservices at scale", alternative: "AWS ECS, Azure AKS" });
  }

  // Database
  if (appType === "Real-time Chat" || appType === "IoT Platform") {
    services.push({ name: "Redis / ElastiCache", purpose: "In-memory data store for real-time messaging and pub/sub", alternative: "AWS MemoryDB, Upstash Redis" });
    services.push({ name: "DynamoDB / Firestore", purpose: "NoSQL database for high-throughput, low-latency reads/writes", alternative: "MongoDB Atlas, ScyllaDB" });
  } else if (appType === "Data Pipeline" || appType === "ML/AI Service") {
    services.push({ name: "PostgreSQL (RDS / Cloud SQL)", purpose: "Relational database for structured data and analytics", alternative: "Supabase, PlanetScale, Neon" });
    services.push({ name: "S3 / Cloud Storage", purpose: "Object storage for large datasets, models, and artifacts", alternative: "MinIO, Backblaze B2" });
  } else {
    services.push({ name: isSmall ? "Supabase / PlanetScale" : "PostgreSQL (RDS / Aurora)", purpose: "Managed relational database with connection pooling", alternative: "Neon, CockroachDB, AlloyDB" });
  }

  // CDN / Edge
  services.push({ name: "CloudFront / Cloudflare CDN", purpose: "Global content delivery, DDoS protection, edge caching", alternative: "Fastly, Vercel Edge Network" });

  // Storage
  if (["Web Application", "E-commerce", "Mobile Backend"].includes(appType)) {
    services.push({ name: "S3 / Cloud Storage", purpose: "File uploads, static assets, and media storage", alternative: "Cloudflare R2 (no egress fees), Backblaze B2" });
  }

  // Auth
  services.push({ name: isSmall ? "Supabase Auth / Clerk" : "AWS Cognito / Auth0", purpose: "User authentication with SSO, MFA, and social login support", alternative: "Firebase Auth, Keycloak (self-hosted)" });

  // Monitoring
  services.push({ name: isSmall ? "Sentry + Uptime Robot" : "Datadog / New Relic", purpose: "Application monitoring, error tracking, and alerting", alternative: "Grafana Cloud, AWS CloudWatch" });

  // Queues (for larger apps)
  if (isLarge || isEnterprise || appType === "Data Pipeline") {
    services.push({ name: "SQS / Pub/Sub / Kafka", purpose: "Message queue for async processing and event-driven architecture", alternative: "RabbitMQ, Redis Streams, NATS" });
  }

  // Security additions
  if (wantsSecurity) {
    services.push({ name: "AWS WAF / Cloudflare WAF", purpose: "Web Application Firewall for OWASP Top 10 protection", alternative: "ModSecurity, Imperva" });
    services.push({ name: "AWS Secrets Manager / Vault", purpose: "Centralized secrets management with rotation", alternative: "Doppler, Infisical" });
    notes.push("Enable encryption at rest and in transit for all services.");
    notes.push("Implement least-privilege IAM policies and service roles.");
    notes.push("Set up VPC with private subnets for database and internal services.");
  }

  if (wantsHA) {
    notes.push("Deploy across multiple availability zones (AZs) for redundancy.");
    notes.push("Implement health checks and auto-scaling policies.");
    notes.push("Use read replicas for database load distribution.");
    notes.push("Set up automated backups with point-in-time recovery.");
  }

  if (wantsCheap) {
    notes.push("Use reserved instances or savings plans for predictable workloads (up to 72% savings).");
    notes.push("Implement auto-scaling to zero during off-peak hours.");
    notes.push("Use Cloudflare R2 instead of S3 to eliminate egress fees.");
    notes.push("Consider spot/preemptible instances for batch processing.");
  }

  notes.push("Use Infrastructure as Code (Terraform, Pulumi, or CDK) for reproducible deployments.");
  notes.push("Implement CI/CD pipeline with staging environment before production.");

  const costMap: Record<string, string> = {
    "Small (< 1K users)": "$0–50/month (serverless + managed services)",
    "Medium (1K–100K users)": "$100–500/month (containers + managed DB)",
    "Large (100K–1M users)": "$500–5,000/month (Kubernetes + auto-scaling)",
    "Enterprise (1M+ users)": "$5,000–50,000+/month (multi-region, HA)",
  };

  return {
    tier: scale,
    services,
    notes,
    estimatedCost: costMap[scale] || "$varies",
  };
};

const CloudArchHelper = () => {
  const [appType, setAppType] = useState("");
  const [scale, setScale] = useState("");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [result, setResult] = useState<ArchRecommendation | null>(null);

  const togglePriority = (p: string) => {
    setSelectedPriorities(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const generate = () => {
    if (!appType || !scale) {
      toast({ title: "Missing fields", description: "Select an app type and scale.", variant: "destructive" });
      return;
    }
    setResult(generateArchitecture(appType, scale, selectedPriorities));
  };

  const copyResult = () => {
    if (!result) return;
    let text = `Cloud Architecture for: ${appType} (${scale})\n\n`;
    text += `Services:\n`;
    result.services.forEach(s => { text += `- ${s.name}: ${s.purpose}\n  Alternative: ${s.alternative}\n`; });
    text += `\nNotes:\n`;
    result.notes.forEach(n => { text += `- ${n}\n`; });
    text += `\nEstimated Cost: ${result.estimatedCost}\n`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">What are you building? *</label>
        <div className="flex flex-wrap gap-2">
          {appTypes.map(t => (
            <Button key={t} size="sm" variant={appType === t ? "default" : "outline"} onClick={() => setAppType(t)}>{t}</Button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Expected scale *</label>
        <div className="flex flex-wrap gap-2">
          {scaleOptions.map(s => (
            <Button key={s} size="sm" variant={scale === s ? "default" : "outline"} onClick={() => setScale(s)}>{s}</Button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Priorities (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {priorities.map(p => (
            <Button key={p} size="sm" variant={selectedPriorities.includes(p) ? "default" : "outline"} onClick={() => togglePriority(p)}>{p}</Button>
          ))}
        </div>
      </div>

      <Button onClick={generate} className="w-full">Generate Architecture Recommendation</Button>

      {result && (
        <div className="bg-card border rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">{appType} Architecture</h3>
            </div>
            <Button size="sm" variant="outline" onClick={copyResult}><Copy className="h-3.5 w-3.5 mr-1" /> Copy</Button>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Recommended Services</p>
            {result.services.map((s, i) => (
              <div key={i} className="bg-muted rounded-lg p-4">
                <p className="font-semibold text-foreground text-sm">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.purpose}</p>
                <p className="text-xs text-muted-foreground mt-1">Alternative: {s.alternative}</p>
              </div>
            ))}
          </div>

          {result.notes.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Architecture Notes</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                {result.notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>
          )}

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-medium text-foreground">Estimated Monthly Cost</p>
            <p className="text-sm text-muted-foreground">{result.estimatedCost}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudArchHelper;
