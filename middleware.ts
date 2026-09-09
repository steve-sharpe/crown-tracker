import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    const adminAuth = request.cookies.get('admin_auth')?.value
    if (adminAuth !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/dashboard/:path*',
}