# LinkSnap - URL Shortener

A modern full-stack URL shortener application demonstrating clean architecture, TypeScript best practices, and modern React patterns.

## ✨ Features

- 🔗 Shorten long URLs into compact, shareable links
- 📊 Track click statistics for each short link
- 📋 One-click copy functionality
- 📜 Local history with persistent storage
- 🎨 Modern, responsive UI
- 🧹 Clear history functionality

## Tech Stack

### Backend

- Node.js 20+
- Express
- SQLite (sql.js - pure JavaScript)
- TypeScript
- nanoid (slug generation)
- zod (validation)

### Frontend

- React 19 with Hooks
- TypeScript
- Vite
- Custom React Hooks (useClipboard, useStats, useUrlShortening)
- Component composition & separation of concerns
- shadcn/ui components
- Tailwind CSS

## 🏗️ Architecture Highlights

**Backend:**

- Clean separation: routes → services → database
- Type-safe API with Zod validation
- Environment-based configuration
- Error handling middleware

**Frontend:**

- Custom hooks for reusable logic
- Component composition (sections, features, history)
- Utility functions for common operations
- Type-safe API client
- Responsive design with mobile-first approach

## 📁 Project Structure

```
LinkSnap/
├── backend/
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # CORS, error handling
│   │   ├── validators/    # Zod schemas
│   │   ├── utils/         # Helper functions
│   │   └── db.ts          # Database layer
│   └── data/              # SQLite database
├── frontend/
│   ├── src/
│   │   ├── hooks/         # Custom React hooks
│   │   ├── components/    # Organized components
│   │   │   ├── sections/  # Page sections
│   │   │   ├── features/  # Feature components
│   │   │   └── history/   # History components
│   │   ├── utils/         # Utility functions
│   │   └── lib/           # API & storage
│   └── public/
└── package.json           # Root scripts
```

## Quick Start

### Install Dependencies

```bash
npm run install:all
```

Or install separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Development

Run both backend and frontend together:

```bash
npm run dev
```

This will start:

- Backend server on `http://localhost:4000`
- Frontend dev server on `http://localhost:5173`

### Manual Start

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd frontend
npm run dev
```

## API Endpoints

### POST `/api/shorten`

Create a new short URL.

**Request:**

```json
{
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "slug": "abc1234",
  "shortUrl": "http://localhost:4000/abc1234",
  "url": "https://example.com"
}
```

### GET `/:slug`

Redirect to the original URL (increments click count).

### GET `/api/stats/:slug`

Get statistics for a short URL.

**Response:**

```json
{
  "slug": "abc1234",
  "url": "https://example.com",
  "clicks": 42,
  "createdAt": "2024-01-01 12:00:00"
}
```

### GET `/health`

Health check endpoint.

## ⚙️ Configuration

### Environment Variables (Optional)

For local development, no `.env` file is needed. The app works out of the box.

If you want to customize, create `backend/.env`:

```env
PORT=4000                    # Server port (default: 4000)
BASE_URL=http://localhost:4000  # For development (auto-detected if unset)
```

### Database

SQLite database is automatically created at `backend/data/linksnap.db` on first run. No setup required!

## 🚀 Quick Commands

```bash
# Install all dependencies
npm run install:all

# Run development servers (both frontend & backend)
npm run dev

# Build for production
npm run build
```

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with modern web technologies and best practices. Special thanks to the open-source community for the amazing tools and libraries used in this project.
