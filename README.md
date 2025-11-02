# LinkSnap - URL Shortener

A modern full-stack URL shortener application demonstrating clean architecture, TypeScript best practices, and modern React patterns.

## 🌐 Live Demo

Check out the live application: **[https://linksnap-frontend.onrender.com](https://linksnap-frontend.onrender.com)**

## 🚀 Tech Stack

**Backend:** Node.js 20+ | Express | SQLite (sql.js) | TypeScript | nanoid | zod  
**Frontend:** React 19 | TypeScript | Vite | Custom Hooks | shadcn/ui | Tailwind CSS

## ✨ Key Features

- 🔗 Shorten long URLs into compact, shareable links
- 📊 Track click statistics for each short link
- 📋 One-click copy functionality
- 📜 Local history with persistent storage
- 🎨 Modern, responsive UI

## 🏃 Quick Start

### Option 1: Run Both Together (Recommended)

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend
npm run dev
```

### Option 2: Run Separately

```bash
# Backend
cd backend && npm install
npm run dev

# Frontend (new terminal)
cd frontend && npm install
npm run dev
```

Visit `http://localhost:5173` (Frontend) | `http://localhost:4000` (Backend)

## 📁 Architecture

Clean, scalable architecture with separation of concerns:

- **Backend:** routes → services → database | Type-safe API with Zod validation
- **Frontend:** Custom hooks | Component composition | Type-safe API client
- **Database:** SQLite automatically created on first run

## 🎯 Highlights

- **Performance:** Optimized re-renders, efficient state management
- **UX:** Form validation, loading states, one-click copy
- **Code Quality:** TypeScript, consistent patterns, clean architecture
- **Type Safety:** End-to-end type safety with Zod validation

## 📦 What's Included

- URL shortening with custom slugs
- Click statistics tracking
- Local history management
- Responsive design for all devices

## 🔧 Environment Variables

**Backend (Optional):** `PORT`, `BASE_URL` - Works out of the box with defaults

## 📄 License

MIT License

---

**Built with modern best practices** | Ready for production deployment
