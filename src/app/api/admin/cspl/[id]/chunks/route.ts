import { NextResponse } from 'next/server'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import { CSPL_BUCKET, CSPL_SELECT, mapCsplRow, type CsplDbRow } from '@/lib/cspl'
import {
  CSPL_CHUNK_SELECT,
  mapCsplChunkRow,
  splitCsplTextToChunks,
  type CsplChunkDbRow,
} from '@/lib/csplChunk'
import { extractCsplPlainText } from '@/lib/csplExtract'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

type Ctx = { params: Promise<{ id: string }> }

function missingChunksTable(message: string): boolean {
  return /cspl_chunks/i.test(message)
}

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
    return NextResponse.json({ error: 'Thiếu id văn bản.' }, { status: 400 })
  }

  const db = getSupabaseAdmin()!
  const { data: doc, error: docErr } = await db
    .from('cspl_documents')
    .select(CSPL_SELECT)
    .eq('id', id)
    .maybeSingle()
  if (docErr) {
    return NextResponse.json({ error: docErr.message }, { status: 500 })
  }
  if (!doc) {
    return NextResponse.json({ error: 'Không tìm thấy văn bản.' }, { status: 404 })
  }

  const { data, error } = await db
    .from('cspl_chunks')
    .select(CSPL_CHUNK_SELECT)
    .eq('document_id', id)
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json(
      {
        error: missingChunksTable(error.message)
          ? 'Chưa tạo bảng chunk. Chạy supabase/schema-cspl-chunks.sql trên Supabase.'
          : error.message,
      },
      { status: 500 },
    )
  }

  const chunks = ((data ?? []) as CsplChunkDbRow[]).map(mapCsplChunkRow)
  const summary = {
    total: chunks.length,
    pending: chunks.filter((c) => c.status === 'pending').length,
    approved: chunks.filter((c) => c.status === 'approved').length,
    rejected: chunks.filter((c) => c.status === 'rejected').length,
  }

  return NextResponse.json({
    data: {
      document: mapCsplRow(doc as CsplDbRow),
      chunks,
      summary,
    },
  })
}

/** Tách đoạn từ file gốc → ghi cspl_chunks, VB → chunk_review */
export async function POST(request: Request, ctx: Ctx) {
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
    return NextResponse.json({ error: 'Thiếu id văn bản.' }, { status: 400 })
  }

  let force = false
  try {
    const body = (await request.json()) as { force?: boolean }
    force = Boolean(body?.force)
  } catch {
    // empty body OK
  }

  const db = getSupabaseAdmin()!
  const { data: docRow, error: docErr } = await db
    .from('cspl_documents')
    .select(CSPL_SELECT)
    .eq('id', id)
    .maybeSingle()
  if (docErr) {
    return NextResponse.json({ error: docErr.message }, { status: 500 })
  }
  if (!docRow) {
    return NextResponse.json({ error: 'Không tìm thấy văn bản.' }, { status: 404 })
  }
  const doc = mapCsplRow(docRow as CsplDbRow)

  if (doc.status === 'active' && !force) {
    return NextResponse.json(
      {
        error:
          'Văn bản đang dùng (active). Tách lại sẽ ghi đè chunk — gửi { "force": true } nếu chắc chắn.',
      },
      { status: 409 },
    )
  }

  await db
    .from('cspl_documents')
    .update({ status: 'ingesting', updated_at: new Date().toISOString() })
    .eq('id', id)

  try {
    const { data: blob, error: dlErr } = await db.storage
      .from(CSPL_BUCKET)
      .download(doc.storagePath)
    if (dlErr || !blob) {
      throw new Error(dlErr?.message || 'Không tải được file gốc từ Storage.')
    }

    const buffer = Buffer.from(await blob.arrayBuffer())
    const ext =
      (doc.originalFilename || doc.storagePath).split('.').pop()?.toLowerCase() ||
      'docx'
    const { text, method } = await extractCsplPlainText(buffer, ext)
    const { drafts, strategy } = splitCsplTextToChunks(text)
    if (drafts.length === 0) {
      throw new Error('Không tách được đoạn nào. Kiểm tra file hoặc upload bản Word sạch hơn.')
    }

    const { error: delErr } = await db.from('cspl_chunks').delete().eq('document_id', id)
    if (delErr) {
      throw new Error(
        missingChunksTable(delErr.message)
          ? 'Chưa tạo bảng chunk. Chạy supabase/schema-cspl-chunks.sql trên Supabase.'
          : delErr.message,
      )
    }

    const rows = drafts.map((d) => ({
      document_id: id,
      sector: doc.sector,
      so_hieu: doc.soHieu,
      cite_label: d.citeLabel,
      dieu: d.dieu,
      khoan: d.khoan,
      muc: d.muc,
      body: d.body,
      char_count: d.body.length,
      sort_order: d.sortOrder,
      status: 'pending',
    }))

    // Insert theo lô nhỏ tránh payload lớn
    const batchSize = 80
    for (let i = 0; i < rows.length; i += batchSize) {
      const slice = rows.slice(i, i + batchSize)
      const { error: insErr } = await db.from('cspl_chunks').insert(slice)
      if (insErr) {
        throw new Error(
          missingChunksTable(insErr.message)
            ? 'Chưa tạo bảng chunk. Chạy supabase/schema-cspl-chunks.sql trên Supabase.'
            : insErr.message,
        )
      }
    }

    const { data: updated, error: upErr } = await db
      .from('cspl_documents')
      .update({
        status: 'chunk_review',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(CSPL_SELECT)
      .single()
    if (upErr) throw new Error(upErr.message)

    const { data: chunkRows, error: listErr } = await db
      .from('cspl_chunks')
      .select(CSPL_CHUNK_SELECT)
      .eq('document_id', id)
      .order('sort_order', { ascending: true })
    if (listErr) throw new Error(listErr.message)

    const chunks = ((chunkRows ?? []) as CsplChunkDbRow[]).map(mapCsplChunkRow)

    return NextResponse.json({
      data: {
        document: mapCsplRow(updated as CsplDbRow),
        chunks,
        summary: {
          total: chunks.length,
          pending: chunks.length,
          approved: 0,
          rejected: 0,
          strategy,
          method,
          textLength: text.length,
        },
      },
    })
  } catch (e) {
    await db
      .from('cspl_documents')
      .update({
        status: doc.status === 'active' ? 'active' : 'uploaded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    const msg = e instanceof Error ? e.message : 'Tách đoạn thất bại.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

/** Kích hoạt VB: cần ≥1 approved và 0 pending */
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
    return NextResponse.json({ error: 'Thiếu id văn bản.' }, { status: 400 })
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'JSON không hợp lệ.' }, { status: 400 })
  }

  const action = String(body.action || '').trim()
  const db = getSupabaseAdmin()!

  if (action === 'approve_all_pending') {
    const { error } = await db
      .from('cspl_chunks')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString(),
      })
      .eq('document_id', id)
      .eq('status', 'pending')
    if (error) {
      return NextResponse.json(
        {
          error: missingChunksTable(error.message)
            ? 'Chưa tạo bảng chunk. Chạy supabase/schema-cspl-chunks.sql trên Supabase.'
            : error.message,
        },
        { status: 500 },
      )
    }
    return NextResponse.json({ ok: true })
  }

  if (action !== 'activate') {
    return NextResponse.json({ error: 'Action không hỗ trợ.' }, { status: 400 })
  }

  const { data: chunks, error: listErr } = await db
    .from('cspl_chunks')
    .select('id, status')
    .eq('document_id', id)
  if (listErr) {
    return NextResponse.json(
      {
        error: missingChunksTable(listErr.message)
          ? 'Chưa tạo bảng chunk. Chạy supabase/schema-cspl-chunks.sql trên Supabase.'
          : listErr.message,
      },
      { status: 500 },
    )
  }
  const list = chunks ?? []
  if (list.length === 0) {
    return NextResponse.json(
      { error: 'Chưa có đoạn nào. Bấm Tách đoạn trước.' },
      { status: 400 },
    )
  }
  const pending = list.filter((c) => c.status === 'pending').length
  const approved = list.filter((c) => c.status === 'approved').length
  if (pending > 0) {
    return NextResponse.json(
      {
        error: `Còn ${pending} đoạn chờ duyệt. Duyệt hết (hoặc loại) rồi kích hoạt.`,
      },
      { status: 400 },
    )
  }
  if (approved === 0) {
    return NextResponse.json(
      { error: 'Cần ít nhất 1 đoạn đã duyệt để đưa vào dùng.' },
      { status: 400 },
    )
  }

  const { data, error } = await db
    .from('cspl_documents')
    .update({
      status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(CSPL_SELECT)
    .maybeSingle()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'Không tìm thấy văn bản.' }, { status: 404 })
  }

  return NextResponse.json({
    data: {
      document: mapCsplRow(data as CsplDbRow),
      summary: { total: list.length, pending: 0, approved, rejected: list.length - approved },
    },
  })
}
