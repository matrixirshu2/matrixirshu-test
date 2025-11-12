import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({ where: { id: params.id } })
  if (!user) return NextResponse.json({ ok:false, error: 'Not found' }, { status: 404 })
  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { isBlocked: !user.isBlocked }
  })
  return NextResponse.json({ ok: true, user: updated })
}
