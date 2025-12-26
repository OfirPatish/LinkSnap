/**
 * Tests for custom error classes
 */

import {
  AppError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  DatabaseError,
} from '../../utils/errors.js';

describe('AppError', () => {
  it('should create error with default status code', () => {
    const error = new AppError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe('AppError');
  });

  it('should create error with custom status code', () => {
    const error = new AppError('Test error', 400);
    expect(error.statusCode).toBe(400);
  });

  it('should create error with custom isOperational flag', () => {
    const error = new AppError('Test error', 500, false);
    expect(error.isOperational).toBe(false);
  });

  it('should be instance of Error', () => {
    const error = new AppError('Test error');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('ValidationError', () => {
  it('should have status code 400', () => {
    const error = new ValidationError('Validation failed');
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Validation failed');
    expect(error.name).toBe('ValidationError');
  });

  it('should be instance of AppError', () => {
    const error = new ValidationError('Validation failed');
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });
});

describe('NotFoundError', () => {
  it('should have status code 404', () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Resource not found');
  });

  it('should accept custom message', () => {
    const error = new NotFoundError('Custom not found message');
    expect(error.message).toBe('Custom not found message');
    expect(error.statusCode).toBe(404);
  });

  it('should be instance of AppError', () => {
    const error = new NotFoundError();
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });
});

describe('RateLimitError', () => {
  it('should have status code 429', () => {
    const error = new RateLimitError();
    expect(error.statusCode).toBe(429);
    expect(error.message).toBe('Too many requests');
  });

  it('should accept custom message', () => {
    const error = new RateLimitError('Custom rate limit message');
    expect(error.message).toBe('Custom rate limit message');
    expect(error.statusCode).toBe(429);
  });

  it('should be instance of AppError', () => {
    const error = new RateLimitError();
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });
});

describe('DatabaseError', () => {
  it('should have status code 500', () => {
    const error = new DatabaseError();
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Database operation failed');
  });

  it('should have isOperational set to false', () => {
    const error = new DatabaseError();
    expect(error.isOperational).toBe(false);
  });

  it('should accept custom message', () => {
    const error = new DatabaseError('Custom database error');
    expect(error.message).toBe('Custom database error');
    expect(error.statusCode).toBe(500);
  });

  it('should be instance of AppError', () => {
    const error = new DatabaseError();
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });
});

