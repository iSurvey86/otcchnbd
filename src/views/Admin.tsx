'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { QUESTIONS } from '../data/questions'
import { TOPICS } from '../data/topics'
import { DT_TOPICS } from '../data/dt/topics'
import { XD_TOPICS } from '../data/xd/topics'
import { apiJson } from '../lib/apiClient'
import { isAdminEmail } from '../lib/config'
import type { LogEvent } from '../lib/analytics'
import { letter, EXAM_DO_DAC, EXAM_XAY_DUNG, EXAM_DAU_THAU, examDauThauForLot, examPassMark, examQuestionCount, examTotalMax } from '../lib/exam'
import { SECTORS } from '../data/sectors'
import { dtLotLabel } from '../data/dt/lots'
import { xdTrackLabel } from '../data/xd/tracks'
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
  payload: Record<string, unknown>
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
  payload?: Record<string, unknown> | null
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
  practice_started: {
    module: 'ON_THI',
    action: 'PRACTICE',
    detail: 'Bắt đầu ôn tập',
  },
  practice_finished: {
    module: 'ON_THI',
    action: 'PRACTICE',
    detail: 'Kết thúc ôn tập',
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

const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]))
const TOPIC_TITLE = new Map<string, string>(
  [...TOPICS, ...XD_TOPICS, ...DT_TOPICS].map((t) => [t.id, t.title]),
)
const SECTOR_TITLE = new Map<string, string>(SECTORS.map((s) => [s.id, s.title]))

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return {}
}

function asStr(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function asNum(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function asBool(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function clip(text: string, max = 90): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1)}…`
}

function fmtScore(value: number): string {
  return value.toLocaleString('vi-VN', { maximumFractionDigits: 1 })
}

function modeLabel(mode?: string): string {
  if (mode === 'practice') return 'Ôn tập'
  if (mode === 'exam') return 'Thi thử'
  return ''
}

function onThiKind(row: LogRow): string {
  if (row.event === 'practice_started' || row.event === 'practice_finished') return 'Ôn tập'
  if (row.event === 'exam_started' || row.event === 'exam_submitted') return 'Thi thử'
  return modeLabel(row.mode)
}

function examFrame(row: LogRow): {
  totalMax: number
  passMark: number
  questionCount: number
  pointsPerQuestion: number
} {
  const { sector, trackId } = inferScope(row)
  const config =
    sector === 'xay-dung'
      ? EXAM_XAY_DUNG
      : sector === 'dau-thau'
        ? trackId?.startsWith('dt-lo-')
          ? examDauThauForLot(trackId)
          : EXAM_DAU_THAU
        : EXAM_DO_DAC
  return {
    totalMax: asNum(row.payload.totalMax) ?? examTotalMax(config),
    passMark: asNum(row.payload.passMark) ?? examPassMark(config),
    questionCount: asNum(row.payload.questionCount) ?? examQuestionCount(config),
    pointsPerQuestion: config.pointsPerQuestion,
  }
}

function inferScope(row: LogRow): { sector?: string; trackId?: string } {
  const sector = asStr(row.payload.sector)
  const trackId = asStr(row.payload.trackId)
  if (sector) return { sector, trackId }
  const id = row.questionId ?? ''
  if (/^(pl|kn)-/i.test(id)) return { sector: 'do-dac-ban-do' }
  if (/^dt-/i.test(id)) return { sector: 'dau-thau' }
  const xd = /^xd-([\d.]+)-(i{1,3})-/i.exec(id)
  if (xd) {
    return {
      sector: 'xay-dung',
      trackId: `xd-${xd[1]}-hang-${xd[2].toLowerCase()}`,
    }
  }
  if (/^xd-/i.test(id)) return { sector: 'xay-dung' }
  if (
    row.event === 'exam_started' ||
    row.event === 'exam_submitted' ||
    row.event === 'practice_started' ||
    row.event === 'practice_finished' ||
    row.event === 'question_answered'
  ) {
    return { sector: 'do-dac-ban-do' }
  }
  return {}
}

function linhVuc(row: LogRow): { title: string; sub?: string } | null {
  const meta = EVENT_META[row.event]
  if (meta && meta.module !== 'ON_THI' && meta.module !== 'GOP_Y') return null
  const { sector, trackId } = inferScope(row)
  if (!sector) return null
  if (sector === 'do-dac-ban-do') return { title: 'Đo đạc và Bản đồ' }
  if (sector === 'xay-dung') {
    return {
      title: 'Xây dựng',
      sub: trackId ? xdTrackLabel(trackId) : undefined,
    }
  }
  if (sector === 'dau-thau') {
    return {
      title: 'Đấu thầu',
      sub: trackId?.startsWith('dt-lo-')
        ? dtLotLabel(trackId)
        : asStr(row.payload.topicTitle) || 'NVCM',
    }
  }
  return { title: SECTOR_TITLE.get(sector) ?? sector }
}

function optionSnippet(row: LogRow, which: 'choice' | 'answer'): string | undefined {
  const idx = asNum(row.payload[which])
  if (idx == null) return undefined
  const stored = asStr(row.payload[which === 'choice' ? 'choiceText' : 'answerText'])
  if (stored) return stored
  const question = row.questionId ? QUESTION_BY_ID.get(row.questionId) : undefined
  return question?.options[idx]
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

function answerBits(row: LogRow) {
  const payload = row.payload
  const question = row.questionId ? QUESTION_BY_ID.get(row.questionId) : undefined
  const prompt = asStr(payload.prompt) || question?.prompt
  const topic =
    asStr(payload.topicTitle) ||
    (asStr(payload.topicId) ? TOPIC_TITLE.get(asStr(payload.topicId)!) : undefined)
  const idx = asNum(payload.index)
  const total = asNum(payload.total)
  const pos =
    idx != null && total != null
      ? `Câu ${idx + 1}/${total}`
      : row.questionId
        ? `Câu ${row.questionId}`
        : 'Câu hỏi'
  const choice = asNum(payload.choice)
  const answer = asNum(payload.answer)
  const choiceText = optionSnippet(row, 'choice')
  const answerText = optionSnippet(row, 'answer')
  const chose =
    choice != null
      ? `Chọn ${letter(choice)}${choiceText ? `. ${clip(choiceText, 90)}` : ''}`
      : ''
  const key =
    answer != null
      ? `Đáp án ${letter(answer)}${answerText ? `. ${clip(answerText, 90)}` : ''}`
      : ''
  return {
    pos,
    topic,
    prompt,
    chose,
    key,
    passed: row.passed,
    result: row.passed === true ? 'Đúng' : row.passed === false ? 'Sai' : '',
  }
}

function logDetail(row: LogRow): string {
  const payload = row.payload

  if (row.event === 'question_answered') {
    const b = answerBits(row)
    const head = [b.pos, b.topic ? `chuyên đề ${b.topic}` : null].filter(Boolean).join(' · ')
    const pick = b.chose || 'Chưa ghi đáp án đã chọn'
    const result =
      b.result && b.passed === false && b.key
        ? `${b.result} · ${b.key}`
        : b.result
    return [head, b.prompt ? clip(b.prompt, 140) : null, pick, result]
      .filter(Boolean)
      .join(' — ')
  }

  if (row.event === 'exam_submitted') {
    const frame = examFrame(row)
    const correctCount =
      asNum(payload.correctCount) ??
      (typeof row.score === 'number'
        ? Math.round(row.score / frame.pointsPerQuestion)
        : undefined)
    const scoreBit =
      typeof row.score === 'number'
        ? `${fmtScore(row.score)}/${fmtScore(frame.totalMax)} điểm`
        : null
    const ketQua =
      row.passed === true ? 'Đạt' : row.passed === false ? 'Không đạt' : null
    const counts =
      correctCount != null ? `${correctCount}/${frame.questionCount} câu đúng` : null
    const timed = asBool(payload.timedOut) ? 'hết giờ' : null
    return ['Nộp bài thi thử', scoreBit, `ngưỡng đạt ${fmtScore(frame.passMark)}`, ketQua, counts, timed]
      .filter(Boolean)
      .join(' · ')
  }

  if (row.event === 'exam_started') {
    return 'Bắt đầu thi thử'
  }

  if (row.event === 'practice_started') {
    const topic = asStr(payload.topicTitle)
    return ['Bắt đầu ôn tập', topic].filter(Boolean).join(' · ')
  }

  if (row.event === 'practice_finished') {
    const topic = asStr(payload.topicTitle)
    const total = asNum(payload.total)
    const scoreBit =
      typeof row.score === 'number' && total != null
        ? `${row.score}/${total} câu đúng`
        : typeof row.score === 'number'
          ? `${row.score} câu đúng`
          : null
    return ['Kết thúc ôn tập', scoreBit, topic].filter(Boolean).join(' · ')
  }

  const base = EVENT_META[row.event]?.detail ?? String(row.event)
  if (row.reason) return `${base} · ${row.reason}`
  return base
}

function LogDetailCell({ row }: { row: LogRow }) {
  if (row.event !== 'question_answered') {
    return <>{logDetail(row)}</>
  }
  const b = answerBits(row)
  return (
    <div className="admin-detail-stack">
      <div>
        {[b.pos, b.topic ? `chuyên đề ${b.topic}` : null].filter(Boolean).join(' · ')}
      </div>
      {b.prompt ? <div className="admin-q-prompt">{clip(b.prompt, 140)}</div> : null}
      <div>
        {b.chose || 'Log cũ: chưa ghi đáp án đã chọn'}
        {b.result ? (
          <>
            {' — '}
            <span className={b.passed ? 'admin-result-ok' : 'admin-result-bad'}>
              {b.result}
            </span>
          </>
        ) : null}
        {b.passed === false && b.key ? ` · ${b.key}` : null}
      </div>
    </div>
  )
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
  const [sectorFilter, setSectorFilter] = useState('all')
  const [hideAdmin, setHideAdmin] = useState(() => {
    try {
      return localStorage.getItem('otcchnbd.admin.hideAdmin') === '1'
    } catch {
      return false
    }
  })
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
          payload: asRecord(row.payload),
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
  }, [tab, search, moduleFilter, actionFilter, sectorFilter, feedbackStatus, hideAdmin])

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
      if (sectorFilter !== 'all' && inferScope(row).sector !== sectorFilter) return false
      if (hideAdmin && isAdminEmail(row.email)) return false
      if (!q) return true
      const field = linhVuc(row)
      const hay = [
        row.email,
        row.displayName,
        meta.module,
        meta.action,
        meta.detail,
        logDetail(row),
        field?.title,
        field?.sub,
        row.questionId,
        row.mode,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [logs, search, moduleFilter, actionFilter, sectorFilter, hideAdmin])

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
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">Tất cả lĩnh vực</option>
              <option value="do-dac-ban-do">Đo đạc và Bản đồ</option>
              <option value="xay-dung">Xây dựng</option>
              <option value="dau-thau">Đấu thầu</option>
            </select>
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
              <option value="PRACTICE">PRACTICE</option>
              <option value="EXAM_START">EXAM_START</option>
              <option value="EXAM_SUBMIT">EXAM_SUBMIT</option>
              <option value="PAYWALL">PAYWALL</option>
              <option value="SUBMIT">SUBMIT</option>
            </select>
            <button
              type="button"
              className={hideAdmin ? 'btn copper compact' : 'btn ghost compact'}
              onClick={() => {
                const next = !hideAdmin
                setHideAdmin(next)
                try {
                  localStorage.setItem('otcchnbd.admin.hideAdmin', next ? '1' : '0')
                } catch {
                  /* ignore */
                }
              }}
            >
              {hideAdmin ? 'Hiện admin' : 'Ẩn admin'}
            </button>
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
                  <th>Lĩnh vực</th>
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
                  const field = linhVuc(row)
                  return (
                    <tr key={row.id}>
                      <td>{(pageSafe - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="admin-col-actor">
                        <strong>{row.displayName || row.email || '–'}</strong>
                        {row.email && row.displayName ? (
                          <span className="admin-cell-sub">{row.email}</span>
                        ) : null}
                      </td>
                      <td className="admin-col-sector">
                        {field ? (
                          <>
                            <strong>{field.title}</strong>
                            {field.sub ? (
                              <span className="admin-cell-sub">{field.sub}</span>
                            ) : null}
                          </>
                        ) : (
                          '–'
                        )}
                      </td>
                      <td>
                        <span className={`admin-chip module-${meta.module.toLowerCase()}`}>
                          {meta.module}
                        </span>
                        {meta.module === 'ON_THI' && onThiKind(row) ? (
                          <span className="admin-cell-sub">{onThiKind(row)}</span>
                        ) : null}
                      </td>
                      <td className="admin-col-action">
                        <strong className={`admin-action action-${meta.action.toLowerCase()}`}>
                          {meta.action}
                        </strong>
                        <span className="admin-cell-sub">{formatWhen(row.createdAt)}</span>
                      </td>
                      <td className="admin-detail">
                        <LogDetailCell row={row} />
                      </td>
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
            <p className="feedback-kicker">Góp ý người dùng</p>
            <p className="feedback-modal-prompt feedback-modal-message">
              {selectedFeedback.message}
            </p>
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
