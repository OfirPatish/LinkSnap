# LinkSnap Backend API Reference

This document provides a comprehensive API reference for the LinkSnap backend. Use this as a reference when building the frontend or integrating with the API.

## Base URL

```
Development: http://localhost:4000
Production: [Your production URL]
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible with rate limiting applied.

## Rate Limits

- **General API**: 100 requests per 15 minutes per IP
- **URL Shortening**: 10 requests per minute per IP
- **Rate limit headers**: `RateLimit-*` headers are included in responses

## Response Format

### Success Response

All successful responses return JSON with the following structure:

```json
{
  "field1": "value1",
  "field2": "value2"
}
```

### Error Response

All error responses return JSON with the following structure:

```json
{
  "error": "Error message here"
}
```

For validation errors (400), additional details may be included:

```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["field"],
      "message": "Field is required"
    }
  ]
}
```

## HTTP Status Codes

- `200` - Success
- `302` - Temporary redirect (for slug redirects)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable (database disconnected)

---

## Endpoints

### 1. Create Short URL

Create a new short URL from a long URL.

**Endpoint:** `POST /api/shorten`

**Rate Limit:** 10 requests per minute

**Request Body:**

```json
{
  "url": "https://example.com/very/long/url/path"
}
```

**Request Body Schema:**
- `url` (string, required): The URL to shorten. Can be with or without protocol (http/https will be added automatically if missing). Must be a valid URL with a domain name.

**Example Request:**

```bash
curl -X POST http://localhost:4000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/very/long/url"}'
```

**Success Response (200):**

```json
{
  "slug": "abc1234",
  "shortUrl": "http://localhost:4000/abc1234",
  "url": "https://example.com/very/long/url"
}
```

**Response Fields:**
- `slug` (string): The unique slug identifier for the short URL
- `shortUrl` (string): The complete short URL (base URL + slug)
- `url` (string): The normalized original URL

**Error Responses:**

**400 Bad Request** - Invalid URL format:
```json
{
  "error": "Please enter a valid URL (e.g., example.com or https://example.com)"
}
```

**400 Bad Request** - URL too long:
```json
{
  "error": "URL is too long (max 2048 characters)"
}
```

**400 Bad Request** - Invalid protocol:
```json
{
  "error": "URL must use http or https protocol"
}
```

**429 Too Many Requests**:
```json
{
  "error": "Too many URL shortening requests, please try again later."
}
```

**500 Internal Server Error**:
```json
{
  "error": "Failed to generate unique slug after multiple attempts"
}
```

---

### 2. Redirect to Original URL

Redirect to the original URL using a slug.

**Endpoint:** `GET /:slug`

**Rate Limit:** 100 requests per 15 minutes

**URL Parameters:**
- `slug` (string, required): The slug identifier (3-20 characters, alphanumeric, hyphens, underscores)

**Example Request:**

```bash
curl -L http://localhost:4000/abc1234
```

**Success Response (302):**

HTTP 302 redirect to the original URL.

**Response Headers:**
- `Location`: The original URL to redirect to

**Error Responses:**

**404 Not Found** - Invalid slug format:
```json
{
  "error": "Invalid short link format"
}
```

**404 Not Found** - Slug not found:
```json
{
  "error": "Short link not found"
}
```

**Note:** This endpoint increments the click counter for the slug automatically.

---

### 3. Get Link Statistics

Get statistics for a shortened URL.

**Endpoint:** `GET /api/stats/:slug`

**Rate Limit:** 100 requests per 15 minutes

**URL Parameters:**
- `slug` (string, required): The slug identifier (3-20 characters, alphanumeric, hyphens, underscores)

**Example Request:**

```bash
curl http://localhost:4000/api/stats/abc1234
```

**Success Response (200):**

```json
{
  "slug": "abc1234",
  "url": "https://example.com/very/long/url",
  "clicks": 42,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Response Fields:**
- `slug` (string): The slug identifier
- `url` (string): The original URL
- `clicks` (number): Total number of clicks/redirects
- `createdAt` (string): ISO 8601 timestamp of when the link was created

**Error Responses:**

**404 Not Found** - Invalid slug format:
```json
{
  "error": "Invalid short link format"
}
```

**404 Not Found** - Slug not found:
```json
{
  "error": "Short link not found"
}
```

---

### 4. Health Check

Check the health status of the API and database.

**Endpoint:** `GET /health`

**Rate Limit:** None

**Example Request:**

```bash
curl http://localhost:4000/health
```

**Success Response (200):**

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600.123
}
```

**Response Fields:**
- `status` (string): Health status ("ok" or "unhealthy")
- `database` (string): Database connection status ("connected" or "disconnected")
- `timestamp` (string): ISO 8601 timestamp of the health check
- `uptime` (number): Server uptime in seconds

**Error Response (503):**

When database is disconnected:

```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## TypeScript Types

For frontend TypeScript integration, use these types:

```typescript
// Request types
interface ShortenUrlRequest {
  url: string;
}

// Response types
interface ShortenUrlResponse {
  slug: string;
  shortUrl: string;
  url: string;
}

interface LinkStats {
  slug: string;
  url: string;
  clicks: number;
  createdAt: string;
}

interface HealthCheckResponse {
  status: "ok" | "unhealthy";
  database: "connected" | "disconnected";
  timestamp: string;
  uptime?: number;
}

// Error response type
interface ErrorResponse {
  error: string;
  details?: Array<{
    path: string[];
    message: string;
  }>;
}
```

---

## URL Validation Rules

The API validates URLs according to these rules:

1. **Protocol**: URLs can be provided with or without `http://` or `https://`. If missing, `https://` is automatically added.

2. **Domain**: Must be a valid domain name:
   - ✅ `example.com`
   - ✅ `sub.example.com`
   - ✅ `localhost` (for development)
   - ✅ `127.0.0.1` (IP addresses)
   - ❌ `singleword` (no domain separator)
   - ❌ `invalid` (not a valid URL)

3. **Length**: Maximum 2048 characters

4. **Protocol**: Only `http://` and `https://` are allowed

5. **Sanitization**: Dangerous protocols and XSS attempts are automatically sanitized

---

## Slug Format

- **Length**: 3-20 characters
- **Characters**: Alphanumeric (a-z, A-Z, 0-9), hyphens (-), underscores (_)
- **Generated**: Automatically using nanoid (7 characters by default)
- **Uniqueness**: Guaranteed by database constraints

---

## CORS Configuration

The API supports CORS. Configure allowed origins via the `ALLOWED_ORIGINS` environment variable:

```env
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

If not set, all origins are allowed (`*`).

---

## Error Handling

### Error Types

1. **ValidationError (400)**: Invalid input data
2. **NotFoundError (404)**: Resource not found
3. **RateLimitError (429)**: Rate limit exceeded
4. **DatabaseError (500)**: Database operation failed
5. **Generic Error (500)**: Unexpected server error

### Error Response Format

```json
{
  "error": "Error message",
  "details": [] // Only for validation errors
}
```

In development mode, error responses may include a `stack` field with the error stack trace.

---

## Example Frontend Integration

### JavaScript/TypeScript Fetch Example

```typescript
const API_BASE_URL = 'http://localhost:4000';

// Shorten URL
async function shortenUrl(url: string): Promise<ShortenUrlResponse> {
  const response = await fetch(`${API_BASE_URL}/api/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}

// Get stats
async function getStats(slug: string): Promise<LinkStats> {
  const response = await fetch(`${API_BASE_URL}/api/stats/${slug}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}

// Health check
async function checkHealth(): Promise<HealthCheckResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}
```

### React Hook Example

```typescript
import { useState } from 'react';

function useUrlShortener() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shortenUrl = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to shorten URL';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { shortenUrl, loading, error };
}
```

---

## Best Practices

1. **Error Handling**: Always check `response.ok` before parsing JSON
2. **Rate Limiting**: Implement exponential backoff for 429 responses
3. **URL Validation**: Validate URLs on the frontend before sending to API
4. **Caching**: Consider caching stats responses for frequently accessed slugs
5. **Health Checks**: Use the health endpoint for monitoring and status pages

---

## Changelog

### Current Version
- Native SQLite with better-sqlite3
- Structured logging with Pino
- In-memory caching for links
- Graceful shutdown handling
- Comprehensive error handling
- Input sanitization and XSS protection

---

## Support

For issues or questions, refer to the main [README.md](./README.md) or [STRUCTURE.md](./STRUCTURE.md) files.

