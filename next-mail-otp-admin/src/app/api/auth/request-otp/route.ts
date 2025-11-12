import { NextResponse } from 'next/server';
import { generateCode, saveOTP } from '@/lib/otp';
import { sendOTP } from '@/lib/mailer';
import { createTablesIfNotExists, ensureUser, getUserByEmail } from '@/lib/db';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !String(email).includes('@')) {
      return NextResponse.json({ ok: false, error: 'Valid email required' }, { status: 400 });
    }
    await createTablesIfNotExists();
    const user = await getUserByEmail(email);
    if (user?.is_disabled) {
      return NextResponse.json({ ok: false, error: 'Account disabled by admin' }, { status: 403 });
    }
    await ensureUser(email);
    const code = generateCode(6);
    await saveOTP(email, code);
    await sendOTP(email, code);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e.message || 'Server error' }, { status: 500 });
  }
}