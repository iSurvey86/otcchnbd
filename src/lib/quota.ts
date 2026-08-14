import { GUEST_LIMIT } from './config'

const KEY = 'otcchnbd.quota.answered'

export function readGuestAnswered(): number {
  try {
    const raw = localStorage.getItem(KEY)
    const n = raw ? Number.parseInt(raw, 10) : 0
    return Number.isFinite(n) && n > 0 ? n : 0
  } catch {
    return 0
  }
}

export function writeGuestAnswered(count: number): void {
  localStorage.setItem(KEY, String(Math.max(0, count)))
}

export function guestRemaining(answered = readGuestAnswered()): number {
  return Math.max(0, GUEST_LIMIT - answered)
}
