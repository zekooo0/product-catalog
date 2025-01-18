import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value
  const isLoginPage = request.nextUrl.pathname === '/login'

  // If user is logged in and tries to access login page, redirect to home
  if (isLoginPage && authToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // For protected routes, check if user is authenticated
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                          request.nextUrl.pathname.startsWith('/profile')
  
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login']
}
