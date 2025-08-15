import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

// List of paths that require authentication
const protectedPaths = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  if (protectedPaths.includes(pathname)) {
    const session = await getSession();

    // If no session is found, redirect to login
    if (!session) {
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
