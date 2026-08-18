import type { User } from 'firebase/auth'
import { apiJson } from './apiClient'

export type LogEvent =
  | 'login'
  | 'logout'
  | 'question_answered'
  | 'exam_started'
  | 'exam_submitted'
  | 'paywall_hit'
  | 'feedback_submitted'

export async function upsertUser(
  user: User,
  provider?: string,
): Promise<void> {
  await apiJson('/api/user', {
    method: 'POST',
    user,
    body: JSON.stringify({
      photoURL: user.photoURL,
      provider:
        provider ?? user.providerData[0]?.providerId ?? 'google.com',
      bumpLogin: true,
    }),
  })
}

export async function logEvent(
  user: User | null,
  event: LogEvent,
  payload: Record<string, string | number | boolean | null> = {},
): Promise<void> {
  if (!user) return
  const {
    questionId = null,
    mode = null,
    passed = null,
    score = null,
    reason = null,
    ...rest
  } = payload
  await apiJson('/api/logs', {
    method: 'POST',
    user,
    body: JSON.stringify({
      event,
      questionId,
      mode,
      passed,
      score,
      reason,
      payload: rest,
    }),
  })
}

export async function bumpUserStat(
  _uid: string,
  field: 'answerCount' | 'examCount',
  user?: User | null,
): Promise<void> {
  await apiJson('/api/user', {
    method: 'PATCH',
    user: user ?? undefined,
    body: JSON.stringify({ field }),
  })
}
