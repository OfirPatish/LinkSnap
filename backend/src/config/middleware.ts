import express from "express";
import compression from "compression";
import helmet from "helmet";
import { corsMiddleware } from "../middleware/cors.js";
import { apiLimiter, shortenLimiter } from "../middleware/rateLimit.js";
import { logger, pinoHttp } from "../utils/logger.js";

/**
 * Configure all Express middleware
 */
export function configureMiddleware(app: express.Application): void {
  // Trust proxy for accurate IP addresses behind reverse proxies
  app.set("trust proxy", 1);

  // Security middleware - Helmet provides comprehensive security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow embedding if needed
    })
  );

  // Compression middleware
  app.use(compression());

  // Body parsing middleware with size limits
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Structured request logging with Pino
  // Only log errors and warnings, skip successful requests to reduce noise
  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => {
          // Skip health check endpoint (too frequent)
          return req.url === "/health";
        },
      },
      customLogLevel: (req, res, err) => {
        // Only log errors (4xx, 5xx) - skip successful requests (2xx, 3xx)
        if (res.statusCode >= 400 && res.statusCode < 500) {
          return "warn";
        } else if (res.statusCode >= 500 || err) {
          return "error";
        }
        // Return a level below current logger level to skip logging successful requests
        // Using "trace" which is below "info" level
        return "trace";
      },
      customSuccessMessage: (req, res) => {
        return `${req.method} ${req.url} ${res.statusCode}`;
      },
      customErrorMessage: (req, res, err) => {
        return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
      },
    })
  );

  // CORS middleware
  app.use(corsMiddleware);
}

// Export rate limiters for use in routes
export { shortenLimiter, apiLimiter };
