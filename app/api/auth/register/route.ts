import { NextResponse } from 'next/server';
import sequelize from '../../../../lib/db';
import { User } from '../../../../models/User';
import { hashPassword, signToken, verifyToken } from '../../../../lib/auth';
import { corsResponse, handleOptions } from '../../../../lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;
    if (!name || !email || !password) {
      return corsResponse(NextResponse.json({ error: 'Missing fields' }, { status: 400 }));
    }

    // RBAC for registration
    let targetRole = 'employee';
    if (role && role !== 'employee') {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(/token=([^;]+)/);
      const token = match ? match[1] : '';
      const auth = verifyToken(token);
      
      if (auth?.role === 'super_admin') {
        targetRole = role;
      } else if (auth?.role === 'admin') {
        // Admins can only create employees
        targetRole = 'employee';
      } else {
        return corsResponse(NextResponse.json({ error: 'Forbidden: Only admins and super admins can create users' }, { status: 403 }));
      }
    }

    await sequelize.authenticate();
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return corsResponse(NextResponse.json({ error: 'Email already in use' }, { status: 400 }));
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role: targetRole });
    const token = signToken(user);

    const payload = {
      id: typeof (user as any).get === 'function' ? (user as any).get('id').toString() : (user as any).id.toString(),
      name: typeof (user as any).get === 'function' ? (user as any).get('name') : (user as any).name,
      email: typeof (user as any).get === 'function' ? (user as any).get('email') : (user as any).email,
      role: typeof (user as any).get === 'function' ? (user as any).get('role') : (user as any).role
    };
    const response = corsResponse(NextResponse.json({ token, user: payload }));
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return corsResponse(NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 }));
  }
}
