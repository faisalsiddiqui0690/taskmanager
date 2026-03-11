import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // TODO: return tasks
  return NextResponse.json({ tasks: [] });
}

export async function POST(request: Request) {
  // TODO: create task
  return NextResponse.json({ message: 'task created' });
}
