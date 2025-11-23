import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../utils/errors.js";
import { SLUG_MIN_LENGTH, SLUG_MAX_LENGTH } from "../constants/index.js";

/**
 * Middleware to validate slug format
 * Validates that slug exists, has correct length, and contains only valid characters
 */
export function validateSlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug } = req.params;

  if (
    !slug ||
    slug.length < SLUG_MIN_LENGTH ||
    slug.length > SLUG_MAX_LENGTH ||
    !/^[a-zA-Z0-9_-]+$/.test(slug)
  ) {
    return next(new NotFoundError("Invalid short link format"));
  }

  next();
}

