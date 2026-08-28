import { NextResponse } from 'next/server'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import {
  CSPL_BUCKET,
  CSPL_SELECT,
  findCsplDuplicateBySoHieu,
  mapCsplRow,
  type CsplDbRow,
  type CsplDocType,
} from '@/lib/cspl'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

type Ctx = { params: Promise<{ id: string }> }

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

function optionalDate(value: unknown): string | null | undefined {
  if (value === undefined) return undefined
  const s = String(value || '').trim()
  if (!s) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined
  return s
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

  if (action === 'update') {
    const soHieu = String(body.soHieu || '').trim()
    if (!soHieu) {
      return NextResponse.json({ error: 'Nhập số hiệu văn bản.' }, { status: 400 })
    }
    const docType = String(body.docType || '') as CsplDocType
    if (!DOC_TYPES.has(docType)) {
      return NextResponse.json({ error: 'Loại văn bản không hợp lệ.' }, { status: 400 })
    }
    const issuedOn = optionalDate(body.issuedOn)
    const effectiveOn = optionalDate(body.effectiveOn)
    if (body.issuedOn !== undefined && issuedOn === undefined) {
      return NextResponse.json({ error: 'Ngày ban hành không hợp lệ.' }, { status: 400 })
    }
    if (body.effectiveOn !== undefined && effectiveOn === undefined) {
      return NextResponse.json({ error: 'Ngày hiệu lực không hợp lệ.' }, { status: 400 })
    }

    const title = String(body.title || '').trim() || null
    const notes = String(body.notes || '').trim() || null

    const { data: current, error: currentErr } = await db
      .from('cspl_documents')
      .select('id, sector')
      .eq('id', id)
      .maybeSingle()
    if (currentErr) {
      return NextResponse.json({ error: currentErr.message }, { status: 500 })
    }
    if (!current) {
      return NextResponse.json({ error: 'Không tìm thấy văn bản.' }, { status: 404 })
    }

    const { data: existingRows, error: existingErr } = await db
      .from('cspl_documents')
      .select('id, so_hieu, title')
      .eq('sector', current.sector)
      .limit(500)
    if (existingErr) {
      return NextResponse.json({ error: existingErr.message }, { status: 500 })
    }
    const dup = findCsplDuplicateBySoHieu(
      (existingRows ?? []).map((r) => ({
        id: String(r.id),
        soHieu: String(r.so_hieu || ''),
        title: r.title ? String(r.title) : null,
      })),
      soHieu,
      id,
    )
    if (dup) {
      return NextResponse.json(
        {
          error: `Số hiệu «${dup.soHieu}» đã gắn với văn bản khác${dup.title ? ` — ${dup.title}` : ''}.`,
        },
        { status: 409 },
      )
    }

    const { data, error } = await db
      .from('cspl_documents')
      .update({
        so_hieu: soHieu,
        doc_type: docType,
        title,
        issued_on: issuedOn ?? null,
        effective_on: effectiveOn ?? null,
        notes,
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
    return NextResponse.json({ data: mapCsplRow(data as CsplDbRow) })
  }

  if (action !== 'expire') {
    return NextResponse.json({ error: 'Action không hỗ trợ.' }, { status: 400 })
  }

  const expiredOn = String(body.expiredOn || '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expiredOn)) {
    return NextResponse.json({ error: 'Chọn ngày hết hiệu lực.' }, { status: 400 })
  }

  const replacedById = body.replacedById
    ? String(body.replacedById).trim()
    : null
  if (replacedById && replacedById === id) {
    return NextResponse.json(
      { error: 'Văn bản thay thế không được là chính nó.' },
      { status: 400 },
    )
  }

  const expireNote = String(body.expireNote || '').trim() || null

  if (replacedById) {
    const { data: repl, error: replErr } = await db
      .from('cspl_documents')
      .select('id, legal_status')
      .eq('id', replacedById)
      .maybeSingle()
    if (replErr || !repl) {
      return NextResponse.json(
        { error: 'Không tìm thấy văn bản thay thế.' },
        { status: 400 },
      )
    }
  }

  const { data, error } = await db
    .from('cspl_documents')
    .update({
      legal_status: 'het_hieu_luc',
      expired_on: expiredOn,
      replaced_by_id: replacedById,
      expire_note: expireNote,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(CSPL_SELECT)
    .maybeSingle()

  if (error) {
    return NextResponse.json(
      {
        error:
          /legal_status|replaced_by/i.test(error.message)
            ? 'Chưa chạy migration hiệu lực. Chạy supabase/schema-cspl-alter-legal-status.sql.'
            : error.message,
      },
      { status: 500 },
    )
  }
  if (!data) {
    return NextResponse.json({ error: 'Không tìm thấy văn bản.' }, { status: 404 })
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
  if (!id) {
    return NextResponse.json({ error: 'Thiếu id văn bản.' }, { status: 400 })
  }

  const db = getSupabaseAdmin()!
  const { data: existing, error: loadErr } = await db
    .from('cspl_documents')
    .select(CSPL_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (loadErr) {
    return NextResponse.json({ error: loadErr.message }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ error: 'Không tìm thấy văn bản.' }, { status: 404 })
  }

  const doc = mapCsplRow(existing as CsplDbRow)
  const paths = [
    doc.storagePath,
    ...doc.appendices.map((pl) => pl.path).filter(Boolean),
  ].filter(Boolean)

  const { error: delErr } = await db.from('cspl_documents').delete().eq('id', id)
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 })
  }

  if (paths.length > 0) {
    await db.storage.from(CSPL_BUCKET).remove(paths)
  }

  return NextResponse.json({ ok: true, id })
}
