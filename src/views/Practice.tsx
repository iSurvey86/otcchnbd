import { useEffect, useMemo, useState } from 'react'
import { QuestionCard } from '../components/QuestionCard'
import { useAuth } from '../context/AuthContext'
import { dtRandCount } from '../data/dt/groups'
import { questionsByTopicForScope, topicsForScope } from '../lib/bank'
import {
  markDtPracticeAnswer,
  readDtCursor,
  writeDtCursor,
} from '../lib/dtPractice'
import { shuffle } from '../lib/exam'
import type { Question, StudyScope, TopicId } from '../types'

interface Props {
  scope: StudyScope
  topicId?: TopicId
}

interface PracticeAnswer {
  question: Question
  choice: number
  index: number
}

export function Practice({ scope, topicId }: Props) {
  const { tryRecordAnswer, notifyPracticeStarted, notifyPracticeFinished } = useAuth()
  const continueMode = scope.sector === 'dau-thau' && !topicId
  const randN = dtRandCount(topicId)
  const pool = useMemo(() => {
    const raw = questionsByTopicForScope(scope, topicId)
    if (continueMode) return raw
    if (randN != null) return shuffle(raw).slice(0, randN)
    return shuffle(raw)
  }, [scope, topicId, continueMode, randN])

  const [index, setIndex] = useState(() => {
    if (!continueMode || pool.length === 0) return 0
    return Math.min(readDtCursor(), Math.max(0, pool.length - 1))
  })
  const [choice, setChoice] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [answers, setAnswers] = useState<PracticeAnswer[]>([])
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong'>('all')

  const topic = topicsForScope(scope).find((t) => t.id === topicId)
  const topicTitle =
    topic?.title ??
    (topicId === 'dt-sai'
      ? 'Ôn câu sai'
      : randN
        ? `Ôn ngẫu nhiên ${randN} câu`
        : continueMode
          ? 'Tiếp tục ôn'
          : 'Tất cả chuyên đề')
  const question = pool[index]
  const revealed = choice !== null

  useEffect(() => {
    if (pool.length === 0) return
    notifyPracticeStarted({
      topicId: topicId ?? null,
      topicTitle,
      sector: scope.sector,
      trackId: scope.trackId ?? null,
    })
  }, [notifyPracticeStarted, pool.length, scope.sector, scope.trackId, topicId, topicTitle])

  function restartSession() {
    setIndex(0)
    setChoice(null)
    setCorrect(0)
    setDone(false)
    setAnswers([])
    setReviewFilter('all')
    if (continueMode) writeDtCursor(0)
    notifyPracticeStarted({
      topicId: topicId ?? null,
      topicTitle,
      sector: scope.sector,
      trackId: scope.trackId ?? null,
    })
  }

  if (pool.length === 0) {
    return (
      <div className="panel empty">
        {topicId === 'dt-sai'
          ? 'Chưa có câu sai trên máy này. Ôn hoặc thi thử để ghi câu trả lời sai.'
          : 'Chưa có câu hỏi trong chuyên đề này.'}
      </div>
    )
  }

  if (done) {
    const sessionTotal = answers.length
    const sessionCorrect = answers.filter((a) => a.choice === a.question.answer).length
    const wrongCount = sessionTotal - sessionCorrect
    const visible =
      reviewFilter === 'wrong'
        ? answers.filter((a) => a.choice !== a.question.answer)
        : answers

    return (
      <>
        <section className="panel">
          <p className="kicker">Kết thúc ôn tập</p>
          <h2>
            <span className={sessionCorrect === sessionTotal ? 'pass' : ''}>
              {sessionCorrect}/{sessionTotal}
            </span>{' '}
            câu đúng
          </h2>
          <p className="lead">
            {topicTitle}
            {wrongCount > 0
              ? `. ${wrongCount} câu sai — xem lại bên dưới rồi ôn lại.`
              : '. Không có câu sai trong phiên này.'}
          </p>
          <div className="actions">
            <button className="btn primary" onClick={restartSession}>
              Ôn lại từ đầu
            </button>
          </div>
        </section>

        <div className="section-head">
          <h2>Xem lại từng câu</h2>
          {wrongCount > 0 ? (
            <div className="practice-review-filters">
              <button
                type="button"
                className={reviewFilter === 'all' ? 'btn copper compact' : 'btn ghost compact'}
                onClick={() => setReviewFilter('all')}
              >
                Tất cả ({sessionTotal})
              </button>
              <button
                type="button"
                className={reviewFilter === 'wrong' ? 'btn copper compact' : 'btn ghost compact'}
                onClick={() => setReviewFilter('wrong')}
              >
                Câu sai ({wrongCount})
              </button>
            </div>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <div className="panel empty">Không có câu nào trong bộ lọc này.</div>
        ) : (
          visible.map((item) => {
            const ok = item.choice === item.question.answer
            return (
              <div key={`${item.question.id}-${item.index}`} className="review-item">
                <p className={`practice-review-flag ${ok ? 'pass' : 'fail'}`}>
                  {ok ? 'Đúng' : 'Sai'}
                </p>
                <QuestionCard
                  question={item.question}
                  index={item.index}
                  total={continueMode ? pool.length : sessionTotal}
                  choice={item.choice}
                  revealed
                  scope={scope}
                  onChoose={() => undefined}
                />
              </div>
            )
          })
        )}
      </>
    )
  }

  return (
    <>
      <div className="section-head">
        <div>
          <p className="kicker">Chế độ ôn tập</p>
          <h2>{topicTitle}</h2>
        </div>
        <span className="muted">
          Đúng {correct} · Còn {pool.length - index - (revealed ? 1 : 0)} câu
        </span>
      </div>
      <div className="progress">
        <span style={{ width: `${((index + (revealed ? 1 : 0)) / pool.length) * 100}%` }} />
      </div>
      {question ? (
        <QuestionCard
          question={question}
          index={index}
          total={pool.length}
          choice={choice}
          revealed={revealed}
          scope={scope}
          onChoose={(next) => {
            if (choice !== null) return
            const ok = next === question.answer
            if (
              !tryRecordAnswer({
                questionId: question.id,
                section: question.section,
                topicId: question.topic,
                mode: 'practice',
                correct: ok,
                choice: next,
                answer: question.answer,
                prompt: question.prompt,
                choiceText: question.options[next],
                answerText: question.options[question.answer],
                sector: scope.sector,
                trackId: scope.trackId,
                topicTitle,
                index,
                total: pool.length,
              })
            ) {
              return
            }
            if (scope.sector === 'dau-thau') markDtPracticeAnswer(question.id, ok)
            setChoice(next)
            setAnswers((prev) => [...prev, { question, choice: next, index }])
            if (ok) setCorrect((c) => c + 1)
          }}
        />
      ) : null}
      <div className="actions">
        <button
          className="btn primary"
          disabled={!revealed}
          onClick={() => {
            if (index + 1 >= pool.length) {
              if (continueMode) writeDtCursor(0)
              const sessionTotal = answers.length
              notifyPracticeFinished({
                topicId: topicId ?? null,
                topicTitle,
                sector: scope.sector,
                trackId: scope.trackId ?? null,
                correct,
                total: sessionTotal,
              })
              const wrongN = sessionTotal - correct
              setReviewFilter(sessionTotal > 30 && wrongN > 0 ? 'wrong' : 'all')
              setDone(true)
              return
            }
            const nextIndex = index + 1
            if (continueMode) writeDtCursor(nextIndex)
            setIndex(nextIndex)
            setChoice(null)
          }}
        >
          {index + 1 >= pool.length ? 'Xem kết quả' : 'Câu tiếp'}
        </button>
      </div>
    </>
  )
}
