import type { Server } from "http";
import { logger } from "../utils/logger.js";
import { closeDb } from "../db.js";

/**
 * Configure graceful shutdown handlers
 */
export function configureShutdown(server: Server | null): void {
  const gracefulShutdown = (signal: string) => {
    logger.info({ context: "Shutdown" }, `Received ${signal}, starting graceful shutdown...`);

    if (server) {
      server.close(() => {
        logger.info({ context: "Shutdown" }, "HTTP server closed");

        // Close database connection
        closeDb();
        logger.info({ context: "Shutdown" }, "Database connection closed");

        logger.info({ context: "Shutdown" }, "Graceful shutdown complete");
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error({ context: "Shutdown" }, "Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    } else {
      closeDb();
      process.exit(0);
    }
  };

  // Handle shutdown signals
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    logger.error({ err, context: "Shutdown" }, "Uncaught exception");
    gracefulShutdown("uncaughtException");
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    logger.error({ reason, promise, context: "Shutdown" }, "Unhandled promise rejection");
    gracefulShutdown("unhandledRejection");
  });
}
