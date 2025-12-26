/**
 * Tests for URL validators
 */

import { shortenUrlSchema } from '../../validators/url.js';

describe('shortenUrlSchema', () => {
  it('should validate valid URL with https', () => {
    const result = shortenUrlSchema.parse({ url: 'https://example.com' });
    expect(result.url).toBe('https://example.com');
  });

  it('should validate valid URL with http', () => {
    const result = shortenUrlSchema.parse({ url: 'http://example.com' });
    expect(result.url).toBe('http://example.com');
  });

  it('should validate URL without protocol', () => {
    const result = shortenUrlSchema.parse({ url: 'example.com' });
    expect(result.url).toBe('example.com');
  });

  it('should validate URL with subdomain', () => {
    const result = shortenUrlSchema.parse({ url: 'sub.example.com' });
    expect(result.url).toBe('sub.example.com');
  });

  it('should validate localhost', () => {
    const result = shortenUrlSchema.parse({ url: 'localhost' });
    expect(result.url).toBe('localhost');
  });

  it('should validate IP address', () => {
    const result = shortenUrlSchema.parse({ url: '127.0.0.1' });
    expect(result.url).toBe('127.0.0.1');
  });

  it('should reject empty URL', () => {
    expect(() => shortenUrlSchema.parse({ url: '' })).toThrow();
  });

  it('should reject missing URL', () => {
    expect(() => shortenUrlSchema.parse({})).toThrow();
  });

  it('should reject single word without domain', () => {
    expect(() => shortenUrlSchema.parse({ url: 'singleword' })).toThrow();
  });

  it('should reject invalid URL format', () => {
    expect(() => shortenUrlSchema.parse({ url: 'not a url' })).toThrow();
  });

  it('should trim whitespace', () => {
    const result = shortenUrlSchema.parse({ url: '  example.com  ' });
    expect(result.url).toBe('example.com');
  });

  it('should validate URL with path', () => {
    const result = shortenUrlSchema.parse({ url: 'example.com/path/to/page' });
    expect(result.url).toBe('example.com/path/to/page');
  });

  it('should validate URL with query parameters', () => {
    const result = shortenUrlSchema.parse({ url: 'example.com?param=value' });
    expect(result.url).toBe('example.com?param=value');
  });
});

