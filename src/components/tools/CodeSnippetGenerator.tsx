import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface Snippet {
  id: string;
  title: string;
  language: string;
  pattern: string;
  code: string;
  explanation: string;
}

const snippets: Snippet[] = [
  // JavaScript/TypeScript
  { id: "js1", title: "Debounce Function", language: "JavaScript", pattern: "Utility", code: `function debounce(fn, delay) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\n// Usage:\nconst handleSearch = debounce((query) => {\n  console.log('Searching:', query);\n}, 300);`, explanation: "Delays execution until the user stops triggering the event. Ideal for search inputs, resize handlers, and scroll events to reduce unnecessary API calls." },
  { id: "js2", title: "Deep Clone Object", language: "JavaScript", pattern: "Utility", code: `function deepClone(obj) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (obj instanceof Date) return new Date(obj);\n  if (obj instanceof Array) return obj.map(item => deepClone(item));\n  const cloned = {};\n  for (const key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      cloned[key] = deepClone(obj[key]);\n    }\n  }\n  return cloned;\n}\n\n// Or use: structuredClone(obj) — native in modern browsers`, explanation: "Creates a true deep copy of an object, handling nested objects, arrays, and Date instances. For modern environments, prefer structuredClone()." },
  { id: "js3", title: "Retry with Exponential Backoff", language: "TypeScript", pattern: "API", code: `async function retry<T>(\n  fn: () => Promise<T>,\n  maxRetries = 3,\n  baseDelay = 1000\n): Promise<T> {\n  for (let attempt = 0; attempt <= maxRetries; attempt++) {\n    try {\n      return await fn();\n    } catch (error) {\n      if (attempt === maxRetries) throw error;\n      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;\n      console.log(\`Retry \${attempt + 1}/\${maxRetries} in \${Math.round(delay)}ms\`);\n      await new Promise(r => setTimeout(r, delay));\n    }\n  }\n  throw new Error('Unreachable');\n}\n\n// Usage:\nconst data = await retry(() => fetch('/api/data').then(r => r.json()));`, explanation: "Retries a failed async operation with increasing delays between attempts plus random jitter. Essential for resilient API calls and external service integrations." },
  { id: "js4", title: "Event Emitter", language: "TypeScript", pattern: "Design Pattern", code: `class EventEmitter<T extends Record<string, any>> {\n  private listeners = new Map<keyof T, Set<Function>>();\n\n  on<K extends keyof T>(event: K, fn: (data: T[K]) => void) {\n    if (!this.listeners.has(event)) this.listeners.set(event, new Set());\n    this.listeners.get(event)!.add(fn);\n    return () => this.listeners.get(event)?.delete(fn);\n  }\n\n  emit<K extends keyof T>(event: K, data: T[K]) {\n    this.listeners.get(event)?.forEach(fn => fn(data));\n  }\n}\n\n// Usage:\ntype Events = { userLogin: { id: string }; error: Error };\nconst bus = new EventEmitter<Events>();\nconst unsub = bus.on('userLogin', (data) => console.log(data.id));\nbus.emit('userLogin', { id: '123' });`, explanation: "Type-safe event emitter (pub/sub pattern) for decoupled communication between components. Returns an unsubscribe function for cleanup." },
  // React
  { id: "r1", title: "Custom useFetch Hook", language: "React/TypeScript", pattern: "Hook", code: `import { useState, useEffect } from 'react';\n\nfunction useFetch<T>(url: string) {\n  const [data, setData] = useState<T | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<Error | null>(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    setLoading(true);\n\n    fetch(url, { signal: controller.signal })\n      .then(res => {\n        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n        return res.json();\n      })\n      .then(setData)\n      .catch(err => {\n        if (err.name !== 'AbortError') setError(err);\n      })\n      .finally(() => setLoading(false));\n\n    return () => controller.abort();\n  }, [url]);\n\n  return { data, loading, error };\n}`, explanation: "Reusable data fetching hook with loading/error states and automatic request cancellation on unmount via AbortController." },
  { id: "r2", title: "useLocalStorage Hook", language: "React/TypeScript", pattern: "Hook", code: `import { useState, useCallback } from 'react';\n\nfunction useLocalStorage<T>(key: string, initialValue: T) {\n  const [storedValue, setStoredValue] = useState<T>(() => {\n    try {\n      const item = localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch {\n      return initialValue;\n    }\n  });\n\n  const setValue = useCallback((value: T | ((val: T) => T)) => {\n    setStoredValue(prev => {\n      const next = value instanceof Function ? value(prev) : value;\n      localStorage.setItem(key, JSON.stringify(next));\n      return next;\n    });\n  }, [key]);\n\n  const remove = useCallback(() => {\n    localStorage.removeItem(key);\n    setStoredValue(initialValue);\n  }, [key, initialValue]);\n\n  return [storedValue, setValue, remove] as const;\n}\n\n// Usage:\nconst [theme, setTheme] = useLocalStorage('theme', 'dark');`, explanation: "Syncs React state with localStorage automatically. Supports lazy initialization, updater functions, and a remove method." },
  // Python
  { id: "p1", title: "Rate Limiter Decorator", language: "Python", pattern: "Utility", code: `import time\nfrom functools import wraps\n\ndef rate_limit(max_calls, period):\n    \"\"\"Decorator to limit function calls to max_calls per period (seconds).\"\"\"\n    calls = []\n    \n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            now = time.time()\n            # Remove expired timestamps\n            while calls and calls[0] < now - period:\n                calls.pop(0)\n            if len(calls) >= max_calls:\n                wait = period - (now - calls[0])\n                raise Exception(f\"Rate limited. Try again in {wait:.1f}s\")\n            calls.append(now)\n            return func(*args, **kwargs)\n        return wrapper\n    return decorator\n\n# Usage:\n@rate_limit(max_calls=5, period=60)\ndef call_api(endpoint):\n    return requests.get(endpoint)`, explanation: "Decorator that enforces rate limiting on any function. Tracks call timestamps and raises an exception when the limit is exceeded within the time window." },
  { id: "p2", title: "Context Manager for Timing", language: "Python", pattern: "Utility", code: `import time\nfrom contextlib import contextmanager\n\n@contextmanager\ndef timer(label=\"Block\"):\n    \"\"\"Context manager to measure execution time.\"\"\"\n    start = time.perf_counter()\n    try:\n        yield\n    finally:\n        elapsed = time.perf_counter() - start\n        print(f\"{label}: {elapsed:.4f}s\")\n\n# Usage:\nwith timer(\"Database query\"):\n    results = db.execute(\"SELECT * FROM users\")\n\nwith timer(\"API call\"):\n    response = requests.get(\"https://api.example.com/data\")`, explanation: "Measures execution time of any code block using Python's context manager protocol. Uses perf_counter for high-resolution timing." },
  // SQL
  { id: "sq1", title: "Pagination Query", language: "SQL", pattern: "Query", code: `-- Offset-based pagination (simple but slow for large offsets)\nSELECT id, title, created_at\nFROM posts\nWHERE status = 'published'\nORDER BY created_at DESC\nLIMIT 20 OFFSET 40; -- Page 3, 20 per page\n\n-- Cursor-based pagination (fast, recommended)\nSELECT id, title, created_at\nFROM posts\nWHERE status = 'published'\n  AND created_at < '2024-01-15T10:30:00Z' -- cursor from last item\nORDER BY created_at DESC\nLIMIT 20;`, explanation: "Two pagination strategies: offset-based (simple but degrades with large datasets) and cursor-based (constant performance, ideal for infinite scroll and APIs)." },
  // Bash
  { id: "b1", title: "Safe Bash Script Template", language: "Bash", pattern: "Template", code: `#!/usr/bin/env bash\nset -euo pipefail\nIFS=$'\\n\\t'\n\n# --- Configuration ---\nreadonly SCRIPT_DIR=\"$(cd \"$(dirname \"\${BASH_SOURCE[0]}\")\" && pwd)\"\nreadonly LOG_FILE=\"/tmp/$(basename \"$0\" .sh).log\"\n\n# --- Functions ---\nlog() { echo \"[$(date '+%Y-%m-%d %H:%M:%S')] $*\" | tee -a \"$LOG_FILE\"; }\nerr() { log \"ERROR: $*\" >&2; exit 1; }\ncleanup() { log \"Cleaning up...\"; }\ntrap cleanup EXIT\n\n# --- Main ---\nmain() {\n  log \"Starting script...\"\n  [[ $# -lt 1 ]] && err \"Usage: $0 <argument>\"\n  \n  local arg=\"$1\"\n  log \"Processing: $arg\"\n  \n  # Your logic here\n  \n  log \"Done!\"\n}\n\nmain \"$@\"`, explanation: "Production-ready Bash template with strict mode (set -euo pipefail), logging, error handling, cleanup trap, and proper argument validation." },
];

const languages = ["All", ...Array.from(new Set(snippets.map(s => s.language)))];
const patterns = ["All", ...Array.from(new Set(snippets.map(s => s.pattern)))];

const CodeSnippetGenerator = () => {
  const [lang, setLang] = useState("All");
  const [pattern, setPattern] = useState("All");

  const filtered = snippets.filter(s => {
    return (lang === "All" || s.language === lang) && (pattern === "All" || s.pattern === pattern);
  });

  const copyCode = (code: string, title: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `"${title}" copied to clipboard.` });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Language</label>
          <div className="flex flex-wrap gap-2">
            {languages.map(l => (
              <Button key={l} size="sm" variant={lang === l ? "default" : "outline"} onClick={() => setLang(l)}>{l}</Button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Pattern</label>
          <div className="flex flex-wrap gap-2">
            {patterns.map(p => (
              <Button key={p} size="sm" variant={pattern === p ? "default" : "outline"} onClick={() => setPattern(p)}>{p}</Button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} snippet{filtered.length !== 1 ? "s" : ""}</p>

      <div className="space-y-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-card border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 pb-2">
              <div>
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{s.language}</span>
                  <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">{s.pattern}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => copyCode(s.code, s.title)}>
                <Copy className="h-3.5 w-3.5 mr-1" /> Copy
              </Button>
            </div>
            <pre className="text-xs font-mono bg-muted mx-4 mb-3 rounded-lg p-4 overflow-auto max-h-72 whitespace-pre-wrap text-muted-foreground">{s.code}</pre>
            <div className="px-4 pb-4">
              <p className="text-sm text-muted-foreground">{s.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeSnippetGenerator;
