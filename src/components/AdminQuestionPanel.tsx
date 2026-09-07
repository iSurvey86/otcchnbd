'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminQuestionEditorModal } from './AdminQuestionEditorModal'
import { useQuestionOverrides } from '../context/QuestionOverrideContext'
import { DD_BANKS, DD_DEFAULT_BANK_ID, resolveDdBankId } from '../data/dd/banks'
import { loadDdBank } from '../data/dd/questions'
import { allDtQuestions, loadDtBank } from '../data/dt/questions'
import { XD_TRACKS } from '../data/xd/tracks'
import { loadXdBank } from '../data/xd/questions'
import {
  applyOverride,
  overrideKeyFromScope,
} from '../lib/questionOverride'
import { pathForView } from '../lib/paths'
import type { Question, SectorId, StudyScope } from '../types'

type IndexedQ = {
  question: Question
  scope: StudyScope
  label: string
}

async function buildIndex(): Promise<IndexedQ[]> {
  const out: IndexedQ[] = []
  for (const bank of DD_BANKS.filter((b) => b.ready)) {
    const qs = await loadDdBank(bank.id)
    for (const q of qs) {
      out.push({
        question: q,
        scope: { sector: 'do-dac-ban-do', bankId: bank.id },
        label: `Đo đạc · ${bank.periodLabel || bank.id}`,
      })
    }
  }
  for (const track of XD_TRACKS.filter((t) => t.open)) {
    const bank = await loadXdBank(track.id)
    for (const q of bank?.questions ?? []) {
      out.push({
        question: q,
        scope: { sector: 'xay-dung', trackId: track.id },
        label: `XD · ${track.title}`,
      })
    }
  }
  await loadDtBank()
  for (const q of allDtQuestions()) {
    out.push({
      question: q,
      scope: { sector: 'dau-thau' },
      label: 'Đấu thầu NVCM',
    })
  }
  return out
}

export function AdminQuestionPanel({
  initialQuery,
  initialQuestionId,
  initialScope,
}: {
  initialQuery?: string
  initialQuestionId?: string
  initialScope?: StudyScope
} = {}) {
  const { byKey, refresh } = useQuestionOverrides()
  const [index, setIndex] = useState<IndexedQ[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState(initialQuery || initialQuestionId || '')
  const [sectorFilter, setSectorFilter] = useState<SectorId | 'all'>(
    initialScope?.sector ?? 'all',
  )
  const [edit, setEdit] = useState<IndexedQ | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void buildIndex().then((rows) => {
      if (cancelled) return
      setIndex(rows)
      setLoading(false)
      if (initialQuestionId && initialScope) {
        const hit = rows.find(
          (r) =>
            r.question.id === initialQuestionId &&
            r.scope.sector === initialScope.sector &&
            (initialScope.bankId
              ? r.scope.bankId === resolveDdBankId(initialScope.bankId)
              : true) &&
            (initialScope.trackId
              ? r.scope.trackId === initialScope.trackId
              : true),
        )
        if (hit) setEdit(hit)
      }
    })
    return () => {
      cancelled = true
    }
  }, [initialQuestionId, initialScope])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = index
    if (sectorFilter !== 'all') {
      rows = rows.filter((r) => r.scope.sector === sectorFilter)
    }
    if (!q) return rows.slice(0, 50)
    return rows
      .filter((r) => {
        const hay = [
          r.question.id,
          r.question.prompt,
          r.question.source,
          ...r.question.options,
          r.label,
        ]
          .join('\n')
          .toLowerCase()
        return hay.includes(q)
      })
      .slice(0, 80)
  }, [index, query, sectorFilter])

  const openPractice = useCallback((row: IndexedQ) => {
    const base = pathForView({
      name: 'practice',
      scope: {
        sector: row.scope.sector,
        bankId:
          row.scope.sector === 'do-dac-ban-do'
            ? row.scope.bankId ?? DD_DEFAULT_BANK_ID
            : undefined,
        trackId: row.scope.trackId,
      },
    })
    const url = `${base}${base.includes('?') ? '&' : '?'}q=${encodeURIComponent(row.question.id)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  return (
    <div className="admin-q-panel">
      <section className="panel admin-panel admin-cspl-card">
        <header className="admin-cspl-card-head">
          <h2 className="admin-cspl-title">Kho câu hỏi</h2>
          <span className="admin-cspl-count">
            {loading ? 'Đang nạp…' : `${index.length} câu`}
          </span>
        </header>
        <div className="admin-q-search-row">
          <input
            type="search"
            className="admin-cspl-input admin-q-search-input"
            placeholder="Tìm: pl-093 · hành lang · viễn thám…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="admin-cspl-input admin-q-search-filter"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value as SectorId | 'all')}
          >
            <option value="all">Mọi lĩnh vực</option>
            <option value="do-dac-ban-do">Đo đạc</option>
            <option value="xay-dung">Xây dựng</option>
            <option value="dau-thau">Đấu thầu</option>
          </select>
        </div>
      </section>

      <section className="panel admin-panel admin-cspl-card">
        {loading ? (
          <p className="lead">Đang tải ngân hàng…</p>
        ) : results.length === 0 ? (
          <p className="lead">Không thấy câu khớp.</p>
        ) : (
          <ul className="admin-cspl-pack-q-list">
            {results.map((row) => {
              const key = overrideKeyFromScope(row.scope, row.question.id)
              const ov = byKey.get(key)
              const q = applyOverride(row.question, ov)
              return (
                <li
                  key={`${key}`}
                  className="admin-cspl-pack-q"
                >
                  <div className="admin-cspl-pack-q-head">
                    <div>
                      <strong>
                        <code>{q.id}</code>
                        {ov ? (
                          <span className="admin-chip admin-q-override-chip">
                            {' '}
                            Override
                          </span>
                        ) : null}
                      </strong>
                      <div className="admin-cspl-sub">{row.label}</div>
                      <div className="admin-cspl-sub">{q.prompt}</div>
                    </div>
                    <div className="admin-cspl-row-actions">
                      <button
                        type="button"
                        className="btn ghost compact"
                        onClick={() => openPractice(row)}
                      >
                        Mở ôn
                      </button>
                      <button
                        type="button"
                        className="btn primary compact"
                        onClick={() => setEdit(row)}
                      >
                        Sửa
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {edit ? (
        <AdminQuestionEditorModal
          open
          base={edit.question}
          scope={edit.scope}
          existing={byKey.get(
            overrideKeyFromScope(edit.scope, edit.question.id),
          )}
          onClose={() => setEdit(null)}
          onSaved={() => void refresh()}
        />
      ) : null}
    </div>
  )
}
