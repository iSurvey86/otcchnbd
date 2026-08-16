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
    photoURL?: string | null
    provider?: string | null
    bumpLogin?: boolean
  }

  const db = getSupabaseAdmin()!
  const now = new Date().toISOString()
  const { data: existing } = await db
    .from('app_users')
    .select('uid, login_count')
    .eq('uid', auth.user.uid)
    .maybeSingle()

  if (!existing) {
    const { error } = await db.from('app_users').insert({
      uid: auth.user.uid,
      email: auth.user.email,
      display_name: auth.user.name,
      photo_url: body.photoURL ?? null,
      provider: body.provider ?? 'google.com',
      answer_count: 0,
      exam_count: 0,
      login_count: body.bumpLogin === false ? 0 : 1,
      last_login_at: now,
      last_seen_at: now,
      created_at: now,
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else {
    const patch: Record<string, unknown> = {
      email: auth.user.email,
      display_name: auth.user.name,
      photo_url: body.photoURL ?? null,
      provider: body.provider ?? 'google.com',
      last_login_at: now,
      last_seen_at: now,
    }
    if (body.bumpLogin !== false) {
      patch.login_count = Number(existing.login_count ?? 0) + 1
    }
    const { error } = await db.from('app_users').update(patch).eq('uid', auth.user.uid)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Chưa cấu hình Supabase.' }, { status: 500 })
  }
  const auth = await verifyBearerUser(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body = (await request.json().catch(() => ({}))) as {
    field?: 'answerCount' | 'examCount'
  }
  if (body.field !== 'answerCount' && body.field !== 'examCount') {
    return NextResponse.json({ error: 'field không hợp lệ.' }, { status: 400 })
  }

  const db = getSupabaseAdmin()!
  const { data: cur, error: readErr } = await db
    .from('app_users')
    .select('answer_count, exam_count')
    .eq('uid', auth.user.uid)
    .maybeSingle()

  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 })
  }

  const patch =
    body.field === 'answerCount'
      ? { answer_count: Number(cur?.answer_count ?? 0) + 1 }
      : { exam_count: Number(cur?.exam_count ?? 0) + 1 }

  const { error } = await db
    .from('app_users')
    .update({ ...patch, last_seen_at: new Date().toISOString() })
    .eq('uid', auth.user.uid)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
