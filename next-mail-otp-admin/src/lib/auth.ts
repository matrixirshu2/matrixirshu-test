import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'session';
const MAX_AGE = 60 * 60 * 24 * 7;

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function createSession(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecretKey());
  cookies().set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', maxAge: MAX_AGE, path: '/' });
}

export async function getSession(): Promise<any | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
}

export function clearSession() {
  cookies().set(COOKIE_NAME, '', { httpOnly: true, maxAge: 0, path: '/' });
}