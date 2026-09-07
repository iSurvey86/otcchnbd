'use client'

import { AuthProvider } from '@/context/AuthContext'
import { QuestionOverrideProvider } from '@/context/QuestionOverrideContext'
import { LoginModal } from '@/components/LoginModal'
import { AppChrome } from '@/components/AppChrome'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QuestionOverrideProvider>
        <AppChrome>{children}</AppChrome>
        <LoginModal />
      </QuestionOverrideProvider>
    </AuthProvider>
  )
}
