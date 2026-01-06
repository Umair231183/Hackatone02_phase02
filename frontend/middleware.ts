// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function checks if the user is authenticated
// Since we store the token in localStorage on the client, we'll check for a custom header
// that the client sets when a token exists
function isAuthenticated(request: NextRequest) {
  // Check for the presence of a token in the Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length);
    return !!token;
  }

  // Also check for a custom header that the client sets when a token exists
  const hasToken = request.headers.get('x-has-token');
  return hasToken === 'true';
}

export function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/dashboard/profile', '/dashboard/settings', '/dashboard/tasks'];
  const authRoutes = ['/login', '/register'];

  // Check if the current route is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If user is on a protected route but not authenticated
  if (isProtectedRoute && !isAuthenticated(request)) {
    // Redirect to login with a return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('return', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is on an auth route but already authenticated
  if (isAuthRoute && isAuthenticated(request)) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};