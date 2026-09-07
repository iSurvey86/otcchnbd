'use client'

import { useMemo, useState } from 'react'
import { AppLink } from './AppLink'
import {
  lawSectionLabel,
  skillSectionLabel,
} from '../lib/bank'
import type { Question, StudyScope } from '../types'

const MIN_QUERY = 2
const MAX_RESULTS = 20

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function clip(text: string, max = 140): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

type Props = {
  scope: StudyScope
  questions: Question[]
}

export function QuestionSearch({ scope, questions }: Props) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const raw = query.trim()
    if (raw.length < MIN_QUERY) return []
    const tokens = normalize(raw)
      .split(/\s+/)
      .filter(Boolean)
    if (tokens.length === 0) return []

    const hits: Question[] = []
    for (const q of questions) {
      const hay = normalize(
        [q.id, q.prompt, q.source, ...q.options].join('\n'),
      )
      if (tokens.every((t) => hay.includes(t))) {
        hits.push(q)
        if (hits.length >= MAX_RESULTS) break
      }
    }
    return hits
  }, [query, questions])

  const showList = query.trim().length >= MIN_QUERY

  return (
    <section className="panel user-q-search" aria-label="Tìm câu hỏi">
      <div className="user-q-search-head">
        <h2 className="user-q-search-title">Tìm câu hỏi</h2>
      </div>
      <input
        type="search"
        className="user-q-search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Gõ nội dung để tìm kiếm"
        autoComplete="off"
        spellCheck={false}
      />
      {showList ? (
        results.length === 0 ? (
          <p className="user-q-search-empty muted">Không thấy câu khớp.</p>
        ) : (
          <ul className="user-q-search-list">
            {results.map((q) => (
              <li key={q.id}>
                <AppLink
                  className="user-q-search-item"
                  view={{
                    name: 'practice',
                    scope,
                    questionId: q.id,
                  }}
                >
                  <span className="user-q-search-meta">
                    <span className="user-q-search-badge">
                      {q.section === 'phap-luat'
                        ? lawSectionLabel(scope)
                        : skillSectionLabel(scope)}
                    </span>
                    <code className="user-q-search-id">{q.id}</code>
                  </span>
                  <span className="user-q-search-prompt">{clip(q.prompt)}</span>
                </AppLink>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </section>
  )
}
