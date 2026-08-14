import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getFirebase } from '../lib/firebase'
import type { LogEvent } from '../lib/analytics'

interface UserRow {
  uid: string
  email: string | null
  displayName: string | null
  answerCount: number
  examCount: number
  loginCount: number
  lastLoginAt: Date | null
}

interface LogRow {
  id: string
  email: string | null
  event: LogEvent | string
  createdAt: Date | null
  questionId?: string
  mode?: string
  passed?: boolean
  score?: number
}

const EVENT_LABEL: Record<string, string> = {
  login: 'Đăng nhập',
  logout: 'Đăng xuất',
  question_answered: 'Trả lời câu',
  exam_started: 'Bắt đầu thi',
  exam_submitted: 'Nộp bài',
  paywall_hit: 'Chạm cổng đăng nhập',
}

function asDate(value: { toDate?: () => Date } | Date | null | undefined): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value.toDate === 'function') return value.toDate()
  return null
}

function formatWhen(value: Date | null): string {
  return value ? value.toLocaleString('vi-VN') : '—'
}

export function Admin() {
  const { isAdmin, isConfigured } = useAuth()
  const [users, setUsers] = useState<UserRow[]>([])
  const [logs, setLogs] = useState<LogRow[]>([])
  const [tab, setTab] = useState<'users' | 'logs'>('users')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    const fb = getFirebase()
    if (!fb) return
    setLoading(true)
    setError(null)
    try {
      const [userSnap, logSnap] = await Promise.all([
        getDocs(query(collection(fb.db, 'users'), orderBy('lastLoginAt', 'desc'), limit(200))),
        getDocs(query(collection(fb.db, 'logs'), orderBy('createdAt', 'desc'), limit(300))),
      ])
      setUsers(
        userSnap.docs.map((item) => {
          const data = item.data()
          return {
            uid: item.id,
            email: data.email ?? null,
            displayName: data.displayName ?? null,
            answerCount: Number(data.answerCount ?? 0),
            examCount: Number(data.examCount ?? 0),
            loginCount: Number(data.loginCount ?? 0),
            lastLoginAt: asDate(data.lastLoginAt),
          }
        }),
      )
      setLogs(
        logSnap.docs.map((item) => {
          const data = item.data()
          return {
            id: item.id,
            email: data.email ?? null,
            event: data.event,
            createdAt: asDate(data.createdAt),
            questionId: data.questionId,
            mode: data.mode,
            passed: data.passed,
            score: data.score,
          }
        }),
      )
    } catch {
      setError(
        'Không đọc được dữ liệu. Thêm Gmail admin vào document meta/config (adminEmails) trên Firestore và deploy firestore.rules.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAdmin && isConfigured) void load()
  }, [isAdmin, isConfigured, load])

  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return {
      users: users.length,
      answers: logs.filter((row) => row.event === 'question_answered').length,
      exams: logs.filter((row) => row.event === 'exam_submitted').length,
      loginsToday: logs.filter(
        (row) => row.event === 'login' && row.createdAt && row.createdAt >= today,
      ).length,
    }
  }, [logs, users.length])

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
          Thêm Gmail của bạn vào VITE_ADMIN_EMAILS rồi đăng nhập lại.
        </p>
      </section>
    )
  }

  return (
    <>
      <div className="section-head">
        <div>
          <p className="kicker">Quản lý hệ thống</p>
          <h2>Thống kê giai đoạn thử nghiệm</h2>
        </div>
        <button className="btn ghost compact" onClick={() => void load()} disabled={loading}>
          {loading ? 'Đang tải…' : 'Làm mới'}
        </button>
      </div>

      <div className="stats admin-stats">
        <div className="stat stat-bank">
          <b>{stats.users}</b>
          <span>Người dùng</span>
        </div>
        <div className="stat stat-law">
          <b>{stats.loginsToday}</b>
          <span>Đăng nhập hôm nay</span>
        </div>
        <div className="stat stat-skill">
          <b>{stats.answers}</b>
          <span>Câu đã trả lời</span>
        </div>
        <div className="stat stat-exam">
          <b>{stats.exams}</b>
          <span>Bài thi đã nộp</span>
        </div>
      </div>

      {error ? <p className="auth-error">{error}</p> : null}

      <div className="admin-tabs">
        <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>
          Người dùng
        </button>
        <button className={tab === 'logs' ? 'active' : ''} onClick={() => setTab('logs')}>
          Nhật ký
        </button>
      </div>

      {tab === 'users' ? (
        <div className="panel table-wrap">
          {users.length === 0 ? (
            <p className="empty">Chưa có user đăng nhập Google.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Tên</th>
                  <th>Đăng nhập</th>
                  <th>Câu trả lời</th>
                  <th>Bài thi</th>
                  <th>Lần cuối</th>
                </tr>
              </thead>
              <tbody>
                {users.map((row) => (
                  <tr key={row.uid}>
                    <td>{row.email ?? '—'}</td>
                    <td>{row.displayName ?? '—'}</td>
                    <td>{row.loginCount}</td>
                    <td>{row.answerCount}</td>
                    <td>{row.examCount}</td>
                    <td>{formatWhen(row.lastLoginAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="panel table-wrap">
          {logs.length === 0 ? (
            <p className="empty">Chưa có nhật ký.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Thời điểm</th>
                  <th>Email</th>
                  <th>Sự kiện</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((row) => (
                  <tr key={row.id}>
                    <td>{formatWhen(row.createdAt)}</td>
                    <td>{row.email ?? '—'}</td>
                    <td>{EVENT_LABEL[row.event] ?? row.event}</td>
                    <td className="muted">
                      {row.mode ? `${row.mode}` : ''}
                      {row.questionId ? ` · ${row.questionId}` : ''}
                      {typeof row.score === 'number' ? ` · ${row.score}đ` : ''}
                      {row.passed === true ? ' · đạt' : row.passed === false ? ' · không đạt' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  )
}
