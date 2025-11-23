# Contributing to LinkSnap

Thank you for your interest in contributing to LinkSnap! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/linksnap.git`
3. Install dependencies:
   ```bash
   npm run install:all
   ```
4. Set up environment variables (see `.env.example` files)
5. Start development servers:
   ```bash
   npm run dev
   ```

## Code Style

- Follow TypeScript best practices
- Use functional components and hooks
- Prefer composition over inheritance
- Write descriptive variable names
- Add JSDoc comments for public functions
- Follow the existing code style and formatting

## Testing

Before submitting a PR, ensure:
- [ ] Code compiles without errors
- [ ] No linting errors
- [ ] Manual testing completed
- [ ] Error handling is appropriate

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit with clear messages: `git commit -m "Add feature: description"`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a Pull Request

## Areas for Contribution

- Bug fixes
- Performance improvements
- Accessibility enhancements
- Documentation improvements
- Test coverage
- New features (please discuss in an issue first)

## Questions?

Open an issue for questions or discussions about contributions.

