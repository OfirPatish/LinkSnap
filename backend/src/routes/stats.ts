import { Router, Request, Response, NextFunction } from "express";
import { getLinkStats } from "../services/url.js";
import { NotFoundError } from "../utils/errors.js";
import { validateSlug } from "../middleware/validateSlug.js";

const router = Router();

router.get("/:slug", validateSlug, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

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
