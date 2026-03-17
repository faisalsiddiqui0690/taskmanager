import { NextResponse } from 'next/server';
import sequelize from '../../../../lib/db';
import { Task } from '../../../../models/Task';
import { User } from '../../../../models/User';
import { getAuthData } from '../route';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getAuthData(request);
  if (!auth || !auth.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await sequelize.authenticate();
  const task = await Task.findByPk(id, {
    include: [
      { model: User, as: 'Assigner', attributes: ['id', 'name'] },
      { model: User, as: 'Assignee', attributes: ['id', 'name'] }
    ]
  });
  
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const currentUserId = auth.userId ? Number(auth.userId) : null;
  const isCreator = Number(task.userId) === currentUserId;
  const isAssignee = task.assignedTo ? Number(task.assignedTo) === currentUserId : false;
  const isSuperAdmin = auth.role === 'super_admin';

  if (!isCreator && !isAssignee && !isSuperAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ task });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getAuthData(request);
  if (!auth || !auth.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, priority, dueDate, assignedTo, status } = body;
  await sequelize.authenticate();

  const task = await Task.findByPk(id);

  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const currentUserId = auth.userId ? Number(auth.userId) : null;
  const isCreator = Number(task.userId) === currentUserId;
  const isAssignee = task.assignedTo ? Number(task.assignedTo) === currentUserId : false;
  const isSuperAdmin = auth.role === 'super_admin';

  console.log(`Auth Check: ID=${id}, User=${currentUserId}, Role=${auth.role}, isCreator=${isCreator}, isAssignee=${isAssignee}`);

  if (!isCreator && !isAssignee && !isSuperAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // If ONLY assignee (not creator/superadmin), can ONLY update status
  if (isAssignee && !isCreator && !isSuperAdmin) {
    await task.update({ status: body.status });
  } else {
    // Creator or SuperAdmin can update everything
    // Use an object that only includes fields if they are present in body
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate;
    if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo ? parseInt(body.assignedTo) : null;
    if (body.status !== undefined) updateData.status = body.status;
    
    await task.update(updateData);
  }

  // Re-fetch with associations for consistent return
  const updatedTask = await Task.findByPk(id, {
    include: [
      { model: User, as: 'Assigner', attributes: ['id', 'name'] },
      { model: User, as: 'Assignee', attributes: ['id', 'name'] }
    ]
  });

  return NextResponse.json({ task: updatedTask });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getAuthData(request);
  if (!auth || !auth.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await sequelize.authenticate();
  const task = await Task.findByPk(id);
  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const currentUserId = auth.userId ? Number(auth.userId) : null;
  const isCreator = Number(task.userId) === currentUserId;
  const isSuperAdmin = auth.role === 'super_admin';

  if (!isCreator && !isSuperAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await task.destroy();
  return NextResponse.json({ success: true });
}
