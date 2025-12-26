/**
 * Tests for URL normalization utility
 */

import { normalizeUrl } from '../../utils/url-normalization.js';

describe('normalizeUrl', () => {
  it('should add https:// if no protocol is present', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com');
    expect(normalizeUrl('www.example.com')).toBe('https://www.example.com');
  });

  it('should preserve http:// protocol', () => {
    expect(normalizeUrl('http://example.com')).toBe('http://example.com');
  });

  it('should preserve https:// protocol', () => {
    expect(normalizeUrl('https://example.com')).toBe('https://example.com');
  });

  it('should trim whitespace', () => {
    expect(normalizeUrl('  example.com  ')).toBe('https://example.com');
  });

  it('should handle URLs with paths', () => {
    expect(normalizeUrl('example.com/path/to/page')).toBe(
      'https://example.com/path/to/page'
    );
    expect(normalizeUrl('https://example.com/path/to/page')).toBe(
      'https://example.com/path/to/page'
    );
  });

  it('should handle URLs with query parameters', () => {
    expect(normalizeUrl('example.com?param=value')).toBe(
      'https://example.com?param=value'
    );
  });

  it('should handle URLs with ports', () => {
    expect(normalizeUrl('example.com:8080')).toBe('https://example.com:8080');
  });

  it('should allow localhost', () => {
    expect(normalizeUrl('localhost')).toBe('https://localhost');
    expect(normalizeUrl('localhost:3000')).toBe('https://localhost:3000');
  });

  it('should allow IP addresses', () => {
    expect(normalizeUrl('127.0.0.1')).toBe('https://127.0.0.1');
    expect(normalizeUrl('192.168.1.1')).toBe('https://192.168.1.1');
  });

  it('should reject single-word hostnames without domain', () => {
    expect(() => normalizeUrl('singleword')).toThrow('Invalid URL');
    expect(() => normalizeUrl('test')).toThrow('Invalid URL');
  });

  it('should reject invalid URL format', () => {
    expect(() => normalizeUrl('not a url')).toThrow('Invalid URL');
    expect(() => normalizeUrl('')).toThrow('Invalid URL');
  });

  it('should handle subdomains', () => {
    expect(normalizeUrl('sub.example.com')).toBe('https://sub.example.com');
    expect(normalizeUrl('www.sub.example.com')).toBe('https://www.sub.example.com');
  });

  it('should be case-insensitive for protocol', () => {
    expect(normalizeUrl('HTTP://example.com')).toBe('http://example.com');
    expect(normalizeUrl('HTTPS://example.com')).toBe('https://example.com');
  });
});

