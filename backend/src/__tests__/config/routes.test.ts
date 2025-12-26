/**
 * Tests for route configuration
 */

import request from 'supertest';
import express from 'express';
import { configureRoutes } from '../../config/routes.js';
import { configureMiddleware, configureErrorHandler } from '../../config/index.js';
import { initDb, closeDb } from '../../db.js';
import { clearLinksTable } from '../helpers/testDb.js';

const app = express();

describe('Route Configuration', () => {
  beforeAll(() => {
    process.env.DB_PATH = './data/test';
    initDb();
    configureMiddleware(app);
    configureRoutes(app);
    configureErrorHandler(app);
  });

  beforeEach(() => {
    clearLinksTable();
  });

  afterAll(() => {
    closeDb();
  });

  describe('GET /health', () => {
    it('should return health status when database is connected', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body.status).toBe('ok');
      expect(response.body.database).toBe('connected');
      expect(typeof response.body.uptime).toBe('number');
    });

    it('should return ISO 8601 timestamp', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      const timestamp = response.body.timestamp;
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('path');
      expect(response.body.error).toBe('Not found');
      expect(response.body.path).toBe('/api/nonexistent');
    });
  });
});

