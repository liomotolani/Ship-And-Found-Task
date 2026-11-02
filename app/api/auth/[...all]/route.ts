import { toNextJsHandler } from 'better-auth/next-js';
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

const handlers = toNextJsHandler(auth);

export const { GET } = handlers;

export async function POST(request: NextRequest) {
  if (request.nextUrl.pathname.endsWith('/sign-up/email')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return handlers.POST(request);
}
