import { NextResponse } from 'next/server';
import sequelize from '../../../../lib/db';
import { User } from '../../../../models/User';
import { comparePassword, signToken } from '../../../../lib/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }
  await sequelize.authenticate();
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
  const hashedPassword = typeof user.get === 'function' ? user.get('password') : (user as any).password;
  const valid = await comparePassword(password, hashedPassword);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
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
