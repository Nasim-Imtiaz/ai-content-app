import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')
    const { pathname } = request.nextUrl

    const publicRoutes = ['/login', '/signup']
    const isPublicRoute = publicRoutes.includes(pathname)

    if (accessToken && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!isPublicRoute && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

