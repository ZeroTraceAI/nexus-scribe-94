import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const KubernetesYamlGenerator = () => {
  const [appName, setAppName] = useState("my-app");
  const [image, setImage] = useState("nginx:latest");
  const [replicas, setReplicas] = useState("3");
  const [port, setPort] = useState("80");
  const [resource, setResource] = useState("Deployment");
  const [hpa, setHpa] = useState(false);
  const [ingress, setIngress] = useState(false);
  const [yaml, setYaml] = useState("");

  const generate = () => {
    const parts: string[] = [];
    const name = appName.toLowerCase().replace(/[^a-z0-9-]/g, "-");

    if (resource === "Deployment" || resource === "All") {
      parts.push(`apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${name}
  labels:
    app: ${name}
spec:
  replicas: ${replicas}
  selector:
    matchLabels:
      app: ${name}
  template:
    metadata:
      labels:
        app: ${name}
    spec:
      containers:
        - name: ${name}
          image: ${image}
          ports:
            - containerPort: ${port}
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          livenessProbe:
            httpGet:
              path: /health
              port: ${port}
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /ready
              port: ${port}
            initialDelaySeconds: 5
            periodSeconds: 10`);
    }

    if (resource === "Service" || resource === "All") {
      parts.push(`apiVersion: v1
kind: Service
metadata:
  name: ${name}-svc
spec:
  selector:
    app: ${name}
  ports:
    - protocol: TCP
      port: 80
      targetPort: ${port}
  type: ClusterIP`);
    }

    if (hpa || resource === "All") {
      parts.push(`apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${name}-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${name}
  minReplicas: ${replicas}
  maxReplicas: ${parseInt(replicas) * 3}
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70`);
    }

    if (ingress || resource === "All") {
      parts.push(`apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${name}-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: ${name}.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ${name}-svc
                port:
                  number: 80`);
    }

    setYaml(parts.join("\n---\n"));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><p className="text-xs text-muted-foreground mb-1">App Name</p><Input value={appName} onChange={e => setAppName(e.target.value)} /></div>
        <div><p className="text-xs text-muted-foreground mb-1">Container Image</p><Input value={image} onChange={e => setImage(e.target.value)} /></div>
        <div><p className="text-xs text-muted-foreground mb-1">Replicas</p><Input type="number" value={replicas} onChange={e => setReplicas(e.target.value)} min="1" /></div>
        <div><p className="text-xs text-muted-foreground mb-1">Container Port</p><Input type="number" value={port} onChange={e => setPort(e.target.value)} /></div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-1">Resource Type</p>
        <Select value={resource} onValueChange={setResource}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {["Deployment", "Service", "All"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2"><Switch checked={hpa} onCheckedChange={setHpa} /><Label className="text-sm">Auto-scaling (HPA)</Label></div>
        <div className="flex items-center gap-2"><Switch checked={ingress} onCheckedChange={setIngress} /><Label className="text-sm">Ingress</Label></div>
      </div>

      <Button onClick={generate}>Generate YAML</Button>

      {yaml && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">Kubernetes YAML</Badge>
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(yaml); toast({ title: "YAML copied!" }); }}>Copy</Button>
          </div>
          <pre className="bg-muted/50 border rounded-xl p-4 text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto max-h-[500px] overflow-y-auto">{yaml}</pre>
        </div>
      )}
    </div>
  );
};

export default KubernetesYamlGenerator;
