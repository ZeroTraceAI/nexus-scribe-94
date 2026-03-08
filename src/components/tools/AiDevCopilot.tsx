import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface ReviewResult {
  score: number;
  issues: { severity: "error" | "warning" | "info"; line: string; message: string; fix: string }[];
  suggestions: string[];
  metrics: { name: string; value: string; status: "good" | "warn" | "bad" }[];
}

const reviewCode = (code: string): ReviewResult => {
  const lines = code.split("\n");
  const issues: ReviewResult["issues"] = [];
  const suggestions: string[] = [];
  let score = 100;

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    const lineRef = `Line ${i + 1}`;

    if (/console\.(log|debug|info)\s*\(/.test(trimmed)) {
      issues.push({ severity: "warning", line: lineRef, message: "Console statement found — remove before production", fix: "Remove or replace with a proper logger" });
      score -= 3;
    }
    if (/var\s+/.test(trimmed)) {
      issues.push({ severity: "warning", line: lineRef, message: "'var' declaration — use 'const' or 'let' instead", fix: `Replace 'var' with 'const' or 'let'` });
      score -= 5;
    }
    if (/==(?!=)/.test(trimmed) && !trimmed.includes("===")) {
      issues.push({ severity: "error", line: lineRef, message: "Loose equality (==) — use strict equality (===)", fix: "Replace == with ===" });
      score -= 5;
    }
    if (/any/.test(trimmed) && /:\s*any/.test(trimmed)) {
      issues.push({ severity: "warning", line: lineRef, message: "TypeScript 'any' type — reduces type safety", fix: "Define a proper interface or use 'unknown'" });
      score -= 3;
    }
    if (trimmed.length > 120) {
      issues.push({ severity: "info", line: lineRef, message: "Line exceeds 120 characters", fix: "Break into multiple lines for readability" });
      score -= 1;
    }
    if (/todo|fixme|hack|xxx/i.test(trimmed)) {
      issues.push({ severity: "info", line: lineRef, message: "TODO/FIXME comment found — address before merge", fix: "Resolve the TODO or create a tracking issue" });
      score -= 2;
    }
    if (/catch\s*\(\s*\w*\s*\)\s*\{?\s*\}/.test(trimmed) || /catch\s*\{/.test(trimmed)) {
      issues.push({ severity: "error", line: lineRef, message: "Empty catch block — errors are silently swallowed", fix: "Add error handling or re-throw" });
      score -= 10;
    }
    if (/password|secret|api.?key|token/i.test(trimmed) && /=\s*['"]/.test(trimmed)) {
      issues.push({ severity: "error", line: lineRef, message: "Potential hardcoded secret detected", fix: "Move to environment variables" });
      score -= 15;
    }
  });

  // General suggestions
  if (lines.length > 100) suggestions.push("Consider splitting into smaller modules (>100 lines)");
  if (!code.includes("try") && code.includes("await")) suggestions.push("Add try-catch blocks around async operations");
  if (!code.includes("interface") && !code.includes("type ") && code.includes(": ")) suggestions.push("Define explicit TypeScript interfaces for better type safety");
  if (code.includes("function") && !code.includes("/**")) suggestions.push("Add JSDoc comments to document public functions");
  if (!code.includes("test") && !code.includes("spec")) suggestions.push("Add unit tests for this module");

  const metrics: ReviewResult["metrics"] = [
    { name: "Lines of Code", value: lines.length.toString(), status: lines.length > 200 ? "warn" : "good" },
    { name: "Issues Found", value: issues.length.toString(), status: issues.length > 5 ? "bad" : issues.length > 0 ? "warn" : "good" },
    { name: "Error Count", value: issues.filter(i => i.severity === "error").length.toString(), status: issues.some(i => i.severity === "error") ? "bad" : "good" },
    { name: "Complexity", value: (code.match(/if|for|while|switch|catch|\?\?|\?\.|\&\&|\|\|/g) || []).length.toString(), status: (code.match(/if|for|while|switch/g) || []).length > 15 ? "bad" : "good" },
  ];

  return { score: Math.max(0, score), issues, suggestions, metrics };
};

const AiDevCopilot = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ReviewResult | null>(null);

  const handleReview = () => {
    if (!code.trim()) { toast({ title: "Paste code to review" }); return; }
    setResult(reviewCode(code));
  };

  const exportReview = () => {
    if (!result) return;
    const md = `# Code Review Report\n\nScore: ${result.score}/100\n\n## Issues\n${result.issues.map(i => `- [${i.severity.toUpperCase()}] ${i.line}: ${i.message}\n  Fix: ${i.fix}`).join("\n")}\n\n## Suggestions\n${result.suggestions.map(s => `- ${s}`).join("\n")}`;
    navigator.clipboard.writeText(md);
    toast({ title: "Review exported!" });
  };

  const scoreColor = (s: number) => s >= 80 ? "text-green-500" : s >= 60 ? "text-yellow-500" : "text-destructive";
  const sevIcon = (s: string) => s === "error" ? "🔴" : s === "warning" ? "🟡" : "🔵";

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste your code here for AI-powered review..." value={code} onChange={e => setCode(e.target.value)} rows={10} className="font-mono text-sm" />
      <Button onClick={handleReview} className="w-full">Run Code Review</Button>

      {result && (
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-xl p-6 border text-center">
            <p className={`text-5xl font-bold ${scoreColor(result.score)}`}>{result.score}</p>
            <p className="text-sm text-muted-foreground mt-1">Code Quality Score</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {result.metrics.map((m, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3 border text-center">
                <p className="text-xs text-muted-foreground">{m.name}</p>
                <p className={`text-lg font-bold ${m.status === "good" ? "text-green-500" : m.status === "warn" ? "text-yellow-500" : "text-destructive"}`}>{m.value}</p>
              </div>
            ))}
          </div>

          {result.issues.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Issues</p>
                <Button variant="outline" size="sm" onClick={exportReview}>Export</Button>
              </div>
              <div className="space-y-2">
                {result.issues.map((issue, i) => (
                  <div key={i} className="bg-muted/50 rounded-lg p-3 border">
                    <div className="flex items-start gap-2">
                      <span>{sevIcon(issue.severity)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{issue.line}</span>
                          <span className="text-sm text-foreground">{issue.message}</span>
                        </div>
                        <p className="text-xs text-primary mt-1">💡 {issue.fix}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Suggestions</p>
              <ul className="space-y-1">{result.suggestions.map((s, i) => <li key={i} className="text-sm text-muted-foreground flex items-center gap-2"><span className="text-primary">→</span> {s}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiDevCopilot;
