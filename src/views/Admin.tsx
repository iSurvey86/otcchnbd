'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiJson } from '../lib/apiClient'
import type { LogEvent } from '../lib/analytics'
import {
  FEEDBACK_STATUS_LABEL,
  listFeedback,
  updateFeedbackAdmin,
  type FeedbackRow,
  type FeedbackStatus,
} from '../lib/feedback'

interface LogRow {
  id: string
  uid?: string
  email: string | null
  displayName: string | null
  event: LogEvent | string
  createdAt: Date | null
  questionId?: string
  mode?: string
  passed?: boolean
  score?: number
  reason?: string
}

type LogDbRow = {
  id: string
  uid: string
  email: string | null
  display_name: string | null
  event: string
  question_id: string | null
  mode: string | null
  passed: boolean | null
  score: number | null
  reason: string | null
  created_at: string | null
}

const PAGE_SIZE = 20

const EVENT_META: Record<
  string,
  { module: string; action: string; detail: string }
> = {
  login: { module: 'XAC_THUC', action: 'LOGIN', detail: 'Đăng nhập hệ thống thành công' },
  logout: { module: 'XAC_THUC', action: 'LOGOUT', detail: 'Đăng xuất hệ thống' },
  question_answered: {
    module: 'ON_THI',
    action: 'ANSWER',
    detail: 'Trả lời câu hỏi',
  },
  exam_started: { module: 'ON_THI', action: 'EXAM_START', detail: 'Bắt đầu thi thử' },
  exam_submitted: { module: 'ON_THI', action: 'EXAM_SUBMIT', detail: 'Nộp bài thi thử' },
  paywall_hit: {
    module: 'XAC_THUC',
    action: 'PAYWALL',
    detail: 'Chạm cổng yêu cầu đăng nhập',
  },
  feedback_submitted: {
    module: 'GOP_Y',
    action: 'SUBMIT',
    detail: 'Gửi góp ý câu hỏi',
  },
}

function formatWhen(value: Date | null): string {
  return value
    ? value.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '–'
}

function logDetail(row: LogRow): string {
  const base = EVENT_META[row.event]?.detail ?? String(row.event)
  const bits: string[] = []
  if (row.mode) bits.push(`mode=${row.mode}`)
  if (row.questionId) bits.push(`questionId=${row.questionId}`)
  if (typeof row.score === 'number') bits.push(`score=${row.score}`)
  if (row.passed === true) bits.push('passed=true')
  if (row.passed === false) bits.push('passed=false')
  if (row.reason) bits.push(`reason=${row.reason}`)
  return bits.length ? `${base} { ${bits.join(', ')} }` : base
}

export function Admin() {
  const { isAdmin, isConfigured } = useAuth()
  const [logs, setLogs] = useState<LogRow[]>([])
  const [feedback, setFeedback] = useState<FeedbackRow[]>([])
  const [tab, setTab] = useState<'logs' | 'feedback'>('logs')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [feedbackStatus, setFeedbackStatus] = useState<'all' | FeedbackStatus>('all')
  const [page, setPage] = useState(1)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRow | null>(null)
  const [reply, setReply] = useState('')
  const [savingFeedback, setSavingFeedback] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [logRes, feedbackRows] = await Promise.all([
        apiJson<LogDbRow[]>('/api/admin/logs?limit=400', { method: 'GET' }),
        listFeedback(400),
      ])
      if (!logRes.ok) throw new Error(logRes.error)
      setLogs(
        (logRes.data ?? []).map((row) => ({
          id: row.id,
          uid: row.uid,
          email: row.email ?? null,
          displayName: row.display_name ?? null,
          event: row.event,
          createdAt: row.created_at ? new Date(row.created_at) : null,
          questionId: row.question_id ?? undefined,
          mode: row.mode ?? undefined,
          passed: row.passed ?? undefined,
          score: row.score ?? undefined,
          reason: row.reason ?? undefined,
        })),
      )
      setFeedback(feedbackRows)
    } catch {
      setError(
        'Không đọc được dữ liệu. Kiểm tra Supabase + Firebase Admin env, và quyền admin (NEXT_PUBLIC_ADMIN_EMAILS).',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAdmin && isConfigured) void load()
  }, [isAdmin, isConfigured, load])

  useEffect(() => {
    setPage(1)
  }, [tab, search, moduleFilter, actionFilter, feedbackStatus])

  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase()
    return logs.filter((row) => {
      const meta = EVENT_META[row.event] ?? {
        module: 'KHAC',
        action: String(row.event).toUpperCase(),
        detail: String(row.event),
      }
      if (moduleFilter !== 'all' && meta.module !== moduleFilter) return false
      if (actionFilter !== 'all' && meta.action !== actionFilter) return false
      if (!q) return true
      const hay = [
        row.email,
        row.displayName,
        meta.module,
        meta.action,
        meta.detail,
        row.questionId,
        row.mode,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [logs, search, moduleFilter, actionFilter])

  const filteredFeedback = useMemo(() => {
    const q = search.trim().toLowerCase()
    return feedback.filter((row) => {
      if (feedbackStatus !== 'all' && row.status !== feedbackStatus) return false
      if (!q) return true
      const hay = [row.email, row.displayName, row.message, row.questionId, row.questionPrompt]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [feedback, search, feedbackStatus])

  const rows = tab === 'logs' ? filteredLogs : filteredFeedback
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pageSafe = Math.min(page, totalPages)
  const pageRows = rows.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  const moiCount = feedback.filter((f) => f.status === 'moi').length

  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return {
      loginsToday: logs.filter(
        (row) => row.event === 'login' && row.createdAt && row.createdAt >= today,
      ).length,
      answers: logs.filter((row) => row.event === 'question_answered').length,
      exams: logs.filter((row) => row.event === 'exam_submitted').length,
      feedbackMoi: moiCount,
    }
  }, [logs, moiCount])

  async function saveFeedbackPatch(status?: FeedbackStatus) {
    if (!selectedFeedback) return
    setSavingFeedback(true)
    const result = await updateFeedbackAdmin(selectedFeedback.id, {
      status,
      adminReply: reply,
    })
    setSavingFeedback(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    await load()
    setSelectedFeedback(null)
    setReply('')
  }

  if (!isConfigured) {
    return (
      <section className="panel">
        <p className="kicker">Quản lý hệ thống</p>
        <h2>Chưa cấu hình Firebase</h2>
        <p className="lead">Tạo file .env.local theo .env.example rồi bật Google Sign-in.</p>
      </section>
    )
  }

  if (!isAdmin) {
    return (
      <section className="panel">
        <p className="kicker">Quản lý hệ thống</p>
        <h2>Không có quyền</h2>
        <p className="lead">
          Thêm Gmail của bạn vào NEXT_PUBLIC_ADMIN_EMAILS rồi đăng nhập lại.
        </p>
      </section>
    )
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Quản lý hệ thống</h1>
          <p className="admin-sub">Giám sát hoạt động và góp ý người dùng</p>
        </div>
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab admin-tab-logs${tab === 'logs' ? ' active' : ''}`}
            onClick={() => setTab('logs')}
          >
            Nhật ký hoạt động
          </button>
          <button
            type="button"
            className={`admin-tab admin-tab-feedback${tab === 'feedback' ? ' active' : ''}`}
            onClick={() => setTab('feedback')}
          >
            Góp ý người dùng
            {moiCount > 0 ? <span className="admin-tab-badge">{moiCount > 9 ? '9+' : moiCount}</span> : null}
          </button>
        </div>
      </div>

      <div className="stats admin-stats">
        <div className="stat stat-law">
          <span className="stat-bar" aria-hidden />
          <b>{stats.loginsToday}</b>
          <span>Đăng nhập hôm nay</span>
        </div>
        <div className="stat stat-skill">
          <span className="stat-bar" aria-hidden />
          <b>{stats.answers}</b>
          <span>Câu đã trả lời</span>
        </div>
        <div className="stat stat-bank">
          <span className="stat-bar" aria-hidden />
          <b>{stats.exams}</b>
          <span>Bài thi đã nộp</span>
        </div>
        <div className="stat stat-exam">
          <span className="stat-bar" aria-hidden />
          <b>{stats.feedbackMoi}</b>
          <span>Góp ý mới</span>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-search"
          placeholder={
            tab === 'logs'
              ? 'Tìm theo tên, email hoặc mô tả…'
              : 'Tìm theo email, câu hỏi hoặc nội dung góp ý…'
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {tab === 'logs' ? (
          <>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">Tất cả phân hệ</option>
              <option value="XAC_THUC">XAC_THUC</option>
              <option value="ON_THI">ON_THI</option>
              <option value="GOP_Y">GOP_Y</option>
            </select>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">Tất cả hành động</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
              <option value="ANSWER">ANSWER</option>
              <option value="EXAM_START">EXAM_START</option>
              <option value="EXAM_SUBMIT">EXAM_SUBMIT</option>
              <option value="PAYWALL">PAYWALL</option>
              <option value="SUBMIT">SUBMIT</option>
            </select>
          </>
        ) : (
          <select
            value={feedbackStatus}
            onChange={(e) => setFeedbackStatus(e.target.value as 'all' | FeedbackStatus)}
            className="admin-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="moi">Mới</option>
            <option value="dang_xu_ly">Đang xử lý</option>
            <option value="xong">Đã xong</option>
            <option value="dong">Đóng</option>
          </select>
        )}
        <button className="btn ghost compact" onClick={() => void load()} disabled={loading}>
          {loading ? 'Đang tải…' : 'Làm mới'}
        </button>
      </div>

      {error ? <p className="auth-error">{error}</p> : null}

      {tab === 'logs' ? (
        <div className="panel table-wrap admin-panel">
          {filteredLogs.length === 0 ? (
            <p className="empty">Chưa có nhật ký phù hợp.</p>
          ) : (
            <table className="admin-table admin-table-logs">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Người thực hiện</th>
                  <th>Phân hệ</th>
                  <th>Hành động</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {(pageRows as LogRow[]).map((row, i) => {
                  const meta = EVENT_META[row.event] ?? {
                    module: 'KHAC',
                    action: String(row.event).toUpperCase(),
                    detail: String(row.event),
                  }
                  return (
                    <tr key={row.id}>
                      <td>{(pageSafe - 1) * PAGE_SIZE + i + 1}</td>
                      <td>
                        <strong>{row.displayName || row.email || '–'}</strong>
                        {row.email && row.displayName ? (
                          <span className="admin-cell-sub">{row.email}</span>
                        ) : null}
                      </td>
                      <td>
                        <span className={`admin-chip module-${meta.module.toLowerCase()}`}>
                          {meta.module}
                        </span>
                      </td>
                      <td>
                        <strong className={`admin-action action-${meta.action.toLowerCase()}`}>
                          {meta.action}
                        </strong>
                        <span className="admin-cell-sub">{formatWhen(row.createdAt)}</span>
                      </td>
                      <td className="admin-detail">{logDetail(row)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="panel table-wrap admin-panel">
          {filteredFeedback.length === 0 ? (
            <p className="empty">Chưa có góp ý phù hợp.</p>
          ) : (
            <table className="admin-table admin-table-logs">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Người gửi</th>
                  <th>Câu hỏi</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(pageRows as FeedbackRow[]).map((row, i) => (
                  <tr key={row.id}>
                    <td>{(pageSafe - 1) * PAGE_SIZE + i + 1}</td>
                    <td>
                      <strong>{row.displayName || row.email || '–'}</strong>
                      {row.email ? <span className="admin-cell-sub">{row.email}</span> : null}
                      <span className="admin-cell-sub">{formatWhen(row.createdAt)}</span>
                    </td>
                    <td>
                      <code>{row.questionId}</code>
                      <span className="admin-cell-sub">{row.questionPrompt.slice(0, 80)}</span>
                    </td>
                    <td className="admin-detail">{row.message}</td>
                    <td>
                      <span className={`admin-status status-${row.status}`}>
                        {FEEDBACK_STATUS_LABEL[row.status]}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn ghost compact"
                        onClick={() => {
                          setSelectedFeedback(row)
                          setReply(row.adminReply ?? '')
                        }}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="admin-pager">
        <span>
          Trang {pageSafe} / {totalPages} · {rows.length} mục
        </span>
        <div className="admin-pager-actions">
          <button
            type="button"
            className="btn ghost compact"
            disabled={pageSafe <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Trước
          </button>
          <button
            type="button"
            className="btn ghost compact"
            disabled={pageSafe >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Tiếp
          </button>
        </div>
      </div>

      {selectedFeedback ? (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedFeedback(null)}
          role="presentation"
        >
          <div
            className="feedback-modal"
            role="dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="feedback-modal-title">Chi tiết góp ý</h2>
            <p className="feedback-modal-meta muted">
              {selectedFeedback.displayName || selectedFeedback.email} ·{' '}
              {formatWhen(selectedFeedback.createdAt)}
            </p>
            <p className="feedback-modal-meta">
              Câu <code>{selectedFeedback.questionId}</code>
            </p>
            <p className="feedback-modal-prompt">{selectedFeedback.questionPrompt}</p>
            <p className="feedback-modal-prompt">{selectedFeedback.message}</p>
            <label className="feedback-label">
              Phản hồi admin
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="Ghi chú xử lý / trả lời người dùng…"
              />
            </label>
            <div className="feedback-actions feedback-actions-wrap">
              <button
                type="button"
                className="btn copper"
                disabled={savingFeedback}
                onClick={() => void saveFeedbackPatch('dang_xu_ly')}
              >
                Đang xử lý
              </button>
              <button
                type="button"
                className="btn primary"
                disabled={savingFeedback}
                onClick={() => void saveFeedbackPatch('xong')}
              >
                Đánh dấu xong
              </button>
              <button
                type="button"
                className="btn ghost"
                disabled={savingFeedback}
                onClick={() => void saveFeedbackPatch('dong')}
              >
                Đóng góp ý
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setSelectedFeedback(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
