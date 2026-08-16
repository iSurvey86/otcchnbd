import { NextResponse } from 'next/server'
import { verifyBearerUser } from '@/lib/firebaseAdmin'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Chưa cấu hình Supabase.' }, { status: 500 })
  }
  const auth = await verifyBearerUser(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body = (await request.json().catch(() => ({}))) as {
    event?: string
    questionId?: string | null
    mode?: string | null
    passed?: boolean | null
    score?: number | null
    reason?: string | null
    payload?: Record<string, unknown>
  }

  if (!body.event || typeof body.event !== 'string') {
    return NextResponse.json({ error: 'Thiếu event.' }, { status: 400 })
  }

  const db = getSupabaseAdmin()!
  const { error } = await db.from('activity_logs').insert({
    uid: auth.user.uid,
    email: auth.user.email,
    display_name: auth.user.name,
    event: body.event,
    question_id: body.questionId ?? null,
    mode: body.mode ?? null,
    passed: body.passed ?? null,
    score: body.score ?? null,
    reason: body.reason ?? null,
    payload: body.payload ?? {},
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
