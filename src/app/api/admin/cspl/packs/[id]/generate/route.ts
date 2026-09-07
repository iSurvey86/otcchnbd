import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import { CSPL_PILOT_SECTOR } from '@/lib/cspl'
import {
  CSPL_CHUNK_SELECT,
  mapCsplChunkRow,
  type CsplChunkDbRow,
} from '@/lib/csplChunk'
import {
  buildPackGeneratePrompt,
  CSPL_PACK_QUESTION_SELECT,
  CSPL_PACK_SELECT,
  mapCsplPackQuestionRow,
  mapCsplPackRow,
  parseAiPackQuestionsJson,
  pickRandom,
  type CsplMonthlyPackDbRow,
  type CsplPackQuestionDbRow,
  type GenerateChunkInput,
} from '@/lib/csplPack'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const maxDuration = 120

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

  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Chưa cấu hình GEMINI_API_KEY trên server.' },
      { status: 500 },
    )
  }

  const { id } = await ctx.params
  if (!id) {
    return NextResponse.json({ error: 'Thiếu id pack.' }, { status: 400 })
  }

  let body: { count?: number } = {}
  try {
    body = (await request.json().catch(() => ({}))) as typeof body
  } catch {
    body = {}
  }
  const count = Math.min(Math.max(Number(body.count) || 5, 1), 8)

  const db = getSupabaseAdmin()!
  const { data: packRow, error: packErr } = await db
    .from('cspl_monthly_packs')
    .select(CSPL_PACK_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (packErr || !packRow) {
    return NextResponse.json(
      {
        error: packErr
          ? /cspl_monthly_packs/i.test(packErr.message)
            ? 'Chưa chạy supabase/schema-cspl-monthly-pack.sql.'
            : packErr.message
          : 'Không tìm thấy pack.',
      },
      { status: packErr ? 500 : 404 },
    )
  }

  const pack = mapCsplPackRow(packRow as CsplMonthlyPackDbRow)
  if (pack.sector !== CSPL_PILOT_SECTOR) {
    return NextResponse.json({ error: 'Sector không hỗ trợ.' }, { status: 400 })
  }
  if (pack.status === 'published' || pack.status === 'locked') {
    return NextResponse.json(
      { error: 'Pack đã publish/khóa — không sinh thêm draft.' },
      { status: 400 },
    )
  }

  const { data: activeDocs, error: docErr } = await db
    .from('cspl_documents')
    .select('id')
    .eq('sector', pack.sector)
    .eq('status', 'active')
    .eq('legal_status', 'con_hieu_luc')

  if (docErr) {
    return NextResponse.json({ error: docErr.message }, { status: 500 })
  }
  const docIds = ((activeDocs ?? []) as { id: string }[]).map((d) => d.id)
  if (docIds.length === 0) {
    return NextResponse.json(
      {
        error:
          'Chưa có VB active còn hiệu lực. Admin: Đoạn → Tách → Duyệt → Đưa vào dùng.',
      },
      { status: 400 },
    )
  }

  const { data: chunkRows, error: chunkErr } = await db
    .from('cspl_chunks')
    .select(CSPL_CHUNK_SELECT)
    .in('document_id', docIds)
    .eq('status', 'approved')
    .eq('sector', pack.sector)

  if (chunkErr) {
    return NextResponse.json(
      {
        error: /cspl_chunks/i.test(chunkErr.message)
          ? 'Chưa chạy supabase/schema-cspl-chunks.sql.'
          : chunkErr.message,
      },
      { status: 500 },
    )
  }

  const chunks = ((chunkRows ?? []) as CsplChunkDbRow[])
    .map(mapCsplChunkRow)
    .filter((c) => c.body.trim().length >= 40)

  if (chunks.length === 0) {
    return NextResponse.json(
      { error: 'Chưa có chunk Đã duyệt trên VB active.' },
      { status: 400 },
    )
  }

  const { data: existingQs } = await db
    .from('cspl_pack_questions')
    .select('prompt, section, status')
    .eq('pack_id', id)

  const existingList = (existingQs ?? []) as {
    prompt: string
    section: string
    status: string
  }[]
  const avoidPrompts = existingList
    .filter((q) => q.status !== 'rejected')
    .map((q) => q.prompt)
  const approvedLaw = existingList.filter(
    (q) => q.status === 'approved' && q.section === 'phap-luat',
  ).length
  const approvedSkill = existingList.filter(
    (q) => q.status === 'approved' && q.section === 'kinh-nghiem',
  ).length
  const draftLaw = existingList.filter(
    (q) => q.status === 'draft' && q.section === 'phap-luat',
  ).length
  const draftSkill = existingList.filter(
    (q) => q.status === 'draft' && q.section === 'kinh-nghiem',
  ).length

  const lawNeed = Math.max(
    0,
    pack.lawTarget - approvedLaw - draftLaw,
  )
  const skillNeed = Math.max(
    0,
    pack.skillTarget - approvedSkill - draftSkill,
  )

  const selected = pickRandom(chunks, Math.min(10, Math.max(4, count + 2)))
  const chunkInputs: GenerateChunkInput[] = selected.map((c) => ({
    id: c.id,
    soHieu: c.soHieu,
    citeLabel: c.citeLabel,
    body: c.body,
  }))
  const chunkById = new Map(chunkInputs.map((c) => [c.id, c]))

  const prompt = buildPackGeneratePrompt({
    period: pack.period,
    count,
    lawNeed: lawNeed || Math.ceil(count / 2),
    skillNeed: skillNeed || Math.floor(count / 2),
    chunks: chunkInputs,
    avoidPrompts,
  })

  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' },
    })

    let aiText = String(response.text || '')
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim()
    const jsonMatch = aiText.match(/\{[\s\S]*\}/)
    if (jsonMatch) aiText = jsonMatch[0]
    const raw = JSON.parse(aiText) as unknown
    const parsed = parseAiPackQuestionsJson(raw, chunkById)

    if (parsed.questions.length === 0) {
      return NextResponse.json(
        {
          error:
            parsed.errors[0] ||
            'AI không trả câu hợp lệ (cite / 4 mục giải thích). Thử lại.',
          parseErrors: parsed.errors,
        },
        { status: 422 },
      )
    }

    const rows = parsed.questions.map((q) => ({
      pack_id: pack.id,
      sector: pack.sector,
      period: pack.period,
      status: 'draft',
      stem_type: q.stemType,
      section: q.section,
      prompt: q.prompt,
      option_a: q.options[0],
      option_b: q.options[1],
      option_c: q.options[2],
      option_d: q.options[3],
      answer: q.answer,
      explanation: q.explanation,
      sources: q.sources,
      multi_source_ok: false,
    }))

    const { data: inserted, error: insErr } = await db
      .from('cspl_pack_questions')
      .insert(rows)
      .select(CSPL_PACK_QUESTION_SELECT)

    if (insErr) {
      return NextResponse.json({ error: insErr.message }, { status: 500 })
    }

    if (pack.status === 'draft') {
      await db
        .from('cspl_monthly_packs')
        .update({ status: 'review', updated_at: new Date().toISOString() })
        .eq('id', pack.id)
    }

    return NextResponse.json({
      data: ((inserted ?? []) as CsplPackQuestionDbRow[]).map(
        mapCsplPackQuestionRow,
      ),
      parseErrors: parsed.errors,
      meta: {
        chunkPool: chunks.length,
        usedChunks: selected.length,
        requested: count,
        saved: inserted?.length ?? 0,
      },
    })
  } catch (error) {
    console.error('CSPL pack generate error:', error)
    const msg = error instanceof Error ? error.message : 'Lỗi sinh câu AI.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
