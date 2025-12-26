/**
 * Frontend logger utility
 * Provides structured logging with different log levels
 * Pretty-printed in development, minimal in production
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogOptions {
  context?: string;
  data?: unknown;
}

class Logger {
  private isDev: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.isDev = import.meta.env.DEV;
    // Support VITE_LOG_LEVEL environment variable (debug, info, warn, error)
    // In production, default to warn (only warnings and errors)
    // In development, default to debug (all logs)
    const envLogLevel = import.meta.env.VITE_LOG_LEVEL?.toLowerCase() as
      | LogLevel
      | undefined;
    const validLevels: LogLevel[] = ["debug", "info", "warn", "error"];

    if (envLogLevel && validLevels.includes(envLogLevel)) {
      this.logLevel = envLogLevel;
    } else {
      this.logLevel = this.isDev ? "debug" : "warn";
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private getLevelIcon(level: LogLevel): string {
    const icons: Record<LogLevel, string> = {
      debug: "🔍",
      info: "ℹ️",
      warn: "⚠️",
      error: "❌",
    };
    return icons[level] || "📝";
  }

  private getLevelColor(level: LogLevel): string {
    if (!this.isDev) return "";
    const colors: Record<LogLevel, string> = {
      debug: "color: #6B7280; font-weight: normal;",
      info: "color: #3B82F6; font-weight: 500;",
      warn: "color: #F59E0B; font-weight: 500;",
      error: "color: #EF4444; font-weight: 600;",
    };
    return colors[level] || "";
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    options?: LogOptions
  ): string {
    const timestamp = this.isDev ? new Date().toLocaleTimeString() : "";
    const icon = this.getLevelIcon(level);
    const levelLabel = level.toUpperCase().padEnd(5);
    const context = options?.context ? `[${options.context}]` : "";

    if (this.isDev) {
      return `${icon} ${timestamp} ${levelLabel} ${context} ${message}`.trim();
    }
    return `${icon} ${levelLabel} ${context} ${message}`.trim();
  }

  private log(level: LogLevel, message: string, options?: LogOptions): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, options);
    const consoleMethod = console[level] || console.log;
    const colorStyle = this.getLevelColor(level);

    if (this.isDev && colorStyle) {
      if (options?.data) {
        consoleMethod(`%c${formattedMessage}`, colorStyle, options.data);
      } else {
        consoleMethod(`%c${formattedMessage}`, colorStyle);
      }
    } else {
      if (options?.data) {
        consoleMethod(formattedMessage, options.data);
      } else {
        consoleMethod(formattedMessage);
      }
    }
  }

  debug(message: string, options?: LogOptions): void {
    this.log("debug", message, options);
  }

  info(message: string, options?: LogOptions): void {
    this.log("info", message, options);
  }

  warn(message: string, options?: LogOptions): void {
    this.log("warn", message, options);
  }

  error(message: string, error?: Error | unknown, options?: LogOptions): void {
    const errorMessage =
      error instanceof Error ? `${message}: ${error.message}` : message;
    const formattedMessage = this.formatMessage("error", errorMessage, options);
    const colorStyle = this.isDev ? "color: #EF4444; font-weight: 600;" : "";

    if (error instanceof Error) {
      const errorData: Record<string, unknown> = {
        error: error.message,
      };
      if (this.isDev && error.stack) {
        errorData.stack = error.stack;
      }
      if (options?.data) {
        errorData.data = options.data;
      }

      if (this.isDev && colorStyle) {
        console.error(`%c${formattedMessage}`, colorStyle, errorData);
      } else {
        console.error(formattedMessage, errorData);
      }
    } else if (error) {
      if (this.isDev && colorStyle) {
        console.error(
          `%c${formattedMessage}`,
          colorStyle,
          error,
          options?.data
        );
      } else {
        console.error(formattedMessage, error, options?.data);
      }
    } else {
      if (this.isDev && colorStyle) {
        console.error(`%c${formattedMessage}`, colorStyle);
      } else {
        console.error(formattedMessage);
      }
    }
  }
}

export const logger = new Logger();
