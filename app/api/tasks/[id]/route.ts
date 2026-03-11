import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // TODO: update task
  return NextResponse.json({ message: `updated ${params.id}` });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // TODO: delete task
  return NextResponse.json({ message: `deleted ${params.id}` });
}
