/**
 * Tests for sanitize utility functions
 */

import {
  sanitizeString,
  sanitizeUrl,
  sanitizeSlug,
} from '../../utils/sanitize.js';

describe('sanitizeString', () => {
  it('should trim whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });

  it('should remove angle brackets', () => {
    expect(sanitizeString('<script>alert("xss")</script>')).toBe(
      'scriptalert("xss")/script'
    );
  });

  it('should remove javascript: protocol', () => {
    expect(sanitizeString('javascript:alert(1)')).toBe('alert(1)');
    expect(sanitizeString('JAVASCRIPT:alert(1)')).toBe('alert(1)');
  });

  it('should remove event handlers', () => {
    expect(sanitizeString('onclick=alert(1)')).toBe('alert(1)');
    expect(sanitizeString('onerror=alert(1)')).toBe('alert(1)');
  });

  it('should handle normal strings', () => {
    expect(sanitizeString('hello world')).toBe('hello world');
  });
});

describe('sanitizeUrl', () => {
  it('should trim whitespace', () => {
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com');
  });

  it('should throw error for javascript: protocol', () => {
    expect(() => sanitizeUrl('javascript:alert(1)')).toThrow(
      'Dangerous protocol detected: javascript:'
    );
  });

  it('should throw error for data: protocol', () => {
    expect(() => sanitizeUrl('data:text/html,<script>alert(1)</script>')).toThrow(
      'Dangerous protocol detected: data:'
    );
  });

  it('should throw error for vbscript: protocol', () => {
    expect(() => sanitizeUrl('vbscript:msgbox(1)')).toThrow(
      'Dangerous protocol detected: vbscript:'
    );
  });

  it('should throw error for file: protocol', () => {
    expect(() => sanitizeUrl('file:///etc/passwd')).toThrow(
      'Dangerous protocol detected: file:'
    );
  });

  it('should throw error for about: protocol', () => {
    expect(() => sanitizeUrl('about:blank')).toThrow(
      'Dangerous protocol detected: about:'
    );
  });

  it('should allow http: protocol', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
  });

  it('should allow https: protocol', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
  });

  it('should be case-insensitive for dangerous protocols', () => {
    expect(() => sanitizeUrl('JAVASCRIPT:alert(1)')).toThrow();
    expect(() => sanitizeUrl('DATA:text/html')).toThrow();
  });
});

describe('sanitizeSlug', () => {
  it('should allow alphanumeric characters', () => {
    expect(sanitizeSlug('abc123')).toBe('abc123');
    expect(sanitizeSlug('ABC123')).toBe('ABC123');
  });

  it('should allow hyphens', () => {
    expect(sanitizeSlug('abc-123')).toBe('abc-123');
  });

  it('should allow underscores', () => {
    expect(sanitizeSlug('abc_123')).toBe('abc_123');
  });

  it('should remove invalid characters', () => {
    expect(sanitizeSlug('abc@123')).toBe('abc123');
    expect(sanitizeSlug('abc#123')).toBe('abc123');
    expect(sanitizeSlug('abc$123')).toBe('abc123');
    expect(sanitizeSlug('abc%123')).toBe('abc123');
  });

  it('should remove spaces', () => {
    expect(sanitizeSlug('abc 123')).toBe('abc123');
  });

  it('should remove special characters', () => {
    expect(sanitizeSlug('abc!@#$%^&*()123')).toBe('abc123');
  });

  it('should handle empty string', () => {
    expect(sanitizeSlug('')).toBe('');
  });
});

