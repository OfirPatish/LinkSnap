/**
 * Tests for shorten route
 */

import request from 'supertest';
import express from 'express';
import shortenRouter from '../../routes/shorten.js';
import { clearLinksTable } from '../helpers/testDb.js';
import { linkCache } from '../../utils/cache.js';

const app = express();
app.use(express.json());
app.use('/api/shorten', shortenRouter);
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});

describe('POST /api/shorten', () => {
  beforeEach(() => {
    clearLinksTable();
    linkCache.clear();
  });

  it('should create a short URL', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example.com' })
      .expect(200);

    expect(response.body).toHaveProperty('slug');
    expect(response.body).toHaveProperty('shortUrl');
    expect(response.body).toHaveProperty('url');
    expect(response.body.url).toBe('https://example.com');
  });

  it('should normalize URL without protocol', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ url: 'example.com' })
      .expect(200);

    expect(response.body.url).toBe('https://example.com');
  });

  it('should return 400 for missing URL', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid URL', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ url: 'not-a-url' })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for URL without domain', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ url: 'singleword' })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for URL with invalid protocol', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ url: 'ftp://example.com' })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for dangerous protocol', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ url: 'javascript:alert(1)' })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for URL that is too long', async () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(3000);
    const response = await request(app)
      .post('/api/shorten')
      .send({ url: longUrl })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should generate unique slugs for different URLs', async () => {
    const response1 = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example.com' })
      .expect(200);

    const response2 = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example2.com' })
      .expect(200);

    expect(response1.body.slug).not.toBe(response2.body.slug);
  });

  it('should handle empty request body', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});

