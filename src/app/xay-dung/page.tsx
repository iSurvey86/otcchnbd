'use client'

import { XdBrowse } from '@/views/XdBrowse'
import { useAppNavigate } from '@/lib/useAppNavigate'

export default function XdBrowsePage() {
  const onNavigate = useAppNavigate()
  return <XdBrowse onNavigate={onNavigate} />
}
