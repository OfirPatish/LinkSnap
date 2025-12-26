# LinkSnap Backend

High-performance Express API built with TypeScript, featuring structured logging, security best practices, and optimized database operations.

## 🚀 Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** SQLite (better-sqlite3) - Native performance
- **Language:** TypeScript (strict mode)
- **Validation:** Zod schemas
- **Logging:** Pino (structured JSON logging)
- **Security:** Helmet, input sanitization, rate limiting

## ✨ Features

- RESTful API with type-safe endpoints
- Native SQLite with WAL mode for optimal performance
- In-memory caching for frequently accessed links
- Structured logging with configurable log levels
- Comprehensive security (Helmet, sanitization, rate limiting)
- Graceful shutdown with proper cleanup
- Health check endpoints for monitoring

## 🏃 Quick Start

```bash
npm install
npm run dev
```

## 📡 API Endpoints

- `POST /api/shorten` - Create short URL
- `GET /:slug` - Redirect to original URL
- `GET /api/stats/:slug` - Get click statistics
- `GET /health` - Health check

## 📁 Architecture

```
src/
├── routes/        # HTTP route handlers
├── services/      # Business logic layer
├── middleware/    # Express middleware (CORS, rate limiting, validation)
├── utils/         # Utilities (logger, cache, errors, sanitization)
├── validators/    # Zod validation schemas
├── types/         # TypeScript type definitions
├── constants/     # Application constants
├── config/        # Configuration modules
├── db.ts          # Database setup
└── server.ts       # Application entry point
```

## 🔒 Security

- Helmet security headers
- Input sanitization (XSS prevention)
- Rate limiting (10 req/min for shortening, 100 req/15min general)
- CORS configuration
- SQL injection prevention (parameterized queries)
- URL validation and normalization

## ⚡ Performance

- Native SQLite (better-sqlite3) - 10-100x faster than WASM
- Write-Ahead Logging (WAL) mode
- In-memory caching with TTL
- Database indexing for optimized queries
- Request compression (gzip)

## 📊 Logging

Structured logging with Pino:

- **Development:** Pretty-printed logs with colors and context
- **Production:** JSON logs for log aggregation tools
- **Configurable:** LOG_LEVEL environment variable
- **Request Logging:** Automatic HTTP request/response logging

## 🛠️ Scripts

```bash
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Start production server
npm test         # Run test suite
```

## 📝 Environment Variables

```env
PORT=4000
NODE_ENV=development
BASE_URL=http://localhost:4000
ALLOWED_ORIGINS=http://localhost:5173
DB_PATH=./data
LOG_LEVEL=info
CACHE_TTL=300000
```

## 🧪 Testing

Jest test suite with integration tests covering:

- Route handlers
- Service layer
- Middleware
- Utilities
- Database operations
