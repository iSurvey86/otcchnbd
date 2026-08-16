'use client'

import { Admin } from '@/views/Admin'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user || !isAdmin) router.replace('/')
  }, [loading, user, isAdmin, router])

  if (loading || !user || !isAdmin) return null
  return <Admin />
}
