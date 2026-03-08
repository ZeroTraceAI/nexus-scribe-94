import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface LineExplanation {
  line: string;
  explanation: string;
  category: "declaration" | "control" | "operation" | "import" | "comment" | "function" | "return" | "other";
}

const categoryColors: Record<string, string> = {
  declaration: "border-l-blue-500",
  control: "border-l-yellow-500",
  operation: "border-l-green-500",
  import: "border-l-purple-500",
  comment: "border-l-muted",
  function: "border-l-primary",
  return: "border-l-orange-500",
  other: "border-l-muted-foreground",
};

const categoryLabels: Record<string, string> = {
  declaration: "Declaration",
  control: "Control Flow",
  operation: "Operation",
  import: "Import",
  comment: "Comment",
  function: "Function",
  return: "Return",
  other: "Code",
};

const explainLine = (line: string): LineExplanation => {
  const trimmed = line.trim();
  if (!trimmed || trimmed === "{" || trimmed === "}" || trimmed === ");") {
    return { line, explanation: trimmed === "{" ? "Opens a code block." : trimmed === "}" ? "Closes the code block." : "End of statement.", category: "other" };
  }

  // Comments
  if (trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
    return { line, explanation: "A comment — ignored by the compiler/interpreter. Used for documentation and readability.", category: "comment" };
  }

  // Imports
  if (/^(import|from|require|use |using |#include)/.test(trimmed)) {
    const module = trimmed.match(/['"]([^'"]+)['"]/)?.[1] || trimmed.match(/(?:import|from|require)\s+(\S+)/)?.[1] || "a module";
    return { line, explanation: `Imports functionality from ${module}. This makes external code available for use in this file.`, category: "import" };
  }

  // Function declarations
  if (/^(function|def |fn |func |const \w+ = (?:async )?\(|public |private |protected |async function|export (?:default )?function|export const \w+ = )/.test(trimmed)) {
    const name = trimmed.match(/(?:function|def|fn|func)\s+(\w+)/)?.[1] || trimmed.match(/(?:const|let|var)\s+(\w+)/)?.[1] || "anonymous";
    const isAsync = /async/.test(trimmed);
    return { line, explanation: `Defines ${isAsync ? "an asynchronous " : ""}function called "${name}". ${isAsync ? "It can use 'await' for non-blocking operations. " : ""}Functions are reusable blocks of code that perform a specific task.`, category: "function" };
  }

  // Variable declarations
  if (/^(const|let|var|int|string|bool|uint|address|mapping|struct|enum|type |interface )/.test(trimmed)) {
    const keyword = trimmed.match(/^(\w+)/)?.[1];
    const varName = trimmed.match(/(?:const|let|var|int|string|bool|uint\d*|address)\s+(\w+)/)?.[1];
    const isConst = keyword === "const";
    if (keyword === "interface" || keyword === "type" || keyword === "struct" || keyword === "enum") {
      return { line, explanation: `Defines a ${keyword} — a custom data type that describes the shape/structure of data.`, category: "declaration" };
    }
    return { line, explanation: `Declares ${isConst ? "a constant" : "a"} variable${varName ? ` called "${varName}"` : ""}. ${isConst ? "Constants cannot be reassigned after initialization." : `Using '${keyword}' means the variable ${keyword === "let" ? "can be reassigned" : "is function-scoped"}.`}`, category: "declaration" };
  }

  // Return statements
  if (/^return\b/.test(trimmed)) {
    return { line, explanation: "Returns a value from the function and exits its execution. The calling code receives this value.", category: "return" };
  }

  // Conditionals
  if (/^(if|else if|elif|else|switch|case|when)[\s(]/.test(trimmed) || trimmed === "else {" || trimmed === "else:") {
    return { line, explanation: "A conditional statement — executes the following code block only if the condition evaluates to true. Controls program flow based on runtime values.", category: "control" };
  }

  // Loops
  if (/^(for|while|do|loop|foreach|\.forEach|\.map|\.filter|\.reduce)/.test(trimmed)) {
    return { line, explanation: "A loop — repeats the code block for each iteration. Useful for processing collections of data or repeating operations.", category: "control" };
  }

  // Try/catch
  if (/^(try|catch|except|finally|rescue)/.test(trimmed)) {
    const keyword = trimmed.match(/^(\w+)/)?.[1];
    return { line, explanation: `Error handling: '${keyword}' ${keyword === "try" ? "wraps code that might throw an error" : keyword === "catch" || keyword === "except" ? "handles the error if one occurs" : "runs regardless of whether an error occurred"}.`, category: "control" };
  }

  // Throws / assertions
  if (/^(throw|raise|assert|require\(|revert)/.test(trimmed)) {
    return { line, explanation: "Explicitly throws an error or enforces a condition. If the condition fails, execution stops and an error is propagated.", category: "control" };
  }

  // Await
  if (/await\s/.test(trimmed)) {
    return { line, explanation: "Uses 'await' to pause execution until the asynchronous operation (Promise) completes. This prevents blocking the main thread while waiting for results.", category: "operation" };
  }

  // Console/print/log
  if (/console\.|print\(|println|log\(|fmt\.Print|System\.out/.test(trimmed)) {
    return { line, explanation: "Outputs a message to the console/terminal. Used for debugging, logging, and displaying information during development.", category: "operation" };
  }

  // Event listeners
  if (/addEventListener|\.on\(|\.subscribe|\.listen/.test(trimmed)) {
    return { line, explanation: "Registers an event listener — a callback function that runs when a specific event (click, data received, etc.) occurs.", category: "operation" };
  }

  // Assignments and method calls
  if (/=/.test(trimmed) && !/[=!<>]=/.test(trimmed)) {
    return { line, explanation: "Assigns a value to a variable or property. The right side is evaluated first, then stored in the left side.", category: "operation" };
  }

  // Class
  if (/^(class |abstract class |contract )/.test(trimmed)) {
    return { line, explanation: "Defines a class (or contract in Solidity) — a blueprint for creating objects with shared properties and methods.", category: "declaration" };
  }

  // Decorators
  if (/^@/.test(trimmed)) {
    return { line, explanation: "A decorator — modifies or extends the behavior of the function/class that follows it without changing its source code.", category: "function" };
  }

  // Exports
  if (/^export\s/.test(trimmed)) {
    return { line, explanation: "Exports this value/function/class, making it available for import in other files/modules.", category: "import" };
  }

  return { line, explanation: "Performs an operation. This line executes logic as part of the overall program flow.", category: "operation" };
};

const CodeExplainer = () => {
  const [code, setCode] = useState("");
  const [explanations, setExplanations] = useState<LineExplanation[] | null>(null);

  const explain = () => {
    if (!code.trim()) {
      toast({ title: "Paste some code", description: "Enter code to get explanations.", variant: "destructive" });
      return;
    }
    const lines = code.split("\n");
    const results = lines.map(line => explainLine(line));
    setExplanations(results);
  };

  const copyExplanation = () => {
    if (!explanations) return;
    const text = explanations
      .filter(e => e.line.trim())
      .map((e, i) => `Line ${i + 1}: ${e.line.trim()}\n→ ${e.explanation}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Paste Your Code</label>
        <Textarea
          placeholder={`// Paste any code here...\nfunction greet(name) {\n  const message = "Hello, " + name;\n  console.log(message);\n  return message;\n}`}
          value={code}
          onChange={e => setCode(e.target.value)}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <Button onClick={explain} className="w-full">Explain This Code</Button>

      {explanations && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">Line-by-Line Explanation</h3>
            <Button size="sm" variant="outline" onClick={copyExplanation}><Copy className="h-3.5 w-3.5 mr-1" /> Copy</Button>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm border-l-4 ${categoryColors[key]}`} />
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {explanations.map((e, i) => (
              <div key={i} className={`border-l-4 ${categoryColors[e.category]} pl-4 py-2 hover:bg-muted/50 rounded-r-lg transition-colors`}>
                <code className="text-xs font-mono text-foreground block whitespace-pre">{e.line || " "}</code>
                {e.line.trim() && (
                  <p className="text-xs text-muted-foreground mt-1">→ {e.explanation}</p>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">This tool uses pattern-based analysis to explain common code constructs. Explanations are generalized and may not capture every nuance of your specific code.</p>
        </div>
      )}
    </div>
  );
};

export default CodeExplainer;
