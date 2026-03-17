import { NextResponse } from 'next/server';

import sequelize from '../../../lib/db';
import { User } from '../../../models/User';

export async function GET(request: Request) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
      order: [['name', 'ASC']],
    });
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
