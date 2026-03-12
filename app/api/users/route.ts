import { NextResponse } from 'next/server';

import sequelize from '../../../lib/db';
import { User } from '../../../models/User';

export async function GET(request: Request) {
  await sequelize.authenticate();
  const users = await User.findAll({
    attributes: ['id', 'name', 'email'],
    order: [['name', 'ASC']],
  });
  return NextResponse.json({ users });
}
