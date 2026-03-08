import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const CodeComplexityAnalyzer = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<null | {
    cyclomaticComplexity: number;
    linesOfCode: number;
    functions: number;
    maxNesting: number;
    avgFunctionLength: number;
    maintainabilityIndex: number;
    grade: string;
    issues: { message: string; severity: string; line?: number }[];
  }>(null);

  const analyze = () => {
    if (!code.trim()) return;
    const lines = code.split("\n");
    const loc = lines.filter(l => l.trim() && !l.trim().startsWith("//") && !l.trim().startsWith("/*") && !l.trim().startsWith("*")).length;

    // Cyclomatic complexity estimation
    const branchKeywords = /\b(if|else if|elif|case|for|while|do|catch|&&|\|\||\?)\b/g;
    const branches = (code.match(branchKeywords) || []).length;
    const cyclomatic = branches + 1;

    // Function count
    const funcPatterns = /\b(function|const\s+\w+\s*=\s*\(|def |fn |func |public\s+\w+\s*\(|private\s+\w+\s*\(|=>\s*\{)/g;
    const functions = (code.match(funcPatterns) || []).length || 1;

    // Max nesting depth
    let maxNesting = 0;
    let currentNesting = 0;
    for (const char of code) {
      if (char === "{") { currentNesting++; maxNesting = Math.max(maxNesting, currentNesting); }
      if (char === "}") currentNesting = Math.max(0, currentNesting - 1);
    }

    const avgFunctionLength = Math.round(loc / functions);
    const maintainabilityIndex = Math.max(0, Math.min(100, Math.round(171 - 5.2 * Math.log(cyclomatic) - 0.23 * loc - 16.2 * Math.log(maxNesting + 1))));
    const grade = maintainabilityIndex >= 80 ? "A" : maintainabilityIndex >= 60 ? "B" : maintainabilityIndex >= 40 ? "C" : "D";

    const issues: { message: string; severity: string; line?: number }[] = [];
    if (cyclomatic > 10) issues.push({ message: `High cyclomatic complexity (${cyclomatic}). Consider breaking into smaller functions.`, severity: "High" });
    if (maxNesting > 4) issues.push({ message: `Deep nesting detected (${maxNesting} levels). Use early returns or extract methods.`, severity: "High" });
    if (avgFunctionLength > 30) issues.push({ message: `Long functions (avg ${avgFunctionLength} lines). Keep functions under 20 lines.`, severity: "Medium" });
    if (loc > 200) issues.push({ message: `Large file (${loc} lines). Consider splitting into modules.`, severity: "Medium" });

    lines.forEach((line, i) => {
      if (line.length > 120) issues.push({ message: `Line ${i + 1} exceeds 120 characters (${line.length})`, severity: "Low", line: i + 1 });
    });

    const todoCount = (code.match(/TODO|FIXME|HACK|XXX/gi) || []).length;
    if (todoCount > 0) issues.push({ message: `${todoCount} TODO/FIXME comments found. Address technical debt.`, severity: "Low" });

    setResult({ cyclomaticComplexity: cyclomatic, linesOfCode: loc, functions, maxNesting, avgFunctionLength, maintainabilityIndex, grade, issues: issues.slice(0, 10) });
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste your code here to analyze complexity..." value={code} onChange={e => setCode(e.target.value)} rows={10} className="font-mono text-sm" />
      <Button onClick={analyze} disabled={!code.trim()}>Analyze Complexity</Button>

      {result && (
        <div className="space-y-6 mt-4">
          <div className="text-center p-6 bg-muted/50 border rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Maintainability Index</p>
            <p className="text-4xl font-bold text-primary">{result.maintainabilityIndex}</p>
            <Badge variant="secondary" className="mt-2">{result.grade} Grade</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Cyclomatic Complexity", value: result.cyclomaticComplexity, max: 20 },
              { label: "Lines of Code", value: result.linesOfCode, max: 300 },
              { label: "Functions", value: result.functions, max: 20 },
              { label: "Max Nesting", value: result.maxNesting, max: 6 },
            ].map((m, i) => (
              <div key={i} className="bg-muted/50 border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className={`text-xl font-bold ${m.value > m.max ? "text-destructive" : "text-foreground"}`}>{m.value}</p>
                <Progress value={Math.min(100, (m.value / m.max) * 100)} className="h-1 mt-1" />
              </div>
            ))}
          </div>

          {result.issues.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Issues ({result.issues.length})</h3>
              <div className="space-y-2">
                {result.issues.map((issue, i) => (
                  <div key={i} className="flex items-start justify-between p-3 rounded-lg border bg-muted/30">
                    <span className="text-sm text-foreground flex-1">{issue.message}</span>
                    <Badge variant={issue.severity === "High" ? "destructive" : issue.severity === "Medium" ? "secondary" : "outline"} className="text-xs shrink-0 ml-2">{issue.severity}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeComplexityAnalyzer;
