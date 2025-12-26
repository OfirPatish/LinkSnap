/**
 * Tests for URL service
 */

import {
  createLink,
  findLinkBySlug,
  incrementClicks,
  getLinkStats,
} from '../../services/url.js';
import { ValidationError, DatabaseError } from '../../utils/errors.js';
import { clearLinksTable, insertTestLink, getLinkFromDb } from '../helpers/testDb.js';
import { linkCache } from '../../utils/cache.js';

describe('createLink', () => {
  beforeEach(() => {
    clearLinksTable();
    linkCache.clear();
  });

  it('should create a new link with valid URL', () => {
    const baseUrl = 'http://localhost:4000';
    const result = createLink('https://example.com', baseUrl);

    expect(result).toHaveProperty('slug');
    expect(result).toHaveProperty('shortUrl');
    expect(result).toHaveProperty('url');
    expect(result.url).toBe('https://example.com');
    expect(result.shortUrl).toBe(`${baseUrl}/${result.slug}`);
    expect(result.slug).toHaveLength(7);
  });

  it('should normalize URL without protocol', () => {
    const baseUrl = 'http://localhost:4000';
    const result = createLink('example.com', baseUrl);

    expect(result.url).toBe('https://example.com');
  });

  it('should throw ValidationError for invalid URL', () => {
    const baseUrl = 'http://localhost:4000';
    expect(() => createLink('not-a-url', baseUrl)).toThrow(ValidationError);
  });

  it('should throw ValidationError for URL without domain', () => {
    const baseUrl = 'http://localhost:4000';
    expect(() => createLink('singleword', baseUrl)).toThrow(ValidationError);
  });

  it('should throw ValidationError for URL with invalid protocol', () => {
    const baseUrl = 'http://localhost:4000';
    expect(() => createLink('ftp://example.com', baseUrl)).toThrow(ValidationError);
  });

  it('should throw ValidationError for URL that is too long', () => {
    const baseUrl = 'http://localhost:4000';
    const longUrl = 'https://example.com/' + 'a'.repeat(3000);
    expect(() => createLink(longUrl, baseUrl)).toThrow(ValidationError);
  });

  it('should throw ValidationError for dangerous protocol', () => {
    const baseUrl = 'http://localhost:4000';
    expect(() => createLink('javascript:alert(1)', baseUrl)).toThrow(ValidationError);
  });

  it('should generate unique slugs', () => {
    const baseUrl = 'http://localhost:4000';
    const result1 = createLink('https://example.com', baseUrl);
    const result2 = createLink('https://example2.com', baseUrl);

    expect(result1.slug).not.toBe(result2.slug);
  });

  it('should cache created link', () => {
    const baseUrl = 'http://localhost:4000';
    const result = createLink('https://example.com', baseUrl);
    const cached = linkCache.get(`link:${result.slug}`);
    expect(cached).toBeDefined();
  });
});

describe('findLinkBySlug', () => {
  beforeEach(() => {
    clearLinksTable();
    linkCache.clear();
  });

  it('should find existing link', () => {
    insertTestLink({ slug: 'test123', url: 'https://example.com' });
    const link = findLinkBySlug('test123');

    expect(link).toBeDefined();
    expect(link?.slug).toBe('test123');
    expect(link?.url).toBe('https://example.com');
  });

  it('should return null for non-existent slug', () => {
    const link = findLinkBySlug('nonexistent');
    expect(link).toBeNull();
  });

  it('should return null for inactive link', () => {
    insertTestLink({
      slug: 'test123',
      url: 'https://example.com',
      is_active: 0,
    });
    const link = findLinkBySlug('test123');
    expect(link).toBeNull();
  });

  it('should return null for expired link', () => {
    const expiredDate = new Date(Date.now() - 1000).toISOString();
    insertTestLink({
      slug: 'test123',
      url: 'https://example.com',
      expires_at: expiredDate,
    });
    const link = findLinkBySlug('test123');
    expect(link).toBeNull();
  });

  it('should return link from cache if available', () => {
    insertTestLink({ slug: 'test123', url: 'https://example.com' });
    const link1 = findLinkBySlug('test123');
    expect(link1).toBeDefined();

    // Clear database but keep cache
    clearLinksTable();
    const link2 = findLinkBySlug('test123');
    expect(link2).toBeDefined();
  });

  it('should cache found link', () => {
    insertTestLink({ slug: 'test123', url: 'https://example.com' });
    findLinkBySlug('test123');
    const cached = linkCache.get(`link:test123`);
    expect(cached).toBeDefined();
  });
});

describe('incrementClicks', () => {
  beforeEach(() => {
    clearLinksTable();
    linkCache.clear();
  });

  it('should increment click count', () => {
    insertTestLink({ slug: 'test123', url: 'https://example.com', clicks: 5 });
    incrementClicks('test123');

    const link = getLinkFromDb('test123') as any;
    expect(link.clicks).toBe(6);
  });

  it('should invalidate cache after incrementing', () => {
    insertTestLink({ slug: 'test123', url: 'https://example.com' });
    linkCache.set('link:test123', { slug: 'test123', url: 'https://example.com' });
    incrementClicks('test123');

    const cached = linkCache.get('link:test123');
    expect(cached).toBeNull();
  });

  it('should not throw error for non-existent slug', () => {
    expect(() => incrementClicks('nonexistent')).not.toThrow();
  });
});

describe('getLinkStats', () => {
  beforeEach(() => {
    clearLinksTable();
    linkCache.clear();
  });

  it('should return stats for existing link', () => {
    const createdAt = new Date().toISOString();
    insertTestLink({
      slug: 'test123',
      url: 'https://example.com',
      clicks: 42,
    });

    const stats = getLinkStats('test123');

    expect(stats).toBeDefined();
    expect(stats?.slug).toBe('test123');
    expect(stats?.url).toBe('https://example.com');
    expect(stats?.clicks).toBe(42);
    expect(stats?.createdAt).toBeDefined();
  });

  it('should return null for non-existent link', () => {
    const stats = getLinkStats('nonexistent');
    expect(stats).toBeNull();
  });

  it('should return null for inactive link', () => {
    insertTestLink({
      slug: 'test123',
      url: 'https://example.com',
      is_active: 0,
    });
    const stats = getLinkStats('test123');
    expect(stats).toBeNull();
  });

  it('should return null for expired link', () => {
    const expiredDate = new Date(Date.now() - 1000).toISOString();
    insertTestLink({
      slug: 'test123',
      url: 'https://example.com',
      expires_at: expiredDate,
    });
    const stats = getLinkStats('test123');
    expect(stats).toBeNull();
  });
});

