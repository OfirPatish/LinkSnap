import { Router, Request, Response } from "express";
import { z } from "zod";
import { createLink } from "../url.service.js";
import { shortenUrlSchema } from "../validators/index.js";
import { getBaseUrl } from "../utils/url.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { url } = shortenUrlSchema.parse(req.body);
    const baseUrl = getBaseUrl(req);

    const result = createLink(url, baseUrl);

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
