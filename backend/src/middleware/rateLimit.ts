import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

/**
 * Rate limiting middleware to prevent abuse
 * Different limits for different endpoints
 */

/**
 * General API rate limiter - 100 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many requests from this IP, please try again later.",
    });
  },
});

/**
 * Strict rate limiter for URL shortening - 10 requests per minute
 * Prevents abuse of the shortening endpoint
 */
export const shortenLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  message: "Too many URL shortening requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many URL shortening requests, please try again later.",
    });
  },
});
