'use client'

import { Catalog } from '@/views/Catalog'
import { useAppNavigate } from '@/lib/useAppNavigate'

export default function CatalogPage() {
  const onNavigate = useAppNavigate()
  return <Catalog onNavigate={onNavigate} />
}
