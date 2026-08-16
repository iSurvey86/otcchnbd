'use client'

import { StudyPage } from '@/components/StudyPage'
import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ trackId: string }>
}) {
  const { trackId } = use(params)
  return <StudyPage sector="xay-dung" trackId={trackId} mode="exam" />
}
