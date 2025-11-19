import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public and protected pages
const publicRoutes = ['/auth/login'];
const protectedRoutes = ['/jobs'];

// Role-based pages
const roleRoutes: Record<string, string[]> = {
  admin: ['/jobs/detail'],
  candidate: ['/jobs/application'],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  //  Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  //  Read NextAuth JWT from cookies
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  //  Protected routes require login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      // Proxy-style: rewrite instead of redirect
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.rewrite(url);
    }
  }

  //  Role-based access
  if (session?.user?.role) {
    const role = session.user.role;
    const allowed = roleRoutes[role];

    const isAllowed = allowed?.some((route) => pathname.startsWith(route));

    if (!isAllowed) {
      // Proxy-style rewrite to safe default
      const url = req.nextUrl.clone();
      url.pathname = '/jobs';
      return NextResponse.rewrite(url);
    }
  }

  // Default allow
  return NextResponse.next();
}

// Matcher (UI only, excludes API and assets)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
