import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta(
  'Ôn thi Đo đạc và Bản đồ',
  'Chọn ngân hàng câu hỏi chính thức (2020, 2019) hoặc bộ cập nhật ONTHICCHN. Ôn tập và thi thử sát hạch CCHN Đo đạc và Bản đồ.',
  '/do-dac-ban-do',
)

export default function DoDacLayout({ children }: { children: React.ReactNode }) {
  return children
}
