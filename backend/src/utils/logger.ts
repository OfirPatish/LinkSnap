import pino from "pino";
import { getEnv } from "./env.js";

/**
 * Structured logger using Pino
 * Provides different log levels and pretty printing in development
 */
export const logger = pino({
  level:
    process.env.LOG_LEVEL ||
    (getEnv().NODE_ENV === "production" ? "warn" : "info"),
  transport:
    getEnv().NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
            singleLine: false,
            hideObject: false,
          },
        }
      : undefined,
  formatters: {
    level: (label) => {
      // Return level as uppercase string for display
      return { level: label.toUpperCase() };
    },
    log: (object) => {
      // Add icon and context formatting to the log object
      const level = object.level || 20;
      const icons: Record<number, string> = {
        10: "🔍",
        20: "ℹ️ ",
        30: "⚠️ ",
        40: "❌",
        50: "💀",
      };
      const icon = icons[level] || "📝";
      
      // Format message with icon and context
      if (object.msg && typeof object.msg === "string") {
        const context = object.context ? `[${object.context}]` : "";
        object.msg = `${icon} ${context} ${object.msg}`.trim();
      }
      
      return object;
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Request logger middleware for Pino
 * Use this instead of the basic requestLogger middleware
 */
export { pinoHttp } from "pino-http";
