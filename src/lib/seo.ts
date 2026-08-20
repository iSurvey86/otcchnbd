import type { Metadata } from 'next'
import { getDdBank } from '@/data/dd/banks'
import { getXdTrack, xdTrackLabel } from '@/data/xd/tracks'

export const SITE_URL = 'https://www.onthicchn.org'

export function pageMeta(
  title: string,
  description: string,
  path = '/',
): Metadata {
  const url = `${SITE_URL}${path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      locale: 'vi_VN',
      type: 'website',
      siteName: 'ONTHICCHN',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export function ddBankMeta(bankId: string): Metadata {
  const bank = getDdBank(bankId)
  if (!bank) {
    return pageMeta(
      'Ôn thi Đo đạc và Bản đồ',
      'Luyện trắc nghiệm sát hạch cấp chứng chỉ hành nghề Đo đạc và Bản đồ trên ONTHICCHN.',
      `/do-dac-ban-do/${encodeURIComponent(bankId)}`,
    )
  }
  return pageMeta(
    `${bank.title} – Đo đạc và Bản đồ`,
    `Ôn tập và thi thử ngân hàng ${bank.periodLabel}: ${bank.questionCountHint ?? ''} câu. ${bank.legalRef ?? 'Bộ đề Đo đạc và Bản đồ trên ONTHICCHN.'}`.replace(
      /\s+/g,
      ' ',
    ).trim(),
    `/do-dac-ban-do/${encodeURIComponent(bank.id)}`,
  )
}

export function xdTrackMeta(trackId: string): Metadata {
  const track = getXdTrack(trackId)
  const label = xdTrackLabel(trackId)
  const count = track?.questionCount
  return pageMeta(
    `${label} – Ôn thi Xây dựng`,
    track
      ? `Ôn tập và thi thử CCHN xây dựng ${label}${count ? ` · ${count} câu` : ''}. Ngân hàng theo Quyết định 163/QĐ-BXD.`
      : 'Ôn thi chứng chỉ hành nghề hoạt động xây dựng trên ONTHICCHN.',
    `/xay-dung/${encodeURIComponent(trackId)}`,
  )
}
