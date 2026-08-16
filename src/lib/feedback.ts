import type { User } from 'firebase/auth'
import { apiJson } from './apiClient'

export type FeedbackStatus = 'moi' | 'dang_xu_ly' | 'xong' | 'dong'

export interface FeedbackInput {
  message: string
  questionId: string
  questionPrompt: string
  sector?: string
  trackId?: string
  topicId?: string
}

export interface FeedbackRow {
  id: string
  uid: string
  email: string | null
  displayName: string | null
  message: string
  questionId: string
  questionPrompt: string
  sector?: string
  trackId?: string
  topicId?: string
  status: FeedbackStatus
  adminReply: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export const FEEDBACK_STATUS_LABEL: Record<FeedbackStatus, string> = {
  moi: 'Mới',
  dang_xu_ly: 'Đang xử lý',
  xong: 'Đã xong',
  dong: 'Đóng',
}

type FeedbackDbRow = {
  id: string
  uid: string
  email: string | null
  display_name: string | null
  message: string
  question_id: string
  question_prompt: string | null
  sector: string | null
  track_id: string | null
  topic_id: string | null
  status: FeedbackStatus
  admin_reply: string | null
  created_at: string | null
  updated_at: string | null
}

function mapFeedback(row: FeedbackDbRow): FeedbackRow {
  return {
    id: row.id,
    uid: row.uid,
    email: row.email,
    displayName: row.display_name,
    message: row.message,
    questionId: row.question_id,
    questionPrompt: row.question_prompt ?? '',
    sector: row.sector ?? undefined,
    trackId: row.track_id ?? undefined,
    topicId: row.topic_id ?? undefined,
    status: row.status || 'moi',
    adminReply: row.admin_reply,
    createdAt: row.created_at ? new Date(row.created_at) : null,
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
  }
}

export async function submitFeedback(
  user: User,
  input: FeedbackInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const message = input.message.trim()
  if (message.length < 10) {
    return { ok: false, error: 'Vui lòng mô tả góp ý ít nhất 10 ký tự.' }
  }
  if (message.length > 2000) {
    return { ok: false, error: 'Góp ý tối đa 2000 ký tự.' }
  }

  const result = await apiJson('/api/feedback', {
    method: 'POST',
    user,
    body: JSON.stringify({
      message,
      questionId: input.questionId,
      questionPrompt: input.questionPrompt,
      sector: input.sector ?? null,
      trackId: input.trackId ?? null,
      topicId: input.topicId ?? null,
    }),
  })
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true }
}

export async function listFeedback(max = 300): Promise<FeedbackRow[]> {
  const result = await apiJson<FeedbackDbRow[]>(`/api/admin/feedback?limit=${max}`, {
    method: 'GET',
  })
  if (!result.ok) throw new Error(result.error)
  return (result.data ?? []).map(mapFeedback)
}

export async function updateFeedbackAdmin(
  id: string,
  patch: { status?: FeedbackStatus; adminReply?: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await apiJson(`/api/admin/feedback/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: patch.status,
      adminReply: patch.adminReply,
    }),
  })
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true }
}
