import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-env';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/tasks')) {
    const token = request.cookies.get('token')?.value || '';
    
    try {
      if (!token) throw new Error('No token');
      console.log('Middleware Path:', pathname);
      console.log('Secret (first 5 chars):', JWT_SECRET.substring(0, 5));
      console.log('Secret length:', JWT_SECRET.length);
      const { payload } = await jwtVerify(token, secret);
      console.log('Verification successful for userId:', payload.userId);
    } catch (err: any) {
      console.log('Verification failed:', err.message, err.code);
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/tasks', '/tasks/:path*'],
};
