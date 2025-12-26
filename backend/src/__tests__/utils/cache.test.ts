/**
 * Tests for cache utility
 */

import { linkCache } from '../../utils/cache.js';

describe('linkCache', () => {
  beforeEach(() => {
    linkCache.clear();
  });

  it('should store and retrieve values', () => {
    const testData = { slug: 'test123', url: 'https://example.com' };
    linkCache.set('link:test123', testData);
    expect(linkCache.get('link:test123')).toEqual(testData);
  });

  it('should return null for non-existent keys', () => {
    expect(linkCache.get('link:nonexistent')).toBeNull();
  });

  it('should delete values', () => {
    const testData = { slug: 'test123', url: 'https://example.com' };
    linkCache.set('link:test123', testData);
    linkCache.delete('link:test123');
    expect(linkCache.get('link:test123')).toBeNull();
  });

  it('should clear all values', () => {
    linkCache.set('link:test1', { slug: 'test1' });
    linkCache.set('link:test2', { slug: 'test2' });
    expect(linkCache.size()).toBe(2);
    linkCache.clear();
    expect(linkCache.size()).toBe(0);
  });

  it('should return correct cache size', () => {
    expect(linkCache.size()).toBe(0);
    linkCache.set('link:test1', { slug: 'test1' });
    expect(linkCache.size()).toBe(1);
    linkCache.set('link:test2', { slug: 'test2' });
    expect(linkCache.size()).toBe(2);
  });

  it('should expire entries after TTL', (done) => {
    const testData = { slug: 'test123', url: 'https://example.com' };
    linkCache.set('link:test123', testData, 100); // 100ms TTL

    // Should be available immediately
    expect(linkCache.get('link:test123')).toEqual(testData);

    // Should be expired after TTL
    setTimeout(() => {
      expect(linkCache.get('link:test123')).toBeNull();
      done();
    }, 150);
  }, 10000);

  it('should overwrite existing values', () => {
    const testData1 = { slug: 'test123', url: 'https://example.com' };
    const testData2 = { slug: 'test123', url: 'https://example2.com' };
    linkCache.set('link:test123', testData1);
    linkCache.set('link:test123', testData2);
    expect(linkCache.get('link:test123')).toEqual(testData2);
  });
});

