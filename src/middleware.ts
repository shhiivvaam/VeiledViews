import { NextRequest, NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
export { default } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (token &&
        // adding middlewares to redirect user from signing in again if already signed in(token is already present) 
        (
            url.pathname.startsWith('/') ||          // if already signed in -> no need to go to the landing page -> redirect to the main content page
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        // '/about/:path*',
        '/',
        '/sign-in',
        '/sign-up',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}