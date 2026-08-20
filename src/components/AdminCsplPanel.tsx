'use client'

import { useCallback, useEffect, useId, useState, type FormEvent } from 'react'
import { getFirebaseAuth } from '../lib/firebase'
import {
  CSPL_DOC_TYPE_LABEL,
  CSPL_MAX_BYTES,
  CSPL_PILOT_SECTOR,
  CSPL_SECTOR_LABEL,
  CSPL_STATUS_LABEL,
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
      setOkMsg(`Đã tải lên: ${json.data?.soHieu ?? soHieu}`)
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
                onChange={(e) => setSoHieu(e.target.value)}
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
                  <th>Số hiệu</th>
                  <th>Loại</th>
                  <th>Trạng thái</th>
                  <th>File</th>
                  <th>Ngày tải</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.soHieu}</strong>
                      {row.title ? (
                        <div className="admin-cspl-sub">{row.title}</div>
                      ) : null}
                    </td>
                    <td>{CSPL_DOC_TYPE_LABEL[row.docType] ?? row.docType}</td>
                    <td>
                      <span className="admin-chip">
                        {CSPL_STATUS_LABEL[row.status] ?? row.status}
                      </span>
                    </td>
                    <td>
                      {row.originalFilename || '–'}
                      <div className="admin-cspl-sub">{formatBytes(row.byteSize)}</div>
                    </td>
                    <td>{formatWhen(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
