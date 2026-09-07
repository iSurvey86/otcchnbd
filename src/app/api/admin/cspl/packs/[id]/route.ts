import { NextResponse } from 'next/server'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import {
  CSPL_PACK_QUESTION_SELECT,
  CSPL_PACK_SELECT,
  mapCsplPackQuestionRow,
  mapCsplPackRow,
  type CsplMonthlyPackDbRow,
  type CsplPackQuestionDbRow,
  type CsplPackStatus,
} from '@/lib/csplPack'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(request: Request, ctx: Ctx) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Chưa cấu hình Supabase.' }, { status: 500 })
  }
  const auth = await verifyBearerUser(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const denied = requireAdmin(auth.user)
  if (denied) {
    return NextResponse.json({ error: denied.error }, { status: denied.status })
  }

  const { id } = await ctx.params
  if (!id) {
    return NextResponse.json({ error: 'Thiếu id pack.' }, { status: 400 })
  }

  const db = getSupabaseAdmin()!
  const { data: packRow, error: packErr } = await db
    .from('cspl_monthly_packs')
    .select(CSPL_PACK_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (packErr) {
    return NextResponse.json(
      {
        error: /cspl_monthly_packs/i.test(packErr.message)
          ? 'Chưa chạy supabase/schema-cspl-monthly-pack.sql.'
          : packErr.message,
      },
      { status: 500 },
    )
  }
  if (!packRow) {
    return NextResponse.json({ error: 'Không tìm thấy pack.' }, { status: 404 })
  }

  const { data: qRows, error: qErr } = await db
    .from('cspl_pack_questions')
    .select(CSPL_PACK_QUESTION_SELECT)
    .eq('pack_id', id)
    .order('created_at', { ascending: true })

  if (qErr) {
    return NextResponse.json({ error: qErr.message }, { status: 500 })
  }

  const questions = ((qRows ?? []) as CsplPackQuestionDbRow[]).map(
    mapCsplPackQuestionRow,
  )
  const counts = { total: 0, draft: 0, approved: 0, rejected: 0 }
  for (const q of questions) {
    counts.total += 1
    if (q.status === 'approved') counts.approved += 1
    else if (q.status === 'rejected') counts.rejected += 1
    else counts.draft += 1
  }

  const pack = mapCsplPackRow(packRow as CsplMonthlyPackDbRow)
  pack.questionCounts = counts

  return NextResponse.json({ data: { pack, questions } })
}

export async function PATCH(request: Request, ctx: Ctx) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Chưa cấu hình Supabase.' }, { status: 500 })
  }
  const auth = await verifyBearerUser(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const denied = requireAdmin(auth.user)
  if (denied) {
    return NextResponse.json({ error: denied.error }, { status: denied.status })
  }

  const { id } = await ctx.params
  if (!id) {
    return NextResponse.json({ error: 'Thiếu id pack.' }, { status: 400 })
  }

  let body: { status?: string; notes?: string | null }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'JSON không hợp lệ.' }, { status: 400 })
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (body.notes !== undefined) {
    patch.notes = String(body.notes || '').trim() || null
  }
  if (body.status) {
    const allowed: CsplPackStatus[] = [
      'draft',
      'review',
      'approved',
      'published',
      'locked',
    ]
    if (!allowed.includes(body.status as CsplPackStatus)) {
      return NextResponse.json({ error: 'Status pack không hợp lệ.' }, { status: 400 })
    }
    if (body.status === 'published') {
      return NextResponse.json(
        {
          error:
            'Publish 01 00:00 GMT+7 chưa bật trong MVP — chỉ chuyển draft/review.',
        },
        { status: 400 },
      )
    }
    patch.status = body.status
  }

  const db = getSupabaseAdmin()!
  const { data, error } = await db
    .from('cspl_monthly_packs')
    .update(patch)
    .eq('id', id)
    .select(CSPL_PACK_SELECT)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'Không tìm thấy pack.' }, { status: 404 })
  }

  return NextResponse.json({ data: mapCsplPackRow(data as CsplMonthlyPackDbRow) })
}
