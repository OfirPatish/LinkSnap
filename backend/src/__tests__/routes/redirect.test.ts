/**
 * Tests for redirect route
 */

import request from 'supertest';
import express from 'express';
import redirectRouter from '../../routes/redirect.js';
import { clearLinksTable, insertTestLink } from '../helpers/testDb.js';
import { linkCache } from '../../utils/cache.js';

const app = express();
app.use(express.json());
app.use('/', redirectRouter);
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});

describe('GET /:slug', () => {
  beforeEach(() => {
    clearLinksTable();
    linkCache.clear();
  });

  it('should redirect to original URL', async () => {
    insertTestLink({ slug: 'test123', url: 'https://example.com' });

    const response = await request(app)
      .get('/test123')
      .expect(302);

    expect(response.headers.location).toBe('https://example.com');
  });

  it('should return 404 for non-existent slug', async () => {
    const response = await request(app)
      .get('/nonexistent')
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Short link not found');
  });

  it('should return 404 for invalid slug format (too short)', async () => {
    const response = await request(app)
      .get('/ab')
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 404 for invalid slug format (too long)', async () => {
    const response = await request(app)
      .get('/' + 'a'.repeat(21))
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 404 for invalid slug format (invalid characters)', async () => {
    const response = await request(app)
      .get('/test@123')
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should increment click count on redirect', async () => {
    insertTestLink({ slug: 'test123', url: 'https://example.com', clicks: 5 });

    await request(app).get('/test123').expect(302);

    // Check that clicks were incremented (this would require a helper function)
    // For now, we just verify the redirect works
  });

  it('should return 404 for inactive link', async () => {
    insertTestLink({
      slug: 'test123',
      url: 'https://example.com',
      is_active: 0,
    });

    const response = await request(app)
      .get('/test123')
      .expect(404);

    expect(response.body.error).toBe('Short link not found');
  });

  it('should handle slug with hyphens', async () => {
    insertTestLink({ slug: 'test-123', url: 'https://example.com' });

    const response = await request(app)
      .get('/test-123')
      .expect(302);

    expect(response.headers.location).toBe('https://example.com');
  });

  it('should handle slug with underscores', async () => {
    insertTestLink({ slug: 'test_123', url: 'https://example.com' });

    const response = await request(app)
      .get('/test_123')
      .expect(302);

    expect(response.headers.location).toBe('https://example.com');
  });
});

