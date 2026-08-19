import { QUESTIONS } from '../questions'
import type { Question } from '../../types'

export interface DdBankFile {
  bankId: string
  questions: Question[]
}

const cache = new Map<string, Question[]>()
const inflight = new Map<string, Promise<Question[]>>()

const JSON_BANKS = new Set(['official-2019', 'onthicchn-2026-07', 'onthicchn-2026-06'])

function jsonFileName(bankId: string): string | null {
  if (JSON_BANKS.has(bankId)) return `${bankId}.json`
  return null
}

export function getCachedDdQuestions(bankId: string): Question[] | undefined {
  return cache.get(bankId)
}

export function ddQuestions(bankId: string): Question[] {
  if (bankId === 'official-2020') return QUESTIONS
  return cache.get(bankId) ?? []
}

export function hasDdLoader(bankId: string): boolean {
  return bankId === 'official-2020' || JSON_BANKS.has(bankId)
}

export async function loadDdBank(bankId: string): Promise<Question[]> {
  if (bankId === 'official-2020') {
    cache.set(bankId, QUESTIONS)
    return QUESTIONS
  }

  const hit = cache.get(bankId)
  if (hit) return hit

  const pending = inflight.get(bankId)
  if (pending) return pending

  const file = jsonFileName(bankId)
  if (!file) {
    cache.set(bankId, [])
    return []
  }

  const promise = import(`./${file}`)
    .then((mod) => {
      const raw = mod as DdBankFile & { default?: DdBankFile }
      const bank = (raw.default ?? raw) as DdBankFile
      const qs = bank.questions ?? []
      cache.set(bankId, qs)
      inflight.delete(bankId)
      return qs
    })
    .catch(() => {
      inflight.delete(bankId)
      cache.set(bankId, [])
      return []
    })

  inflight.set(bankId, promise)
  return promise
}

export function allDdQuestions(): Question[] {
  const merged: Question[] = [...QUESTIONS]
  for (const qs of cache.values()) {
    merged.push(...qs)
  }
  return merged
}
