import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../utils/errors.js";
import { SLUG_MIN_LENGTH, SLUG_MAX_LENGTH } from "../constants/index.js";
import { sanitizeSlug } from "../utils/sanitize.js";

/**
 * Middleware to validate and sanitize slug format
 * Validates that slug exists, has correct length, and contains only valid characters
 */
export function validateSlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug } = req.params;

  if (!slug) {
    return next(new NotFoundError("Invalid short link format"));
  }

  // Sanitize slug first
  const sanitizedSlug = sanitizeSlug(slug);

  // Validate length and format
  if (
    sanitizedSlug.length < SLUG_MIN_LENGTH ||
    sanitizedSlug.length > SLUG_MAX_LENGTH ||
    sanitizedSlug !== slug // If sanitization changed the slug, it contained invalid chars
  ) {
    return next(new NotFoundError("Invalid short link format"));
  }

  // Replace slug in params with sanitized version
  req.params.slug = sanitizedSlug;

  next();
}

