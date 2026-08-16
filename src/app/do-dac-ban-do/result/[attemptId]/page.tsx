'use client'

import { StudyPage } from '@/components/StudyPage'
import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ attemptId: string }>
}) {
  const { attemptId } = use(params)
  return (
    <StudyPage sector="do-dac-ban-do" mode="result" attemptId={attemptId} />
  )
}
