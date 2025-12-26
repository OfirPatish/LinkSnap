/**
 * Tests for validateSlug middleware
 */

import { validateSlug } from '../../middleware/validateSlug.js';
import { NotFoundError } from '../../utils/errors.js';
import { createMockRequest, createMockResponse, createMockNext } from '../helpers/mocks.js';
import type { Request, Response, NextFunction } from 'express';

describe('validateSlug', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  it('should call next() for valid slug', () => {
    req.params = { slug: 'abc123' };
    validateSlug(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  it('should sanitize slug and replace in params', () => {
    req.params = { slug: 'abc-123_test' };
    validateSlug(req as Request, res as Response, next);
    expect(req.params.slug).toBe('abc-123_test');
    expect(next).toHaveBeenCalled();
  });

  it('should reject slug shorter than minimum length', () => {
    req.params = { slug: 'ab' };
    validateSlug(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error.message).toBe('Invalid short link format');
  });

  it('should reject slug longer than maximum length', () => {
    req.params = { slug: 'a'.repeat(21) };
    validateSlug(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it('should reject slug with invalid characters', () => {
    req.params = { slug: 'abc@123' };
    validateSlug(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it('should reject empty slug', () => {
    req.params = { slug: '' };
    validateSlug(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it('should reject undefined slug', () => {
    req.params = {};
    validateSlug(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it('should allow valid alphanumeric slug', () => {
    req.params = { slug: 'abc123' };
    validateSlug(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should allow slug with hyphens', () => {
    req.params = { slug: 'abc-123' };
    validateSlug(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should allow slug with underscores', () => {
    req.params = { slug: 'abc_123' };
    validateSlug(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should sanitize and validate slug with mixed valid characters', () => {
    req.params = { slug: 'abc-123_test' };
    validateSlug(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith();
  });
});

