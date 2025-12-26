/**
 * Tests for URL utility functions
 */

import { getBaseUrl } from '../../utils/url.js';
import { createMockRequest } from '../helpers/mocks.js';
import type { Request } from 'express';

describe('getBaseUrl', () => {
  beforeEach(() => {
    delete process.env.BASE_URL;
  });

  it('should use BASE_URL from environment if set', () => {
    process.env.BASE_URL = 'https://custom-domain.com';
    const req = createMockRequest() as Request;
    expect(getBaseUrl(req)).toBe('https://custom-domain.com');
  });

  it('should auto-detect protocol from x-forwarded-proto header', () => {
    const req = createMockRequest({
      headers: {
        'x-forwarded-proto': 'https',
        host: 'example.com',
      },
    }) as Request;
    expect(getBaseUrl(req)).toBe('https://example.com');
  });

  it('should use http when x-forwarded-proto is http', () => {
    const req = createMockRequest({
      headers: {
        'x-forwarded-proto': 'http',
        host: 'example.com',
      },
    }) as Request;
    expect(getBaseUrl(req)).toBe('http://example.com');
  });

  it('should use x-forwarded-host header if present', () => {
    const req = createMockRequest({
      headers: {
        'x-forwarded-proto': 'https',
        'x-forwarded-host': 'custom-host.com',
        host: 'example.com',
      },
    }) as Request;
    expect(getBaseUrl(req)).toBe('https://custom-host.com');
  });

  it('should use host header if x-forwarded-host is not present', () => {
    const req = createMockRequest({
      headers: {
        host: 'example.com:3000',
      },
    }) as Request;
    expect(getBaseUrl(req)).toBe('http://example.com:3000');
  });

  it('should default to localhost with default port if no host header', () => {
    delete process.env.PORT;
    const req = createMockRequest({
      headers: {},
    }) as Request;
    const baseUrl = getBaseUrl(req);
    expect(baseUrl).toMatch(/^http:\/\/localhost:4000$/);
  });

  it('should use PORT from environment for default host', () => {
    process.env.PORT = '5000';
    const req = createMockRequest({
      headers: {},
    }) as Request;
    const baseUrl = getBaseUrl(req);
    expect(baseUrl).toBe('http://localhost:5000');
  });

  it('should use https when req.secure is true', () => {
    const req = createMockRequest({
      secure: true,
      headers: {
        host: 'example.com',
      },
    }) as Request;
    expect(getBaseUrl(req)).toBe('https://example.com');
  });
});

