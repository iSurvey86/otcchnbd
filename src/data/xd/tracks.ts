import type { HangId, XdGroupId } from '../../types'
import manifest from './manifest.json' with { type: 'json' }

export interface XdTrackMeta {
  id: string
  fieldCode: string
  hang: HangId
  group: XdGroupId
  title: string
  /** true when question bank JSON exists */
  open: boolean
  /** Known count (for browse UI before lazy-load) */
  questionCount: number
}

export const XD_GROUPS: { id: XdGroupId; title: string }[] = [
  { id: 'khao-sat', title: 'Khảo sát' },
  { id: 'thiet-ke', title: 'Thiết kế' },
  { id: 'giam-sat', title: 'Giám sát' },
  { id: 'dinh-gia', title: 'Định giá' },
  { id: 'quan-ly-du-an', title: 'Quản lý dự án' },
]

export const XD_FIELDS: {
  code: string
  group: XdGroupId
  title: string
}[] = [
  { code: '1.1', group: 'khao-sat', title: 'Khảo sát địa hình' },
  { code: '1.2', group: 'khao-sat', title: 'Khảo sát địa chất công trình' },
  { code: '2', group: 'thiet-ke', title: 'Thiết kế quy hoạch xây dựng' },
  { code: '3.1', group: 'thiet-ke', title: 'Kết cấu công trình' },
  { code: '3.2', group: 'thiet-ke', title: 'Công trình khai thác mỏ' },
  { code: '3.3', group: 'thiet-ke', title: 'Đường bộ' },
  { code: '3.4', group: 'thiet-ke', title: 'Đường sắt' },
  { code: '3.5', group: 'thiet-ke', title: 'Cầu – Hầm' },
  { code: '3.6', group: 'thiet-ke', title: 'Đường thủy nội địa – Hàng hải' },
  { code: '3.7', group: 'thiet-ke', title: 'Thủy lợi, đê điều' },
  { code: '3.8', group: 'thiet-ke', title: 'Cấp nước – thoát nước' },
  { code: '3.9', group: 'thiet-ke', title: 'Xử lý chất thải rắn' },
  { code: '3.10', group: 'thiet-ke', title: 'Cơ–điện: Hệ thống điện' },
  { code: '3.11', group: 'thiet-ke', title: 'Cơ–điện: Cấp–thoát nước công trình' },
  { code: '3.12', group: 'thiet-ke', title: 'Cơ–điện: Thông gió – cấp thoát nhiệt' },
  { code: '4.1', group: 'giam-sat', title: 'Giám sát công tác xây dựng công trình' },
  { code: '4.2', group: 'giam-sat', title: 'Giám sát lắp đặt thiết bị công trình' },
  { code: '5', group: 'dinh-gia', title: 'Định giá xây dựng' },
  { code: '6', group: 'quan-ly-du-an', title: 'Quản lý dự án đầu tư xây dựng' },
]

type ManifestEntry = {
  file: string
  count: number
  title: string
  fieldCode: string
  hang: string
}

const OPEN_TRACKS: Record<string, number> = Object.fromEntries(
  Object.entries(manifest as Record<string, ManifestEntry>).map(([id, row]) => [
    id,
    row.count,
  ]),
)

export const XD_HANGS: HangId[] = ['I', 'II', 'III']

export function trackIdFor(fieldCode: string, hang: HangId): string {
  return `xd-${fieldCode}-hang-${hang.toLowerCase()}`
}

export const XD_TRACKS: XdTrackMeta[] = XD_HANGS.flatMap((hang) =>
  XD_FIELDS.map((field) => {
    const id = trackIdFor(field.code, hang)
    const questionCount = OPEN_TRACKS[id] ?? 0
    return {
      id,
      fieldCode: field.code,
      hang,
      group: field.group,
      title: field.title,
      open: questionCount > 0,
      questionCount,
    }
  }),
)

export function getXdTrack(trackId: string): XdTrackMeta | undefined {
  return XD_TRACKS.find((t) => t.id === trackId)
}

export function xdTrackLabel(trackId: string): string {
  const track = getXdTrack(trackId)
  if (!track) return 'Xây dựng'
  return `${track.title} – Hạng ${track.hang}`
}

export function openXdQuestionTotal(): number {
  return Object.values(OPEN_TRACKS).reduce((sum, n) => sum + n, 0)
}

/** Track cùng hạng + nhóm, rồi cùng mã lĩnh vực hạng khác — cho liên kết nội bộ. */
export function relatedXdTracks(trackId: string, limit = 4): XdTrackMeta[] {
  const current = getXdTrack(trackId)
  if (!current) return []

  const sameHangGroup = XD_TRACKS.filter(
    (t) =>
      t.open &&
      t.id !== trackId &&
      t.hang === current.hang &&
      t.group === current.group,
  )
  const sameField = XD_TRACKS.filter(
    (t) =>
      t.open &&
      t.id !== trackId &&
      t.fieldCode === current.fieldCode &&
      !sameHangGroup.some((s) => s.id === t.id),
  )
  const sameHangOther = XD_TRACKS.filter(
    (t) =>
      t.open &&
      t.id !== trackId &&
      t.hang === current.hang &&
      !sameHangGroup.some((s) => s.id === t.id) &&
      !sameField.some((s) => s.id === t.id),
  )

  return [...sameHangGroup, ...sameField, ...sameHangOther].slice(0, limit)
}
