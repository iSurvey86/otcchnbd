import type { ExamAttempt } from '../types'

const KEY = 'otcchnbd.attempts.v1'

export function loadAttempts(): ExamAttempt[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ExamAttempt[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveAttempt(attempt: ExamAttempt): void {
  const all = [attempt, ...loadAttempts()].slice(0, 30)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function getAttempt(id: string): ExamAttempt | undefined {
  return loadAttempts().find((item) => item.id === id)
}
