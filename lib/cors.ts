import { NextResponse } from 'next/server';

export function corsResponse(response: NextResponse) {
  const origin = process.env.CORS_ORIGIN || '*';
  
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  
  return response;
}

export function handleOptions() {
  const response = new NextResponse(null, { status: 204 });
  return corsResponse(response);
}
