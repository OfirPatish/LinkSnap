import { Request, Response, NextFunction } from "express";

/**
 * CORS middleware for frontend development
 * In production, configure ALLOWED_ORIGINS environment variable
 */
export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["*"];

  if (allowedOrigins.includes("*")) {
    res.header("Access-Control-Allow-Origin", "*");
  } else {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
}
