import { NextResponse } from 'next/server';
import sequelize from '../../../lib/db';
import { Task } from '../../../models/Task';
import { User } from '../../../models/User';
import { verifyToken } from '../../../lib/auth';
import { Op } from 'sequelize';

export async function getAuthData(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/token=([^;]+)/);
  const token = match ? match[1] : '';
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: Request) {
  try {
    const auth = await getAuthData(request);
    if (!auth || !auth.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let whereClause = {};
    if (auth.role === 'admin') {
      whereClause = {
        [Op.or]: [
          { userId: parseInt(auth.userId) },
          { assignedTo: parseInt(auth.userId) },
        ],
      };
    } else if (auth.role === 'employee') {
      whereClause = { assignedTo: parseInt(auth.userId) };
    }

    await sequelize.authenticate();
    const tasks = await Task.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'Assigner', attributes: ['id', 'name'] },
        { model: User, as: 'Assignee', attributes: ['id', 'name'] }
      ],
    });
    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error('GET tasks error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthData(request);
    if (!auth || !auth.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (auth.role !== 'admin' && auth.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
      priority: priority || 'Low',
      userId: parseInt(auth.userId),
      assignedTo: assignedTo ? parseInt(assignedTo) : null,
      status: 'pending',
    });

    const fullTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'Assigner', attributes: ['id', 'name'] },
        { model: User, as: 'Assignee', attributes: ['id', 'name'] }
      ]
    });

    return NextResponse.json({ task: fullTask });
  } catch (error: any) {
    console.error('POST task error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
