import { NextResponse } from 'next/server';
import sequelize from '../../../../lib/db';
import { User } from '../../../../models/User';
import { hashPassword, signToken } from '../../../../lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  await sequelize.authenticate();
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed });
  const token = signToken(user);

  const payload = {
    id: typeof (user as any).get === 'function' ? (user as any).get('id').toString() : (user as any).id.toString(),
    name: typeof (user as any).get === 'function' ? (user as any).get('name') : (user as any).name,
    email: typeof (user as any).get === 'function' ? (user as any).get('email') : (user as any).email
  };
  const response = NextResponse.json({ token, user: payload });
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
}
