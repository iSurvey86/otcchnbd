/**
 * OCR PDF TCVN bằng Gemini (PDF scan hoặc text layer lỗi font).
 *
 * Usage:
 *   node scripts/ocr_tcvn_pdf.js docs/tcvn/TCVN\ 9398_2012\ ....pdf
 *   node scripts/ocr_tcvn_pdf.js --out docs/tcvn/TCVN-9398-2012.ocr.raw.txt <pdf>
 */
const fs = require('fs')
const path = require('path')
const { GoogleGenAI } = require('@google/genai')
const { loadEnvLocal } = require('./loadEnvLocal')

loadEnvLocal()

const args = process.argv.slice(2)
let outPath = null
const pdfArgs = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out' && args[i + 1]) {
    outPath = args[++i]
  } else {
    pdfArgs.push(args[i])
  }
}

const pdfPath = pdfArgs[0]
if (!pdfPath) {
  console.error('Usage: node scripts/ocr_tcvn_pdf.js [--out raw.txt] <pdf>')
  process.exit(1)
}

const absPdf = path.resolve(pdfPath)
if (!fs.existsSync(absPdf)) {
  console.error('PDF not found:', absPdf)
  process.exit(1)
}

const apiKey = process.env.GEMINI_API_KEY?.trim()
if (!apiKey) {
  console.error('Thiếu GEMINI_API_KEY trong .env.local')
  process.exit(1)
}

const base = path.basename(absPdf, path.extname(absPdf))
if (!outPath) {
  const slug = base.includes('9398')
    ? 'TCVN-9398-2012'
    : base.includes('9401')
      ? 'TCVN-9401-2024'
      : base.replace(/[^\w.-]+/g, '-')
  outPath = path.join(path.dirname(absPdf), `${slug}.ocr.raw.txt`)
}

const OCR_PROMPT = `Bạn là công cụ OCR tiếng Việt cho tiêu chuẩn TCVN.

Nhiệm vụ: trích xuất TOÀN BỘ văn bản từ PDF đính kèm, theo thứ tự trang.

Yêu cầu:
- Giữ đúng tiếng Việt có dấu, số hiệu điều/khoản/mục, bảng biểu (dùng | giữa cột nếu cần).
- Mỗi trang bắt đầu bằng dòng: ===== TRANG n / tổng =====
- Không tóm tắt, không bỏ đoạn.
- Không bọc markdown code fence.
- Chỉ trả về plain text OCR.`

async function main() {
  const buffer = fs.readFileSync(absPdf)
  const mb = buffer.length / (1024 * 1024)
  console.log('PDF:', absPdf, `(${mb.toFixed(2)} MB)`)

  const ai = new GoogleGenAI({ apiKey })
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: buffer.toString('base64'),
            },
          },
          { text: OCR_PROMPT },
        ],
      },
    ],
  })

  let text = String(response.text || '').trim()
  if (!text) {
    console.error('Gemini không trả text.')
    process.exit(1)
  }

  fs.writeFileSync(outPath, text + '\n', 'utf8')
  console.log('Wrote', outPath, fs.statSync(outPath).size, 'bytes')
  console.log('--- preview ---')
  console.log(text.slice(0, 1200))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
