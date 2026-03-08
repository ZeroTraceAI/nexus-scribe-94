import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  language: string;
  category: string;
  description: string;
  code: string;
  tags: string[];
}

const templates: Template[] = [
  { id: "1", name: "REST API Server", language: "TypeScript", category: "Backend", description: "Express.js REST API with middleware, error handling, and CORS", code: `import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Middleware
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Routes
app.get('/api/items', asyncHandler(async (req: any, res: any) => {
  const items = []; // fetch from DB
  res.json({ data: items, count: items.length });
}));

app.post('/api/items', asyncHandler(async (req: any, res: any) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const item = { id: Date.now(), name, description };
  res.status(201).json({ data: item });
}));

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000, () => console.log('Server running on :3000'));`, tags: ["express", "api", "rest", "node"] },
  { id: "2", name: "React Custom Hook", language: "TypeScript", category: "Frontend", description: "Reusable data fetching hook with caching, loading, and error states", code: `import { useState, useEffect, useCallback, useRef } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(url: string, options?: RequestInit): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController>();

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { ...options, signal: abortRef.current.signal });
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { fetchData(); return () => abortRef.current?.abort(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export default useFetch;`, tags: ["react", "hooks", "fetch", "typescript"] },
  { id: "3", name: "Auth Middleware", language: "TypeScript", category: "Security", description: "JWT authentication middleware with role-based access control", code: `import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  roles: string[];
}

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...roles: string[]) => (req: any, res: any, next: any) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (!roles.some(role => req.user.roles.includes(role))) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

// Usage: app.get('/admin', authenticate, authorize('admin'), handler);`, tags: ["jwt", "auth", "middleware", "rbac"] },
  { id: "4", name: "Database Repository", language: "TypeScript", category: "Backend", description: "Type-safe repository pattern with CRUD operations", code: `interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Repository<T extends Entity> {
  findAll(filters?: Partial<T>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

class BaseRepository<T extends Entity> implements Repository<T> {
  constructor(private tableName: string, private db: any) {}

  async findAll(filters?: Partial<T>): Promise<T[]> {
    let query = this.db(this.tableName);
    if (filters) query = query.where(filters);
    return query.select('*');
  }

  async findById(id: string): Promise<T | null> {
    return this.db(this.tableName).where({ id }).first();
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const now = new Date();
    const [record] = await this.db(this.tableName)
      .insert({ ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now })
      .returning('*');
    return record;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const [record] = await this.db(this.tableName)
      .where({ id })
      .update({ ...data, updatedAt: new Date() })
      .returning('*');
    return record;
  }

  async delete(id: string): Promise<boolean> {
    const count = await this.db(this.tableName).where({ id }).del();
    return count > 0;
  }
}

export default BaseRepository;`, tags: ["database", "repository", "crud", "pattern"] },
  { id: "5", name: "Rate Limiter", language: "TypeScript", category: "Security", description: "Token bucket rate limiter with sliding window", code: `class RateLimiter {
  private buckets = new Map<string, { tokens: number; lastRefill: number }>();

  constructor(
    private maxTokens: number = 100,
    private refillRate: number = 10, // tokens per second
    private windowMs: number = 60000
  ) {}

  isAllowed(key: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = { tokens: this.maxTokens, lastRefill: now };
      this.buckets.set(key, bucket);
    }

    // Refill tokens
    const elapsed = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(this.maxTokens, bucket.tokens + elapsed * this.refillRate);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return { allowed: true, remaining: Math.floor(bucket.tokens), resetIn: 0 };
    }

    const resetIn = Math.ceil((1 - bucket.tokens) / this.refillRate * 1000);
    return { allowed: false, remaining: 0, resetIn };
  }

  // Express middleware
  middleware() {
    return (req: any, res: any, next: any) => {
      const key = req.ip || req.headers['x-forwarded-for'];
      const result = this.isAllowed(key);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      if (!result.allowed) {
        res.setHeader('Retry-After', Math.ceil(result.resetIn / 1000));
        return res.status(429).json({ error: 'Too many requests', retryIn: result.resetIn });
      }
      next();
    };
  }
}

export default RateLimiter;`, tags: ["rate-limit", "security", "middleware", "token-bucket"] },
  { id: "6", name: "WebSocket Server", language: "TypeScript", category: "Backend", description: "Real-time WebSocket server with rooms and broadcasting", code: `import { WebSocketServer, WebSocket } from 'ws';

interface Client { ws: WebSocket; id: string; rooms: Set<string>; }

class RealtimeServer {
  private clients = new Map<string, Client>();
  private rooms = new Map<string, Set<string>>();

  constructor(port: number) {
    const wss = new WebSocketServer({ port });
    wss.on('connection', (ws) => this.onConnect(ws));
    console.log(\`WebSocket server on :\${port}\`);
  }

  private onConnect(ws: WebSocket) {
    const id = crypto.randomUUID();
    const client: Client = { ws, id, rooms: new Set() };
    this.clients.set(id, client);
    this.send(ws, { type: 'connected', id });

    ws.on('message', (raw) => {
      const msg = JSON.parse(raw.toString());
      switch (msg.type) {
        case 'join': this.joinRoom(id, msg.room); break;
        case 'leave': this.leaveRoom(id, msg.room); break;
        case 'broadcast': this.broadcast(msg.room, { type: 'message', from: id, data: msg.data }, id); break;
      }
    });

    ws.on('close', () => {
      client.rooms.forEach(room => this.leaveRoom(id, room));
      this.clients.delete(id);
    });
  }

  private joinRoom(clientId: string, room: string) {
    if (!this.rooms.has(room)) this.rooms.set(room, new Set());
    this.rooms.get(room)!.add(clientId);
    this.clients.get(clientId)?.rooms.add(room);
  }

  private leaveRoom(clientId: string, room: string) {
    this.rooms.get(room)?.delete(clientId);
    this.clients.get(clientId)?.rooms.delete(room);
  }

  private broadcast(room: string, msg: any, excludeId?: string) {
    this.rooms.get(room)?.forEach(id => {
      if (id !== excludeId) {
        const client = this.clients.get(id);
        if (client?.ws.readyState === WebSocket.OPEN) this.send(client.ws, msg);
      }
    });
  }

  private send(ws: WebSocket, data: any) { ws.send(JSON.stringify(data)); }
}

new RealtimeServer(8080);`, tags: ["websocket", "realtime", "rooms", "broadcast"] },
];

const AiCodeGenerator = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const categories = [...new Set(templates.map(t => t.category))];
  const filtered = templates.filter(t => {
    const matchCat = !selectedCategory || t.category === selectedCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q));
    return matchCat && matchSearch;
  });

  const copyCode = (code: string) => { navigator.clipboard.writeText(code); toast({ title: "Code copied!" }); };

  return (
    <div className="space-y-4">
      <Input placeholder="Search templates (e.g., auth, api, websocket)..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedCategory(null)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${!selectedCategory ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setSelectedCategory(selectedCategory === c ? null : c)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedCategory === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{c}</button>
        ))}
      </div>

      {selectedTemplate ? (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>← Back</Button>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">{selectedTemplate.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{selectedTemplate.language}</Badge>
              <Badge variant="outline">{selectedTemplate.category}</Badge>
            </div>
          </div>
          <div className="relative bg-muted/50 rounded-xl border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted">
              <span className="text-xs font-mono text-muted-foreground">{selectedTemplate.language}</span>
              <Button variant="ghost" size="sm" onClick={() => copyCode(selectedTemplate.code)}>Copy</Button>
            </div>
            <pre className="p-4 text-sm font-mono text-foreground overflow-x-auto whitespace-pre">{selectedTemplate.code}</pre>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedTemplate.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(t => (
            <button key={t.id} onClick={() => setSelectedTemplate(t)} className="text-left bg-muted/50 rounded-xl p-4 border hover:border-primary/40 transition-all group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{t.name}</h3>
                <Badge variant="outline" className="text-xs shrink-0">{t.language}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{t.description}</p>
              <div className="flex flex-wrap gap-1">{t.tags.map(tag => <span key={tag} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{tag}</span>)}</div>
            </button>
          ))}
        </div>
      )}
      {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No templates found.</p>}
    </div>
  );
};

export default AiCodeGenerator;
