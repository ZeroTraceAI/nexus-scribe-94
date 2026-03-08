import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-csharp";

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
  // Go
  { id: "go1", title: "HTTP Server with Middleware", language: "Go", pattern: "API", code: `package main\n\nimport (\n\t"fmt"\n\t"log"\n\t"net/http"\n\t"time"\n)\n\nfunc logging(next http.Handler) http.Handler {\n\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\tstart := time.Now()\n\t\tnext.ServeHTTP(w, r)\n\t\tlog.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))\n\t})\n}\n\nfunc recovery(next http.Handler) http.Handler {\n\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\tdefer func() {\n\t\t\tif err := recover(); err != nil {\n\t\t\t\thttp.Error(w, "Internal Server Error", 500)\n\t\t\t\tlog.Printf("panic: %v", err)\n\t\t\t}\n\t\t}()\n\t\tnext.ServeHTTP(w, r)\n\t})\n}\n\nfunc main() {\n\tmux := http.NewServeMux()\n\tmux.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintf(w, "Hello, World!")\n\t})\n\n\thandler := recovery(logging(mux))\n\tlog.Println("Server starting on :8080")\n\tlog.Fatal(http.ListenAndServe(":8080", handler))\n}`, explanation: "Idiomatic Go HTTP server with chainable middleware for logging and panic recovery. Uses the standard library only — no frameworks needed." },
  { id: "go2", title: "Worker Pool Pattern", language: "Go", pattern: "Concurrency", code: `package main\n\nimport (\n\t"fmt"\n\t"sync"\n)\n\nfunc worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {\n\tdefer wg.Done()\n\tfor job := range jobs {\n\t\tfmt.Printf("Worker %d processing job %d\\n", id, job)\n\t\tresults <- job * 2 // simulate work\n\t}\n}\n\nfunc main() {\n\tconst numWorkers = 3\n\tconst numJobs = 10\n\n\tjobs := make(chan int, numJobs)\n\tresults := make(chan int, numJobs)\n\tvar wg sync.WaitGroup\n\n\tfor w := 1; w <= numWorkers; w++ {\n\t\twg.Add(1)\n\t\tgo worker(w, jobs, results, &wg)\n\t}\n\n\tfor j := 1; j <= numJobs; j++ {\n\t\tjobs <- j\n\t}\n\tclose(jobs)\n\n\tgo func() { wg.Wait(); close(results) }()\n\n\tfor r := range results {\n\t\tfmt.Println("Result:", r)\n\t}\n}`, explanation: "Classic Go concurrency pattern using goroutines, channels, and WaitGroup to process jobs in parallel with a fixed number of workers." },
  { id: "go3", title: "Error Wrapping & Handling", language: "Go", pattern: "Utility", code: `package main\n\nimport (\n\t"errors"\n\t"fmt"\n)\n\ntype NotFoundError struct {\n\tResource string\n\tID       string\n}\n\nfunc (e *NotFoundError) Error() string {\n\treturn fmt.Sprintf("%s with ID %s not found", e.Resource, e.ID)\n}\n\nfunc findUser(id string) (string, error) {\n\tif id != "123" {\n\t\treturn "", &NotFoundError{Resource: "User", ID: id}\n\t}\n\treturn "Alice", nil\n}\n\nfunc getProfile(id string) (string, error) {\n\tname, err := findUser(id)\n\tif err != nil {\n\t\treturn "", fmt.Errorf("getProfile: %w", err)\n\t}\n\treturn fmt.Sprintf("Profile: %s", name), nil\n}\n\nfunc main() {\n\t_, err := getProfile("456")\n\tif err != nil {\n\t\tvar nf *NotFoundError\n\t\tif errors.As(err, &nf) {\n\t\t\tfmt.Printf("Not found: %s %s\\n", nf.Resource, nf.ID)\n\t\t} else {\n\t\t\tfmt.Println("Error:", err)\n\t\t}\n\t}\n}`, explanation: "Idiomatic Go error handling with custom error types, error wrapping with %w, and unwrapping with errors.As() for type-safe error inspection." },
  // Rust
  { id: "rs1", title: "Result & Error Handling", language: "Rust", pattern: "Utility", code: `use std::fmt;\nuse std::num::ParseIntError;\n\n#[derive(Debug)]\nenum AppError {\n    NotFound(String),\n    ParseError(ParseIntError),\n    Custom(String),\n}\n\nimpl fmt::Display for AppError {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        match self {\n            AppError::NotFound(id) => write!(f, "Resource '{}' not found", id),\n            AppError::ParseError(e) => write!(f, "Parse error: {}", e),\n            AppError::Custom(msg) => write!(f, "{}", msg),\n        }\n    }\n}\n\nimpl From<ParseIntError> for AppError {\n    fn from(e: ParseIntError) -> Self {\n        AppError::ParseError(e)\n    }\n}\n\nfn parse_and_double(input: &str) -> Result<i64, AppError> {\n    let num: i64 = input.parse()?; // auto-converts via From\n    if num < 0 {\n        return Err(AppError::Custom("Negative numbers not allowed".into()));\n    }\n    Ok(num * 2)\n}\n\nfn main() {\n    match parse_and_double("42") {\n        Ok(val) => println!("Result: {}", val),\n        Err(e) => eprintln!("Error: {}", e),\n    }\n}`, explanation: "Rust error handling with custom enum errors, Display trait, From trait for automatic conversion, and the ? operator for ergonomic propagation." },
  { id: "rs2", title: "Iterator Chain & Closures", language: "Rust", pattern: "Utility", code: `fn main() {\n    let words = vec!["hello", "world", "rust", "is", "fast", "and", "safe"];\n\n    // Filter, transform, collect\n    let result: Vec<String> = words.iter()\n        .filter(|w| w.len() > 3)\n        .map(|w| w.to_uppercase())\n        .collect();\n    println!("Long words: {:?}", result);\n    // ["HELLO", "WORLD", "RUST", "FAST", "SAFE"]\n\n    // Fold (reduce)\n    let total_len: usize = words.iter()\n        .map(|w| w.len())\n        .fold(0, |acc, len| acc + len);\n    println!("Total chars: {}", total_len);\n\n    // Enumerate + for_each\n    words.iter()\n        .enumerate()\n        .for_each(|(i, w)| println!("{}: {}", i, w));\n\n    // Chained with find\n    let first_long = words.iter()\n        .find(|w| w.len() >= 5)\n        .unwrap_or(&"none");\n    println!("First long word: {}", first_long);\n}`, explanation: "Demonstrates Rust's zero-cost iterator abstractions: filter, map, collect, fold, enumerate, find — all lazily evaluated and optimized by the compiler." },
  { id: "rs3", title: "Struct with Traits & Impl", language: "Rust", pattern: "Design Pattern", code: `use std::fmt;\n\ntrait Summary {\n    fn summarize(&self) -> String;\n    fn preview(&self) -> String {\n        format!("{}...", &self.summarize()[..20.min(self.summarize().len())])\n    }\n}\n\n#[derive(Debug, Clone)]\nstruct Article {\n    title: String,\n    author: String,\n    content: String,\n}\n\nimpl Article {\n    fn new(title: &str, author: &str, content: &str) -> Self {\n        Self {\n            title: title.to_string(),\n            author: author.to_string(),\n            content: content.to_string(),\n        }\n    }\n\n    fn word_count(&self) -> usize {\n        self.content.split_whitespace().count()\n    }\n}\n\nimpl Summary for Article {\n    fn summarize(&self) -> String {\n        format!("{} by {} ({} words)", self.title, self.author, self.word_count())\n    }\n}\n\nimpl fmt::Display for Article {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, "[{}] {} - {} words", self.author, self.title, self.word_count())\n    }\n}\n\nfn print_summary(item: &impl Summary) {\n    println!("Summary: {}", item.summarize());\n}\n\nfn main() {\n    let article = Article::new("Rust Guide", "Alice", "Rust is a systems programming language");\n    println!("{}", article);\n    print_summary(&article);\n}`, explanation: "Rust struct with method implementations, trait definition with default methods, Display trait, and trait bounds for generic functions." },
  // C#
  { id: "cs1", title: "Async/Await with HttpClient", language: "C#", pattern: "API", code: `using System.Net.Http.Json;\n\npublic record User(int Id, string Name, string Email);\n\npublic class ApiClient : IDisposable\n{\n    private readonly HttpClient _client;\n\n    public ApiClient(string baseUrl)\n    {\n        _client = new HttpClient { BaseAddress = new Uri(baseUrl) };\n        _client.DefaultRequestHeaders.Add("Accept", "application/json");\n    }\n\n    public async Task<User?> GetUserAsync(int id, CancellationToken ct = default)\n    {\n        try\n        {\n            return await _client.GetFromJsonAsync<User>($"/users/{id}", ct);\n        }\n        catch (HttpRequestException ex)\n        {\n            Console.WriteLine($"Request failed: {ex.Message}");\n            return null;\n        }\n    }\n\n    public async Task<bool> CreateUserAsync(User user, CancellationToken ct = default)\n    {\n        var response = await _client.PostAsJsonAsync("/users", user, ct);\n        return response.IsSuccessStatusCode;\n    }\n\n    public void Dispose() => _client.Dispose();\n}\n\n// Usage:\n// using var api = new ApiClient("https://api.example.com");\n// var user = await api.GetUserAsync(1);`, explanation: "Modern C# HTTP client with async/await, System.Net.Http.Json for automatic serialization, CancellationToken support, and IDisposable for proper cleanup." },
  { id: "cs2", title: "LINQ Query Patterns", language: "C#", pattern: "Utility", code: `using System;\nusing System.Linq;\nusing System.Collections.Generic;\n\npublic record Product(string Name, string Category, decimal Price, int Stock);\n\nvar products = new List<Product>\n{\n    new("Laptop", "Electronics", 999.99m, 50),\n    new("Mouse", "Electronics", 29.99m, 200),\n    new("Desk", "Furniture", 249.99m, 30),\n    new("Chair", "Furniture", 199.99m, 45),\n    new("Monitor", "Electronics", 399.99m, 75),\n};\n\n// Filter + Order\nvar expensive = products\n    .Where(p => p.Price > 100)\n    .OrderByDescending(p => p.Price)\n    .Select(p => new { p.Name, p.Price });\n\n// Group by category\nvar byCategory = products\n    .GroupBy(p => p.Category)\n    .Select(g => new\n    {\n        Category = g.Key,\n        Count = g.Count(),\n        AvgPrice = g.Average(p => p.Price),\n        TotalStock = g.Sum(p => p.Stock)\n    });\n\n// Aggregate\nvar summary = new\n{\n    Total = products.Sum(p => p.Price * p.Stock),\n    MostExpensive = products.MaxBy(p => p.Price)?.Name,\n    InStock = products.Count(p => p.Stock > 0)\n};`, explanation: "Common LINQ patterns: filtering with Where, ordering, projecting with Select, grouping with GroupBy, and aggregation methods like Sum, Average, MaxBy." },
  { id: "cs3", title: "Generic Repository Pattern", language: "C#", pattern: "Design Pattern", code: `public interface IRepository<T> where T : class\n{\n    Task<T?> GetByIdAsync(int id);\n    Task<IEnumerable<T>> GetAllAsync();\n    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);\n    Task AddAsync(T entity);\n    Task UpdateAsync(T entity);\n    Task DeleteAsync(int id);\n}\n\npublic class Repository<T> : IRepository<T> where T : class\n{\n    private readonly DbContext _context;\n    private readonly DbSet<T> _dbSet;\n\n    public Repository(DbContext context)\n    {\n        _context = context;\n        _dbSet = context.Set<T>();\n    }\n\n    public async Task<T?> GetByIdAsync(int id)\n        => await _dbSet.FindAsync(id);\n\n    public async Task<IEnumerable<T>> GetAllAsync()\n        => await _dbSet.ToListAsync();\n\n    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)\n        => await _dbSet.Where(predicate).ToListAsync();\n\n    public async Task AddAsync(T entity)\n    {\n        await _dbSet.AddAsync(entity);\n        await _context.SaveChangesAsync();\n    }\n\n    public async Task UpdateAsync(T entity)\n    {\n        _dbSet.Update(entity);\n        await _context.SaveChangesAsync();\n    }\n\n    public async Task DeleteAsync(int id)\n    {\n        var entity = await GetByIdAsync(id);\n        if (entity != null)\n        {\n            _dbSet.Remove(entity);\n            await _context.SaveChangesAsync();\n        }\n    }\n}\n\n// Usage with DI:\n// services.AddScoped(typeof(IRepository<>), typeof(Repository<>));`, explanation: "Generic repository pattern with Entity Framework Core. Provides CRUD operations with async support, expression-based queries, and works with dependency injection." },
];

const languages = ["All", ...Array.from(new Set(snippets.map(s => s.language)))];
const patterns = ["All", ...Array.from(new Set(snippets.map(s => s.pattern)))];

const langToPrism: Record<string, string> = {
  "JavaScript": "javascript",
  "TypeScript": "typescript",
  "React/TypeScript": "tsx",
  "Python": "python",
  "SQL": "sql",
  "Bash": "bash",
  "Go": "go",
  "Rust": "rust",
  "C#": "csharp",
};

const HighlightedCode = ({ code, language }: { code: string; language: string }) => {
  const codeRef = useRef<HTMLElement>(null);
  const prismLang = langToPrism[language] || "javascript";

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, prismLang]);

  return (
    <pre className="text-xs rounded-lg overflow-auto max-h-72 !bg-[#1d1f21]">
      <code ref={codeRef} className={`language-${prismLang}`}>
        {code}
      </code>
    </pre>
  );
};

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
            <div className="mx-4 mb-3 rounded-lg overflow-hidden">
              <HighlightedCode code={s.code} language={s.language} />
            </div>
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
