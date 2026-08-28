import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { requireAdmin, verifyBearerUser } from '@/lib/firebaseAdmin'
import { extFromFilename } from '@/lib/cspl'
import { extractDocxPlainText } from '@/lib/csplExtract'
import {
  buildCsplScanPrompt,
  buildScanErrorMessage,
  CSPL_SCAN_MAX_BYTES,
  parseCsplScanJson,
} from '@/lib/csplScan'

export const runtime = 'nodejs'

function resolveMime(file: File, ext: string | null): string {
  if (file.type && file.type !== 'application/octet-stream') return file.type
  if (ext === 'pdf') return 'application/pdf'
  if (ext === 'docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
  if (ext === 'doc') return 'application/msword'
  return 'application/pdf'
}

function clipText(text: string, max = 120_000): string {
  if (text.length <= max) return text
  const head = text.slice(0, Math.floor(max * 0.55))
  const tail = text.slice(-Math.floor(max * 0.4))
  return `${head}\n\n[…đã rút gọn…]\n\n${tail}`
}

export async function POST(request: Request) {
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

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Không đọc được form.' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Chọn file để quét.' }, { status: 400 })
  }
  if (file.size <= 0 || file.size > CSPL_SCAN_MAX_BYTES) {
    return NextResponse.json(
      {
        error: `File không hợp lệ hoặc vượt ${Math.round(CSPL_SCAN_MAX_BYTES / (1024 * 1024))} MB.`,
      },
      { status: 400 },
    )
  }

  const ext = extFromFilename(file.name)
  if (!ext) {
    return NextResponse.json(
      { error: 'Chỉ quét .pdf, .doc, .docx.' },
      { status: 400 },
    )
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const mime = resolveMime(file, ext)
    const prompt = buildCsplScanPrompt()
    const ai = new GoogleGenAI({ apiKey })

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> =
      []

    if (ext === 'docx' || (ext === 'doc' && buffer[0] === 0x50 && buffer[1] === 0x4b)) {
      const text = await extractDocxPlainText(buffer)
      if (!text) {
        return NextResponse.json(
          {
            error:
              'Không đọc được nội dung Word. Lưu lại .docx hoặc xuất PDF rồi quét.',
          },
          { status: 400 },
        )
      }
      parts.push({
        text: `${prompt}\n\n--- NỘI DUNG VĂN BẢN (trích từ Word) ---\n${clipText(text)}`,
      })
    } else if (ext === 'doc') {
      return NextResponse.json(
        {
          error:
            'File .doc cũ chưa hỗ trợ quét tốt. Mở Word → Lưu .docx hoặc xuất PDF.',
        },
        { status: 400 },
      )
    } else {
      parts.push({
        inlineData: { mimeType: mime, data: buffer.toString('base64') },
      })
      parts.push({ text: prompt })
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts }],
      config: { responseMimeType: 'application/json' },
    })

    let aiText = String(response.text || '')
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim()
    const jsonMatch = aiText.match(/\{[\s\S]*\}/)
    if (jsonMatch) aiText = jsonMatch[0]
    const raw = JSON.parse(aiText) as Record<string, unknown>
    const data = parseCsplScanJson(raw)

    return NextResponse.json({ data })
  } catch (error) {
    console.error('CSPL scan error:', error)
    return NextResponse.json(
      { error: buildScanErrorMessage(error) },
      { status: 500 },
    )
  }
}
