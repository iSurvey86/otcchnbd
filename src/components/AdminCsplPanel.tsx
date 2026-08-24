'use client'

import { useCallback, useEffect, useId, useState, type FormEvent } from 'react'
import { getFirebaseAuth } from '../lib/firebase'
import {
  CSPL_DOC_TYPE_LABEL,
  CSPL_LEGAL_STATUS_LABEL,
  CSPL_MAX_BYTES,
  CSPL_PILOT_SECTOR,
  CSPL_SECTOR_LABEL,
  csplDocLabel,
  type CsplDocType,
  type CsplDocument,
} from '../lib/cspl'
import { apiJson } from '../lib/apiClient'
import type { CsplScanResult } from '../lib/csplScan'

const DOC_TYPE_OPTIONS = Object.entries(CSPL_DOC_TYPE_LABEL) as [
  CsplDocType,
  string,
][]

function formatBytes(n: number | null): string {
  if (n == null || n <= 0) return '–'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function formatWhen(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '–'
  return d.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function IconPencil() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 2.33H5v-.92l9.06-9.06.92.92L5.92 19.58zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
      />
    </svg>
  )
}

export function AdminCsplPanel({
  onDocumentsChange,
}: {
  onDocumentsChange?: (docs: CsplDocument[]) => void
}) {
  const fileInputId = useId()
  const [rows, setRows] = useState<CsplDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [okMsg, setOkMsg] = useState<string | null>(null)
  const [scanHint, setScanHint] = useState<string | null>(null)

  const [docType, setDocType] = useState<CsplDocType>('nghi-dinh')
  const [soHieu, setSoHieu] = useState('')
  const [title, setTitle] = useState('')
  const [issuedOn, setIssuedOn] = useState('')
  const [effectiveOn, setEffectiveOn] = useState('')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [expireTarget, setExpireTarget] = useState<CsplDocument | null>(null)
  const [expireOn, setExpireOn] = useState('')
  const [replacedById, setReplacedById] = useState('')
  const [expireNote, setExpireNote] = useState('')
  const [expiring, setExpiring] = useState(false)
  const [appendixTarget, setAppendixTarget] = useState<CsplDocument | null>(null)
  const [appendixFile, setAppendixFile] = useState<File | null>(null)
  const [appendixTen, setAppendixTen] = useState('')
  const [appendixBusy, setAppendixBusy] = useState(false)
  const [editTarget, setEditTarget] = useState<CsplDocument | null>(null)
  const [editDocType, setEditDocType] = useState<CsplDocType>('nghi-dinh')
  const [editSoHieu, setEditSoHieu] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editIssuedOn, setEditIssuedOn] = useState('')
  const [editEffectiveOn, setEditEffectiveOn] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editBusy, setEditBusy] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await apiJson<CsplDocument[]>(
      `/api/admin/cspl?sector=${CSPL_PILOT_SECTOR}&limit=100`,
      { method: 'GET' },
    )
    setLoading(false)
    if (!res.ok) {
      setError(res.error)
      onDocumentsChange?.([])
      return
    }
    setRows(res.data)
    onDocumentsChange?.(res.data)
  }, [onDocumentsChange])

  useEffect(() => {
    void load()
  }, [load])

  async function onScanAi() {
    setOkMsg(null)
    setError(null)
    setScanHint(null)
    if (!file) {
      setError('Chọn file trước, rồi bấm Quét.')
      return
    }
    const auth = getFirebaseAuth()
    const user = auth?.currentUser
    if (!user) {
      setError('Chưa đăng nhập.')
      return
    }

    setScanning(true)
    try {
      const token = await user.getIdToken()
      const body = new FormData()
      body.set('file', file)
      const res = await fetch('/api/admin/cspl/scan', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      })
      const json = (await res.json().catch(() => ({}))) as {
        error?: string
        data?: CsplScanResult
      }
      if (!res.ok || !json.data) {
        setError(json.error || `Quét thất bại (${res.status})`)
        return
      }
      const d = json.data
      if (d.docType) setDocType(d.docType)
      if (d.soHieu) setSoHieu(d.soHieu)
      if (d.title) setTitle(d.title)
      if (d.issuedOn) setIssuedOn(d.issuedOn)
      if (d.effectiveOn) setEffectiveOn(d.effectiveOn)
      if (d.coQuanBanHanh) {
        setNotes((prev) => {
          const line = `Cơ quan: ${d.coQuanBanHanh}`
          if (!prev.trim()) return line
          if (prev.includes(d.coQuanBanHanh)) return prev
          return `${line}\n${prev}`
        })
      }
      const hints = [
        d.sources.issuedOn ? `Ngày BH — ${d.sources.issuedOn}` : '',
        d.sources.effectiveOn ? `Ngày HL — ${d.sources.effectiveOn}` : '',
        d.warning ? d.warning : '',
      ].filter(Boolean)
      setScanHint(
        hints.length
          ? hints.join(' · ')
          : 'Đã nhận dạng. Kiểm tra các trường trước khi lưu.',
      )
      setOkMsg(null)
    } catch {
      setError('Không kết nối được máy chủ khi quét AI.')
    } finally {
      setScanning(false)
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setOkMsg(null)
    setError(null)
    if (!file) {
      setError('Chọn file PDF hoặc Word.')
      return
    }
    if (!soHieu.trim()) {
      setError('Nhập số hiệu văn bản.')
      return
    }
    if (file.size > CSPL_MAX_BYTES) {
      setError(`File vượt quá ${Math.round(CSPL_MAX_BYTES / (1024 * 1024))} MB.`)
      return
    }

    const auth = getFirebaseAuth()
    const user = auth?.currentUser
    if (!user) {
      setError('Chưa đăng nhập.')
      return
    }

    setUploading(true)
    try {
      const token = await user.getIdToken()
      const body = new FormData()
      body.set('sector', CSPL_PILOT_SECTOR)
      body.set('docType', docType)
      body.set('soHieu', soHieu.trim())
      if (title.trim()) body.set('title', title.trim())
      if (issuedOn) body.set('issuedOn', issuedOn)
      if (effectiveOn) body.set('effectiveOn', effectiveOn)
      if (notes.trim()) body.set('notes', notes.trim())
      body.set('file', file)

      const res = await fetch('/api/admin/cspl', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      })
      const json = (await res.json().catch(() => ({}))) as {
        error?: string
        data?: CsplDocument
      }
      if (!res.ok) {
        setError(json.error || `Lỗi ${res.status}`)
        return
      }
      setSoHieu('')
      setTitle('')
      setIssuedOn('')
      setEffectiveOn('')
      setNotes('')
      setFile(null)
      setScanHint(null)
      await load()
    } catch {
      setError('Không kết nối được máy chủ.')
    } finally {
      setUploading(false)
    }
  }

  async function onExpireSave() {
    if (!expireTarget) return
    setError(null)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expireOn)) {
      setError('Chọn ngày hết hiệu lực.')
      return
    }
    const auth = getFirebaseAuth()
    const user = auth?.currentUser
    if (!user) {
      setError('Chưa đăng nhập.')
      return
    }
    setExpiring(true)
    try {
      const token = await user.getIdToken()
      const res = await fetch(`/api/admin/cspl/${expireTarget.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'expire',
          expiredOn: expireOn,
          replacedById: replacedById || null,
          expireNote: expireNote.trim() || null,
        }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(json.error || `Lỗi ${res.status}`)
        return
      }
      setExpireTarget(null)
      setExpireOn('')
      setReplacedById('')
      setExpireNote('')
      setOkMsg(`Đã đánh dấu hết HL: ${expireTarget.soHieu}`)
      await load()
    } catch {
      setError('Không kết nối được máy chủ.')
    } finally {
      setExpiring(false)
    }
  }

  async function onAddAppendix() {
    if (!appendixTarget || !appendixFile) {
      setError('Chọn file phụ lục / phần Công báo.')
      return
    }
    const auth = getFirebaseAuth()
    const user = auth?.currentUser
    if (!user) {
      setError('Chưa đăng nhập.')
      return
    }
    setAppendixBusy(true)
    setError(null)
    try {
      const token = await user.getIdToken()
      const body = new FormData()
      body.set('file', appendixFile)
      if (appendixTen.trim()) body.set('ten', appendixTen.trim())
      const res = await fetch(`/api/admin/cspl/${appendixTarget.id}/attachments`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      })
      const json = (await res.json().catch(() => ({}))) as {
        error?: string
        data?: CsplDocument
      }
      if (!res.ok || !json.data) {
        setError(json.error || `Lỗi ${res.status}`)
        return
      }
      setAppendixFile(null)
      setAppendixTen('')
      setAppendixTarget(json.data)
      setOkMsg(`Đã thêm phụ lục cho ${json.data.soHieu}`)
      await load()
    } catch {
      setError('Không kết nối được máy chủ.')
    } finally {
      setAppendixBusy(false)
    }
  }

  async function onRemoveAppendix(appendixId: string) {
    if (!appendixTarget) return
    if (!window.confirm('Xóa phụ lục này khỏi văn bản?')) return
    const auth = getFirebaseAuth()
    const user = auth?.currentUser
    if (!user) {
      setError('Chưa đăng nhập.')
      return
    }
    setAppendixBusy(true)
    setError(null)
    try {
      const token = await user.getIdToken()
      const res = await fetch(
        `/api/admin/cspl/${appendixTarget.id}/attachments?appendixId=${encodeURIComponent(appendixId)}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      const json = (await res.json().catch(() => ({}))) as {
        error?: string
        data?: CsplDocument
      }
      if (!res.ok || !json.data) {
        setError(json.error || `Lỗi ${res.status}`)
        return
      }
      setAppendixTarget(json.data)
      await load()
    } catch {
      setError('Không kết nối được máy chủ.')
    } finally {
      setAppendixBusy(false)
    }
  }

  async function onEditSave() {
    if (!editTarget) return
    if (!editSoHieu.trim()) {
      setError('Nhập số hiệu văn bản.')
      return
    }
    const auth = getFirebaseAuth()
    const user = auth?.currentUser
    if (!user) {
      setError('Chưa đăng nhập.')
      return
    }
    setEditBusy(true)
    setError(null)
    try {
      const token = await user.getIdToken()
      const res = await fetch(`/api/admin/cspl/${editTarget.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          soHieu: editSoHieu.trim(),
          docType: editDocType,
          title: editTitle.trim() || null,
          issuedOn: editIssuedOn || null,
          effectiveOn: editEffectiveOn || null,
          notes: editNotes.trim() || null,
        }),
      })
      const json = (await res.json().catch(() => ({}))) as {
        error?: string
        data?: CsplDocument
      }
      if (!res.ok || !json.data) {
        setError(json.error || `Lỗi ${res.status}`)
        return
      }
      setEditTarget(null)
      setOkMsg(`Đã cập nhật: ${json.data.soHieu}`)
      await load()
    } catch {
      setError('Không kết nối được máy chủ.')
    } finally {
      setEditBusy(false)
    }
  }

  async function onDeleteDoc(row: CsplDocument) {
    if (
      !window.confirm(
        `Xóa văn bản ${row.soHieu}?\n\nSẽ xóa luôn file gốc và phụ lục trên Storage. Không hoàn tác.`,
      )
    ) {
      return
    }
    const auth = getFirebaseAuth()
    const user = auth?.currentUser
    if (!user) {
      setError('Chưa đăng nhập.')
      return
    }
    setDeletingId(row.id)
    setError(null)
    setOkMsg(null)
    try {
      const token = await user.getIdToken()
      const res = await fetch(`/api/admin/cspl/${row.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(json.error || `Lỗi ${res.status}`)
        return
      }
      if (editTarget?.id === row.id) setEditTarget(null)
      if (appendixTarget?.id === row.id) setAppendixTarget(null)
      if (expireTarget?.id === row.id) setExpireTarget(null)
      setOkMsg(`Đã xóa: ${row.soHieu}`)
      await load()
    } catch {
      setError('Không kết nối được máy chủ.')
    } finally {
      setDeletingId(null)
    }
  }

  function openEdit(row: CsplDocument) {
    setEditTarget(row)
    setEditDocType(row.docType)
    setEditSoHieu(row.soHieu)
    setEditTitle(row.title || '')
    setEditIssuedOn(row.issuedOn || '')
    setEditEffectiveOn(row.effectiveOn || '')
    setEditNotes(row.notes || '')
    setError(null)
  }

  const replacementChoices = rows.filter(
    (r) =>
      r.id !== expireTarget?.id && r.legalStatus === 'con_hieu_luc',
  )

  return (
    <div className="admin-cspl">
      <section className="panel admin-panel admin-cspl-card">
        <header className="admin-cspl-card-head">
          <h2 className="admin-cspl-title">
            Lĩnh vực: {CSPL_SECTOR_LABEL[CSPL_PILOT_SECTOR]}
          </h2>
        </header>

        <form className="admin-cspl-form" onSubmit={onSubmit}>
          <div className="admin-cspl-scan">
            <div className="admin-cspl-scan-top">
              <label className="admin-cspl-file" htmlFor={fileInputId}>
                <input
                  id={fileInputId}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null)
                    setScanHint(null)
                    setOkMsg(null)
                    setError(null)
                  }}
                />
                <span className="admin-cspl-file-btn">Chọn file</span>
                <span className="admin-cspl-file-name">
                  {file
                    ? `${file.name} (${formatBytes(file.size)})`
                    : `Chưa chọn · tối đa ${Math.round(CSPL_MAX_BYTES / (1024 * 1024))} MB`}
                </span>
              </label>
              <button
                type="button"
                className="admin-cspl-scan-btn"
                disabled={!file || scanning || uploading}
                onClick={() => void onScanAi()}
              >
                {scanning ? 'Đang quét…' : 'Quét'}
              </button>
            </div>

            {scanHint ? <p className="admin-cspl-scan-hint">{scanHint}</p> : null}
          </div>

          <div className="admin-cspl-grid">
            <label className="admin-cspl-field">
              <span>Số hiệu *</span>
              <input
                className="admin-cspl-input"
                value={soHieu}
                onChange={(e) => {
                  setSoHieu(e.target.value)
                  setOkMsg(null)
                }}
                placeholder="96/2024/NĐ-CP"
                required
              />
            </label>

            <label className="admin-cspl-field">
              <span>Loại văn bản *</span>
              <select
                className="admin-cspl-input"
                value={docType}
                onChange={(e) => setDocType(e.target.value as CsplDocType)}
              >
                {DOC_TYPE_OPTIONS.map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-cspl-field">
              <span>Ngày ban hành</span>
              <input
                type="date"
                className="admin-cspl-input"
                value={issuedOn}
                onChange={(e) => setIssuedOn(e.target.value)}
              />
            </label>

            <label className="admin-cspl-field">
              <span>Ngày hiệu lực</span>
              <input
                type="date"
                className="admin-cspl-input"
                value={effectiveOn}
                onChange={(e) => setEffectiveOn(e.target.value)}
              />
            </label>

            <label className="admin-cspl-field admin-cspl-field-half">
              <span>Nội dung / trích yếu</span>
              <textarea
                className="admin-cspl-input admin-cspl-textarea"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nghị định số … ngày … của …: [trích yếu]"
                rows={3}
              />
            </label>

            <label className="admin-cspl-field admin-cspl-field-half">
              <span>Ghi chú nội bộ</span>
              <textarea
                className="admin-cspl-input admin-cspl-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Cơ quan ban hành, ghi chú…"
                rows={3}
              />
            </label>
          </div>

          {error ? <p className="auth-error admin-cspl-msg">{error}</p> : null}
          {okMsg ? <p className="admin-cspl-ok admin-cspl-msg">{okMsg}</p> : null}

          <div className="admin-cspl-footer">
            <button
              type="submit"
              className="btn primary"
              disabled={uploading || scanning}
            >
              {uploading ? 'Đang tải lên…' : 'Lưu / Upload'}
            </button>
          </div>
        </form>
      </section>

      <section className="panel admin-panel admin-cspl-card">
        <header className="admin-cspl-card-head">
          <h2 className="admin-cspl-title">Văn bản đã tải</h2>
          <span className="admin-cspl-count">{rows.length} mục</span>
        </header>
        {loading ? (
          <p className="lead">Đang tải…</p>
        ) : rows.length === 0 ? (
          <p className="lead">Chưa có văn bản. Upload file đầu tiên ở form trên.</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table admin-table-logs">
              <thead>
                <tr>
                  <th className="admin-cspl-col-sohieu">Số hiệu</th>
                  <th>Hiệu lực</th>
                  <th>File gốc</th>
                  <th>Phụ lục</th>
                  <th>Ngày tải</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const repl = row.replacedById
                    ? rows.find((r) => r.id === row.replacedById)
                    : undefined
                  return (
                    <tr key={row.id}>
                      <td className="admin-cspl-col-sohieu">
                        <strong>{row.soHieu}</strong>
                        {row.title ? (
                          <div className="admin-cspl-sub">{row.title}</div>
                        ) : null}
                        {row.legalStatus === 'het_hieu_luc' && repl ? (
                          <div className="admin-cspl-sub">
                            Thay thế bởi: {repl.soHieu}
                          </div>
                        ) : null}
                      </td>
                      <td>
                        <span
                          className={`admin-chip ${
                            row.legalStatus === 'het_hieu_luc'
                              ? 'admin-cspl-hl-off'
                              : 'admin-cspl-hl-on'
                          }`}
                        >
                          {CSPL_LEGAL_STATUS_LABEL[row.legalStatus]}
                        </span>
                        {row.expiredOn ? (
                          <div className="admin-cspl-sub">Hết: {row.expiredOn}</div>
                        ) : null}
                      </td>
                      <td>
                        {row.originalFilename || '–'}
                        <div className="admin-cspl-sub">{formatBytes(row.byteSize)}</div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn ghost compact"
                          onClick={() => {
                            setAppendixTarget(row)
                            setAppendixFile(null)
                            setAppendixTen('')
                            setError(null)
                          }}
                        >
                          {row.appendices.length > 0
                            ? `📎 ${row.appendices.length}`
                            : '+ Thêm'}
                        </button>
                      </td>
                      <td>{formatWhen(row.createdAt)}</td>
                      <td>
                        <div className="admin-cspl-row-actions">
                          <button
                            type="button"
                            className="admin-cspl-icon-btn"
                            title="Sửa"
                            aria-label="Sửa"
                            disabled={deletingId === row.id}
                            onClick={() => openEdit(row)}
                          >
                            <IconPencil />
                          </button>
                          <button
                            type="button"
                            className="admin-cspl-icon-btn admin-cspl-icon-btn-danger"
                            title="Xóa"
                            aria-label="Xóa"
                            disabled={deletingId === row.id}
                            onClick={() => void onDeleteDoc(row)}
                          >
                            {deletingId === row.id ? '…' : <IconTrash />}
                          </button>
                          {row.legalStatus === 'con_hieu_luc' ? (
                            <button
                              type="button"
                              className="btn ghost compact"
                              disabled={deletingId === row.id}
                              onClick={() => {
                                setExpireTarget(row)
                                setExpireOn(
                                  new Date().toISOString().slice(0, 10),
                                )
                                setReplacedById('')
                                setExpireNote('')
                                setError(null)
                              }}
                            >
                              Hết HL
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editTarget ? (
        <div
          className="modal-backdrop"
          onClick={() => !editBusy && setEditTarget(null)}
          role="presentation"
        >
          <div
            className="feedback-modal admin-cspl-expire-modal"
            role="dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="feedback-modal-title">Sửa văn bản</h2>
            <p className="feedback-modal-meta">
              File gốc giữ nguyên. Đổi file: xóa rồi upload lại, hoặc thêm phụ lục.
            </p>

            <div className="admin-cspl-grid">
              <label className="admin-cspl-field">
                <span>Số hiệu *</span>
                <input
                  className="admin-cspl-input"
                  value={editSoHieu}
                  onChange={(e) => setEditSoHieu(e.target.value)}
                  required
                />
              </label>
              <label className="admin-cspl-field">
                <span>Loại văn bản *</span>
                <select
                  className="admin-cspl-input"
                  value={editDocType}
                  onChange={(e) =>
                    setEditDocType(e.target.value as CsplDocType)
                  }
                >
                  {DOC_TYPE_OPTIONS.map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-cspl-field">
                <span>Ngày ban hành</span>
                <input
                  type="date"
                  className="admin-cspl-input"
                  value={editIssuedOn}
                  onChange={(e) => setEditIssuedOn(e.target.value)}
                />
              </label>
              <label className="admin-cspl-field">
                <span>Ngày hiệu lực</span>
                <input
                  type="date"
                  className="admin-cspl-input"
                  value={editEffectiveOn}
                  onChange={(e) => setEditEffectiveOn(e.target.value)}
                />
              </label>
              <label className="admin-cspl-field admin-cspl-field-half">
                <span>Nội dung / trích yếu</span>
                <textarea
                  className="admin-cspl-input admin-cspl-textarea"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  rows={3}
                />
              </label>
              <label className="admin-cspl-field admin-cspl-field-half">
                <span>Ghi chú nội bộ</span>
                <textarea
                  className="admin-cspl-input admin-cspl-textarea"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                />
              </label>
            </div>

            <div className="admin-cspl-expire-actions">
              <button
                type="button"
                className="btn ghost"
                disabled={editBusy}
                onClick={() => setEditTarget(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn primary"
                disabled={editBusy || !editSoHieu.trim()}
                onClick={() => void onEditSave()}
              >
                {editBusy ? 'Đang lưu…' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {appendixTarget ? (
        <div
          className="modal-backdrop"
          onClick={() => !appendixBusy && setAppendixTarget(null)}
          role="presentation"
        >
          <div
            className="feedback-modal admin-cspl-expire-modal"
            role="dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="feedback-modal-title">Phụ lục / phần Công báo</h2>
            <p className="feedback-modal-meta">{csplDocLabel(appendixTarget)}</p>
            <p className="admin-cspl-expire-help">
              Cùng một văn bản (một số hiệu). File gốc đã lưu; thêm lần lượt các phần
              còn lại / phụ lục. Hệ thống gắn tất cả vào bản ghi này để tham chiếu sau.
            </p>

            {appendixTarget.appendices.length > 0 ? (
              <ul className="admin-cspl-appendix-list">
                {appendixTarget.appendices.map((pl) => (
                  <li key={pl.id}>
                    <div>
                      <strong>
                        {pl.thuTu}. {pl.ten}
                      </strong>
                      <div className="admin-cspl-sub">
                        {pl.fileTenGoc || pl.path}
                        {pl.byteSize != null ? ` · ${formatBytes(pl.byteSize)}` : ''}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn ghost compact"
                      disabled={appendixBusy}
                      onClick={() => void onRemoveAppendix(pl.id)}
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-cspl-sub">Chưa có phụ lục.</p>
            )}

            <label className="admin-cspl-field">
              <span>Tên phần (tuỳ chọn)</span>
              <input
                className="admin-cspl-input"
                value={appendixTen}
                onChange={(e) => setAppendixTen(e.target.value)}
                placeholder="VD: Phần 2 — Điều khoản thi hành / Phụ lục I"
              />
            </label>

            <label className="admin-cspl-field">
              <span>File PDF / Word *</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setAppendixFile(e.target.files?.[0] ?? null)}
              />
              {appendixFile ? (
                <span className="admin-cspl-sub">
                  {appendixFile.name} ({formatBytes(appendixFile.size)})
                </span>
              ) : null}
            </label>

            <div className="admin-cspl-expire-actions">
              <button
                type="button"
                className="btn ghost"
                disabled={appendixBusy}
                onClick={() => setAppendixTarget(null)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn primary"
                disabled={appendixBusy || !appendixFile}
                onClick={() => void onAddAppendix()}
              >
                {appendixBusy ? 'Đang tải…' : 'Thêm phụ lục'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {expireTarget ? (
        <div
          className="modal-backdrop"
          onClick={() => !expiring && setExpireTarget(null)}
          role="presentation"
        >
          <div
            className="feedback-modal admin-cspl-expire-modal"
            role="dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="feedback-modal-title">Đánh dấu hết hiệu lực</h2>
            <p className="feedback-modal-meta">
              {csplDocLabel(expireTarget)}
            </p>
            <p className="admin-cspl-expire-help">
              Upload văn bản mới trước (nếu có), rồi chọn làm văn bản thay thế. Không
              xóa dòng cũ — giữ để tra cứu.
            </p>

            <label className="admin-cspl-field">
              <span>Ngày hết hiệu lực *</span>
              <input
                type="date"
                className="admin-cspl-input"
                value={expireOn}
                onChange={(e) => setExpireOn(e.target.value)}
              />
            </label>

            <label className="admin-cspl-field">
              <span>Văn bản thay thế</span>
              <select
                className="admin-cspl-input"
                value={replacedById}
                onChange={(e) => setReplacedById(e.target.value)}
              >
                <option value="">— Chưa chọn / không có —</option>
                {replacementChoices.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.soHieu}
                    {r.title ? ` — ${r.title.slice(0, 60)}` : ''}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-cspl-field">
              <span>Ghi chú</span>
              <input
                className="admin-cspl-input"
                value={expireNote}
                onChange={(e) => setExpireNote(e.target.value)}
                placeholder="VD: Bãi bỏ bởi NĐ …"
              />
            </label>

            <div className="admin-cspl-expire-actions">
              <button
                type="button"
                className="btn ghost"
                disabled={expiring}
                onClick={() => setExpireTarget(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn primary"
                disabled={expiring}
                onClick={() => void onExpireSave()}
              >
                {expiring ? 'Đang lưu…' : 'Xác nhận hết HL'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
