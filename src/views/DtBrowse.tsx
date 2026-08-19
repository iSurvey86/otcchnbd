'use client'

import { DT_DOC_GROUPS, DT_ONTHICCHN_SETS } from '../data/dt/groups'
import { dtCountByTopic, openDtQuestionTotal } from '../data/dt/questions'
import { useDtBank } from '../hooks/useDtBank'
import { examConfigFor, examPassSummary, examQuestionCount } from '../lib/exam'
import { readDtCursor, readDtWrongIds } from '../lib/dtPractice'
import type { AppView, TopicId } from '../types'

interface Props {
  onNavigate: (view: AppView) => void
}

const DT_SCOPE = { sector: 'dau-thau' as const }

function PracticeCard({
  tone,
  count,
  title,
  blurb,
  onClick,
}: {
  tone: number
  count: string
  title: string
  blurb: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`topic-card topic-tone-${tone % 8}`}
      onClick={onClick}
    >
      <span className="topic-card-bar" aria-hidden />
      <span className="count">{count}</span>
      <h3>{title}</h3>
      <p>{blurb}</p>
    </button>
  )
}

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

          <div className="dd-browse-columns dt-browse-columns">
            <section className="dd-browse-col">
              <div className="section-head">
                <h2>Ôn luyện</h2>
                <button
                  className="btn ghost compact"
                  onClick={() => onNavigate({ name: 'history', scope: DT_SCOPE })}
                >
                  Lịch sử thi thử
                </button>
              </div>
              <div className="dd-bank-list">
                <PracticeCard
                  tone={0}
                  count={
                    cursor > 0 && cursor < total ? `Còn câu ${cursor + 1}` : `${total} câu`
                  }
                  title="Tiếp tục ôn"
                  blurb="Đi lần lượt 390 câu theo thứ tự ngân hàng, nhớ chỗ đang dở."
                  onClick={() => onNavigate({ name: 'practice', scope: DT_SCOPE })}
                />
                <PracticeCard
                  tone={1}
                  count={`${wrongCount} câu`}
                  title="Ôn câu sai"
                  blurb="Các câu đã trả lời sai khi ôn hoặc thi thử trên máy này."
                  onClick={() =>
                    onNavigate({ name: 'practice', scope: DT_SCOPE, topicId: 'dt-sai' })
                  }
                />
                <PracticeCard
                  tone={2}
                  count="10 câu"
                  title="Ôn ngẫu nhiên 10"
                  blurb="Một phiên ngắn, rút ngẫu nhiên từ cả ngân hàng."
                  onClick={() =>
                    onNavigate({
                      name: 'practice',
                      scope: DT_SCOPE,
                      topicId: 'dt-rand-10' as TopicId,
                    })
                  }
                />
                <PracticeCard
                  tone={3}
                  count="20 câu"
                  title="Ôn ngẫu nhiên 20"
                  blurb="Phiên trung bình, rút ngẫu nhiên từ cả ngân hàng."
                  onClick={() =>
                    onNavigate({
                      name: 'practice',
                      scope: DT_SCOPE,
                      topicId: 'dt-rand-20' as TopicId,
                    })
                  }
                />
                <PracticeCard
                  tone={4}
                  count="30 câu"
                  title="Ôn ngẫu nhiên 30"
                  blurb="Phiên dài hơn, rút ngẫu nhiên từ cả ngân hàng."
                  onClick={() =>
                    onNavigate({
                      name: 'practice',
                      scope: DT_SCOPE,
                      topicId: 'dt-rand-30' as TopicId,
                    })
                  }
                />
              </div>

              <div className="section-head dt-browse-subhead">
                <h2>Ôn thi theo bộ đề từ ONTHICCHN</h2>
              </div>
              <div className="dd-bank-list">
                {DT_ONTHICCHN_SETS.map((set, index) => (
                  <article
                    key={set.id}
                    className={`topic-card topic-tone-${(index + 5) % 8}${set.ready ? '' : ' topic-card-soon'}`}
                  >
                    <span className="topic-card-bar" aria-hidden />
                    <span className="count">
                      {set.questionCountHint != null
                        ? `${set.questionCountHint} câu`
                        : 'Sắp có'}
                    </span>
                    <h3>
                      Bộ câu hỏi cập nhật tháng {set.periodLabel}
                      {index === 0 ? (
                        <sup className="dd-bank-new-icon" aria-label="Mới">
                          New
                        </sup>
                      ) : null}
                    </h3>
                    <p>{set.blurb}</p>
                    {!set.ready ? (
                      <p className="muted dt-browse-soon">Đang bổ sung ngân hàng câu hỏi này.</p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            <section className="dd-browse-col dd-browse-col-official">
              <div className="section-head">
                <h2>Ôn theo văn bản</h2>
              </div>
              <div className="dd-bank-list">
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
            </section>
          </div>
        </>
      ) : null}
    </>
  )
}
