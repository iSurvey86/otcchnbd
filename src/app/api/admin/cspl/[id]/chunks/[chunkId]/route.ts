import { NextResponse } from 'next/server'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import {
  CSPL_CHUNK_SELECT,
  mapCsplChunkRow,
  type CsplChunkDbRow,
  type CsplChunkStatus,
} from '@/lib/csplChunk'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

type Ctx = { params: Promise<{ id: string; chunkId: string }> }

const STATUSES = new Set<CsplChunkStatus>(['pending', 'approved', 'rejected'])

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

  const { id, chunkId } = await ctx.params
  if (!id || !chunkId) {
    return NextResponse.json({ error: 'Thiếu id.' }, { status: 400 })
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'JSON không hợp lệ.' }, { status: 400 })
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (body.status !== undefined) {
    const status = String(body.status) as CsplChunkStatus
    if (!STATUSES.has(status)) {
      return NextResponse.json({ error: 'Trạng thái chunk không hợp lệ.' }, { status: 400 })
    }
    patch.status = status
  }

  if (body.body !== undefined) {
    const text = String(body.body || '').trim()
    if (text.length < 20) {
      return NextResponse.json({ error: 'Nội dung đoạn quá ngắn.' }, { status: 400 })
    }
    patch.body = text
    patch.char_count = text.length
  }

  if (body.citeLabel !== undefined) {
    const cite = String(body.citeLabel || '').trim()
    if (!cite) {
      return NextResponse.json({ error: 'Nhãn cite không được trống.' }, { status: 400 })
    }
    patch.cite_label = cite
  }

  if (body.reviewNote !== undefined) {
    patch.review_note = String(body.reviewNote || '').trim() || null
  }

  if (Object.keys(patch).length <= 1) {
    return NextResponse.json({ error: 'Không có trường cập nhật.' }, { status: 400 })
  }

  const db = getSupabaseAdmin()!
  const { data, error } = await db
    .from('cspl_chunks')
    .update(patch)
    .eq('id', chunkId)
    .eq('document_id', id)
    .select(CSPL_CHUNK_SELECT)
    .maybeSingle()

  if (error) {
    return NextResponse.json(
      {
        error: /cspl_chunks/i.test(error.message)
          ? 'Chưa tạo bảng chunk. Chạy supabase/schema-cspl-chunks.sql trên Supabase.'
          : error.message,
      },
      { status: 500 },
    )
  }
  if (!data) {
    return NextResponse.json({ error: 'Không tìm thấy đoạn.' }, { status: 404 })
  }

  return NextResponse.json({ data: mapCsplChunkRow(data as CsplChunkDbRow) })
}
