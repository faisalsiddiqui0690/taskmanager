import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { User } from '../../../../models/User';
import sequelize from '../../../../lib/db';

export async function GET(request: Request) {
    // get token from cookies
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = verifyToken(token);
    if (!data || !data.userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await sequelize.authenticate();
    const user = await User.findByPk(data.userId, {
        attributes: ['id', 'name', 'email', 'role'],
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
}
