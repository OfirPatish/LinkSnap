import { Router, Request, Response, NextFunction } from "express";
import { getLinkStats } from "../url.service.js";
import { NotFoundError } from "../utils/errors.js";

const router = Router();

router.get("/:slug", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    // Validate slug format
    if (!slug || slug.length < 3 || slug.length > 20) {
      return next(new NotFoundError("Invalid short link format"));
    }

    const stats = getLinkStats(slug);

    if (!stats) {
      return next(new NotFoundError("Short link not found"));
    }

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;
