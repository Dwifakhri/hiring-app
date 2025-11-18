import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// ✅ Public routes (no authentication needed)
const publicRoutes = ['/auth/login'];
const protectedRoutes = ['/jobs'];

// ✅ Role-based route access
const roleRoutes: Record<string, string[]> = {
  admin: ['/jobs/detail'],
  candidate: ['/jobs/application'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // ✅ Get session
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ✅ If not logged in and accessing protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // ✅ If user logged in → check RBAC
  if (session) {
    const role = session.user?.role;

    // If no known role, send to /jobs safely
    if (!role) {
      return pathname === '/jobs'
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/jobs', req.url));
    }

    const allowedRoutes = roleRoutes[role];
    const isAllowed = allowedRoutes?.some((route) =>
      pathname.startsWith(route)
    );

    // ✅ Allow if route matches
    if (isAllowed) return NextResponse.next();

    // 🚫 Prevent infinite redirect loop
    if (pathname !== '/jobs') {
      return NextResponse.redirect(new URL('/jobs', req.url));
    }
  }

  // ✅ Default allow
  return NextResponse.next();
}

// ✅ Matcher config
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
