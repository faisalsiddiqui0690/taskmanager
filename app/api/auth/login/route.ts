import { NextResponse } from 'next/server';
import sequelize from '../../../../lib/db';
import { User } from '../../../../models/User';
import { comparePassword, signToken } from '../../../../lib/auth';
import { corsResponse, handleOptions } from '../../../../lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return corsResponse(NextResponse.json({ error: 'Missing credentials' }, { status: 400 }));
    }

    await sequelize.authenticate();

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return corsResponse(NextResponse.json({ error: 'Invalid email or password' }, { status: 401 }));
    }

    const hashedPassword = typeof user.get === 'function' ? user.get('password') : (user as any).password;
    const valid = await comparePassword(password, hashedPassword);
    if (!valid) {
      return corsResponse(NextResponse.json({ error: 'Invalid email or password' }, { status: 401 }));
    }

    const token = signToken(user);
    const payload = {
      id: typeof (user as any).get === 'function' ? (user as any).get('id').toString() : (user as any).id.toString(),
      name: typeof (user as any).get === 'function' ? (user as any).get('name') : (user as any).name,
      email: typeof (user as any).get === 'function' ? (user as any).get('email') : (user as any).email,
      role: typeof (user as any).get === 'function' ? (user as any).get('role') : (user as any).role,
    };

    const response = corsResponse(NextResponse.json({ token, user: payload }));
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: true, // Required for SameSite: none
      sameSite: 'none', // Allow cross-origin cookies
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

