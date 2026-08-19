'use client'

import { StudyPage } from '@/components/StudyPage'
import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ bankId: string }>
}) {
  const { bankId } = use(params)
  return <StudyPage sector="do-dac-ban-do" bankId={bankId} mode="history" />
}
