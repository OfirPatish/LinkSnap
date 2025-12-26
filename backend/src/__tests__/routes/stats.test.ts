/**
 * Tests for stats route
 */

import request from 'supertest';
import express from 'express';
import statsRouter from '../../routes/stats.js';
import { clearLinksTable, insertTestLink } from '../helpers/testDb.js';
import { linkCache } from '../../utils/cache.js';

const app = express();
app.use(express.json());
app.use('/api/stats', statsRouter);
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});

describe('GET /api/stats/:slug', () => {
  beforeEach(() => {
    clearLinksTable();
    linkCache.clear();
  });

  it('should return stats for existing link', async () => {
    const createdAt = new Date().toISOString();
    insertTestLink({
      slug: 'test123',
      url: 'https://example.com',
      clicks: 42,
    });

    const response = await request(app)
      .get('/api/stats/test123')
      .expect(200);

    expect(response.body).toHaveProperty('slug');
    expect(response.body).toHaveProperty('url');
    expect(response.body).toHaveProperty('clicks');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body.slug).toBe('test123');
    expect(response.body.url).toBe('https://example.com');
    expect(response.body.clicks).toBe(42);
  });

  it('should return 404 for non-existent slug', async () => {
    const response = await request(app)
      .get('/api/stats/nonexistent')
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Short link not found');
  });

  it('should return 404 for invalid slug format (too short)', async () => {
    const response = await request(app)
      .get('/api/stats/ab')
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 404 for invalid slug format (too long)', async () => {
    const response = await request(app)
      .get('/api/stats/' + 'a'.repeat(21))
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 404 for invalid slug format (invalid characters)', async () => {
    const response = await request(app)
      .get('/api/stats/test@123')
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 404 for inactive link', async () => {
    insertTestLink({
      slug: 'test123',
      url: 'https://example.com',
      is_active: 0,
    });

    const response = await request(app)
      .get('/api/stats/test123')
      .expect(404);

    expect(response.body.error).toBe('Short link not found');
  });

  it('should return correct click count', async () => {
    insertTestLink({
      slug: 'test123',
      url: 'https://example.com',
      clicks: 100,
    });

    const response = await request(app)
      .get('/api/stats/test123')
      .expect(200);

    expect(response.body.clicks).toBe(100);
  });

  it('should handle slug with hyphens', async () => {
    insertTestLink({ slug: 'test-123', url: 'https://example.com', clicks: 5 });

    const response = await request(app)
      .get('/api/stats/test-123')
      .expect(200);

    expect(response.body.slug).toBe('test-123');
  });

  it('should handle slug with underscores', async () => {
    insertTestLink({ slug: 'test_123', url: 'https://example.com', clicks: 5 });

    const response = await request(app)
      .get('/api/stats/test_123')
      .expect(200);

    expect(response.body.slug).toBe('test_123');
  });
});

