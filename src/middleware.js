import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // If the path is /admin and NOT /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session');

    // If no session or session is not "true", redirect to login
    if (!session || session.value !== 'true') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Only match admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
