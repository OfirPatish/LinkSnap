/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Sanitize string input by removing potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers
}

/**
 * Sanitize URL to prevent XSS and protocol-based attacks
 */
export function sanitizeUrl(url: string): string {
  const sanitized = url.trim();
  
  // Remove dangerous protocols
  const dangerousProtocols = [
    "javascript:",
    "data:",
    "vbscript:",
    "file:",
    "about:",
  ];
  
  const lowerUrl = sanitized.toLowerCase();
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      throw new Error(`Dangerous protocol detected: ${protocol}`);
    }
  }
  
  return sanitized;
}

/**
 * Sanitize slug to ensure it only contains safe characters
 */
export function sanitizeSlug(slug: string): string {
  // Only allow alphanumeric, hyphens, and underscores
  return slug.replace(/[^a-zA-Z0-9_-]/g, "");
}

