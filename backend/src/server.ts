import express from "express";
import dotenv from "dotenv";
import compression from "compression";
import shortenRouter from "./routes/shorten.js";
import redirectRouter from "./routes/redirect.js";
import statsRouter from "./routes/stats.js";
import { initDb, checkDbHealth } from "./db.js";
import { corsMiddleware } from "./middleware/cors.js";
import { apiLimiter, shortenLimiter } from "./middleware/rateLimit.js";
import { securityHeaders } from "./middleware/security.js";
import { requestLogger } from "./middleware/logger.js";
import { getEnv } from "./utils/env.js";
import { DEFAULT_PORT } from "./constants/index.js";
import { AppError } from "./utils/errors.js";

dotenv.config();

// Validate environment variables
const env = getEnv();
const PORT = env.PORT || DEFAULT_PORT;
const app = express();

// Trust proxy for accurate IP addresses behind reverse proxies
app.set("trust proxy", 1);

// Middleware
app.use(compression()); // Enable gzip compression
app.use(express.json({ limit: "10mb" })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(securityHeaders); // Security headers
app.use(requestLogger); // Request logging
app.use(corsMiddleware); // CORS

// Routes with rate limiting
app.use("/api/shorten", shortenLimiter, shortenRouter);
app.use("/api/stats", apiLimiter, statsRouter);

// Health check (must be before redirect router)
app.get("/health", async (req, res) => {
  const dbHealthy = await checkDbHealth();
  
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
  });
});

app.use("/", redirectRouter); // Must be last to catch slug routes

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Log error details
    console.error("Error:", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });

    // Handle known application errors
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    }

    // Handle Zod validation errors
    if (err.name === "ZodError") {
      return res.status(400).json({
        error: "Validation error",
        details: (err as any).errors,
      });
    }

    // Default error response
    const statusCode = (err as any).statusCode || 500;
    const message =
      env.NODE_ENV === "production" ? "Internal server error" : err.message;

    res.status(statusCode).json({
      error: message,
    });
  }
);

// Initialize database and start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
