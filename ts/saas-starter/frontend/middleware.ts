import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/pricing", "/sign-in(.*)"]);

export default clerkMiddleware(async (auth, request) => {
	const isPublic = isPublicRoute(request);
	if (!isPublic) {
		await auth.protect();
	}

	// If we don't have an organization ID, redirect to the create organization page
	if (!isPublic && request.nextUrl.pathname !== "/select-organization") {
		const user = await auth();

		if (!user.orgId) {
			return NextResponse.redirect(
				new URL("/select-organization", request.url),
			);
		}
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
