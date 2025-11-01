# How the Backend Works

This document explains how the LinkSnap backend functions, focusing on the custom implementation files and the flow of data through the system.

---

## 🏗️ Architecture Overview

The backend follows a clean layered architecture:

```
Request → Routes → Service Layer → Database Layer
         ↓
      Response
```

**Flow:**

1. **Routes** - Handle HTTP requests/responses
2. **Validators** - Validate incoming data
3. **Service Layer** - Business logic (URL shortening, stats)
4. **Database Layer** - Data persistence

---

## 📁 File-by-File Explanation

### `server.ts` - Application Entry Point

**Purpose:** Sets up the Express server and wires everything together.

**What it does:**

- Initializes Express app
- Loads environment variables (`.env` file)
- Registers middleware (JSON parsing, CORS)
- Mounts route handlers
- Initializes database on startup
- Starts HTTP server

**Key Points:**

- Database initialization happens **before** server starts (ensures DB is ready)
- Routes are mounted in specific order:
  1. API routes (`/api/shorten`, `/api/stats`)
  2. Health check (`/health`)
  3. Redirect route (`/:slug`) - **must be last** to catch all remaining paths
- Global error handler catches any unhandled errors

**Flow:**

```
Server starts → Load .env → Setup middleware → Mount routes → Init DB → Listen on port
```

---

### `db.ts` - Database Layer

**Purpose:** Manages SQLite database connection and provides a clean API.

**What it does:**

- Wraps `sql.js` (JavaScript SQLite) to provide a simpler API
- Creates database file automatically (`data/linksnap.db`)
- Creates `links` table on first run
- Provides `prepare()`, `run()`, `get()`, `all()` methods
- Auto-saves database after write operations

**Database Schema:**

```sql
links table:
- id (primary key, auto-increment)
- slug (unique, the short identifier)
- url (original long URL)
- clicks (counter, starts at 0)
- created_at (timestamp)
```

**Key Points:**

- Database is created in `data/` folder (or custom `DB_PATH`)
- Uses `sql.js` (pure JavaScript) instead of native SQLite (works everywhere)
- Automatically creates table structure on first run
- Saves database to disk after each write operation

**Why sql.js?**

- Works in serverless environments (no native dependencies)
- Pure JavaScript (no compilation needed)
- Same SQLite SQL syntax

---

### `url.service.ts` - Business Logic Layer

**Purpose:** Contains all the core business logic for URL shortening.

**Functions:**

#### `createLink(originalUrl, baseUrl)`

**What it does:**

1. **Normalizes URL** - Adds `https://` if missing
2. **Validates URL** - Checks format, protocol (http/https only), length
3. **Generates unique slug** - Uses `nanoid` to create 7-character random ID
4. **Handles collisions** - Retries up to 5 times if slug already exists
5. **Saves to database** - Stores slug + original URL
6. **Returns result** - Slug, short URL, and original URL

**Example:**

```javascript
createLink("https://example.com", "https://mysite.com");
// Returns: { slug: "abc1234", shortUrl: "https://mysite.com/abc1234", url: "https://example.com" }
```

#### `findLinkBySlug(slug)`

**What it does:**

- Looks up a link in database by its slug
- Returns `Link` object or `null` if not found

#### `incrementClicks(slug)`

**What it does:**

- Increments the click counter for a slug
- Called every time someone visits a short link

#### `getLinkStats(slug)`

**What it does:**

- Gets statistics for a link (slug, URL, clicks, creation date)
- Used by the stats API endpoint

**Key Points:**

- All database operations go through this service layer
- Handles URL normalization (adds https:// if missing)
- Retry logic prevents slug collisions
- Validates everything before saving

---

### `routes/shorten.ts` - Create Short URL Endpoint

**Purpose:** Handles `POST /api/shorten` requests.

**Flow:**

```
1. Receive POST request with { url: "https://..." }
2. Validate request body using Zod schema
3. Get base URL (from env or auto-detect from request headers)
4. Call createLink() service function
5. Return JSON response with slug and short URL
```

**What happens:**

- Validates input with Zod (ensures URL is present and valid)
- Extracts base URL from request (for building short URL)
- Calls service layer to create the link
- Returns the result to frontend

**Error Handling:**

- Zod validation errors → 400 Bad Request
- Invalid URL format → 400 Bad Request
- Other errors → 500 Internal Server Error

**Example Request/Response:**

```json
POST /api/shorten
{ "url": "https://example.com" }

Response:
{
  "slug": "abc1234",
  "shortUrl": "https://mysite.com/abc1234",
  "url": "https://example.com"
}
```

---

### `routes/redirect.ts` - Redirect Short Links

**Purpose:** Handles `GET /:slug` requests (the actual short link clicks).

**Flow:**

```
1. Extract slug from URL path
2. Look up link in database
3. If found: increment click counter → redirect to original URL
4. If not found: return 404 error
```

**What happens:**

- User visits `https://mysite.com/abc1234`
- Backend extracts `abc1234` as the slug
- Looks up in database
- Increments click count (tracking)
- Redirects user to original URL with HTTP 301 (permanent redirect)

**Key Points:**

- Uses 301 redirect (permanent) - good for SEO
- Click tracking happens automatically
- Must be mounted **last** in server.ts (catches all remaining routes)

**Why mounted last?**

- Routes are matched in order
- If this route was first, it would catch `/api/shorten` too!
- By putting it last, it only catches paths that didn't match API routes

---

### `routes/stats.ts` - Get Statistics Endpoint

**Purpose:** Handles `GET /api/stats/:slug` requests.

**Flow:**

```
1. Extract slug from URL path
2. Get stats from database
3. Return JSON with slug, URL, clicks, and creation date
```

**What happens:**

- Frontend requests stats for a specific slug
- Backend looks up the link
- Returns statistics (clicks, creation date, etc.)

**Example Response:**

```json
GET /api/stats/abc1234

Response:
{
  "slug": "abc1234",
  "url": "https://example.com",
  "clicks": 42,
  "createdAt": "2024-01-01 12:00:00"
}
```

---

### `utils/url.ts` - URL Helper Functions

**Purpose:** Utility for determining the base URL of the application.

**Function: `getBaseUrl(req)`**

**What it does:**

1. Checks `BASE_URL` environment variable first
2. If not set, auto-detects from request headers:
   - Uses `x-forwarded-proto` and `x-forwarded-host` (from proxies/load balancers)
   - Falls back to `req.host` header
   - Final fallback: `localhost:4000`

**Why this matters:**

- Short URLs need to know the domain they're hosted on
- Works behind proxies (Vercel, Railway, etc.) automatically
- Can be explicitly set via `BASE_URL` env variable

**Example:**

```javascript
// If BASE_URL=https://mysite.com set in .env
getBaseUrl(req) → "https://mysite.com"

// If not set, auto-detects from request
getBaseUrl(req) → "https://mysite.com" (from headers)
```

---

### `validators/index.ts` - Input Validation

**Purpose:** Validates incoming request data using Zod schemas.

**Schema: `shortenUrlSchema`**

**What it does:**

- Ensures `url` field is present
- Validates it's a string
- Validates it's a valid URL format

**Why Zod?**

- Type-safe validation
- Automatic error messages
- Integrates well with TypeScript

**Usage:**

```javascript
const { url } = shortenUrlSchema.parse(req.body);
// Throws ZodError if validation fails
```

---

### `middleware/cors.ts` - CORS Configuration

**Purpose:** Handles Cross-Origin Resource Sharing (CORS) headers.

**What it does:**

- Allows frontend (different domain) to call backend API
- Reads `ALLOWED_ORIGINS` environment variable
- Defaults to `*` (allows all origins) if not set
- Sets appropriate CORS headers

**Why needed:**

- Frontend runs on `localhost:5173`
- Backend runs on `localhost:4000`
- Browser blocks cross-origin requests without CORS headers

**For Production:**

- Set `ALLOWED_ORIGINS=https://your-frontend.com` in `.env`
- Restricts API access to specific domains (security)

---

## 🔄 Complete Request Flow Examples

### Example 1: Creating a Short Link

```
1. Frontend sends: POST /api/shorten { "url": "https://google.com" }
   ↓
2. shorten.ts receives request
   ↓
3. Validates with Zod schema
   ↓
4. Gets base URL (from env or headers)
   ↓
5. Calls url.service.createLink()
   ↓
6. createLink() normalizes URL, generates slug, saves to DB
   ↓
7. Returns: { slug: "xyz789", shortUrl: "https://mysite.com/xyz789", url: "https://google.com" }
   ↓
8. Frontend receives response and displays short URL
```

### Example 2: Clicking a Short Link

```
1. User visits: https://mysite.com/xyz789
   ↓
2. redirect.ts receives GET /xyz789
   ↓
3. Extracts slug: "xyz789"
   ↓
4. Calls url.service.findLinkBySlug("xyz789")
   ↓
5. Database returns link: { slug: "xyz789", url: "https://google.com", clicks: 5 }
   ↓
6. Calls url.service.incrementClicks("xyz789") → clicks becomes 6
   ↓
7. Returns HTTP 301 redirect to "https://google.com"
   ↓
8. Browser automatically follows redirect
```

### Example 3: Getting Statistics

```
1. Frontend sends: GET /api/stats/xyz789
   ↓
2. stats.ts receives request
   ↓
3. Extracts slug: "xyz789"
   ↓
4. Calls url.service.getLinkStats("xyz789")
   ↓
5. Service looks up link and returns stats
   ↓
6. Returns JSON: { slug: "xyz789", url: "https://google.com", clicks: 6, createdAt: "..." }
   ↓
7. Frontend displays statistics
```

---

## 🎯 Key Design Decisions

### Why This Architecture?

1. **Separation of Concerns**

   - Routes handle HTTP
   - Services handle business logic
   - Database handles persistence
   - Easy to test and maintain

2. **Type Safety**

   - TypeScript throughout
   - Zod validation at boundaries
   - Type-safe database queries

3. **Error Handling**

   - Validation errors → 400
   - Not found → 404
   - Server errors → 500
   - Global error handler catches everything

4. **Flexibility**
   - Environment variables for configuration
   - Auto-detection for common scenarios
   - Works locally and in production

---

## 🚀 How It All Connects

```
User Action (Frontend)
    ↓
HTTP Request
    ↓
Express Server (server.ts)
    ↓
Route Handler (routes/*.ts)
    ↓
Validation (validators/*.ts)
    ↓
Service Layer (url.service.ts)
    ↓
Database Layer (db.ts)
    ↓
SQLite Database (data/linksnap.db)
    ↓
Response back through layers
    ↓
Frontend receives response
```

This layered approach makes the code:

- **Testable** - Each layer can be tested independently
- **Maintainable** - Changes in one layer don't affect others
- **Scalable** - Easy to add new features or change implementations

---

## 📝 Summary

The backend is a simple but well-structured Express API that:

- Validates all inputs
- Generates unique short slugs
- Stores links in SQLite database
- Tracks click statistics
- Handles redirects
- Provides stats API

Everything is type-safe, error-handled, and follows clean architecture principles.
