import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getClient } from '../get-client';

const isProtectedRoute = (request: NextRequest) => {
  return request.url.startsWith('/dashboard'); // change this to your protected route
};

export const authMiddleware = (
  handlerOrRequest:
    | NextRequest
    | ((auth: any, request: NextRequest) => Promise<Response>)
) => {
  return async (request: NextRequest) => {
    const client = getClient();
    const session = await client.auth.getSession();

    if (isProtectedRoute(request) && !session.data) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (typeof handlerOrRequest === 'function') {
      return await handlerOrRequest(session.data, request);
    }

    return NextResponse.next();
  };
};
