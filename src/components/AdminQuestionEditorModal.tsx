'use client'

import { useEffect, useState } from 'react'
import { getFirebaseAuth } from '../lib/firebase'
import { useQuestionOverrides } from '../context/QuestionOverrideContext'
import {
  overrideKeyFromScope,
  type QuestionOverride,
} from '../lib/questionOverride'
import type { Question, StudyScope } from '../types'

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

type Props = {
  open: boolean
  base: Question
  scope: StudyScope
  existing?: QuestionOverride | null
  noteHint?: string
  onClose: () => void
  onSaved?: () => void
}

export function AdminQuestionEditorModal({
  open,
  base,
  scope,
  existing,
  noteHint,
  onClose,
  onSaved,
}: Props) {
  const { byKey, refresh } = useQuestionOverrides()
  const live = byKey.get(overrideKeyFromScope(scope, base.id))
  const merged: Question = {
    ...base,
    prompt: live?.prompt ?? existing?.prompt ?? base.prompt,
    options: live?.options ?? existing?.options ?? base.options,
    answer: live?.answer ?? existing?.answer ?? base.answer,
    explanation: live?.explanation ?? existing?.explanation ?? base.explanation,
    source: live?.source ?? existing?.source ?? base.source,
  }

  const [prompt, setPrompt] = useState(merged.prompt)
  const [options, setOptions] = useState([...merged.options] as [
    string,
    string,
    string,
    string,
  ])
  const [answer, setAnswer] = useState<0 | 1 | 2 | 3>(merged.answer)
  const [explanation, setExplanation] = useState(merged.explanation)
  const [source, setSource] = useState(merged.source)
  const [note, setNote] = useState(live?.note ?? existing?.note ?? noteHint ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setPrompt(merged.prompt)
    setOptions([...merged.options] as [string, string, string, string])
    setAnswer(merged.answer)
    setExplanation(merged.explanation)
    setSource(merged.source)
    setNote(live?.note ?? existing?.note ?? noteHint ?? '')
    setError(null)
    // only reset when opening / switching question
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, base.id, scope.sector, scope.bankId, scope.trackId])

  function setAnswerAndSyncExpl(next: 0 | 1 | 2 | 3) {
    setAnswer(next)
    const letter = OPTION_LABELS[next]
    const opt = options[next]?.trim() || ''
    const line = `Đáp án đúng: ${letter}. ${opt}`
    setExplanation((prev) => {
      const t = String(prev || '').trim()
      if (!t) return line
      // Cập nhật dòng mở đầu kiểu ngân hàng Đo đạc / Đấu thầu
      if (/^Đáp án đúng\s*:/i.test(t)) {
        return t.replace(/^Đáp án đúng\s*:[^\n]*/i, line)
      }
      if (/^Đáp án chính xác cho câu hỏi này là\s*:/i.test(t)) {
        return t.replace(
          /^Đáp án chính xác cho câu hỏi này là\s*:[^\n]*/i,
          `Đáp án chính xác cho câu hỏi này là:\n${letter}. ${opt}`,
        )
      }
      return `${line}\n\n${t}`
    })
  }

  if (!open) return null

  async function save() {
    const letter = OPTION_LABELS[answer]
    if (
      !window.confirm(
        `Xác nhận lưu override\n\nĐáp án đúng: ${letter}. ${options[answer]}\n\nÔn/thi sẽ dùng đáp án này ngay sau khi tải lại trang ôn.`,
      )
    ) {
      return
    }
    setBusy(true)
    setError(null)
    const auth = getFirebaseAuth()
    const user = auth?.currentUser
    if (!user) {
      setError('Chưa đăng nhập.')
      setBusy(false)
      return
    }
    try {
      const token = await user.getIdToken()
      const res = await fetch('/api/admin/question-overrides', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sector: scope.sector,
          bankId: scope.bankId ?? '',
          trackId: scope.trackId ?? '',
          questionId: base.id,
          prompt: prompt.trim(),
          options: options.map((o) => o.trim()),
          answer: Number(answer),
          explanation: explanation.trim(),
          source: source.trim(),
          section: base.section,
          topic: base.topic,
          note: note.trim() || null,
        }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(json.error || `Lỗi ${res.status}`)
        return
      }
      await refresh()
      onSaved?.()
      onClose()
    } catch {
      setError('Không kết nối được máy chủ.')
    } finally {
      setBusy(false)
    }
  }

  async function removeOverride() {
    const ov = live ?? existing
    if (!ov?.id) return
    if (!window.confirm('Xóa override — khôi phục bản gốc trong file?')) return
    setBusy(true)
    setError(null)
    const auth = getFirebaseAuth()
    const user = auth?.currentUser
    if (!user) {
      setError('Chưa đăng nhập.')
      setBusy(false)
      return
    }
    try {
      const token = await user.getIdToken()
      const res = await fetch(`/api/admin/question-overrides/${ov.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(json.error || `Lỗi ${res.status}`)
        return
      }
      await refresh()
      onSaved?.()
      onClose()
    } catch {
      setError('Không kết nối được máy chủ.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={() => !busy && onClose()}
      role="presentation"
    >
      <div
        className="feedback-modal admin-q-edit-modal"
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="feedback-modal-title">Sửa câu hỏi (override)</h2>
        <p className="feedback-modal-meta">
          <code>{base.id}</code>
          {live || existing ? (
            <span className="admin-chip admin-q-override-chip"> Đang override</span>
          ) : null}
        </p>
        <p className="admin-cspl-expire-help">
          Lưu vào Supabase — áp dụng ngay cho ôn/thi, không cần sửa file Git.
        </p>

        <label className="feedback-label">
          Đề bài
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        </label>

        {OPTION_LABELS.map((letter, i) => (
          <label key={letter} className="feedback-label">
            Phương án {letter}
            <input
              value={options[i]}
              onChange={(e) => {
                const next = [...options] as [string, string, string, string]
                next[i] = e.target.value
                setOptions(next)
              }}
            />
          </label>
        ))}

        <label className="feedback-label admin-q-answer-field">
          <span>
            Đáp án đúng{' '}
            <strong className="admin-q-answer-badge">
              {OPTION_LABELS[answer]}. {options[answer]}
            </strong>
          </span>
          <select
            value={answer}
            onChange={(e) =>
              setAnswerAndSyncExpl(Number(e.target.value) as 0 | 1 | 2 | 3)
            }
          >
            {OPTION_LABELS.map((letter, i) => (
              <option key={letter} value={i}>
                {letter}. {options[i]}
              </option>
            ))}
          </select>
        </label>

        <label className="feedback-label">
          Giải thích
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={6}
          />
        </label>

        <label className="feedback-label">
          Nguồn
          <input value={source} onChange={(e) => setSource(e.target.value)} />
        </label>

        <label className="feedback-label">
          Ghi chú Admin
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="VD: Sửa theo góp ý — NĐ 03/2019 Điều 12"
          />
        </label>

        {error ? <p className="auth-error">{error}</p> : null}

        <div className="feedback-actions feedback-actions-wrap">
          {(live || existing)?.id ? (
            <button
              type="button"
              className="btn ghost"
              disabled={busy}
              onClick={() => void removeOverride()}
            >
              Xóa override
            </button>
          ) : null}
          <button
            type="button"
            className="btn ghost"
            disabled={busy}
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="button"
            className="btn primary"
            disabled={busy}
            onClick={() => void save()}
          >
            {busy ? 'Đang lưu…' : 'Lưu override'}
          </button>
        </div>
      </div>
    </div>
  )
}
