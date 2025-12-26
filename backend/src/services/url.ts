import { nanoid } from "nanoid";
import db from "../db.js";
import type { Link, CreateLinkResult, LinkStats } from "../types/index.js";
import {
  SLUG_LENGTH,
  MAX_RETRIES,
  MAX_URL_LENGTH,
} from "../constants/index.js";
import { DatabaseError, ValidationError } from "../utils/errors.js";
import { sanitizeUrl } from "../utils/sanitize.js";
import { normalizeUrl } from "../utils/url-normalization.js";
import { linkCache } from "../utils/cache.js";
import { logger } from "../utils/logger.js";

// Re-export types for convenience
export type { Link, CreateLinkResult, LinkStats };

/**
 * Create a new short link
 */
export function createLink(
  originalUrl: string,
  baseUrl: string
): CreateLinkResult {
  try {
    // Sanitize URL first
    const sanitizedUrl = sanitizeUrl(originalUrl);
    const normalizedUrl = normalizeUrl(sanitizedUrl);

    // Validate URL
    try {
      new URL(normalizedUrl);
    } catch {
      throw new ValidationError("Invalid URL format");
    }

    // Validate scheme (http/https only)
    const urlObj = new URL(normalizedUrl);
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      throw new ValidationError("URL must use http or https protocol");
    }

    // Validate length (reasonable limit)
    if (normalizedUrl.length > MAX_URL_LENGTH) {
      throw new ValidationError(
        `URL is too long (max ${MAX_URL_LENGTH} characters)`
      );
    }

    // Generate unique slug with retry logic
    let slug: string | undefined;
    let attempts = 0;

    const insertStmt = db.prepare(`
      INSERT INTO links (slug, url)
      VALUES (?, ?)
    `);

    while (attempts < MAX_RETRIES) {
      slug = nanoid(SLUG_LENGTH);

      try {
        insertStmt.run(slug, normalizedUrl);
        break;
      } catch (err: any) {
        // If it's a unique constraint violation, retry
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
          attempts++;
          if (attempts >= MAX_RETRIES) {
            throw new DatabaseError(
              "Failed to generate unique slug after multiple attempts"
            );
          }
          continue;
        }
        // Re-throw database errors
        throw new DatabaseError(
          `Database error: ${err.message || "Unknown error"}`
        );
      }
    }

    if (!slug) {
      throw new DatabaseError("Failed to create link");
    }

    const shortUrl = `${baseUrl}/${slug}`;

    const result = {
      slug,
      shortUrl,
      url: normalizedUrl,
    };

    // Cache the link for faster retrieval
    const link = findLinkBySlug(slug);
    if (link) {
      linkCache.set(`link:${slug}`, link);
    }

    return result;
  } catch (error) {
    // Re-throw AppError instances as-is
    if (error instanceof ValidationError || error instanceof DatabaseError) {
      throw error;
    }
    // Wrap unexpected errors
    if (error instanceof Error) {
      // Check if it's a validation error from normalizeUrl or sanitizeUrl
      if (error.message.includes("Invalid URL") || error.message.includes("Dangerous protocol")) {
        throw new ValidationError(error.message);
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
    throw new DatabaseError("Unknown error occurred");
  }
}

/**
 * Find a link by slug
 * Checks if link is active and not expired
 * Uses cache for frequently accessed links
 */
export function findLinkBySlug(slug: string): Link | null {
  try {
    // Check cache first
    const cached = linkCache.get(`link:${slug}`);
    if (cached) {
      // Verify it's still valid (not expired)
      const link = cached as Link;
      if (link.is_active === 1) {
        if (!link.expires_at) {
          return link;
        }
        // Check if expired
        const expiresAt = new Date(link.expires_at);
        const now = new Date();
        if (expiresAt > now) {
          return link;
        } else {
          // Expired, remove from cache
          linkCache.delete(`link:${slug}`);
        }
      }
    }

    // Query database
    // Use julianday for reliable date comparison across different formats
    const stmt = db.prepare(`
      SELECT * FROM links 
      WHERE slug = ? 
        AND is_active = 1 
        AND (expires_at IS NULL OR julianday(expires_at) > julianday('now'))
    `);
    const row = stmt.get(slug) as Link | undefined;

    if (row) {
      // Cache the result
      linkCache.set(`link:${slug}`, row);
      return row;
    }

    return null;
  } catch (error) {
    throw new DatabaseError(
      `Failed to find link: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Increment click count for a slug
 * Note: Errors are logged but not thrown to avoid breaking redirects
 * Invalidates cache to ensure fresh data on next read
 */
export function incrementClicks(slug: string): void {
  try {
    const stmt = db.prepare(
      "UPDATE links SET clicks = clicks + 1 WHERE slug = ?"
    );
    stmt.run(slug);

    // Invalidate cache to ensure fresh data
    linkCache.delete(`link:${slug}`);
  } catch (error) {
    // Log error but don't throw - we don't want to break redirects
    // if click tracking fails
    logger.error({ err: error, slug }, "Failed to increment clicks");
  }
}

/**
 * Get stats for a slug
 */
export function getLinkStats(slug: string): LinkStats | null {
  try {
    const link = findLinkBySlug(slug);
    if (!link) {
      return null;
    }

    return {
      slug: link.slug,
      url: link.url,
      clicks: link.clicks,
      createdAt: link.created_at,
    };
  } catch (error) {
    // Re-throw database errors
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to get stats: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
