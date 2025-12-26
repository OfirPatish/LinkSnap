import { z } from "zod";

/**
 * Custom URL validation that checks for valid URL format and domain
 */
const urlValidation = z
  .string()
  .min(1, "URL is required")
  .trim()
  .refine(
    (url) => {
      // Basic URL pattern check
      // url is already trimmed by Zod's .trim()
      if (!url) return false;

      // Try to parse as URL (with or without protocol)
      let testUrl = url;
      if (!url.match(/^https?:\/\//i)) {
        testUrl = `https://${url}`;
      }

      try {
        const urlObj = new URL(testUrl);
        // Check that it has a valid hostname (not empty, not just a single word)
        const hostname = urlObj.hostname;

        // Must have a domain (at least one dot) or be localhost
        // Allow: example.com, sub.example.com, localhost, 127.0.0.1
        // Reject: asd, test, single-word strings
        if (
          hostname === "localhost" ||
          hostname.match(/^\d+\.\d+\.\d+\.\d+$/) || // IP address
          hostname.includes(".") // Has a domain
        ) {
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    {
      message:
        "Please enter a valid URL (e.g., example.com or https://example.com)",
    }
  );

/**
 * Validation schema for URL shortening requests
 */
export const shortenUrlSchema = z.object({
  url: urlValidation,
});

