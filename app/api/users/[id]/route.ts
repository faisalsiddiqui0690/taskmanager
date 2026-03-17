import { NextResponse } from 'next/server';
import sequelize from '../../../../lib/db';
import { User } from '../../../../models/User';
import { getAuthData } from '../../tasks/route';
import { corsResponse, handleOptions } from '../../../../lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await getAuthData(request);

    if (!auth || !auth.userId) {
      return corsResponse(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }

    if (auth.role !== 'super_admin') {
      return corsResponse(NextResponse.json({ error: 'Forbidden' }, { status: 403 }));
    }

    // Prevent self-deletion
    if (id === auth.userId.toString()) {
      return corsResponse(NextResponse.json({ error: 'You cannot delete yourself' }, { status: 400 }));
    }

    await sequelize.authenticate();
    const userToDelete = await User.findByPk(id);

    if (!userToDelete) {
      return corsResponse(NextResponse.json({ error: 'User not found' }, { status: 404 }));
    }

    await userToDelete.destroy();

    return corsResponse(NextResponse.json({ success: true, message: 'User deleted successfully' }));
  } catch (error: any) {
    console.error('DELETE user error:', error);
    return corsResponse(NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }));
  }
}
