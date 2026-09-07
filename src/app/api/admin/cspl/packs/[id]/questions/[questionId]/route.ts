import { NextResponse } from 'next/server'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import {
  CSPL_PACK_QUESTION_SELECT,
  mapCsplPackQuestionRow,
  type CsplPackQuestionDbRow,
  type CsplPackQuestionStatus,
} from '@/lib/csplPack'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

type Ctx = { params: Promise<{ id: string; questionId: string }> }

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

  const { id, questionId } = await ctx.params
  if (!id || !questionId) {
    return NextResponse.json({ error: 'Thiếu id pack hoặc câu.' }, { status: 400 })
  }

  let body: {
    status?: string
    multiSourceOk?: boolean
    reviewNote?: string | null
  }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'JSON không hợp lệ.' }, { status: 400 })
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (body.status) {
    const allowed: CsplPackQuestionStatus[] = ['draft', 'approved', 'rejected']
    if (!allowed.includes(body.status as CsplPackQuestionStatus)) {
      return NextResponse.json({ error: 'Status câu không hợp lệ.' }, { status: 400 })
    }
    patch.status = body.status
  }
  if (body.multiSourceOk !== undefined) {
    patch.multi_source_ok = Boolean(body.multiSourceOk)
  }
  if (body.reviewNote !== undefined) {
    patch.review_note = String(body.reviewNote || '').trim() || null
  }

  if (Object.keys(patch).length <= 1) {
    return NextResponse.json({ error: 'Không có trường cập nhật.' }, { status: 400 })
  }

  const db = getSupabaseAdmin()!
  const { data, error } = await db
    .from('cspl_pack_questions')
    .update(patch)
    .eq('id', questionId)
    .eq('pack_id', id)
    .select(CSPL_PACK_QUESTION_SELECT)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'Không tìm thấy câu.' }, { status: 404 })
  }

  return NextResponse.json({ data: mapCsplPackQuestionRow(data as CsplPackQuestionDbRow) })
}
