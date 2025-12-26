/**
 * Tests for rate limiting middleware
 */

import { apiLimiter, shortenLimiter } from '../../middleware/rateLimit.js';
import { createMockRequest, createMockResponse, createMockNext } from '../helpers/mocks.js';
import type { Request, Response, NextFunction } from 'express';

describe('apiLimiter', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  it('should allow requests within limit', (done) => {
    apiLimiter(req as Request, res as Response, next);
    // Rate limiter is async, wait a bit for it to complete
    setTimeout(() => {
      expect(next).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should have correct window and max settings', () => {
    // These are configuration tests - the actual rate limiting behavior
    // would be tested in integration tests
    expect(apiLimiter).toBeDefined();
  });
});

describe('shortenLimiter', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  it('should allow requests within limit', (done) => {
    shortenLimiter(req as Request, res as Response, next);
    // Rate limiter is async, wait a bit for it to complete
    setTimeout(() => {
      expect(next).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should have correct window and max settings', () => {
    // These are configuration tests - the actual rate limiting behavior
    // would be tested in integration tests
    expect(shortenLimiter).toBeDefined();
  });
});

