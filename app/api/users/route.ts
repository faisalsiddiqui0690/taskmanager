import { NextResponse } from 'next/server';
import { User } from '../../../models/User';
import { corsResponse, handleOptions } from '../../../lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: Request) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
      order: [['name', 'ASC']],
    });
    return corsResponse(NextResponse.json({ users }));
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return corsResponse(NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 }));
  }
}
