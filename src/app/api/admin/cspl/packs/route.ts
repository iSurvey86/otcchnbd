import { NextResponse } from 'next/server'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import {
  CSPL_PACK_DO_DAC_DEFAULTS,
  CSPL_PACK_SELECT,
  defaultPackPeriod,
  isValidPeriod,
  mapCsplPackRow,
  type CsplMonthlyPackDbRow,
} from '@/lib/csplPack'
import { CSPL_PILOT_SECTOR, type CsplSector } from '@/lib/cspl'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

function packSchemaHint(message: string): boolean {
  return /cspl_monthly_packs/i.test(message)
}

async function countByStatus(
  db: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  packId: string,
) {
  const { data, error } = await db
    .from('cspl_pack_questions')
    .select('status')
    .eq('pack_id', packId)
  if (error || !data) {
    return { total: 0, draft: 0, approved: 0, rejected: 0 }
  }
  const counts = { total: data.length, draft: 0, approved: 0, rejected: 0 }
  for (const row of data) {
    const s = String((row as { status?: string }).status || '')
    if (s === 'approved') counts.approved += 1
    else if (s === 'rejected') counts.rejected += 1
    else counts.draft += 1
  }
  return counts
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
  const db = getSupabaseAdmin()!
  const { data, error } = await db
    .from('cspl_monthly_packs')
    .select(CSPL_PACK_SELECT)
    .eq('sector', sector)
    .order('period', { ascending: false })
    .limit(24)

  if (error) {
    return NextResponse.json(
      {
        error: packSchemaHint(error.message)
          ? 'Chưa tạo bảng pack. Chạy supabase/schema-cspl-monthly-pack.sql.'
          : error.message,
      },
      { status: 500 },
    )
  }

  const packs = await Promise.all(
    ((data ?? []) as CsplMonthlyPackDbRow[]).map(async (row) => {
      const pack = mapCsplPackRow(row)
      pack.questionCounts = await countByStatus(db, pack.id)
      return pack
    }),
  )

  return NextResponse.json({ data: packs })
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

  let body: { sector?: string; period?: string; notes?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'JSON không hợp lệ.' }, { status: 400 })
  }

  const sector = (body.sector || CSPL_PILOT_SECTOR) as CsplSector
  if (sector !== CSPL_PILOT_SECTOR) {
    return NextResponse.json(
      { error: 'Pilot hiện chỉ pack Đo đạc và Bản đồ.' },
      { status: 400 },
    )
  }
  const period = String(body.period || defaultPackPeriod()).trim()
  if (!isValidPeriod(period)) {
    return NextResponse.json(
      { error: 'Period phải dạng YYYY-MM.' },
      { status: 400 },
    )
  }

  const db = getSupabaseAdmin()!
  const { data: existing } = await db
    .from('cspl_monthly_packs')
    .select(CSPL_PACK_SELECT)
    .eq('sector', sector)
    .eq('period', period)
    .maybeSingle()

  if (existing) {
    const pack = mapCsplPackRow(existing as CsplMonthlyPackDbRow)
    pack.questionCounts = await countByStatus(db, pack.id)
    return NextResponse.json({ data: pack, existed: true })
  }

  const { data, error } = await db
    .from('cspl_monthly_packs')
    .insert({
      sector,
      period,
      status: 'draft',
      min_questions: CSPL_PACK_DO_DAC_DEFAULTS.minQuestions,
      law_target: CSPL_PACK_DO_DAC_DEFAULTS.lawTarget,
      skill_target: CSPL_PACK_DO_DAC_DEFAULTS.skillTarget,
      notes: String(body.notes || '').trim() || null,
      created_by_email: auth.user.email ?? null,
    })
    .select(CSPL_PACK_SELECT)
    .single()

  if (error) {
    return NextResponse.json(
      {
        error: packSchemaHint(error.message)
          ? 'Chưa tạo bảng pack. Chạy supabase/schema-cspl-monthly-pack.sql.'
          : error.message,
      },
      { status: 500 },
    )
  }

  const pack = mapCsplPackRow(data as CsplMonthlyPackDbRow)
  pack.questionCounts = {
    total: 0,
    draft: 0,
    approved: 0,
    rejected: 0,
  }
  return NextResponse.json({ data: pack, existed: false })
}
