import { z } from "zod";
import { logger } from "./logger.js";

/**
 * Environment variable validation schema
 */
const envSchema = z.object({
  PORT: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  BASE_URL: z.string().url().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  DB_PATH: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .optional(),
  CACHE_TTL: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
});

/**
 * Validated environment variables
 */
export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

/**
 * Get validated environment variables
 * Throws error if validation fails
 */
export function getEnv(): Env {
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    validatedEnv = envSchema.parse(process.env);
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      logger.error(
        { errors: errorDetails },
        "Environment variable validation failed"
      );
      throw new Error("Invalid environment variables");
    }
    throw error;
  }
}
