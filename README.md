# LinkSnap - URL Shortener

A modern full-stack URL shortener application demonstrating clean architecture, TypeScript best practices, and modern React patterns.

**🌐 Live Demo:** [https://linksnap-frontend.onrender.com](https://linksnap-frontend.onrender.com)

## 🚀 Tech Stack

**Backend:** Node.js 20+, Express, SQLite (sql.js), TypeScript, nanoid, zod  
**Frontend:** React 19, TypeScript, Vite, shadcn/ui, Tailwind CSS  
**State Management:** Custom hooks

## ✨ Key Features

- **URL Shortening:** Convert long URLs into compact, shareable links
- **Click Statistics:** Track click statistics for each short link
- **One-Click Copy:** Instant copy functionality for easy sharing
- **Local History:** Persistent storage for shortened URLs
- **Responsive Design:** Modern, mobile-first UI design

## 🏃 Quick Start

### Prerequisites
- Node.js 20+

### Backend Setup
```bash
cd backend
npm install
# Optional: Create .env with PORT=4000, BASE_URL
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
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

- Type-safe API with Zod validation
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- End-to-end type safety
