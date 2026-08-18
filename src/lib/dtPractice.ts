const WRONG_KEY = 'otcchnbd.dt.wrong.v1'
const CURSOR_KEY = 'otcchnbd.dt.cursor.v1'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function readDtWrongIds(): string[] {
  const ids = readJson<unknown>(WRONG_KEY, [])
  return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : []
}

export function markDtPracticeAnswer(questionId: string, correct: boolean): void {
  try {
    const set = new Set(readDtWrongIds())
    if (correct) set.delete(questionId)
    else set.add(questionId)
    localStorage.setItem(WRONG_KEY, JSON.stringify([...set]))
  } catch {
    /* ignore */
  }
}

export function addDtWrongIds(questionIds: string[]): void {
  try {
    const set = new Set(readDtWrongIds())
    for (const id of questionIds) set.add(id)
    localStorage.setItem(WRONG_KEY, JSON.stringify([...set]))
  } catch {
    /* ignore */
  }
}

export function readDtCursor(): number {
  try {
    const n = Number(localStorage.getItem(CURSOR_KEY) ?? 0)
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0
  } catch {
    return 0
  }
}

export function writeDtCursor(index: number): void {
  try {
    localStorage.setItem(CURSOR_KEY, String(Math.max(0, index)))
  } catch {
    /* ignore */
  }
}
