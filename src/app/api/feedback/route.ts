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
    message?: string
    questionId?: string
    questionPrompt?: string
    sector?: string | null
    trackId?: string | null
    topicId?: string | null
  }

  const message = String(body.message ?? '').trim()
  if (message.length < 10) {
    return NextResponse.json(
      { error: 'Vui lòng mô tả góp ý ít nhất 10 ký tự.' },
      { status: 400 },
    )
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: 'Góp ý tối đa 2000 ký tự.' }, { status: 400 })
  }
  if (!body.questionId) {
    return NextResponse.json({ error: 'Thiếu questionId.' }, { status: 400 })
  }

  const db = getSupabaseAdmin()!
  const now = new Date().toISOString()
  const { error } = await db.from('feedback').insert({
    uid: auth.user.uid,
    email: auth.user.email,
    display_name: auth.user.name,
    message,
    question_id: body.questionId,
    question_prompt: String(body.questionPrompt ?? '').slice(0, 300),
    sector: body.sector ?? null,
    track_id: body.trackId ?? null,
    topic_id: body.topicId ?? null,
    status: 'moi',
    admin_reply: null,
    created_at: now,
    updated_at: now,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await db.from('activity_logs').insert({
    uid: auth.user.uid,
    email: auth.user.email,
    display_name: auth.user.name,
    event: 'feedback_submitted',
    question_id: body.questionId,
    mode: 'feedback',
  })

  return NextResponse.json({ ok: true })
}
