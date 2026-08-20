'use client'

import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { AppView } from '../types'
import { pathForView } from '../lib/paths'

type Props = {
  view: AppView
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<typeof Link>, 'href'>

/** Next.js Link gắn path từ AppView — SPA + href thật cho Google. */
export function AppLink({ view, children, ...rest }: Props) {
  return (
    <Link href={pathForView(view)} {...rest}>
      {children}
    </Link>
  )
}
