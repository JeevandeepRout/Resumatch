import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.AUTH_SECRET || 'fallback_secret_for_development_only';
const key = new TextEncoder().encode(secretKey);

export async function proxy(req: NextRequest) {
  const session = req.cookies.get('session')?.value;

  // Protect /dashboard and certain API routes
  if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/api/protected')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      await jwtVerify(session, key, { algorithms: ['HS256'] });
      return NextResponse.next();
    } catch (error) {
      // Invalid or expired token
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
