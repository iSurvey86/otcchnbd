'use client'

import { DtBrowse } from '@/views/DtBrowse'
import { useAppNavigate } from '@/lib/useAppNavigate'

export default function DtBrowsePage() {
  const onNavigate = useAppNavigate()
  return <DtBrowse onNavigate={onNavigate} />
}
