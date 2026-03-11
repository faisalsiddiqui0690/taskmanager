import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // TODO: handle registration
  return NextResponse.json({ message: 'register route' });
}
