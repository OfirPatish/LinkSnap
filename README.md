# LinkSnap - URL Shortener

A modern full-stack URL shortener application demonstrating clean architecture, TypeScript best practices, and modern React patterns.

**🌐 Live Demo:** [https://linksnap-frontend.onrender.com](https://linksnap-frontend.onrender.com)

## 🚀 Tech Stack

**Backend:** Node.js 20+, Express, SQLite (sql.js), TypeScript, nanoid, zod, express-rate-limit, compression  
**Frontend:** React 19, TypeScript, Vite, shadcn/ui, Tailwind CSS  
**State Management:** Custom hooks  
**Deployment:** Render (or any Node.js hosting platform)

## ✨ Key Features

- **URL Shortening:** Convert long URLs into compact, shareable links
- **Click Statistics:** Track click statistics for each short link
- **One-Click Copy:** Instant copy functionality for easy sharing
- **Local History:** Persistent storage for shortened URLs
- **Responsive Design:** Modern, mobile-first UI design
- **Error Handling:** Comprehensive error boundaries and retry logic
- **Accessibility:** ARIA labels, keyboard navigation, screen reader support
- **Performance:** Request compression, caching, and optimization

## 🏃 Quick Start

### Prerequisites

- Node.js 20+

### Local Development

#### Backend Setup

```bash
cd backend
npm install
# Copy .env.example to .env and configure if needed
npm run dev
```

#### Frontend Setup

```bash
cd frontend
npm install
# Copy .env.example to .env and configure if needed
npm run dev
```

**Ports:** Backend (4000) | Frontend (5173)

## 📁 Project Structure

```
linksnap/
├── backend/     # Express API with TypeScript and SQLite
└── frontend/    # React application with Vite
```

## 🔒 Security & Validation

- **Rate Limiting:** Prevents abuse with configurable limits (10 req/min for shortening, 100 req/15min for general API)
- **Security Headers:** X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, CSP
- **Type-safe API:** Zod validation for all inputs
- **Input Validation:** URL format validation and sanitization
- **SQL Injection Prevention:** Parameterized queries
- **Error Handling:** Custom error classes with proper status codes
- **Request Logging:** Comprehensive request/response logging
- **Environment Validation:** Zod-based environment variable validation

## 🎯 Additional Features

- **Error Boundaries:** React error boundaries for graceful error handling
- **Request Retry Logic:** Automatic retry with exponential backoff for failed requests
- **Request Timeouts:** 10-second timeout for all API requests
- **Compression:** Gzip compression for improved performance
- **Accessibility:** Full ARIA support, keyboard navigation, screen reader compatibility
- **Health Checks:** Built-in health check endpoints for monitoring

## 📝 Environment Variables

### Backend (.env)

```env
PORT=4000
NODE_ENV=development
BASE_URL=http://localhost:4000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
DB_PATH=./data
```

### Frontend (.env)

```env
VITE_API_BASE=/api
```

See `.env.example` files in each directory for more details.
