import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  cookies().delete('admin_auth')
  return NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
}