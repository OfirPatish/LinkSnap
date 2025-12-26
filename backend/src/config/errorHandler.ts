import express from "express";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { getEnv } from "../utils/env.js";

/**
 * Configure error handling middleware
 * Must be registered after all routes
 */
export function configureErrorHandler(app: express.Application): void {
  const env = getEnv();

  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      // Log error with context
      logger.error(
        {
          err,
          path: req.path,
          method: req.method,
          ip: req.ip,
          userAgent: req.get("user-agent"),
        },
        "Request error"
      );

      // Handle known application errors
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          error: err.message,
          ...(env.NODE_ENV === "development" && { stack: err.stack }),
        });
      }

      // Handle Zod validation errors
      if (err.name === "ZodError") {
        return res.status(400).json({
          error: "Validation error",
          details: (err as any).errors,
        });
      }

      // Default error response
      const statusCode = (err as any).statusCode || 500;
      const message =
        env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message;

      res.status(statusCode).json({
        error: message,
        ...(env.NODE_ENV === "development" && { stack: err.stack }),
      });
    }
  );
}

