# LinkSnap Backend

Express API server with TypeScript and SQLite for URL shortening and statistics tracking.

## 🚀 Tech Stack

**Runtime:** Node.js 20+  
**Framework:** Express  
**Database:** SQLite (sql.js)  
**Language:** TypeScript  
**Validation:** Zod  
**Utilities:** nanoid

## ✨ Key Features

- URL shortening with custom slugs
- Click statistics tracking
- Type-safe API with Zod validation
- SQLite database (automatically created on first run)
- Health check endpoint

## 🏃 Quick Start

### Prerequisites
- Node.js 20+

### Setup
```bash
npm install
# Optional: Create .env with PORT=4000, BASE_URL
npm run dev
```

**Environment Variables (Optional):**
- `PORT` - Server port (default: 4000)
- `BASE_URL` - Base URL for shortened links (default: http://localhost:4000)

No `.env` file needed for local development - works out of the box!

## 📡 API Endpoints

- `POST /api/shorten` - Create short URL
- `GET /:slug` - Redirect to original URL
- `GET /api/stats/:slug` - Get statistics for a short URL
- `GET /health` - Health check

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/      # API routes
│   ├── services/    # Business logic
│   ├── validators/  # Zod schemas
│   ├── middleware/  # Express middleware
│   ├── utils/       # Utility functions
│   └── db.ts        # Database setup
└── data/            # SQLite database file
```

## 🔒 Security & Validation

- Type-safe API with Zod validation
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- End-to-end type safety
