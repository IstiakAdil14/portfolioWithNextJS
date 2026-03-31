import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback_secret');

async function verifyToken(token: string) {
    try {
        await jwtVerify(token, SECRET);
        return true;
    } catch {
        return false;
    }
}

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('admin_token')?.value;
    const { pathname } = req.nextUrl;

    const isProtected = pathname.startsWith('/dashboard');
    const isLoginPage = pathname === '/login';

    if (isProtected) {
        if (!token || !(await verifyToken(token))) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    if (isLoginPage && token && (await verifyToken(token))) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
