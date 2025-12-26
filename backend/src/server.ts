import express from "express";
import type { Server } from "http";
import dotenv from "dotenv";
import {
  configureMiddleware,
  configureRoutes,
  configureErrorHandler,
  configureShutdown,
} from "./config/index.js";
import { initDb } from "./db.js";
import { logger } from "./utils/logger.js";
import { getEnv } from "./utils/env.js";
import { DEFAULT_PORT } from "./constants/index.js";

dotenv.config();

// Validate environment variables
const env = getEnv();
const PORT = env.PORT || DEFAULT_PORT;
const app = express();

// Configure application
configureMiddleware(app);
configureRoutes(app);
configureErrorHandler(app);

// Initialize database and start server
let server: Server | null = null;

const startServer = () => {
  try {
    initDb();
    logger.info({ context: "Database" }, "Database initialized successfully");

    server = app.listen(PORT, () => {
      logger.info(
        {
          context: "Server",
          port: PORT,
          env: env.NODE_ENV,
        },
        `Server running on http://localhost:${PORT}`
      );
    });

    // Configure graceful shutdown
    configureShutdown(server);
  } catch (err) {
    logger.error({ err, context: "Server" }, "Failed to start server");
    process.exit(1);
  }
};

startServer();
