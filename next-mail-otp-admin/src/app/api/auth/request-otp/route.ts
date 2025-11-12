import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/src/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.FROM_EMAIL || 'Your App <onboarding@resend.dev>'

const Body = z.object({ email: z.string().email() })

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  try {
    const { email } = Body.parse(await req.json())

    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({ data: { email } })
    }
    if (user.isBlocked) {
      return NextResponse.json({ ok: false, error: 'User is blocked' }, { status: 403 })
    }

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.oTP.create({
      data: { userId: user.id, code, expiresAt }
    })

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Your OTP Code',
      text: `Your verification code is: ${code}\nThis code expires in 10 minutes.`
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Failed' }, { status: 400 })
  }
}
