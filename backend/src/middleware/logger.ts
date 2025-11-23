import type { Request, Response, NextFunction } from "express";

/**
 * Request logging middleware
 * Logs incoming requests with method, path, IP, and response time
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, path, ip } = req;

  // Log when response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    const logMessage = `${method} ${path} ${statusCode} - ${duration}ms - ${ip}`;

    // Use different log levels based on status code
    if (statusCode >= 500) {
      console.error(logMessage);
    } else if (statusCode >= 400) {
      console.warn(logMessage);
    } else {
      console.log(logMessage);
    }
  });

  next();
}
