import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that require authentication
const protectedPaths = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  if (protectedPaths.includes(pathname)) {
    const sessionId = request.cookies.get('sessionId')?.value; // Directly check the cookie

    // If no session ID is found, redirect to login
    if (!sessionId) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure the matcher to run the middleware on specific paths
export const config = {
  matcher: ['/dashboard/:path*'], // Apply middleware to /dashboard and its sub-paths
};
