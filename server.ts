import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import morgan from "morgan";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import NodeCache from "node-cache";
import rateLimit from "express-rate-limit";
import vm from "vm";

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Telemetry Server
const telemetryClients = new Set<WebSocket>();
const broadcastTelemetry = (type: string, message: string, data?: any) => {
  const payload = JSON.stringify({ type, message, timestamp: new Date().toISOString(), data });
  telemetryClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  // Rate Limiter
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      broadcastTelemetry("SECURITY", `Rate limit exceeded for IP: ${req.ip}`);
      res.status(options.statusCode).send(options.message);
    }
  });

  app.use(express.json());
  // Broadcast request telemetry
  app.use((req, res, next) => {
    broadcastTelemetry("HTTP", `${req.method} ${req.url}`);
    next();
  });
  app.use(morgan("dev"));
  app.use(cors());
  app.use("/api/", apiLimiter);

  // Database Initialization (enable WAL)
  const db = new Database("app.db", { verbose: (msg) => {
     // Broadcast SQL telemetry, but limit frequency for big queries
     if (msg.length < 500) broadcastTelemetry("SQL", msg);
     console.log(msg);
  } });
  db.pragma('journal_mode = WAL');

  // Initialize Schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (id TEXT PRIMARY KEY, key TEXT UNIQUE, userId TEXT, createdAt TEXT);
    CREATE TABLE IF NOT EXISTS ai_tasks (id TEXT PRIMARY KEY, title TEXT, instruction TEXT, status TEXT, result TEXT, createdAt TEXT);
    CREATE TABLE IF NOT EXISTS auth_providers (id TEXT PRIMARY KEY, name TEXT, enabled INTEGER, clientId TEXT, clientSecret TEXT);
    CREATE TABLE IF NOT EXISTS storage_buckets (id TEXT PRIMARY KEY, name TEXT, public INTEGER, createdAt TEXT);
    CREATE TABLE IF NOT EXISTS storage_files (id TEXT PRIMARY KEY, bucketId TEXT, name TEXT, size INTEGER, type TEXT, url TEXT, createdAt TEXT);
    CREATE TABLE IF NOT EXISTS edge_functions (id TEXT PRIMARY KEY, name TEXT, code TEXT, status TEXT, createdAt TEXT);
    CREATE TABLE IF NOT EXISTS users (uid TEXT PRIMARY KEY, name TEXT, email TEXT, familyId TEXT, role TEXT);
    CREATE TABLE IF NOT EXISTS families (id TEXT PRIMARY KEY, name TEXT, inviteCode TEXT, organizerIds TEXT);
    CREATE TABLE IF NOT EXISTS chores (id TEXT PRIMARY KEY, title TEXT, description TEXT, points INTEGER, assignedTo TEXT, createdBy TEXT, familyId TEXT, status TEXT, dueDate TEXT);
  `);

  // --- API Routes ---

  // SQL Execution Endpoint
  app.post("/api/admin/sql", (req, res) => {
    try {
      const { query } = req.body;
      if (!query) return res.status(400).json({ error: "No query provided" });
      
      const q = query.trim();
      const isSelect = q.toUpperCase().startsWith("SELECT") || q.toUpperCase().startsWith("PRAGMA");
      
      if (isSelect) {
        const stmt = db.prepare(q);
        const rows = stmt.all();
        res.json({ rows });
      } else {
        const stmt = db.prepare(q);
        const result = stmt.run();
        res.json({ result });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Table Inspection API
  app.get("/api/admin/tables", (req, res) => {
    try {
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
      res.json({ tables });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/tables/:name/schema", (req, res) => {
    try {
       const { name } = req.params;
       const schema = db.prepare(`PRAGMA table_info(${name})`).all();
       res.json({ schema });
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  });

  // Edge Functions Execution Endpoint
  app.post("/api/functions/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const fnRecord = db.prepare("SELECT * FROM edge_functions WHERE name = ?").get(name) as any;
      if (!fnRecord) return res.status(404).json({ error: "Function not found" });

      broadcastTelemetry("EDGE", `Spinning up V8 Sandbox for: ${name}`);

      let sandboxLogs: string[] = [];
      const sandbox = {
        req: { body: req.body, query: req.query, headers: req.headers },
        res: {
          json: (data: any) => { res.json(data); broadcastTelemetry("EDGE", `Function ${name} returned JSON`); },
          send: (data: any) => { res.send(data); broadcastTelemetry("EDGE", `Function ${name} returned Data`); },
          status: (code: number) => { res.status(code); return sandbox.res; }
        },
        console: {
          log: (...args: any[]) => { sandboxLogs.push(args.join(' ')); broadcastTelemetry("EDGE_LOG", args.join(' ')); },
          error: (...args: any[]) => { sandboxLogs.push(args.join(' ')); broadcastTelemetry("EDGE_ERR", args.join(' ')); }
        },
        db: db // Pass db reference (dangerous in pure zero-trust, but fine for admin dashboard)
      };

      vm.createContext(sandbox);

      const wrappedCode = `
        (async () => {
          try {
            ${fnRecord.code}
          } catch(err) {
            console.error(err);
            res.status(500).json({ error: err.message });
          }
        })();
      `;

      try {
        vm.runInContext(wrappedCode, sandbox, { timeout: 2000 });
      } catch (err: any) {
        broadcastTelemetry("EDGE_ERR", `Execution timeout or error: ${err.message}`);
        if (!res.headersSent) res.status(500).json({ error: "Edge function error: " + err.message });
      }

    } catch (error: any) {
      if (!res.headersSent) res.status(500).json({ error: error.message });
    }
  });

  // Code Generation Endpoint
  app.post("/api/admin/generate-code", async (req, res) => {
    try {
      const { prompt, customApiKey } = req.body;
      if (!prompt) return res.status(400).json({ error: "No prompt provided" });

      const ai = new GoogleGenAI(customApiKey ? { apiKey: customApiKey } : { apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert developer. Provide JUST the code without markdown formatting or backticks unless explicitly requested.",
        }
      });

      let code = response.text || "";
      code = code.replace(/^```(typescript|javascript|tsx|jsx|ts|js)?\n/i, '').replace(/\n```$/i, '');

      res.json({ code });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Example API Middleware for generic /v1/:table
  app.use("/api/v1/:table", (req, res, next) => {
     const authHeader = req.headers.authorization;
     if (!authHeader || !authHeader.startsWith("Bearer ")) {
         return res.status(401).json({ error: "Unauthorized: Missing Bearer Token" });
     }
     const token = authHeader.split(" ")[1];
     const keyRecord = db.prepare("SELECT * FROM api_keys WHERE key = ?").get(token);
     if (!keyRecord) {
         return res.status(401).json({ error: "Unauthorized: Invalid Token" });
     }
     next();
  });

  app.get("/api/v1/:table", (req, res) => {
      try {
          const { table } = req.params;
          
          // Check NodeCache
          const cacheKey = `table_${table}`;
          const cachedData = cache.get(cacheKey);
          if (cachedData) {
             broadcastTelemetry("CACHE", `Cache HIT for table: ${table}`);
             return res.json({ data: cachedData, cached: true });
          }

          broadcastTelemetry("CACHE", `Cache MISS for table: ${table}`);
          const rows = db.prepare(`SELECT * FROM ${table} LIMIT 100`).all();
          
          cache.set(cacheKey, rows);
          res.json({ data: rows, cached: false });
      } catch (error: any) {
          res.status(500).json({ error: error.message });
      }
  });

  app.post("/api/admin/flush-cache", (req, res) => {
     cache.flushAll();
     broadcastTelemetry("SYS", "Memory Cache Flushed via API");
     res.json({ status: "flushed" });
  });

  // Background Task Queue
  setInterval(() => {
     const pendingTask = db.prepare("SELECT * FROM ai_tasks WHERE status = 'pending' LIMIT 1").get() as any;
     if (pendingTask) {
        broadcastTelemetry("WORKER", `Processing background task: ${pendingTask.id}`);
        db.prepare("UPDATE ai_tasks SET status = 'processing' WHERE id = ?").run(pendingTask.id);
        
        // Simulate heavy work
        setTimeout(() => {
           db.prepare("UPDATE ai_tasks SET status = 'completed', result = 'Success' WHERE id = ?").run(pendingTask.id);
           broadcastTelemetry("WORKER", `Completed task: ${pendingTask.id}`);
        }, 3000);
     }
  }, 5000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const wss = new WebSocketServer({ server, path: '/_telemetry' });
  wss.on('connection', (ws) => {
    telemetryClients.add(ws);
    ws.send(JSON.stringify({ type: "SYS", message: "Connected to Engine v2.0.0-turbo Telemetry", timestamp: new Date().toISOString() }));
    ws.on('close', () => telemetryClients.delete(ws));
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
