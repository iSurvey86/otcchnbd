import { useEffect, useState } from 'react'
import {
  getCachedXdBank,
  loadXdBank,
  type XdBankFile,
} from '../data/xd/questions'
import type { Question } from '../types'

export type XdBankStatus = 'idle' | 'loading' | 'ready' | 'error' | 'missing'

export function useXdBank(trackId: string | undefined): {
  status: XdBankStatus
  bank: XdBankFile | null
  questions: Question[]
} {
  const cached = trackId ? getCachedXdBank(trackId) : undefined
  const [status, setStatus] = useState<XdBankStatus>(() => {
    if (!trackId) return 'idle'
    if (cached) return 'ready'
    return 'loading'
  })
  const [bank, setBank] = useState<XdBankFile | null>(() => cached ?? null)

  useEffect(() => {
    if (!trackId) {
      setStatus('idle')
      setBank(null)
      return
    }

    const existing = getCachedXdBank(trackId)
    if (existing) {
      setBank(existing)
      setStatus('ready')
      return
    }

    let cancelled = false
    setStatus('loading')
    void loadXdBank(trackId).then((loaded) => {
      if (cancelled) return
      if (!loaded) {
        setBank(null)
        setStatus('missing')
        return
      }
      setBank(loaded)
      setStatus('ready')
    })

    return () => {
      cancelled = true
    }
  }, [trackId])

  return {
    status,
    bank,
    questions: bank?.questions ?? [],
  }
}
