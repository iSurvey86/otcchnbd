import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta(
  'Ôn thi Xây dựng CCHN',
  'Ôn thi chứng chỉ hành nghề hoạt động xây dựng theo Quyết định 163/QĐ-BXD. Chọn hạng và chuyên ngành để ôn tập, thi thử.',
  '/xay-dung',
)

export default function XayDungLayout({ children }: { children: React.ReactNode }) {
  return children
}
