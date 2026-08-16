'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { AppView } from '../types'
import { pathForView } from './paths'

export function useAppNavigate() {
  const router = useRouter()
  return useCallback(
    (view: AppView) => {
      router.push(pathForView(view))
    },
    [router],
  )
}
