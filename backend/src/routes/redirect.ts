import { Router, Request, Response, NextFunction } from "express";
import { findLinkBySlug, incrementClicks } from "../url.service.js";
import { NotFoundError } from "../utils/errors.js";

const router = Router();

router.get("/:slug", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    // Validate slug format (alphanumeric, length check)
    if (!slug || slug.length < 3 || slug.length > 20) {
      return next(new NotFoundError("Invalid short link format"));
    }

    const link = findLinkBySlug(slug);

    if (!link) {
      return next(new NotFoundError("Short link not found"));
    }

    // Increment click count
    incrementClicks(slug);

    // Redirect with 302 (temporary redirect) so browsers don't cache it
    // This ensures each click hits the server and increments the counter
    res.redirect(302, link.url);
  } catch (error) {
    next(error);
  }
});

export default router;
