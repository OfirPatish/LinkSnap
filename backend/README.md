# Backend

Express API server with TypeScript and SQLite.

## Quick Start

```bash
npm install
npm run dev
```

Server runs on `http://localhost:4000`

## Environment Variables (Optional)

Create `.env` file:

```env
PORT=4000
BASE_URL=http://localhost:4000
```

No `.env` file needed for local development - works out of the box!

## API Endpoints

- `POST /api/shorten` - Create short URL
- `GET /:slug` - Redirect to original URL
- `GET /api/stats/:slug` - Get statistics
- `GET /health` - Health check

See main [README.md](../README.md) for full documentation.
