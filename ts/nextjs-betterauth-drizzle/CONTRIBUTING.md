# Contributing to Encore + Next.js + Better Auth Starter

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```
3. Generate database migrations:
   ```bash
   npm run db:generate
   ```
4. Start the development servers (in separate terminals):
   ```bash
   npm run dev           # Backend
   npm run dev:frontend  # Frontend
   ```

## Making Changes

### Backend Changes

- Backend code lives in the `auth/` directory
- Follow Encore.ts conventions for API endpoints
- Update database schema in `auth/schema.ts`
- Generate migrations after schema changes: `npm run db:generate`

### Frontend Changes

- Frontend code lives in `frontend/src/`
- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Write clear commit messages
- Add comments for complex logic

## Testing

- Test authentication flows thoroughly
- Verify database migrations work correctly
- Test on both light and dark modes
- Check responsive design on mobile

## Submitting Changes

1. Create a new branch for your changes
2. Make your changes with clear commits
3. Test your changes locally
4. Push to your fork
5. Create a pull request with a clear description

## Questions?

Feel free to open an issue for any questions or discussions!

