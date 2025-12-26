import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { logger } from "./utils/logger.js";

// Get database directory path
// Avoid import.meta.url to prevent Jest parsing issues
// Use process.cwd() which works in both Jest and production environments
const getDbDir = (): string => {
  // If DB_PATH is explicitly set, use it (relative to process.cwd())
  if (process.env.DB_PATH) {
    return path.resolve(process.cwd(), process.env.DB_PATH);
  }

  // Check if we're in Jest environment (Jest sets JEST_WORKER_ID)
  const isJest =
    typeof process !== "undefined" && process.env.JEST_WORKER_ID !== undefined;

  if (isJest) {
    // Jest environment - process.cwd() is typically the backend directory
    // Default to ./data relative to backend directory
    return path.resolve(process.cwd(), "data");
  } else {
    // Production environment - process.cwd() should be the backend directory
    // Default to ./data relative to backend directory
    return path.resolve(process.cwd(), "data");
  }
};

const dbDir = getDbDir();
const dbPath = path.join(dbDir, "linksnap.db");

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Database instance
let dbInstance: Database.Database | null = null;
let initialized = false;

/**
 * Initialize database connection and run migrations
 */
export function initDb(): void {
  if (initialized && dbInstance) {
    return;
  }

  // Create database connection with optimizations
  dbInstance = new Database(dbPath, {
    verbose: process.env.NODE_ENV === "development" 
      ? (message?: unknown, ...additionalArgs: unknown[]) => {
          const sql = typeof message === "string" ? message : String(message);
          logger.debug({ sql, args: additionalArgs }, "SQL query");
        }
      : undefined,
  });

  // Enable WAL mode for better concurrency
  dbInstance.pragma("journal_mode = WAL");

  // Optimize for performance
  dbInstance.pragma("synchronous = NORMAL");
  dbInstance.pragma("cache_size = 10000");
  dbInstance.pragma("foreign_keys = ON");
  dbInstance.pragma("temp_store = MEMORY");

  // Create tables if they don't exist
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      url TEXT NOT NULL,
      clicks INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `);

  // Check for missing columns and add them (migration)
  const tableInfo = dbInstance.prepare("PRAGMA table_info(links)").all() as Array<{ name: string }>;
  const columnNames = tableInfo.map(col => col.name);
  
  if (!columnNames.includes('expires_at')) {
    dbInstance.exec(`ALTER TABLE links ADD COLUMN expires_at DATETIME;`);
  }
  
  if (!columnNames.includes('is_active')) {
    dbInstance.exec(`ALTER TABLE links ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1;`);
  }

  // Create indexes (only if they don't exist)
  dbInstance.exec(`
    CREATE INDEX IF NOT EXISTS idx_slug ON links(slug);
    CREATE INDEX IF NOT EXISTS idx_expires_at ON links(expires_at);
    CREATE INDEX IF NOT EXISTS idx_created_at ON links(created_at);
  `);

  initialized = true;
}

/**
 * Get database instance
 * Throws error if database is not initialized
 */
export function getDb(): Database.Database {
  if (!dbInstance || !initialized) {
    throw new Error("Database not initialized. Call initDb() first.");
  }
  return dbInstance;
}

/**
 * Check database health by performing a simple query
 * @returns true if database is healthy, false otherwise
 */
export function checkDbHealth(): boolean {
  try {
    if (!dbInstance || !initialized) {
      return false;
    }
    // Simple query to check database connectivity
    const stmt = dbInstance.prepare("SELECT 1");
    stmt.get();
    return true;
  } catch {
    return false;
  }
}

/**
 * Close database connection gracefully
 */
export function closeDb(): void {
  if (dbInstance) {
    try {
      dbInstance.close();
    } catch (error) {
      logger.error({ err: error, context: "Database" }, "Error closing database");
    } finally {
      dbInstance = null;
      initialized = false;
    }
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  closeDb();
  process.exit(0);
});

process.on("SIGTERM", () => {
  closeDb();
  process.exit(0);
});

// Export default for backward compatibility
const db = {
  prepare: (sql: string): Database.Statement => getDb().prepare(sql),
  exec: (sql: string): Database.Database => getDb().exec(sql),
  transaction: <T>(fn: () => T): T => {
    return getDb().transaction(fn)();
  },
  get isInitialized(): boolean {
    return initialized;
  },
};

export default db;
