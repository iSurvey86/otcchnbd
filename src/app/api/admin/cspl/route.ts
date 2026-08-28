import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import {
  buildCsplStoragePath,
  CSPL_BUCKET,
  CSPL_MAX_BYTES,
  CSPL_PILOT_SECTOR,
  CSPL_SELECT,
  extFromFilename,
  findCsplDuplicateBySoHieu,
  mapCsplRow,
  type CsplDocType,
  type CsplDbRow,
  type CsplSector,
} from '@/lib/cspl'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

const DOC_TYPES = new Set<CsplDocType>([
  'nghi-dinh',
  'thong-tu',
  'quyet-dinh',
  'luat',
  'vbhn',
  'qcvn',
  'tcvn',
  'quy-dinh',
  'khac',
])

async function ensureCsplBucket(
  db: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
) {
  const { data: buckets } = await db.storage.listBuckets()
  if (buckets?.some((b) => b.id === CSPL_BUCKET || b.name === CSPL_BUCKET)) {
    return
  }
  const { error } = await db.storage.createBucket(CSPL_BUCKET, {
    public: false,
    fileSizeLimit: CSPL_MAX_BYTES,
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  })
  if (error && !/already exists|duplicate/i.test(error.message)) {
    throw new Error(error.message)
  }
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
  const sector = (url.searchParams.get('sector') || CSPL_PILOT_SECTOR) as CsplSector
  const limit = Math.min(Number(url.searchParams.get('limit') || 100), 200)

  const db = getSupabaseAdmin()!
  const { data, error } = await db
    .from('cspl_documents')
    .select(CSPL_SELECT)
    .eq('sector', sector)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message.includes('cspl_documents')
            ? 'Chưa tạo bảng CSPL. Chạy supabase/schema-cspl.sql trên Supabase.'
            : error.message,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({
    data: ((data ?? []) as CsplDbRow[]).map(mapCsplRow),
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

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Không đọc được form upload.' }, { status: 400 })
  }

  const sector = String(form.get('sector') || CSPL_PILOT_SECTOR) as CsplSector
  if (sector !== CSPL_PILOT_SECTOR) {
    return NextResponse.json(
      { error: 'Pilot hiện chỉ nhận lĩnh vực Đo đạc và Bản đồ.' },
      { status: 400 },
    )
  }

  const docType = String(form.get('docType') || '') as CsplDocType
  if (!DOC_TYPES.has(docType)) {
    return NextResponse.json({ error: 'Loại văn bản không hợp lệ.' }, { status: 400 })
  }

  const soHieu = String(form.get('soHieu') || '').trim()
  if (!soHieu) {
    return NextResponse.json({ error: 'Nhập số hiệu văn bản.' }, { status: 400 })
  }

  const title = String(form.get('title') || '').trim() || null
  const issuedOn = String(form.get('issuedOn') || '').trim() || null
  const effectiveOn = String(form.get('effectiveOn') || '').trim() || null
  const notes = String(form.get('notes') || '').trim() || null
  const file = form.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Chọn file PDF hoặc Word.' }, { status: 400 })
  }
  if (file.size <= 0) {
    return NextResponse.json({ error: 'File rỗng.' }, { status: 400 })
  }
  if (file.size > CSPL_MAX_BYTES) {
    return NextResponse.json(
      { error: `File vượt quá ${Math.round(CSPL_MAX_BYTES / (1024 * 1024))} MB.` },
      { status: 400 },
    )
  }

  const ext = extFromFilename(file.name)
  if (!ext) {
    return NextResponse.json(
      { error: 'Chỉ nhận .pdf, .doc, .docx.' },
      { status: 400 },
    )
  }

  const db = getSupabaseAdmin()!

  const { data: existingRows, error: existingErr } = await db
    .from('cspl_documents')
    .select('id, so_hieu, title')
    .eq('sector', sector)
    .limit(500)
  if (existingErr) {
    return NextResponse.json(
      {
        error: existingErr.message.includes('cspl_documents')
          ? 'Chưa tạo bảng CSPL. Chạy supabase/schema-cspl.sql trên Supabase.'
          : existingErr.message,
      },
      { status: 500 },
    )
  }
  const dup = findCsplDuplicateBySoHieu(
    (existingRows ?? []).map((r) => ({
      id: String(r.id),
      soHieu: String(r.so_hieu || ''),
      title: r.title ? String(r.title) : null,
    })),
    soHieu,
  )
  if (dup) {
    return NextResponse.json(
      {
        error: `Số hiệu «${dup.soHieu}» đã có trong kho${dup.title ? ` — ${dup.title}` : ''}.`,
      },
      { status: 409 },
    )
  }

  const docId = randomUUID()
  const year = issuedOn
    ? Number(issuedOn.slice(0, 4)) || new Date().getFullYear()
    : new Date().getFullYear()
  const storagePath = buildCsplStoragePath({
    sector,
    docType,
    soHieu,
    year,
    ext,
    docId,
  })

  try {
    await ensureCsplBucket(db)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Không tạo được bucket CSPL.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

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

  const { data, error } = await db
    .from('cspl_documents')
    .insert({
      id: docId,
      sector,
      doc_type: docType,
      so_hieu: soHieu,
      title,
      issued_on: issuedOn,
      effective_on: effectiveOn,
      status: 'uploaded',
      legal_status: 'con_hieu_luc',
      phu_luc_files: [],
      storage_bucket: CSPL_BUCKET,
      storage_path: storagePath,
      original_filename: file.name,
      content_type: file.type || null,
      byte_size: file.size,
      uploaded_by_uid: auth.user.uid,
      uploaded_by_email: auth.user.email ?? null,
      notes,
    })
    .select(CSPL_SELECT)
    .single()

  if (error) {
    await db.storage.from(CSPL_BUCKET).remove([storagePath])
    return NextResponse.json(
      {
        error:
          error.message.includes('cspl_documents')
            ? 'Chưa tạo bảng CSPL. Chạy supabase/schema-cspl.sql trên Supabase.'
            : error.message,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ data: mapCsplRow(data as CsplDbRow) })
}
