import { nanoid } from "nanoid";
import db from "./db.js";
import type { Link, CreateLinkResult, LinkStats } from "./types/index.js";
import { SLUG_LENGTH, MAX_RETRIES, MAX_URL_LENGTH } from "./constants/index.js";

// Re-export types for convenience
export type { Link, CreateLinkResult, LinkStats };

/**
 * Normalize URL to ensure it has a scheme
 * Also validates that the URL has a valid hostname
 */
function normalizeUrl(url: string): string {
  let normalized = url.trim();

  // Add https:// if no scheme is present
  if (!normalized.match(/^https?:\/\//i)) {
    normalized = `https://${normalized}`;
  }

  // Validate hostname
  try {
    const urlObj = new URL(normalized);
    const hostname = urlObj.hostname;

    // Reject invalid hostnames (single words without domain)
    if (
      hostname &&
      hostname !== "localhost" &&
      !hostname.match(/^\d+\.\d+\.\d+\.\d+$/) && // Not an IP address
      !hostname.includes(".") // No domain separator
    ) {
      throw new Error("Invalid URL: must include a valid domain name");
    }
  } catch (error) {
    // Re-throw URL validation errors
    if (error instanceof Error && error.message.includes("Invalid URL")) {
      throw error;
    }
    throw new Error("Invalid URL format");
  }

  return normalized;
}

/**
 * Create a new short link
 */
export function createLink(
  originalUrl: string,
  baseUrl: string
): CreateLinkResult {
  const normalizedUrl = normalizeUrl(originalUrl);

  // Validate URL
  try {
    new URL(normalizedUrl);
  } catch {
    throw new Error("Invalid URL format");
  }

  // Validate scheme (http/https only)
  const urlObj = new URL(normalizedUrl);
  if (!["http:", "https:"].includes(urlObj.protocol)) {
    throw new Error("URL must use http or https protocol");
  }

  // Validate length (reasonable limit)
  if (normalizedUrl.length > MAX_URL_LENGTH) {
    throw new Error(`URL is too long (max ${MAX_URL_LENGTH} characters)`);
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
          throw new Error(
            "Failed to generate unique slug after multiple attempts"
          );
        }
        continue;
      }
      throw err;
    }
  }

  if (!slug) {
    throw new Error("Failed to create link");
  }

  const shortUrl = `${baseUrl}/${slug}`;

  return {
    slug,
    shortUrl,
    url: normalizedUrl,
  };
}

/**
 * Find a link by slug
 */
export function findLinkBySlug(slug: string): Link | null {
  const stmt = db.prepare("SELECT * FROM links WHERE slug = ?");
  const row = stmt.get(slug) as Link | undefined;
  return row || null;
}

/**
 * Increment click count for a slug
 */
export function incrementClicks(slug: string): void {
  const stmt = db.prepare(
    "UPDATE links SET clicks = clicks + 1 WHERE slug = ?"
  );
  stmt.run(slug);
}

/**
 * Get stats for a slug
 */
export function getLinkStats(slug: string): LinkStats | null {
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
}
