/**
 * Mock helpers for testing
 */

import type { Request, Response, NextFunction } from 'express';

/**
 * Create a mock Express request
 */
export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    ip: '127.0.0.1',
    method: 'GET',
    path: '/',
    app: {
      get: jest.fn((key: string) => {
        if (key === 'trust proxy') return false;
        return undefined;
      }),
    } as any,
    ...overrides,
  };
};

/**
 * Create a mock Express response
 */
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    header: jest.fn().mockReturnThis(),
    get: jest.fn(),
    sendStatus: jest.fn().mockReturnThis(),
  };
  return res;
};

/**
 * Create a mock Express next function
 */
export const createMockNext = (): NextFunction => {
  return jest.fn();
};

