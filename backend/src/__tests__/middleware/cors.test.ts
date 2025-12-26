/**
 * Tests for CORS middleware
 */

import { corsMiddleware } from '../../middleware/cors.js';
import { createMockRequest, createMockResponse, createMockNext } from '../helpers/mocks.js';
import type { Request, Response, NextFunction } from 'express';

describe('corsMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
    delete process.env.ALLOWED_ORIGINS;
  });

  it('should set Access-Control-Allow-Origin to * when ALLOWED_ORIGINS is not set', () => {
    corsMiddleware(req as Request, res as Response, next);
    expect(res.header).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    expect(next).toHaveBeenCalled();
  });

  it('should set Access-Control-Allow-Origin to * when ALLOWED_ORIGINS includes *', () => {
    process.env.ALLOWED_ORIGINS = '*';
    corsMiddleware(req as Request, res as Response, next);
    expect(res.header).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
  });

  it('should set Access-Control-Allow-Origin to specific origin when in ALLOWED_ORIGINS', () => {
    process.env.ALLOWED_ORIGINS = 'http://localhost:3000,https://example.com';
    req.headers = { origin: 'http://localhost:3000' };
    corsMiddleware(req as Request, res as Response, next);
    expect(res.header).toHaveBeenCalledWith(
      'Access-Control-Allow-Origin',
      'http://localhost:3000'
    );
  });

  it('should not set Access-Control-Allow-Origin for origin not in ALLOWED_ORIGINS', () => {
    process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
    req.headers = { origin: 'http://malicious.com' };
    corsMiddleware(req as Request, res as Response, next);
    // Should not set the header for unauthorized origin
    const calls = (res.header as jest.Mock).mock.calls;
    const originCall = calls.find((call) => call[0] === 'Access-Control-Allow-Origin');
    expect(originCall).toBeUndefined();
  });

  it('should set Access-Control-Allow-Methods header', () => {
    corsMiddleware(req as Request, res as Response, next);
    expect(res.header).toHaveBeenCalledWith(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS'
    );
  });

  it('should set Access-Control-Allow-Headers header', () => {
    corsMiddleware(req as Request, res as Response, next);
    expect(res.header).toHaveBeenCalledWith('Access-Control-Allow-Headers', 'Content-Type');
  });

  it('should return 200 for OPTIONS request', () => {
    req.method = 'OPTIONS';
    corsMiddleware(req as Request, res as Response, next);
    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() for non-OPTIONS requests', () => {
    req.method = 'GET';
    corsMiddleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should handle multiple allowed origins', () => {
    process.env.ALLOWED_ORIGINS = 'http://localhost:3000,https://example.com,https://app.example.com';
    req.headers = { origin: 'https://example.com' };
    corsMiddleware(req as Request, res as Response, next);
    expect(res.header).toHaveBeenCalledWith(
      'Access-Control-Allow-Origin',
      'https://example.com'
    );
  });
});

