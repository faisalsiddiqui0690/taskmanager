import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // TODO: handle login
  return NextResponse.json({ message: 'login route' });
}
