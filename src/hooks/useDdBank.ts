import { useEffect, useState } from 'react'
import { getDdBank } from '../data/dd/banks'
import {
  ddQuestions,
  getCachedDdQuestions,
  hasDdLoader,
  loadDdBank,
} from '../data/dd/questions'
import type { Question } from '../types'

export type DdBankStatus = 'idle' | 'loading' | 'ready' | 'error' | 'missing'

export function useDdBank(bankId: string | undefined): {
  status: DdBankStatus
  questions: Question[]
} {
  const meta = bankId ? getDdBank(bankId) : undefined
  const cached = bankId ? getCachedDdQuestions(bankId) : undefined

  const [status, setStatus] = useState<DdBankStatus>(() => {
    if (!bankId) return 'idle'
    if (!meta?.ready) return meta ? 'missing' : 'missing'
    if (bankId === 'official-2020' || cached) return 'ready'
    return 'loading'
  })

  const [questions, setQuestions] = useState<Question[]>(() => {
    if (!bankId) return []
    return ddQuestions(bankId)
  })

  useEffect(() => {
    if (!bankId) {
      setStatus('idle')
      setQuestions([])
      return
    }

    if (!meta?.ready) {
      setStatus('missing')
      setQuestions([])
      return
    }

    if (!hasDdLoader(bankId)) {
      setStatus('missing')
      setQuestions([])
      return
    }

    if (bankId === 'official-2020') {
      setQuestions(ddQuestions(bankId))
      setStatus('ready')
      return
    }

    const existing = getCachedDdQuestions(bankId)
    if (existing) {
      setQuestions(existing)
      setStatus('ready')
      return
    }

    let cancelled = false
    setStatus('loading')
    void loadDdBank(bankId).then((loaded) => {
      if (cancelled) return
      setQuestions(loaded)
      setStatus(loaded.length > 0 ? 'ready' : 'missing')
    })

    return () => {
      cancelled = true
    }
  }, [bankId, meta?.ready])

  return { status, questions }
}
