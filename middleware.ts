import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // API requests are handled separately; protect pages only
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/tasks')) {
    const token = request.cookies.get('token')?.value || '';
    const data = verifyToken(token);
    if (!data) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*'],
};
