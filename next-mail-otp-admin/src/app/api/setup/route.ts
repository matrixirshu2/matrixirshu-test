import { NextResponse } from 'next/server';
import { createTablesIfNotExists } from '@/lib/db';

export async function POST() {
  await createTablesIfNotExists();
  return NextResponse.json({ ok: true, via: 'POST' });
}

// Optional: allow browser GET to work too
export async function GET() {
  await createTablesIfNotExists();
  return NextResponse.json({ ok: true, via: 'GET' });
}
