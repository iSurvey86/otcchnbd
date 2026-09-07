import { NextResponse } from 'next/server'
import {
  QUESTION_OVERRIDE_SELECT,
  mapQuestionOverrideRow,
  type QuestionOverrideDbRow,
} from '@/lib/questionOverride'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

/** Public read — để ôn/thi thấy đáp án đã sửa nóng. */
export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: [] })
  }

  const url = new URL(request.url)
  const sector = url.searchParams.get('sector')?.trim()
  const bankId = url.searchParams.get('bankId')
  const trackId = url.searchParams.get('trackId')

  const db = getSupabaseAdmin()!
  let q = db.from('question_overrides').select(QUESTION_OVERRIDE_SELECT)
  if (sector) q = q.eq('sector', sector)
  if (bankId != null) q = q.eq('bank_id', bankId)
  if (trackId != null) q = q.eq('track_id', trackId)

  const { data, error } = await q.limit(5000)

  if (error) {
    return NextResponse.json(
      {
        error: /question_overrides/i.test(error.message)
          ? 'Chưa chạy supabase/schema-question-overrides.sql.'
          : error.message,
        data: [],
      },
      { status: 500 },
    )
  }

  return NextResponse.json({
    data: ((data ?? []) as QuestionOverrideDbRow[]).map(mapQuestionOverrideRow),
  })
}
