'use client'

import { DT_DOC_GROUPS } from '../data/dt/groups'
import { dtCountByTopic, openDtQuestionTotal } from '../data/dt/questions'
import { useDtBank } from '../hooks/useDtBank'
import { examConfigFor, examPassSummary, examQuestionCount } from '../lib/exam'
import { readDtCursor, readDtWrongIds } from '../lib/dtPractice'
import type { AppView, TopicId } from '../types'

interface Props {
  onNavigate: (view: AppView) => void
}

const DT_SCOPE = { sector: 'dau-thau' as const }

export function DtBrowse({ onNavigate }: Props) {
  const { status } = useDtBank(true)
  const total = openDtQuestionTotal()
  const exam = examConfigFor(DT_SCOPE)
  const totalQ = examQuestionCount(exam)
  const wrongCount = status === 'ready' ? readDtWrongIds().length : 0
  const cursor = status === 'ready' ? readDtCursor() : 0

  return (
    <>
      <div className="catalog-head">
        <h1>Đấu thầu</h1>
        <p className="catalog-sub">
          NVCM · {total} câu · thi thử {totalQ} câu / {exam.minutes} phút / 100 điểm
        </p>
      </div>

      {status === 'loading' || status === 'idle' ? (
        <div className="panel empty">Đang tải ngân hàng câu hỏi…</div>
      ) : null}

      {status === 'missing' || status === 'error' ? (
        <div className="panel empty">Chưa tải được ngân hàng NVCM đấu thầu.</div>
      ) : null}

      {status === 'ready' ? (
        <>
          <section className="hero hero-single">
            <div className="panel exam-card exam-card-center">
              <div>
                <p className="kicker" style={{ color: 'var(--gold)' }}>
                  Mô phỏng sát hạch
                </p>
                <h2 className="exam-heading">Thi thử</h2>
                <p className="exam-desc">
                  Theo Thông báo 1891/TB-QLĐT: {totalQ} câu / {exam.minutes} phút /
                  100 điểm, rút ngẫu nhiên từ {total} câu (không trùng trong đề).{' '}
                  {examPassSummary(exam)} theo Điều 20 Thông tư 02/2024/TT-BKHĐT.
                </p>
                <div className="exam-meta">
                  <span className="chip">{totalQ} câu</span>
                  <span className="chip">{exam.minutes} phút</span>
                  <span className="chip">Đạt ≥ 50/100</span>
                </div>
              </div>
              <button
                className="btn copper"
                onClick={() => onNavigate({ name: 'exam', scope: DT_SCOPE })}
              >
                Bắt đầu thi thử
              </button>
            </div>
          </section>

          <div className="section-head">
            <h2>Ôn luyện</h2>
            <button
              className="btn ghost compact"
              onClick={() => onNavigate({ name: 'history', scope: DT_SCOPE })}
            >
              Lịch sử thi thử
            </button>
          </div>
          <div className="topic-grid">
            <button
              type="button"
              className="topic-card topic-tone-0"
              onClick={() => onNavigate({ name: 'practice', scope: DT_SCOPE })}
            >
              <span className="topic-card-bar" aria-hidden />
              <span className="count">
                {cursor > 0 && cursor < total ? `Còn câu ${cursor + 1}` : `${total} câu`}
              </span>
              <h3>Tiếp tục ôn</h3>
              <p>Đi lần lượt 390 câu theo thứ tự ngân hàng, nhớ chỗ đang dở.</p>
            </button>
            <button
              type="button"
              className="topic-card topic-tone-1"
              onClick={() =>
                onNavigate({ name: 'practice', scope: DT_SCOPE, topicId: 'dt-sai' })
              }
            >
              <span className="topic-card-bar" aria-hidden />
              <span className="count">{wrongCount} câu</span>
              <h3>Ôn câu sai</h3>
              <p>Các câu đã trả lời sai khi ôn hoặc thi thử trên máy này.</p>
            </button>
            {([10, 20, 30] as const).map((n, i) => (
              <button
                key={n}
                type="button"
                className={`topic-card topic-tone-${(i + 2) % 8}`}
                onClick={() =>
                  onNavigate({
                    name: 'practice',
                    scope: DT_SCOPE,
                    topicId: `dt-rand-${n}` as TopicId,
                  })
                }
              >
                <span className="topic-card-bar" aria-hidden />
                <span className="count">{n} câu</span>
                <h3>Ôn ngẫu nhiên {n}</h3>
                <p>Một phiên ngắn, rút ngẫu nhiên từ cả ngân hàng.</p>
              </button>
            ))}
          </div>

          <div className="section-head">
            <h2>Ôn theo văn bản</h2>
          </div>
          <div className="topic-grid">
            {DT_DOC_GROUPS.map((topic, index) => (
              <button
                key={topic.id}
                type="button"
                className={`topic-card topic-tone-${index % 8}`}
                onClick={() =>
                  onNavigate({ name: 'practice', scope: DT_SCOPE, topicId: topic.id })
                }
              >
                <span className="topic-card-bar" aria-hidden />
                <span className="count">{dtCountByTopic('', topic.id)} câu</span>
                <h3>{topic.title}</h3>
                <p>{topic.blurb}</p>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </>
  )
}
