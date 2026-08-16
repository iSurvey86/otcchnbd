import type { ReactNode } from 'react'
import { normalizeLegalCaps } from '../lib/legalCite'

const HEADER_SPECS: { match: RegExp; num: number; label: string }[] = [
  {
    match: /^Đáp án chính xác cho câu hỏi(?: số \d+)? này là:\s*$/,
    num: 1,
    label: 'Đáp án chính xác cho câu hỏi này là:',
  },
  { match: /^Căn cứ:\s*$/, num: 2, label: 'Căn cứ:' },
  { match: /^Phân tích:\s*$/, num: 3, label: 'Phân tích:' },
  {
    match: /^Đối chiếu với các phương án còn lại:\s*$/,
    num: 4,
    label: 'Đối chiếu với các phương án còn lại:',
  },
]

const BULLET_LINE_RE =
  /^(?:[-•*]\s+|Phương án\s+[A-D]\b|Bước\s+\d+\b)/i

function matchHeader(line: string): { num: number; label: string } | null {
  const trimmed = line.trim()
  for (const spec of HEADER_SPECS) {
    if (spec.match.test(trimmed)) return { num: spec.num, label: spec.label }
  }
  return null
}

/** Render structured NVCM explanation: numbered headings, indent, bullets. */
export function ExplanationBody({ text }: { text: string }) {
  const lines = normalizeLegalCaps(text).replace(/\r\n/g, '\n').split('\n')
  const blocks: { num?: number; title?: string; body: string[] }[] = []
  let current: { num?: number; title?: string; body: string[] } = { body: [] }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const header = matchHeader(line)
    if (header) {
      if (current.title || current.body.some((b) => b.trim())) {
        blocks.push(current)
      }
      current = { num: header.num, title: header.label, body: [] }
      continue
    }
    current.body.push(line)
  }
  if (current.title || current.body.some((b) => b.trim())) {
    blocks.push(current)
  }

  if (blocks.length === 0) {
    return <div className="explain-body">{text}</div>
  }

  return (
    <div className="explain-sections">
      {blocks.map((block, i) => (
        <section key={i} className="explain-section">
          {block.title ? (
            <h4 className="explain-h">
              {block.num != null ? `${block.num}. ` : ''}
              {block.title}
            </h4>
          ) : null}
          <SectionBody lines={block.body} kind={block.num} />
        </section>
      ))}
    </div>
  )
}

function SectionBody({
  lines,
  kind,
}: {
  lines: string[]
  kind?: number
}): ReactNode {
  const parts = lines
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[-•*]\s+/, ''))

  if (parts.length === 0) return null

  // Mục 4 (đối chiếu) hoặc nhiều dòng bắt đầu bằng "Phương án…" → bullets
  const useBullets =
    kind === 4 ||
    (parts.length > 1 && parts.every((p) => BULLET_LINE_RE.test(p)))

  if (useBullets) {
    return (
      <ul className="explain-list">
        {parts.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )
  }

  // Mục 1–3: thụt lề, giữ xuống dòng giữa các đoạn
  return (
    <div className="explain-indent">
      {parts.map((p, i) => (
        <p key={i} className="explain-p">
          {p}
        </p>
      ))}
    </div>
  )
}
