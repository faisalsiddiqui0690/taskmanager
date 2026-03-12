import { NextResponse } from 'next/server';
import sequelize from '../../../lib/db';
import { Task } from '../../../models/Task';
import { User } from '../../../models/User';
import { verifyToken } from '../../../lib/auth';

async function getUserId(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/token=([^;]+)/);
  const token = match ? match[1] : '';
  const data = verifyToken(token);
  return data?.userId;
}

import { Op } from 'sequelize';

export async function GET(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const tasks = await Task.findAll({
      where: {
        [Op.or]: [
          { userId: parseInt(userId) },
          { assignedTo: parseInt(userId) },
        ],
      },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'Assigner', attributes: ['id', 'name'] },
        { model: User, as: 'Assignee', attributes: ['id', 'name'] }
      ],
    });
    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { title, description, dueDate, priority, assignedTo } = body;
  if (!title) {
    return NextResponse.json({ error: 'Title required' }, { status: 400 });
  }
  await sequelize.authenticate();
  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    userId: parseInt(userId),
    assignedTo: assignedTo ? parseInt(assignedTo) : null,
    status: 'pending',
  });
  return NextResponse.json({ task });
}
