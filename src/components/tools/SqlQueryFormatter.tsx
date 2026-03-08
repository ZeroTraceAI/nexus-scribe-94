import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const keywords = ["SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "FULL JOIN", "CROSS JOIN", "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "AS", "DISTINCT", "UNION", "UNION ALL", "CASE", "WHEN", "THEN", "ELSE", "END", "IN", "NOT IN", "EXISTS", "NOT EXISTS", "BETWEEN", "LIKE", "IS NULL", "IS NOT NULL", "ASC", "DESC", "WITH"];

const formatSql = (sql: string): string => {
  let formatted = sql.trim();
  // Uppercase keywords
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
    formatted = formatted.replace(regex, kw);
  });

  // Add newlines before major clauses
  const majorClauses = ["SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "FULL JOIN", "CROSS JOIN", "ON", "AND", "OR", "SET", "VALUES", "UNION", "UNION ALL", "WITH"];
  majorClauses.forEach(clause => {
    const regex = new RegExp(`\\s+${clause.replace(/ /g, "\\s+")}\\b`, "gi");
    formatted = formatted.replace(regex, `\n${clause}`);
  });

  // Indent sub-clauses
  const lines = formatted.split("\n").map(line => {
    const trimmed = line.trim();
    if (["AND", "OR", "ON"].some(k => trimmed.startsWith(k + " "))) return "  " + trimmed;
    if (["LEFT", "RIGHT", "INNER", "OUTER", "FULL", "CROSS"].some(k => trimmed.startsWith(k))) return "  " + trimmed;
    return trimmed;
  });

  return lines.filter(l => l.trim()).join("\n");
};

const minifySql = (sql: string): string => {
  return sql.replace(/\s+/g, " ").replace(/\s*,\s*/g, ",").replace(/\s*\(\s*/g, "(").replace(/\s*\)\s*/g, ")").trim();
};

const SqlQueryFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"format" | "minify">("format");

  const process = () => {
    if (!input.trim()) return;
    setOutput(mode === "format" ? formatSql(input) : minifySql(input));
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste your SQL query here..." value={input} onChange={e => setInput(e.target.value)} rows={8} className="font-mono text-sm" />
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {(["format", "minify"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${mode === m ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}>
              {m === "format" ? "Format" : "Minify"}
            </button>
          ))}
        </div>
        <Button onClick={process} disabled={!input.trim()} className="ml-auto">{mode === "format" ? "Format SQL" : "Minify SQL"}</Button>
      </div>

      {output && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{mode === "format" ? "Formatted" : "Minified"}</Badge>
              {mode === "minify" && (
                <span className="text-xs text-muted-foreground">
                  {input.length} → {output.length} chars ({Math.round((1 - output.length / input.length) * 100)}% smaller)
                </span>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "SQL copied!" }); }}>Copy</Button>
          </div>
          <pre className="bg-muted/50 border rounded-xl p-4 text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default SqlQueryFormatter;
