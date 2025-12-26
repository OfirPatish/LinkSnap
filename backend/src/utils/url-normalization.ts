/**
 * URL normalization utilities
 * Handles URL validation and normalization logic
 */

/**
 * Normalize URL to ensure it has a scheme
 * Also validates that the URL has a valid hostname
 */
export function normalizeUrl(url: string): string {
  let normalized = url.trim();

  // Add https:// if no scheme is present
  const protocolMatch = normalized.match(/^(https?:\/\/)/i);
  if (!protocolMatch) {
    normalized = `https://${normalized}`;
  } else {
    // Normalize protocol to lowercase
    const lowerProtocol = protocolMatch[1].toLowerCase();
    normalized = lowerProtocol + normalized.substring(protocolMatch[1].length);
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

