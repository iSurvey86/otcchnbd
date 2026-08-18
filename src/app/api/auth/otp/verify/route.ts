import { NextResponse } from 'next/server'
import { normalizeEmail, normalizeOtp, verifyEmailOtp } from '@/lib/emailOtp'
import { createFirebaseTokenForEmail } from '@/lib/firebaseAdmin'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string
    code?: string
  }
  const email = normalizeEmail(body.email)
  const code = normalizeOtp(body.code)
  if (!email) {
    return NextResponse.json({ error: 'Email không hợp lệ.' }, { status: 400 })
  }
  if (!code) {
    return NextResponse.json({ error: 'Mã gồm đúng 6 chữ số.' }, { status: 400 })
  }

  const verified = await verifyEmailOtp(email, code)
  if ('error' in verified) {
    return NextResponse.json({ error: verified.error }, { status: verified.status })
  }

  const session = await createFirebaseTokenForEmail(email)
  if ('error' in session) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }
  return NextResponse.json({ token: session.token })
}
