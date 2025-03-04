import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that should not be protected
const isPublicRoute = createRouteMatcher(['/', '/signin(.*)', '/signup(.*)', '/api/webhook(.*)', '/terms', '/privacy']);

export default clerkMiddleware(async (auth, req) => {
    // Protect all routes except those defined as public
    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)'
    ]
};
