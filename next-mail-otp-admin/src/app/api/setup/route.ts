import { NextResponse } from 'next/server';
import { createTablesIfNotExists } from '@/lib/db';

export async function POST() {
  await createTablesIfNotExists();
  return NextResponse.json({ ok: true });
}