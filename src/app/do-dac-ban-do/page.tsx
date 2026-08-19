'use client'

import { DoDacBrowse } from '@/views/DoDacBrowse'
import { useAppNavigate } from '@/lib/useAppNavigate'

export default function DoDacBrowsePage() {
  const onNavigate = useAppNavigate()
  return <DoDacBrowse onNavigate={onNavigate} />
}
