'use client'

import { Layout } from '@/components/Layout'
import { useAppNavigate } from '@/lib/useAppNavigate'
import { viewFromPath } from '@/lib/paths'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, type ReactNode } from 'react'

function ChromeInner({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const onNavigate = useAppNavigate()
  const view = viewFromPath(pathname, searchParams)
  return (
    <Layout view={view} onNavigate={onNavigate}>
      {children}
    </Layout>
  )
}

export function AppChrome({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="app-shell">{children}</div>}>
      <ChromeInner>{children}</ChromeInner>
    </Suspense>
  )
}
