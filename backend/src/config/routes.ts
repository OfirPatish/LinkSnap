import express from "express";
import shortenRouter from "../routes/shorten.js";
import redirectRouter from "../routes/redirect.js";
import statsRouter from "../routes/stats.js";
import { checkDbHealth } from "../db.js";
import { shortenLimiter, apiLimiter } from "./middleware.js";

/**
 * Configure all application routes
 */
export function configureRoutes(app: express.Application): void {
  // Routes with rate limiting
  app.use("/api/shorten", shortenLimiter, shortenRouter);
  app.use("/api/stats", apiLimiter, statsRouter);

  // Health check endpoint (must be before redirect router)
  app.get("/health", (req, res) => {
    const dbHealthy = checkDbHealth();

    if (!dbHealthy) {
      return res.status(503).json({
        status: "unhealthy",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Redirect router (must be last to catch slug routes)
  app.use("/", redirectRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: "Not found",
      path: req.path,
    });
  });
}

