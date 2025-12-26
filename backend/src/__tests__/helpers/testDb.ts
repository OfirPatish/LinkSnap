/**
 * Test database helpers
 */

import db from '../../db.js';

/**
 * Clear all data from the links table
 */
export const clearLinksTable = (): void => {
  const stmt = db.prepare('DELETE FROM links');
  stmt.run();
};

/**
 * Insert a test link directly into the database
 */
export const insertTestLink = (params: {
  slug: string;
  url: string;
  clicks?: number;
  is_active?: number;
  expires_at?: string | null;
}): void => {
  const { slug, url, clicks = 0, is_active = 1, expires_at = null } = params;
  const stmt = db.prepare(`
    INSERT INTO links (slug, url, clicks, is_active, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(slug, url, clicks, is_active, expires_at);
};

/**
 * Get a link from the database
 */
export const getLinkFromDb = (slug: string) => {
  const stmt = db.prepare('SELECT * FROM links WHERE slug = ?');
  return stmt.get(slug);
};

/**
 * Get all links from the database
 */
export const getAllLinksFromDb = () => {
  const stmt = db.prepare('SELECT * FROM links');
  return stmt.all();
};

