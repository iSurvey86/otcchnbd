'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { apiJson } from '../lib/apiClient'
import {
  CSPL_CHUNK_STATUS_LABEL,
  type CsplChunk,
  type CsplChunkStatus,
} from '../lib/csplChunk'
import { csplDocLabel, type CsplDocument } from '../lib/cspl'

type ChunkPayload = {
  document: CsplDocument
  chunks: CsplChunk[]
  summary: {
    total: number
    pending: number
    approved: number
    rejected: number
    strategy?: string
    method?: string
    textLength?: number
  }
}

export function AdminCsplChunksModal({
  document,
  onClose,
  onDocumentUpdated,
}: {
  document: CsplDocument
  onClose: () => void
  onDocumentUpdated: (doc: CsplDocument) => void
}) {
  const [doc, setDoc] = useState(document)
  const [chunks, setChunks] = useState<CsplChunk[]>([])
  const [summary, setSummary] = useState<ChunkPayload['summary'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [okMsg, setOkMsg] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [editBody, setEditBody] = useState('')
  const [filter, setFilter] = useState<'all' | CsplChunkStatus>('all')
  const onDocumentUpdatedRef = useRef(onDocumentUpdated)
  onDocumentUpdatedRef.current = onDocumentUpdated

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await apiJson<ChunkPayload>(`/api/admin/cspl/${document.id}/chunks`, {
      method: 'GET',
    })
    setLoading(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setDoc(res.data.document)
    setChunks(res.data.chunks)
    setSummary(res.data.summary)
  }, [document.id])

  useEffect(() => {
    void load()
  }, [load])

  async function onIngest(force = false) {
    setBusy(true)
    setError(null)
    setOkMsg(null)
    const res = await apiJson<ChunkPayload>(`/api/admin/cspl/${doc.id}/chunks`, {
      method: 'POST',
      body: JSON.stringify({ force }),
    })
    setBusy(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setDoc(res.data.document)
    setChunks(res.data.chunks)
    setSummary(res.data.summary)
    onDocumentUpdatedRef.current(res.data.document)
    const s = res.data.summary
    setOkMsg(
      `Đã tách ${s.total} đoạn` +
        (s.strategy ? ` (kiểu: ${s.strategy}` : '') +
        (s.method ? `${s.strategy ? ', ' : ' ('}${s.method}` : '') +
        (s.strategy || s.method ? ')' : '') +
        '.',
    )
  }

  async function patchChunk(
    chunkId: string,
    patch: { status?: CsplChunkStatus; body?: string },
  ) {
    setBusy(true)
    setError(null)
    const res = await apiJson<CsplChunk>(
      `/api/admin/cspl/${doc.id}/chunks/${chunkId}`,
      { method: 'PATCH', body: JSON.stringify(patch) },
    )
    setBusy(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setChunks((prev) => {
      const next = prev.map((c) => (c.id === chunkId ? res.data : c))
      setSummary({
        total: next.length,
        pending: next.filter((c) => c.status === 'pending').length,
        approved: next.filter((c) => c.status === 'approved').length,
        rejected: next.filter((c) => c.status === 'rejected').length,
      })
      return next
    })
    if (patch.body !== undefined) {
      setEditId(null)
      setOkMsg('Đã lưu nội dung đoạn.')
    }
  }

  async function onApproveAll() {
    setBusy(true)
    setError(null)
    const res = await apiJson<{ ok?: boolean }>(`/api/admin/cspl/${doc.id}/chunks`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'approve_all_pending' }),
    })
    setBusy(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    await load()
    setOkMsg('Đã duyệt tất cả đoạn đang chờ.')
  }

  async function onActivate() {
    setBusy(true)
    setError(null)
    const res = await apiJson<{ document: CsplDocument; summary: ChunkPayload['summary'] }>(
      `/api/admin/cspl/${doc.id}/chunks`,
      { method: 'PATCH', body: JSON.stringify({ action: 'activate' }) },
    )
    setBusy(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setDoc(res.data.document)
    setSummary(res.data.summary)
    onDocumentUpdatedRef.current(res.data.document)
    setOkMsg('Văn bản đã chuyển sang Đang dùng (active).')
  }

  const visible =
    filter === 'all' ? chunks : chunks.filter((c) => c.status === filter)

  return (
    <div
      className="modal-backdrop"
      onClick={() => !busy && onClose()}
      role="presentation"
    >
      <div
        className="feedback-modal admin-cspl-expire-modal admin-cspl-chunks-modal"
        role="dialog"
        aria-labelledby="cspl-chunks-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="cspl-chunks-title" className="feedback-modal-title">
          Đoạn CSPL — duyệt
        </h2>
        <p className="feedback-modal-meta">{csplDocLabel(doc)}</p>
        <p className="admin-cspl-expire-help">
          Tách Điều/Khoản (hoặc mục TCVN) → duyệt từng đoạn → kích hoạt. Chỉ đoạn{' '}
          <strong>Đã duyệt</strong> của VB <strong>Đang dùng</strong> mới dùng để sinh câu.
        </p>

        {summary ? (
          <p className="admin-cspl-chunk-summary">
            Tổng {summary.total} · Chờ {summary.pending} · Duyệt {summary.approved} · Loại{' '}
            {summary.rejected}
            {doc.status === 'active' ? ' · VB đang dùng' : ''}
          </p>
        ) : null}

        <div className="admin-cspl-chunk-toolbar">
          <button
            type="button"
            className="btn primary"
            disabled={busy || loading}
            onClick={() => {
              const force = doc.status === 'active'
              if (
                force &&
                !window.confirm(
                  'Văn bản đang active. Tách lại sẽ ghi đè toàn bộ đoạn. Tiếp tục?',
                )
              ) {
                return
              }
              void onIngest(force)
            }}
          >
            {chunks.length ? 'Tách lại' : 'Tách đoạn'}
          </button>
          <button
            type="button"
            className="btn ghost"
            disabled={busy || loading || !summary?.pending}
            onClick={() => void onApproveAll()}
          >
            Duyệt hết chờ
          </button>
          <button
            type="button"
            className="btn primary"
            disabled={
              busy ||
              loading ||
              !summary ||
              summary.pending > 0 ||
              summary.approved < 1 ||
              doc.status === 'active'
            }
            onClick={() => void onActivate()}
          >
            Đưa vào dùng
          </button>
          <label className="admin-cspl-chunk-filter">
            Lọc
            <select
              className="admin-cspl-input"
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as 'all' | CsplChunkStatus)
              }
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Loại</option>
            </select>
          </label>
        </div>

        {error ? <p className="form-error">{error}</p> : null}
        {okMsg ? <p className="form-ok">{okMsg}</p> : null}

        {loading ? (
          <p className="muted">Đang tải danh sách đoạn…</p>
        ) : busy && chunks.length === 0 ? (
          <p className="muted">
            Đang tách đoạn từ file gốc — văn bản dài có thể mất 30–90 giây, vui lòng đợi.
          </p>
        ) : visible.length === 0 ? (
          <p className="muted">
            {chunks.length === 0
              ? 'Chưa có đoạn. Bấm «Tách đoạn» để bắt đầu.'
              : 'Không có đoạn theo bộ lọc.'}
          </p>
        ) : (
          <ul className="admin-cspl-chunk-list">
            {visible.map((c) => (
              <li key={c.id} className={`admin-cspl-chunk-item status-${c.status}`}>
                <div className="admin-cspl-chunk-head">
                  <strong>{c.citeLabel}</strong>
                  <span className={`admin-chip admin-cspl-chunk-chip-${c.status}`}>
                    {CSPL_CHUNK_STATUS_LABEL[c.status]}
                  </span>
                  <span className="admin-cspl-sub">{c.charCount} ký tự</span>
                </div>
                {editId === c.id ? (
                  <textarea
                    className="admin-cspl-input admin-cspl-textarea"
                    rows={6}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                  />
                ) : (
                  <p className="admin-cspl-chunk-body">{c.body}</p>
                )}
                <div className="admin-cspl-chunk-actions">
                  {editId === c.id ? (
                    <>
                      <button
                        type="button"
                        className="btn primary compact"
                        disabled={busy}
                        onClick={() => void patchChunk(c.id, { body: editBody })}
                      >
                        Lưu
                      </button>
                      <button
                        type="button"
                        className="btn ghost compact"
                        disabled={busy}
                        onClick={() => setEditId(null)}
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      {c.status !== 'approved' ? (
                        <button
                          type="button"
                          className="btn primary compact"
                          disabled={busy}
                          onClick={() => void patchChunk(c.id, { status: 'approved' })}
                        >
                          Duyệt
                        </button>
                      ) : null}
                      {c.status !== 'rejected' ? (
                        <button
                          type="button"
                          className="btn ghost compact"
                          disabled={busy}
                          onClick={() => void patchChunk(c.id, { status: 'rejected' })}
                        >
                          Loại
                        </button>
                      ) : null}
                      {c.status === 'rejected' ? (
                        <button
                          type="button"
                          className="btn ghost compact"
                          disabled={busy}
                          onClick={() => void patchChunk(c.id, { status: 'pending' })}
                        >
                          Để chờ lại
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="btn ghost compact"
                        disabled={busy}
                        onClick={() => {
                          setEditId(c.id)
                          setEditBody(c.body)
                        }}
                      >
                        Sửa chữ
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="admin-cspl-expire-actions">
          <button
            type="button"
            className="btn ghost"
            disabled={busy}
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
