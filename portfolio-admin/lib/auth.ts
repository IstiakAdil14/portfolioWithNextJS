import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback_secret');
export const COOKIE = 'admin_token';

export async function signToken() {
    return await new SignJWT({ admin: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(SECRET);
}

export async function verifyToken(token: string) {
    try {
        await jwtVerify(token, SECRET);
        return true;
    } catch {
        return false;
    }
}

export async function isAuthenticated() {
    const store = await cookies();
    const token = store.get(COOKIE)?.value;
    if (!token) return false;
    return verifyToken(token);
}
