/**
 * Trích plain text từ file CSPL (docx / pdf) để tách chunk.
 */
import JSZip from 'jszip'

export async function extractDocxPlainText(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer)
  const xml = await zip.file('word/document.xml')?.async('string')
  if (!xml) return ''
  return normalizeExtractedText(
    xml
      .replace(/<w:tab\/>/gi, '\t')
      .replace(/<\/w:p>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
}

export async function extractPdfPlainText(buffer: Buffer): Promise<string> {
  const mod = await import('pdf-parse')
  const pdfParse =
    typeof mod === 'function'
      ? (mod as unknown as (b: Buffer) => Promise<{ text: string }>)
      : (mod as { default: (b: Buffer) => Promise<{ text: string }> }).default
  if (typeof pdfParse !== 'function') {
    throw new Error('Không tải được pdf-parse.')
  }
  const data = await pdfParse(buffer)
  return normalizeExtractedText(String(data.text || ''))
}

export function normalizeExtractedText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

export async function extractCsplPlainText(
  buffer: Buffer,
  ext: string,
): Promise<{ text: string; method: 'docx' | 'pdf' }> {
  const lower = ext.toLowerCase()
  if (lower === 'docx' || (lower === 'doc' && buffer[0] === 0x50 && buffer[1] === 0x4b)) {
    const text = await extractDocxPlainText(buffer)
    if (!text) {
      throw new Error(
        'Không đọc được nội dung Word. Lưu lại .docx rồi tải lên / tách lại.',
      )
    }
    return { text, method: 'docx' }
  }
  if (lower === 'doc') {
    throw new Error(
      'File .doc cũ chưa hỗ trợ tách đoạn. Mở Word → Lưu .docx rồi upload lại.',
    )
  }
  if (lower === 'pdf') {
    const text = await extractPdfPlainText(buffer)
    if (!text || text.length < 80) {
      throw new Error(
        'PDF không có lớp chữ (scan ảnh) hoặc quá ngắn. Upload bản .docx / Word OCR rồi tách lại.',
      )
    }
    return { text, method: 'pdf' }
  }
  throw new Error('Định dạng không hỗ trợ tách đoạn.')
}
