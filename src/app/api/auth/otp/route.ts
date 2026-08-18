import { NextResponse } from 'next/server'
import { normalizeEmail, sendEmailOtp } from '@/lib/emailOtp'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string }
  const email = normalizeEmail(body.email)
  if (!email) {
    return NextResponse.json({ error: 'Email không hợp lệ.' }, { status: 400 })
  }

  const result = await sendEmailOtp(email)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  return NextResponse.json({ ok: true })
}
