'use client'

import { useCallback, useEffect, useState } from 'react'
import { getFirebaseAuth } from '../lib/firebase'
import { apiJson } from '../lib/apiClient'
import { CSPL_PILOT_SECTOR } from '../lib/cspl'
import {
  CSPL_PACK_Q_STATUS_LABEL,
  CSPL_PACK_STATUS_LABEL,
  defaultPackPeriod,
  type CsplMonthlyPack,
  type CsplPackQuestion,
} from '../lib/csplPack'

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

export function AdminCsplPackPanel() {
  const [packs, setPacks] = useState<CsplMonthlyPack[]>([])
  const [period, setPeriod] = useState(defaultPackPeriod())
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activePackId, setActivePackId] = useState<string | null>(null)
  const [pack, setPack] = useState<CsplMonthlyPack | null>(null)
  const [questions, setQuestions] = useState<CsplPackQuestion[]>([])
  const [filter, setFilter] = useState<'all' | 'draft' | 'approved' | 'rejected'>(
    'all',
  )
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const loadPacks = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await apiJson<CsplMonthlyPack[]>(
      `/api/admin/cspl/packs?sector=${CSPL_PILOT_SECTOR}`,
      { method: 'GET' },
    )
    setLoading(false)
    if (!res.ok) {
      setError(res.error)
      setPacks([])
      return
    }
    setPacks(res.data)
  }, [])

  const loadPackDetail = useCallback(async (id: string) => {
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
      const res = await fetch(`/api/admin/cspl/packs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = (await res.json().catch(() => ({}))) as {
        error?: string
        data?: { pack: CsplMonthlyPack; questions: CsplPackQuestion[] }
      }
      if (!res.ok || !json.data) {
        setError(json.error || `Lỗi ${res.status}`)
        return
      }
      setActivePackId(id)
      setPack(json.data.pack)
      setQuestions(json.data.questions)
    } catch {
      setError('Không kết nối được máy chủ.')
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    void loadPacks()
  }, [loadPacks])

  async function onCreatePack() {
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
      const res = await fetch('/api/admin/cspl/packs', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sector: CSPL_PILOT_SECTOR, period }),
      })
      const json = (await res.json().catch(() => ({}))) as {
        error?: string
        data?: CsplMonthlyPack
      }
      if (!res.ok || !json.data) {
        setError(json.error || `Lỗi ${res.status}`)
        return
      }
      await loadPacks()
      await loadPackDetail(json.data.id)
    } catch {
      setError('Không kết nối được máy chủ.')
    } finally {
      setBusy(false)
    }
  }

  async function onGenerate(batch = 5) {
    if (!activePackId) return
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
      const res = await fetch(`/api/admin/cspl/packs/${activePackId}/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: batch }),
      })
      const json = (await res.json().catch(() => ({}))) as {
        error?: string
        parseErrors?: string[]
        meta?: { saved?: number }
      }
      if (!res.ok) {
        setError(
          json.error ||
            (json.parseErrors?.length ? json.parseErrors[0] : `Lỗi ${res.status}`),
        )
        return
      }
      await loadPackDetail(activePackId)
      await loadPacks()
    } catch {
      setError('Không kết nối được máy chủ.')
    } finally {
      setBusy(false)
    }
  }

  async function patchQuestion(
    questionId: string,
    body: {
      status?: 'draft' | 'approved' | 'rejected'
      multiSourceOk?: boolean
    },
  ) {
    if (!activePackId) return
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
      const res = await fetch(
        `/api/admin/cspl/packs/${activePackId}/questions/${questionId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      )
      const json = (await res.json().catch(() => ({}))) as {
        error?: string
        data?: CsplPackQuestion
      }
      if (!res.ok || !json.data) {
        setError(json.error || `Lỗi ${res.status}`)
        return
      }
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? json.data! : q)),
      )
      await loadPacks()
    } catch {
      setError('Không kết nối được máy chủ.')
    } finally {
      setBusy(false)
    }
  }

  const visible = questions.filter(
    (q) => filter === 'all' || q.status === filter,
  )
  const counts = pack?.questionCounts

  return (
    <div className="admin-cspl-pack">
      <section className="panel admin-panel admin-cspl-card">
        <header className="admin-cspl-card-head">
          <h2 className="admin-cspl-title">Pack câu hỏi tháng — Đo đạc</h2>
        </header>
        <p className="admin-cspl-expire-help">
          Chỉ sinh từ chunk <strong>Đã duyệt</strong> của VB <strong>Đang dùng</strong>.
          AI điền template 4 mục; Admin duyệt từng câu. Publish 01 00:00 chưa bật (MVP).
        </p>
        <div className="admin-cspl-pack-toolbar">
          <label className="admin-cspl-field">
            <span>Tháng (YYYY-MM)</span>
            <input
              className="admin-cspl-input"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="2026-10"
            />
          </label>
          <button
            type="button"
            className="btn primary"
            disabled={busy}
            onClick={() => void onCreatePack()}
          >
            Tạo / mở pack
          </button>
        </div>
        {error ? <p className="auth-error admin-cspl-msg">{error}</p> : null}
      </section>

      <section className="panel admin-panel admin-cspl-card">
        <header className="admin-cspl-card-head">
          <h2 className="admin-cspl-title">Danh sách pack</h2>
          <span className="admin-cspl-count">{packs.length} pack</span>
        </header>
        {loading ? (
          <p className="lead">Đang tải…</p>
        ) : packs.length === 0 ? (
          <p className="lead">Chưa có pack. Chọn tháng rồi Tạo / mở pack.</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table admin-table-logs">
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Trạng thái</th>
                  <th>Câu</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {packs.map((p) => (
                  <tr
                    key={p.id}
                    className={
                      activePackId === p.id ? 'admin-cspl-pack-row-active' : undefined
                    }
                  >
                    <td className="admin-cspl-col-sohieu">
                      <strong>{p.period}</strong>
                    </td>
                    <td>{CSPL_PACK_STATUS_LABEL[p.status]}</td>
                    <td>
                      {p.questionCounts
                        ? `${p.questionCounts.approved} duyệt / ${p.questionCounts.draft} nháp / ${p.questionCounts.total} tổng (min ${p.minQuestions})`
                        : '—'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn ghost compact"
                        disabled={busy}
                        onClick={() => void loadPackDetail(p.id)}
                      >
                        Mở
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pack ? (
        <section className="panel admin-panel admin-cspl-card">
          <header className="admin-cspl-card-head">
            <h2 className="admin-cspl-title">Pack {pack.period}</h2>
            <span className="admin-cspl-count">
              {CSPL_PACK_STATUS_LABEL[pack.status]}
              {counts
                ? ` · ${counts.approved}/${pack.minQuestions} đã duyệt`
                : ''}
            </span>
          </header>

          <div className="admin-cspl-pack-toolbar">
            <button
              type="button"
              className="btn primary"
              disabled={busy}
              onClick={() => void onGenerate(5)}
            >
              {busy ? 'Đang xử lý…' : 'Sinh +5 câu AI'}
            </button>
            <button
              type="button"
              className="btn ghost"
              disabled={busy}
              onClick={() => void onGenerate(3)}
            >
              +3 câu
            </button>
            <select
              className="admin-cspl-input admin-cspl-pack-filter"
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as typeof filter)
              }
            >
              <option value="all">Tất cả</option>
              <option value="draft">Nháp</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Loại</option>
            </select>
          </div>

          {visible.length === 0 ? (
            <p className="lead">Chưa có câu. Bấm Sinh +5 câu AI (cần chunk active).</p>
          ) : (
            <ul className="admin-cspl-pack-q-list">
              {visible.map((q, idx) => {
                const open = expandedId === q.id
                const needsTick = q.sources.some((s) => s.multiSourceSuggested)
                return (
                  <li key={q.id} className="admin-cspl-pack-q">
                    <div className="admin-cspl-pack-q-head">
                      <button
                        type="button"
                        className="admin-cspl-pack-q-toggle"
                        onClick={() =>
                          setExpandedId(open ? null : q.id)
                        }
                      >
                        <strong>
                          #{idx + 1} · {CSPL_PACK_Q_STATUS_LABEL[q.status]} ·{' '}
                          {q.section === 'phap-luat' ? 'PL' : 'KN'} · {q.stemType}
                        </strong>
                        <span className="admin-cspl-sub">{q.prompt}</span>
                      </button>
                      <div className="admin-cspl-row-actions">
                        {q.status !== 'approved' ? (
                          <button
                            type="button"
                            className="btn ghost compact"
                            disabled={busy}
                            onClick={() =>
                              void patchQuestion(q.id, { status: 'approved' })
                            }
                          >
                            Duyệt
                          </button>
                        ) : null}
                        {q.status !== 'rejected' ? (
                          <button
                            type="button"
                            className="btn ghost compact"
                            disabled={busy}
                            onClick={() =>
                              void patchQuestion(q.id, { status: 'rejected' })
                            }
                          >
                            Loại
                          </button>
                        ) : null}
                        {q.status !== 'draft' ? (
                          <button
                            type="button"
                            className="btn ghost compact"
                            disabled={busy}
                            onClick={() =>
                              void patchQuestion(q.id, { status: 'draft' })
                            }
                          >
                            Về nháp
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {open ? (
                      <div className="admin-cspl-pack-q-body">
                        <ol className="admin-cspl-pack-options">
                          {q.options.map((opt, i) => (
                            <li
                              key={i}
                              className={
                                i === q.answer
                                  ? 'admin-cspl-pack-opt-correct'
                                  : undefined
                              }
                            >
                              <strong>{OPTION_LABELS[i]}.</strong> {opt}
                            </li>
                          ))}
                        </ol>
                        <pre className="admin-cspl-pack-expl">{q.explanation}</pre>
                        <p className="admin-cspl-sub">
                          Cite:{' '}
                          {q.sources
                            .map((s) => `${s.soHieu} — ${s.citeLabel}`)
                            .join(' · ')}
                          {needsTick ? ' · AI đề xuất đa nguồn' : ''}
                        </p>
                        {needsTick ? (
                          <label className="admin-cspl-pack-tick">
                            <input
                              type="checkbox"
                              checked={q.multiSourceOk}
                              disabled={busy}
                              onChange={(e) =>
                                void patchQuestion(q.id, {
                                  multiSourceOk: e.target.checked,
                                })
                              }
                            />
                            Admin tick đa nguồn
                          </label>
                        ) : null}
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  )
}
