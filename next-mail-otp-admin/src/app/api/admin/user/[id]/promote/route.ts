import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { Role } from '@prisma/client'

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({ where: { id: params.id } })
  if (!user) return NextResponse.json({ ok:false, error: 'Not found' }, { status: 404 })
  const newRole = user.role === 'ADMIN' ? Role.USER : Role.ADMIN
  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { role: newRole }
  })
  return NextResponse.json({ ok: true, user: updated })
}
