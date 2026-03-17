import { NextResponse } from 'next/server';
import { corsResponse, handleOptions } from '../../../../lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST() {
    const response = corsResponse(NextResponse.json({ success: true }));
    response.cookies.delete('token');
    return response;
}
