/**
 * Test setup file
 * Runs before all tests
 */

import { initDb, closeDb, getDb } from '../db.js';
import fs from 'fs';
import path from 'path';

// Setup test database before all tests
beforeAll(async () => {
  // Use test database
  process.env.DB_PATH = './data/test';
  
  // Ensure test data directory exists
  const testDbDir = path.resolve(process.cwd(), 'data', 'test');
  if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
  }
  
  // Delete existing test database to ensure clean schema
  const testDbPath = path.join(testDbDir, 'linksnap.db');
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
  
  initDb();
});

// Clean up after all tests
afterAll(async () => {
  closeDb();
  
  // Clean up test database file
  const testDbPath = path.resolve(process.cwd(), 'data', 'test', 'linksnap.db');
  if (fs.existsSync(testDbPath)) {
    try {
      fs.unlinkSync(testDbPath);
    } catch (error) {
      // Ignore errors during cleanup
    }
  }
});

// Clear database between tests
beforeEach(() => {
  // Database cleanup is handled in individual test files
});

