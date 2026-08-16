'use client'

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { submitFeedback } from '../lib/feedback'
import type { Question } from '../types'

interface Props {
  open: boolean
  question: Question
  sector?: string
  trackId?: string
  onClose: () => void
}

export function FeedbackModal({
  open,
  question,
  sector,
  trackId,
  onClose,
}: Props) {
  const { user, isConfigured, openLogin } = useAuth()
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)
  const [sending, setSending] = useState(false)

  if (!open) return null

  async function handleSubmit() {
    setError(null)
    setOk(false)
    if (!isConfigured) {
      setError('Chưa cấu hình đăng nhập.')
      return
    }
    if (!user) {
      openLogin('Đăng nhập Google để gửi góp ý về câu hỏi.')
      return
    }
    setSending(true)
    const result = await submitFeedback(user, {
      message,
      questionId: question.id,
      questionPrompt: question.prompt,
      sector,
      trackId,
      topicId: question.topic,
    })
    setSending(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setOk(true)
    setMessage('')
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="feedback-modal"
        role="dialog"
        aria-labelledby="feedback-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="feedback-title" className="feedback-modal-title">
          Phản hồi / Góp ý
        </h2>
        <p className="feedback-modal-meta muted">
          Câu hỏi: <strong>{question.id}</strong>
        </p>
        <p className="feedback-modal-prompt">{question.prompt}</p>
        <label className="feedback-label">
          Nội dung góp ý
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="Mô tả sai sót đáp án, giải thích, hoặc đề xuất cải thiện…"
            disabled={sending || ok}
          />
        </label>
        <p className="feedback-hint muted">{message.length}/2000 · tối thiểu 10 ký tự</p>
        {error ? <p className="auth-error">{error}</p> : null}
        {ok ? (
          <p className="feedback-ok">Đã gửi góp ý. Cảm ơn bạn!</p>
        ) : null}
        <div className="feedback-actions">
          {!ok ? (
            <button
              type="button"
              className="btn copper"
              disabled={sending}
              onClick={() => void handleSubmit()}
            >
              {!user ? 'Đăng nhập để gửi' : sending ? 'Đang gửi…' : 'Gửi góp ý'}
            </button>
          ) : null}
          <button type="button" className="btn ghost" onClick={onClose}>
            {ok ? 'Đóng' : 'Hủy'}
          </button>
        </div>
      </div>
    </div>
  )
}
