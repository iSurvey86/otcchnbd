import { useEffect, useState } from 'react'
import {
  getCachedDtBank,
  loadDtBank,
  type DtBankFile,
} from '../data/dt/questions'

export type DtBankStatus = 'idle' | 'loading' | 'ready' | 'error' | 'missing'

export function useDtBank(enabled: boolean): {
  status: DtBankStatus
  bank: DtBankFile | null
} {
  const cached = enabled ? getCachedDtBank() : undefined
  const [status, setStatus] = useState<DtBankStatus>(() => {
    if (!enabled) return 'idle'
    if (cached) return 'ready'
    return 'loading'
  })
  const [bank, setBank] = useState<DtBankFile | null>(() => cached ?? null)

  useEffect(() => {
    if (!enabled) {
      setStatus('idle')
      setBank(null)
      return
    }

    const existing = getCachedDtBank()
    if (existing) {
      setBank(existing)
      setStatus('ready')
      return
    }

    let cancelled = false
    setStatus('loading')
    void loadDtBank().then((loaded) => {
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
  }, [enabled])

  return { status, bank }
}
