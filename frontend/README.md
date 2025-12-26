# LinkSnap Frontend

Modern React application built with TypeScript, featuring a responsive design, custom hooks, and optimized user experience.

## 🚀 Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **State Management:** Custom React hooks

## ✨ Features

- **Modern Design** - Clean, professional UI with smooth animations
- **Responsive** - Mobile-first design optimized for all screen sizes
- **Type Safety** - Full TypeScript coverage
- **Custom Hooks** - Reusable hooks for URL shortening, stats, and clipboard
- **Error Handling** - Error boundaries and retry logic with exponential backoff
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- **Performance** - Optimized rendering, request cancellation, local storage caching

## 🏃 Quick Start

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── features/      # Feature-specific components
│   │   ├── history/   # History list, items, stats
│   │   └── url-shortener/  # URL form
│   ├── layout/        # Layout components (header, footer, hero)
│   ├── ui/           # Shadcn UI components
│   └── common/       # Shared components (ErrorBoundary)
├── hooks/            # Custom React hooks
├── lib/              # Utilities and API clients
│   ├── api/         # API interaction layer
│   └── storage/     # Local storage utilities
├── utils/           # Helper functions
├── types/           # TypeScript type definitions
└── constants/       # Application constants
```

## 🎨 Design Highlights

- **Responsive Layout** - Optimized for mobile, tablet, and desktop
- **Touch-Friendly** - Proper touch targets and gestures
- **Smooth Animations** - Fade-in, slide-in effects with staggered delays
- **Modern UI** - Clean cards, gradients, and professional typography
- **Accessibility** - Full keyboard navigation and screen reader support

## 🛠️ Scripts

```bash
npm run dev          # Development server
npm run dev:verbose  # Development with debug logging
npm run dev:quiet    # Development with minimal logging
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📝 Environment Variables

```env
VITE_API_BASE=/api
VITE_LOG_LEVEL=info  # debug, info, warn, error
```

## 🔧 Key Components

- **UrlForm** - URL input with validation and submission
- **HistoryList** - Display shortened URLs with stats
- **HistoryItem** - Individual URL card with copy/open actions
- **HistoryStats** - Click statistics display
- **HeroSection** - Landing page hero with features
- **ErrorBoundary** - Graceful error handling

## 🎯 Custom Hooks

- `useUrlShortening` - Manage URL shortening state
- `useStats` - Fetch and cache link statistics
- `useClipboard` - Copy to clipboard functionality

## 📱 Responsive Design

- Mobile-first approach with breakpoints (sm, lg, xl)
- Touch-optimized buttons and inputs
- Flexible layouts that adapt to screen size
- Optimized typography scaling
