import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';
import { createSession } from '@/lib/auth';
import { getUserByEmail } from '@/lib/db';

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ ok: false, error: 'Email and code required' }, { status: 400 });
    const user = await getUserByEmail(email);
    if (user?.is_disabled) return NextResponse.json({ ok:false, error:'Account disabled' }, { status: 403 });
    const ok = await verifyOTP(email, code);
    if (!ok) return NextResponse.json({ ok: false, error: 'Invalid or expired code' }, { status: 401 });
    await createSession({ email, role: user?.role || 'user', uid: user?.id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e.message || 'Server error' }, { status: 500 });
  }
}