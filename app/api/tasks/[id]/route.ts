import { NextResponse } from 'next/server';
import sequelize from '../../../../lib/db';
import { Task } from '../../../../models/Task';
import { verifyToken } from '../../../../lib/auth';

async function getUserId(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/token=([^;]+)/);
  const token = match ? match[1] : '';
  const data = verifyToken(token);
  return data?.userId;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await sequelize.authenticate();
  const task = await Task.findOne({ where: { id, userId: parseInt(userId) } });
  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ task });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { title, description, priority, dueDate, assignedTo, status } = body;
  await sequelize.authenticate();

  const task = await Task.findOne({ where: { id, userId: parseInt(userId) } });

  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await task.update({
    title,
    description,
    priority,
    dueDate,
    assignedTo: assignedTo ? parseInt(assignedTo) : null,
    status
  });

  return NextResponse.json({ task });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await sequelize.authenticate();
  const task = await Task.findOne({ where: { id, userId: parseInt(userId) } });
  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await task.destroy();
  return NextResponse.json({ success: true });
}

