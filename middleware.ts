import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('vault_token')?.value;

  if (pathname === '/login') {
    if (token) {
      // If logged in, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Allow access to login
    return NextResponse.next();
  }

  // For other pages, if no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};