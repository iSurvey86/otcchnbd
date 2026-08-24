import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta(
  'Ôn thi Đấu thầu NVCM',
  'Ôn thi nghiệp vụ chuyên môn đấu thầu: ngân hàng 390 câu. Thi thử 70 câu / 60 phút / 100 điểm; ôn theo văn bản pháp lý.',
  '/dau-thau',
)

export default function DauThauLayout({ children }: { children: React.ReactNode }) {
  return children
}
