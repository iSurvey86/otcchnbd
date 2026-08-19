import type { SectorId } from '../types'

export interface Sector {
  id: SectorId
  title: string
  blurb: string
  open: boolean
  /** false = ẩn khỏi trang chọn ngành (giữ data để mở lại sau) */
  visible: boolean
}

export const SECTORS: Sector[] = [
  {
    id: 'do-dac-ban-do',
    title: 'Đo đạc và Bản đồ',
    blurb: 'Ôn thi Chứng chỉ hành nghề Đo đạc và Bản đồ – chọn ngân hàng câu hỏi chính thức hoặc bộ cập nhật ONTHICCHN.',
    open: true,
    visible: true,
  },
  {
    id: 'xay-dung',
    title: 'Xây dựng',
    blurb:
      'Ôn thi Chứng chỉ hành nghề Hoạt động xây dựng – ngân hàng câu hỏi theo Quyết định 163/QĐ-BXD ngày 18/02/2025. Chọn hạng và chuyên ngành để ôn, thi thử.',
    open: true,
    visible: true,
  },
  {
    id: 'dau-thau',
    title: 'Đấu thầu',
    blurb:
      'Ôn thi nghiệp vụ chuyên môn đấu thầu – ngân hàng 390 câu NVCM. Thi thử 70 câu / 60 phút / 100 điểm; ôn theo văn bản pháp lý.',
    open: true,
    visible: true,
  },
]
