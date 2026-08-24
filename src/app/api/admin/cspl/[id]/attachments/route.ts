import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import {
  buildCsplAppendixPath,
  CSPL_BUCKET,
  CSPL_MAX_BYTES,
  CSPL_SELECT,
  extFromFilename,
  mapCsplRow,
  serializePhuLucFiles,
  type CsplDbRow,
  type CsplSector,
} from '@/lib/cspl'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

type Ctx = { params: Promise<{ id: string }> }

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

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Không đọc được form.' }, { status: 400 })
  }

  const file = form.get('file')
  const ten = String(form.get('ten') || '').trim()
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Chọn file phụ lục.' }, { status: 400 })
  }
  if (file.size <= 0 || file.size > CSPL_MAX_BYTES) {
    return NextResponse.json(
      {
        error: `File không hợp lệ hoặc vượt ${Math.round(CSPL_MAX_BYTES / (1024 * 1024))} MB.`,
      },
      { status: 400 },
    )
  }
  const ext = extFromFilename(file.name)
  if (!ext) {
    return NextResponse.json({ error: 'Chỉ nhận .pdf, .doc, .docx.' }, { status: 400 })
  }

  const db = getSupabaseAdmin()!
  const { data: existing, error: loadErr } = await db
    .from('cspl_documents')
    .select(CSPL_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (loadErr) {
    return NextResponse.json(
      {
        error:
          /phu_luc_files/i.test(loadErr.message)
            ? 'Chưa chạy migration phụ lục. Chạy supabase/schema-cspl-alter-phu-luc.sql.'
            : loadErr.message,
      },
      { status: 500 },
    )
  }
  if (!existing) {
    return NextResponse.json({ error: 'Không tìm thấy văn bản.' }, { status: 404 })
  }

  const doc = mapCsplRow(existing as CsplDbRow)
  const nextIndex =
    doc.appendices.reduce((max, pl) => Math.max(max, pl.thuTu), 0) + 1
  const storagePath = buildCsplAppendixPath({
    sector: doc.sector as CsplSector,
    docId: id,
    index: nextIndex,
    originalName: ten || file.name,
    ext,
  })

  const buffer = Buffer.from(await file.arrayBuffer())
  const { error: uploadError } = await db.storage
    .from(CSPL_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type || undefined,
      upsert: false,
    })
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const appendix = {
    id: randomUUID(),
    ten: ten || file.name.replace(/\.[^.]+$/, '') || `Phụ lục ${nextIndex}`,
    path: storagePath,
    fileTenGoc: file.name,
    byteSize: file.size,
    thuTu: nextIndex,
  }
  const nextList = [...doc.appendices, appendix]

  const { data, error } = await db
    .from('cspl_documents')
    .update({
      phu_luc_files: serializePhuLucFiles(nextList),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(CSPL_SELECT)
    .maybeSingle()

  if (error || !data) {
    await db.storage.from(CSPL_BUCKET).remove([storagePath])
    return NextResponse.json(
      { error: error?.message || 'Không cập nhật được phụ lục.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ data: mapCsplRow(data as CsplDbRow) })
}

export async function DELETE(request: Request, ctx: Ctx) {
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
  const url = new URL(request.url)
  const appendixId = url.searchParams.get('appendixId')?.trim()
  if (!id || !appendixId) {
    return NextResponse.json({ error: 'Thiếu id văn bản hoặc phụ lục.' }, { status: 400 })
  }

  const db = getSupabaseAdmin()!
  const { data: existing, error: loadErr } = await db
    .from('cspl_documents')
    .select(CSPL_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (loadErr || !existing) {
    return NextResponse.json(
      { error: loadErr?.message || 'Không tìm thấy văn bản.' },
      { status: loadErr ? 500 : 404 },
    )
  }

  const doc = mapCsplRow(existing as CsplDbRow)
  const target = doc.appendices.find((pl) => pl.id === appendixId)
  if (!target) {
    return NextResponse.json({ error: 'Không tìm thấy phụ lục.' }, { status: 404 })
  }

  const nextList = doc.appendices
    .filter((pl) => pl.id !== appendixId)
    .map((pl, i) => ({ ...pl, thuTu: i + 1 }))

  const { data, error } = await db
    .from('cspl_documents')
    .update({
      phu_luc_files: serializePhuLucFiles(nextList),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(CSPL_SELECT)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || 'Không xóa được phụ lục.' },
      { status: 500 },
    )
  }

  if (target.path) {
    await db.storage.from(CSPL_BUCKET).remove([target.path])
  }

  return NextResponse.json({ data: mapCsplRow(data as CsplDbRow) })
}
