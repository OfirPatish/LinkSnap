import { Request, Response, NextFunction } from "express";
import { z, ZodTypeAny } from "zod";
import { ValidationError } from "../utils/errors.js";

/**
 * Middleware factory to validate request body against a Zod schema
 */
export function validateBody<T>(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          new ValidationError(
            error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
          )
        );
      }
      next(error);
    }
  };
}

/**
 * Middleware factory to validate request query parameters against a Zod schema
 */
export function validateQuery<T>(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      Object.assign(req.query, schema.parse(req.query));
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          new ValidationError(
            error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
          )
        );
      }
      next(error);
    }
  };
}

/**
 * Middleware factory to validate request params against a Zod schema
 */
export function validateParams<T>(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      Object.assign(req.params, schema.parse(req.params));
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          new ValidationError(
            error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
          )
        );
      }
      next(error);
    }
  };
}

