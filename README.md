# LinkSnap - Modern URL Shortener

A full-stack TypeScript application demonstrating clean architecture, modern React patterns, and production-ready backend development.

**🌐 Live Demo:** https://linksnap-frontend.onrender.com/

## 🚀 Tech Stack

**Backend:** Node.js, Express, TypeScript, SQLite (better-sqlite3), Pino logging, Helmet security  
**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Shadcn UI  
**Architecture:** RESTful API, custom hooks, structured logging, error boundaries

## ✨ Features

- **URL Shortening** - Generate short, shareable links with unique slugs
- **Click Analytics** - Track click statistics for each shortened URL
- **Modern UI** - Responsive, mobile-first design with smooth animations
- **Type Safety** - Full TypeScript coverage with Zod validation
- **Performance** - In-memory caching, database optimization, request compression
- **Security** - Rate limiting, input sanitization, security headers, CORS
- **Developer Experience** - Structured logging, error handling, graceful shutdown

## 🏃 Quick Start

```bash
# Install dependencies
npm run install:all

# Run both backend and frontend
npm run dev
```

**Ports:** Backend (4000) | Frontend (5173)

## 📁 Project Structure

```
linksnap/
├── backend/     # Express API with TypeScript
└── frontend/    # React application with Vite
```

## 🔧 Environment Setup

### Backend

```env
PORT=4000
NODE_ENV=development
BASE_URL=http://localhost:4000
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend

```env
VITE_API_BASE=/api
```

## 🎯 Key Highlights

- **Clean Architecture** - Separation of concerns with routes, services, middleware, and utilities
- **Type Safety** - End-to-end TypeScript with strict type checking
- **Error Handling** - Custom error classes, retry logic with exponential backoff, error boundaries
- **Security** - Helmet security headers, input sanitization, rate limiting, SQL injection prevention
- **Performance** - Native SQLite, WAL mode, in-memory caching, optimized queries
- **Logging** - Structured logging with Pino (JSON in production, pretty in development)
- **Testing** - Jest test suite with integration tests
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support

## 📝 License

MIT
