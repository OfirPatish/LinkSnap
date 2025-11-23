import { Router, Request, Response } from "express";
import { z } from "zod";
import { createLink } from "../url.service.js";
import { shortenUrlSchema } from "../validators/index.js";
import { getBaseUrl } from "../utils/url.js";
import { ValidationError, DatabaseError } from "../utils/errors.js";

const router = Router();

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const { url } = shortenUrlSchema.parse(req.body);
    const baseUrl = getBaseUrl(req);

    const result = createLink(url, baseUrl);

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.errors[0].message));
    }

    if (error instanceof Error) {
      // Check if it's a database-related error
      if (
        error.message.includes("SQLITE") ||
        error.message.includes("database")
      ) {
        return next(new DatabaseError(error.message));
      }
      return next(new ValidationError(error.message));
    }

    next(error);
  }
});

export default router;
