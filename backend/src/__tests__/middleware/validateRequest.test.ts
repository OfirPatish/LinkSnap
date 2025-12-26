/**
 * Tests for validateRequest middleware
 */

import { validateBody, validateQuery, validateParams } from '../../middleware/validateRequest.js';
import { ValidationError } from '../../utils/errors.js';
import { z } from 'zod';
import { createMockRequest, createMockResponse, createMockNext } from '../helpers/mocks.js';
import type { Request, Response, NextFunction } from 'express';

describe('validateBody', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  it('should validate and parse valid body', () => {
    const schema = z.object({
      url: z.string(),
    });
    req.body = { url: 'https://example.com' };
    const middleware = validateBody(schema);
    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ url: 'https://example.com' });
  });

  it('should reject invalid body', () => {
    const schema = z.object({
      url: z.string().min(1),
    });
    req.body = {};
    const middleware = validateBody(schema);
    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('should transform body according to schema', () => {
    const schema = z.object({
      url: z.string().transform((val) => val.trim()),
    });
    req.body = { url: '  https://example.com  ' };
    const middleware = validateBody(schema);
    middleware(req as Request, res as Response, next);
    expect(req.body.url).toBe('https://example.com');
  });
});

describe('validateQuery', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  it('should validate and parse valid query', () => {
    const schema = z.object({
      page: z.string().transform(Number),
    });
    req.query = { page: '1' };
    const middleware = validateQuery(schema);
    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should reject invalid query', () => {
    const schema = z.object({
      page: z.string(),
    });
    req.query = { invalid: 'value' };
    const middleware = validateQuery(schema);
    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });
});

describe('validateParams', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  it('should validate and parse valid params', () => {
    const schema = z.object({
      slug: z.string().min(3),
    });
    req.params = { slug: 'abc123' };
    const middleware = validateParams(schema);
    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should reject invalid params', () => {
    const schema = z.object({
      slug: z.string().min(3),
    });
    req.params = { slug: 'ab' };
    const middleware = validateParams(schema);
    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });
});

