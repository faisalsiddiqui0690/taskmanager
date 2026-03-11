import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // TODO: return users
  return NextResponse.json({ users: [] });
}
