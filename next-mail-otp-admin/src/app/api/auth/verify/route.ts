import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/src/lib/prisma'
import { signJwt } from '@/src/lib/jwt'
import { cookies } from 'next/headers'

const Body = z.object({ email: z.string().email(), code: z.string().min(6).max(6) })

export async function POST(req: Request) {
  try {
    const { email, code } = Body.parse(await req.json())
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
    if (user.isBlocked) return NextResponse.json({ ok: false, error: 'Blocked' }, { status: 403 })

    const otp = await prisma.oTP.findFirst({
      where: { userId: user.id, code },
      orderBy: { createdAt: 'desc' }
    })
    if (!otp || otp.expiresAt < new Date()) {
      return NextResponse.json({ ok: false, error: 'Invalid or expired code' }, { status: 400 })
    }

    await prisma.oTP.deleteMany({ where: { userId: user.id } })

    const token = await signJwt({ uid: user.id, email: user.email, role: user.role }, '30d')
    await prisma.session.create({ data: { userId: user.id, jwt: token } })

    cookies().set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })

    return NextResponse.json({ ok: true, role: user.role })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Failed' }, { status: 400 })
  }
}
