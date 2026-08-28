/**
 * OCR PDF TCVN bằng pdf-to-img + Tesseract.js (vie+eng).
 *
 * Usage:
 *   node scripts/ocr_tcvn_tesseract.js "docs/tcvn/TCVN 9398_2012 ....pdf"
 */
const fs = require('fs')
const path = require('path')
const { pdf } = require('pdf-to-img')
const Tesseract = require('tesseract.js')

const pdfPath = process.argv[2]
if (!pdfPath) {
  console.error('Usage: node scripts/ocr_tcvn_tesseract.js <pdf> [--out path]')
  process.exit(1)
}

let outPath = null
const extra = process.argv.slice(3)
if (extra[0] === '--out' && extra[1]) outPath = extra[1]

const absPdf = path.resolve(pdfPath)
if (!fs.existsSync(absPdf)) {
  console.error('PDF not found:', absPdf)
  process.exit(1)
}

const base = path.basename(absPdf)
const slug = base.includes('9398')
  ? 'TCVN-9398-2012'
  : base.includes('9401')
    ? 'TCVN-9401-2024'
    : base.replace(/[^\w.-]+/g, '-')

if (!outPath) {
  outPath = path.join(path.dirname(absPdf), `${slug}.ocr.raw.txt`)
}

async function ocrPage(buffer, pageNo, total) {
  const {
    data: { text },
  } = await Tesseract.recognize(buffer, 'vie+eng', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        process.stdout.write(
          `\rTrang ${pageNo}/${total} OCR ${Math.round((m.progress || 0) * 100)}%   `,
        )
      }
    },
  })
  process.stdout.write('\n')
  return text.trim()
}

async function main() {
  console.log('PDF:', absPdf)
  const doc = await pdf(absPdf, { scale: 2.2 })
  const pages = []
  let pageNo = 0
  for await (const image of doc) {
    pageNo += 1
    pages.push({ pageNo, image })
  }
  const total = pages.length
  console.log('Pages:', total)

  const chunks = []
  for (const { pageNo, image } of pages) {
    console.log(`OCR trang ${pageNo}/${total}…`)
    const text = await ocrPage(image, pageNo, total)
    chunks.push(`===== TRANG ${pageNo} / ${total} =====\n${text}`)
  }

  const body = chunks.join('\n\n') + '\n'
  fs.writeFileSync(outPath, body, 'utf8')
  console.log('Wrote', outPath, fs.statSync(outPath).size, 'bytes')
  console.log('--- preview ---')
  console.log(body.slice(0, 1400))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
