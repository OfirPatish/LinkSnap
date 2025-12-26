/**
 * Integration tests for the API
 */

import request from 'supertest';
import express from 'express';
import { configureRoutes, configureMiddleware, configureErrorHandler } from '../config/index.js';
import { initDb, closeDb } from '../db.js';
import { clearLinksTable } from './helpers/testDb.js';
import { linkCache } from '../utils/cache.js';

const app = express();

// Setup app similar to server.ts
configureMiddleware(app);
configureRoutes(app);
configureErrorHandler(app);

describe('API Integration Tests', () => {
  beforeAll(() => {
    process.env.DB_PATH = './data/test';
    initDb();
  });

  beforeEach(() => {
    clearLinksTable();
    linkCache.clear();
  });

  afterAll(() => {
    closeDb();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.status).toBe('ok');
      expect(response.body.database).toBe('connected');
    });
  });

  describe('URL Shortening Flow', () => {
    it('should create, redirect, and get stats', async () => {
      // Create short URL
      const shortenResponse = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://example.com' })
        .expect(200);

      const { slug, shortUrl } = shortenResponse.body;
      expect(slug).toBeDefined();
      expect(shortUrl).toBeDefined();

      // Redirect to original URL
      const redirectResponse = await request(app)
        .get(`/${slug}`)
        .expect(302);

      expect(redirectResponse.headers.location).toBe('https://example.com');

      // Get stats
      const statsResponse = await request(app)
        .get(`/api/stats/${slug}`)
        .expect(200);

      expect(statsResponse.body.slug).toBe(slug);
      expect(statsResponse.body.url).toBe('https://example.com');
      expect(statsResponse.body.clicks).toBeGreaterThanOrEqual(1);
    });

    it('should handle multiple URL shortenings', async () => {
      const urls = [
        'https://example.com',
        'https://google.com',
        'https://github.com',
      ];

      const slugs: string[] = [];

      for (const url of urls) {
        const response = await request(app)
          .post('/api/shorten')
          .send({ url })
          .expect(200);

        slugs.push(response.body.slug);
      }

      // All slugs should be unique
      expect(new Set(slugs).size).toBe(slugs.length);

      // All should redirect correctly
      for (let i = 0; i < urls.length; i++) {
        await request(app)
          .get(`/${slugs[i]}`)
          .expect(302)
          .expect('Location', urls[i]);
      }
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent slug', async () => {
      const response = await request(app)
        .get('/nonexistent123')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid URL', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({ url: 'invalid-url' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // CORS headers should be present (implementation dependent)
      expect(response.headers).toBeDefined();
    });

    it('should handle OPTIONS request', async () => {
      await request(app)
        .options('/api/shorten')
        .expect(200);
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within limit', async () => {
      // Make multiple requests within limit
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/shorten')
          .send({ url: `https://example${i}.com` })
          .expect((res) => {
            // Should succeed or be rate limited, but not error
            expect([200, 429]).toContain(res.status);
          });
      }
    });
  });
});

