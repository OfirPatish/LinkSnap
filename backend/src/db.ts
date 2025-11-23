import initSqlJs, { Database as SqlJsDatabase } from "sql.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use environment variable for database path, or default to data folder
const dbDir = process.env.DB_PATH || path.join(__dirname, "..", "data");
const dbPath = path.join(dbDir, "linksnap.db");

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Wrapper to provide better-sqlite3-like API
class Database {
  private db: SqlJsDatabase | null = null;
  private initialized = false;
  private saveTimer: NodeJS.Timeout | null = null;
  private pendingWrites = 0;
  private readonly SAVE_INTERVAL = 5000; // Save every 5 seconds
  private readonly MAX_PENDING_WRITES = 10; // Or save after 10 writes

  async init() {
    if (this.initialized) return;

    // Load sql.js - for Node.js, locate WASM file from node_modules
    const SQL = await initSqlJs({
      locateFile: (file: string) => {
        // Try to find sql-wasm.wasm in node_modules
        const wasmPath = path.join(
          __dirname,
          "..",
          "node_modules",
          "sql.js",
          "dist",
          file
        );
        if (fs.existsSync(wasmPath)) {
          return wasmPath;
        }
        // Fallback to default behavior
        return file;
      },
    });

    // Try to load existing database, or create new one
    let buffer: Uint8Array | undefined;
    if (fs.existsSync(dbPath)) {
      buffer = new Uint8Array(fs.readFileSync(dbPath));
    }

    this.db = new SQL.Database(buffer);
    this.initialized = true;

    // Create tables
    this.exec(`
      CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        url TEXT NOT NULL,
        clicks INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_slug ON links(slug);
    `);

    // Save database
    this.save();
  }

  exec(sql: string) {
    if (!this.db) throw new Error("Database not initialized");
    this.db.run(sql);
  }

  prepare(sql: string) {
    if (!this.db) throw new Error("Database not initialized");
    return new Statement(this.db, sql);
  }

  /**
   * Schedule a database save (batched for performance)
   * Saves immediately if too many writes are pending, otherwise schedules a delayed save
   */
  scheduleSave() {
    if (!this.db) return;

    this.pendingWrites++;

    // Save immediately if too many pending writes
    if (this.pendingWrites >= this.MAX_PENDING_WRITES) {
      this.save();
      this.pendingWrites = 0;
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
      }
      return;
    }

    // Otherwise, schedule a save if not already scheduled
    if (!this.saveTimer) {
      this.saveTimer = setTimeout(() => {
        this.save();
        this.pendingWrites = 0;
        this.saveTimer = null;
      }, this.SAVE_INTERVAL);
    }
  }

  /**
   * Force immediate save to disk
   */
  save() {
    if (!this.db) return;
    const data = this.db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }

  close() {
    if (this.db) {
      // Clear any pending save timer
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
      }
      // Force save before closing
      this.save();
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }

  pragma(setting: string) {
    // sql.js doesn't have pragma support like better-sqlite3
    // This is a no-op for compatibility
  }

  get isInitialized(): boolean {
    return this.initialized;
  }
}

class Statement {
  private stmt: any;
  private db: SqlJsDatabase;

  constructor(db: SqlJsDatabase, sql: string) {
    this.db = db;
    this.stmt = db.prepare(sql);
  }

  run(...params: any[]) {
    try {
      this.stmt.bind(params);
      this.stmt.step();
      this.stmt.reset();
      // Schedule save instead of immediate save for better performance
      db.scheduleSave();
    } catch (err: any) {
      this.stmt.reset();
      // Convert sql.js errors to better-sqlite3-like error format
      if (err && err.message && err.message.includes("UNIQUE")) {
        const error: any = new Error(err.message);
        error.code = "SQLITE_CONSTRAINT_UNIQUE";
        throw error;
      }
      throw err;
    }
  }

  get(...params: any[]): any {
    this.stmt.bind(params);
    const result = this.stmt.step() ? this.stmt.getAsObject() : null;
    this.stmt.reset();
    return result;
  }

  all(...params: any[]): any[] {
    this.stmt.bind(params);
    const results: any[] = [];
    while (this.stmt.step()) {
      results.push(this.stmt.getAsObject());
    }
    this.stmt.reset();
    return results;
  }
}

const db = new Database();

// Initialize database - we'll call this at startup
let initPromise: Promise<void> | null = null;

export async function initDb() {
  if (!initPromise) {
    initPromise = db.init();
  }
  await initPromise;
}

/**
 * Check database health by performing a simple query
 * @returns true if database is healthy, false otherwise
 */
export async function checkDbHealth(): Promise<boolean> {
  try {
    if (!db.isInitialized) {
      return false;
    }
    // Simple query to check database connectivity
    const stmt = db.prepare("SELECT 1");
    stmt.get();
    return true;
  } catch {
    return false;
  }
}

// Export the db instance
export default db;
