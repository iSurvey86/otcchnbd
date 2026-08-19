'use client'

import { StudyPage } from '@/components/StudyPage'
import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ bankId: string; attemptId: string }>
}) {
  const { bankId, attemptId } = use(params)
  return (
    <StudyPage
      sector="do-dac-ban-do"
      bankId={bankId}
      mode="result"
      attemptId={attemptId}
    />
  )
}
