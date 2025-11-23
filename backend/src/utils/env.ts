import { z } from "zod";

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
      console.error("❌ Environment variable validation failed:");
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
      throw new Error("Invalid environment variables");
    }
    throw error;
  }
}
