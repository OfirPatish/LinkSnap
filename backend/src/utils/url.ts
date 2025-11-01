/**
 * URL utility functions
 */

import type { Request } from "express";
import { DEFAULT_PORT } from "../constants/index.js";

/**
 * Get base URL from environment or auto-detect from request
 */
export function getBaseUrl(req: Request): string {
  // Use BASE_URL from env if set
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  // Auto-detect from request (useful for production behind proxies)
  const protocol =
    (req.headers["x-forwarded-proto"] as string) ||
    (req.secure ? "https" : "http");
  const host =
    (req.headers["x-forwarded-host"] as string) ||
    (req.headers.host as string) ||
    `localhost:${process.env.PORT || DEFAULT_PORT}`;

  return `${protocol}://${host}`;
}
