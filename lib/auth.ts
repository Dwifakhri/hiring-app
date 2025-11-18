'use server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function checkSessionToken(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!session) {
    return null;
  }
  return session.user;
}
