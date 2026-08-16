'use client'

import { AuthProvider } from '@/context/AuthContext'
import { LoginModal } from '@/components/LoginModal'
import { AppChrome } from '@/components/AppChrome'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppChrome>{children}</AppChrome>
      <LoginModal />
    </AuthProvider>
  )
}
