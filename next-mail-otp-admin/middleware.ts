import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJwt } from './src/lib/jwt'

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const token = req.cookies.get('session')?.value
    if (!token) return NextResponse.redirect(new URL('/?reason=signin', req.url))
    try {
      const payload = await verifyJwt(token)
      if ((payload as any).role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/?reason=forbidden', req.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/?reason=session', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
