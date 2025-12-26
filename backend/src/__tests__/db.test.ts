/**
 * Tests for database functions
 */

import { initDb, getDb, checkDbHealth, closeDb } from '../db.js';
import { clearLinksTable, insertTestLink, getLinkFromDb } from './helpers/testDb.js';

describe('Database', () => {
  beforeEach(() => {
    // Ensure database is initialized
    initDb();
    clearLinksTable();
  });

  afterAll(() => {
    closeDb();
  });

  describe('initDb', () => {
    it('should initialize database without errors', () => {
      expect(() => initDb()).not.toThrow();
    });

    it('should create links table', () => {
      const db = getDb();
      const stmt = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='links'"
      );
      const result = stmt.get() as any;
      expect(result).toBeDefined();
      expect(result.name).toBe('links');
    });

    it('should create indexes', () => {
      const db = getDb();
      const stmt = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='links'"
      );
      const indexes = stmt.all() as any[];
      const indexNames = indexes.map((idx) => idx.name);
      expect(indexNames).toContain('idx_slug');
      expect(indexNames).toContain('idx_expires_at');
      expect(indexNames).toContain('idx_created_at');
    });
  });

  describe('getDb', () => {
    it('should return database instance when initialized', () => {
      const db = getDb();
      expect(db).toBeDefined();
    });

    it('should throw error when database is not initialized', () => {
      closeDb();
      expect(() => getDb()).toThrow('Database not initialized');
      initDb(); // Reinitialize for other tests
    });
  });

  describe('checkDbHealth', () => {
    it('should return true when database is healthy', () => {
      expect(checkDbHealth()).toBe(true);
    });

    it('should return false when database is not initialized', () => {
      closeDb();
      expect(checkDbHealth()).toBe(false);
      initDb(); // Reinitialize for other tests
    });
  });

  describe('Database operations', () => {
    it('should insert and retrieve links', () => {
      insertTestLink({ slug: 'test123', url: 'https://example.com' });
      const link = getLinkFromDb('test123') as any;
      expect(link).toBeDefined();
      expect(link.slug).toBe('test123');
      expect(link.url).toBe('https://example.com');
    });

    it('should enforce unique constraint on slug', () => {
      insertTestLink({ slug: 'test123', url: 'https://example.com' });
      expect(() => {
        insertTestLink({ slug: 'test123', url: 'https://example2.com' });
      }).toThrow();
    });

    it('should update link clicks', () => {
      insertTestLink({ slug: 'test123', url: 'https://example.com', clicks: 5 });
      const db = getDb();
      const stmt = db.prepare('UPDATE links SET clicks = clicks + 1 WHERE slug = ?');
      stmt.run('test123');
      const link = getLinkFromDb('test123') as any;
      expect(link.clicks).toBe(6);
    });

    it('should handle expired links', () => {
      const expiredDate = new Date(Date.now() - 1000).toISOString();
      insertTestLink({
        slug: 'test123',
        url: 'https://example.com',
        expires_at: expiredDate,
      });
      const db = getDb();
      // Use julianday for reliable date comparison across different formats
      const stmt = db.prepare(
        "SELECT * FROM links WHERE slug = ? AND (expires_at IS NULL OR julianday(expires_at) > julianday('now'))"
      );
      const link = stmt.get('test123');
      expect(link).toBeUndefined();
    });
  });
});

