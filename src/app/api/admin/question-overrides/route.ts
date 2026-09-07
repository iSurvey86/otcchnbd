import { NextResponse } from 'next/server'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import {
  QUESTION_OVERRIDE_SELECT,
  mapQuestionOverrideRow,
  type QuestionOverrideDbRow,
} from '@/lib/questionOverride'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'
import type { Section } from '@/types'

function schemaHint(message: string): boolean {
  return /question_overrides/i.test(message)
}

export async function GET(request: Request) {
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

  const url = new URL(request.url)
  const sector = url.searchParams.get('sector')?.trim()
  const db = getSupabaseAdmin()!
  let q = db
    .from('question_overrides')
    .select(QUESTION_OVERRIDE_SELECT)
    .order('updated_at', { ascending: false })
  if (sector) q = q.eq('sector', sector)

  const { data, error } = await q.limit(5000)
  if (error) {
    return NextResponse.json(
      {
        error: schemaHint(error.message)
          ? 'Chưa chạy supabase/schema-question-overrides.sql.'
          : error.message,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({
    data: ((data ?? []) as QuestionOverrideDbRow[]).map(mapQuestionOverrideRow),
  })
}

export async function POST(request: Request) {
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

  let body: {
    sector?: string
    bankId?: string
    trackId?: string
    questionId?: string
    prompt?: string | null
    options?: string[] | null
    answer?: number | null
    explanation?: string | null
    source?: string | null
    section?: string | null
    topic?: string | null
    note?: string | null
  }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'JSON không hợp lệ.' }, { status: 400 })
  }

  const sector = String(body.sector || '').trim()
  const questionId = String(body.questionId || '').trim()
  if (!sector || !questionId) {
    return NextResponse.json(
      { error: 'Thiếu sector hoặc questionId.' },
      { status: 400 },
    )
  }
  if (!['do-dac-ban-do', 'xay-dung', 'dau-thau'].includes(sector)) {
    return NextResponse.json({ error: 'Sector không hợp lệ.' }, { status: 400 })
  }

  const bankId =
    sector === 'do-dac-ban-do' ? String(body.bankId || '').trim() : ''
  const trackId =
    sector === 'xay-dung' ? String(body.trackId || '').trim() : ''

  if (sector === 'do-dac-ban-do' && !bankId) {
    return NextResponse.json(
      { error: 'Đo đạc cần bankId.' },
      { status: 400 },
    )
  }
  if (sector === 'xay-dung' && !trackId) {
    return NextResponse.json(
      { error: 'Xây dựng cần trackId.' },
      { status: 400 },
    )
  }

  let options: string[] | null = null
  if (body.options != null) {
    if (!Array.isArray(body.options) || body.options.length !== 4) {
      return NextResponse.json(
        { error: 'options phải đủ 4 phương án.' },
        { status: 400 },
      )
    }
    options = body.options.map((x) => String(x || '').trim())
    if (options.some((x) => !x)) {
      return NextResponse.json(
        { error: 'Mỗi phương án A–D không được trống.' },
        { status: 400 },
      )
    }
  }

  let answer: number | null = null
  if (body.answer != null) {
    answer = Number(body.answer)
    if (![0, 1, 2, 3].includes(answer)) {
      return NextResponse.json({ error: 'answer phải 0–3.' }, { status: 400 })
    }
  }

  let section: Section | null = null
  if (body.section) {
    if (body.section !== 'phap-luat' && body.section !== 'kinh-nghiem') {
      return NextResponse.json({ error: 'section không hợp lệ.' }, { status: 400 })
    }
    section = body.section
  }

  const row = {
    sector,
    bank_id: bankId,
    track_id: trackId,
    question_id: questionId,
    prompt: body.prompt != null ? String(body.prompt).trim() || null : null,
    options,
    answer,
    explanation:
      body.explanation != null
        ? String(body.explanation).trim() || null
        : null,
    source: body.source != null ? String(body.source).trim() || null : null,
    section,
    topic: body.topic != null ? String(body.topic).trim() || null : null,
    note: body.note != null ? String(body.note).trim() || null : null,
    updated_by_email: auth.user.email ?? null,
    updated_at: new Date().toISOString(),
  }

  // Nếu mọi field nội dung null → không lưu (hoặc xóa). Yêu cầu ít nhất 1 field.
  const hasContent =
    row.prompt ||
    row.options ||
    row.answer != null ||
    row.explanation ||
    row.source ||
    row.section ||
    row.topic
  if (!hasContent) {
    return NextResponse.json(
      { error: 'Cần ít nhất một trường nội dung để override.' },
      { status: 400 },
    )
  }

  const db = getSupabaseAdmin()!
  const { data, error } = await db
    .from('question_overrides')
    .upsert(row, { onConflict: 'sector,bank_id,track_id,question_id' })
    .select(QUESTION_OVERRIDE_SELECT)
    .single()

  if (error) {
    return NextResponse.json(
      {
        error: schemaHint(error.message)
          ? 'Chưa chạy supabase/schema-question-overrides.sql.'
          : error.message,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ data: mapQuestionOverrideRow(data as QuestionOverrideDbRow) })
}
