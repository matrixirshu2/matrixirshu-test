import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { setUserRole, setUserDisabled, deleteUser } from '@/lib/db';

export async function POST(req) {
  try {
    const session = await requireSession();
    if (session.role !== 'admin') return NextResponse.json({ ok:false, error:'Admins only' }, { status: 403 });
    const form = await req.formData();
    const action = String(form.get('action') || '');
    const id = Number(form.get('id'));
    if (action === 'role') {
      const role = String(form.get('role') || 'user');
      await setUserRole(id, role);
    } else if (action === 'disable') {
      const disabled = String(form.get('disabled')) === 'true';
      await setUserDisabled(id, disabled);
    } else if (action === 'delete') {
      await deleteUser(id);
    } else {
      return NextResponse.json({ ok:false, error:'Unknown action' }, { status: 400 });
    }
    return NextResponse.redirect(new URL('/(protected)/admin', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok:false, error: e.message || 'Server error' }, { status: 500 });
  }
}