'use client'

import { StudyPage } from '@/components/StudyPage'
import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ trackId: string; attemptId: string }>
}) {
  const { trackId, attemptId } = use(params)
  return (
    <StudyPage
      sector="dau-thau"
      trackId={trackId}
      mode="result"
      attemptId={attemptId}
    />
  )
}
