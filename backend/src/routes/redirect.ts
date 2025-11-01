import { Router, Request, Response } from "express";
import { findLinkBySlug, incrementClicks } from "../url.service.js";

const router = Router();

router.get("/:slug", (req: Request, res: Response) => {
  const { slug } = req.params;

  const link = findLinkBySlug(slug);

  if (!link) {
    return res.status(404).json({ error: "Short link not found" });
  }

  // Increment click count
  incrementClicks(slug);

  // Redirect with 302 (temporary redirect) so browsers don't cache it
  // This ensures each click hits the server and increments the counter
  res.redirect(302, link.url);
});

export default router;
