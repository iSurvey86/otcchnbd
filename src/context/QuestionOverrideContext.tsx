'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Question, StudyScope } from '../types'
import {
  applyOverridesToList,
  buildOverrideMap,
  type QuestionOverride,
} from '../lib/questionOverride'

type Ctx = {
  overrides: QuestionOverride[]
  byKey: Map<string, QuestionOverride>
  loading: boolean
  refresh: () => Promise<void>
  applyToList: (questions: Question[], scope: StudyScope) => Question[]
}

const QuestionOverrideContext = createContext<Ctx | null>(null)

export function QuestionOverrideProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<QuestionOverride[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/question-overrides?t=${Date.now()}`,
        { cache: 'no-store' },
      )
      const json = (await res.json().catch(() => ({}))) as {
        data?: QuestionOverride[]
      }
      setOverrides(Array.isArray(json.data) ? json.data : [])
    } catch {
      setOverrides([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    function onFocus() {
      void refresh()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [refresh])

  const byKey = useMemo(() => buildOverrideMap(overrides), [overrides])

  const applyToList = useCallback(
    (questions: Question[], scope: StudyScope) =>
      applyOverridesToList(questions, scope, byKey),
    [byKey],
  )

  const value = useMemo(
    () => ({ overrides, byKey, loading, refresh, applyToList }),
    [overrides, byKey, loading, refresh, applyToList],
  )

  return (
    <QuestionOverrideContext.Provider value={value}>
      {children}
    </QuestionOverrideContext.Provider>
  )
}

export function useQuestionOverrides(): Ctx {
  const ctx = useContext(QuestionOverrideContext)
  if (!ctx) {
    return {
      overrides: [],
      byKey: new Map(),
      loading: false,
      refresh: async () => {},
      applyToList: (questions) => questions,
    }
  }
  return ctx
}
