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
import type { StudyScope, TopicId } from '../types'

interface Props {
  scope: StudyScope
  topicId?: TopicId
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
    return (
      <section className="panel">
        <p className="kicker">Kết thúc ôn tập</p>
        <h2>
          {correct}/{pool.length} câu đúng
        </h2>
        <p className="lead">
          {topicTitle}. Làm lại để củng cố những câu còn sai.
        </p>
        <button
          className="btn primary"
          onClick={() => {
            setIndex(0)
            setChoice(null)
            setCorrect(0)
            setDone(false)
            if (continueMode) writeDtCursor(0)
            notifyPracticeStarted({
              topicId: topicId ?? null,
              topicTitle,
              sector: scope.sector,
              trackId: scope.trackId ?? null,
            })
          }}
        >
          Ôn lại từ đầu
        </button>
      </section>
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
              notifyPracticeFinished({
                topicId: topicId ?? null,
                topicTitle,
                sector: scope.sector,
                trackId: scope.trackId ?? null,
                correct,
                total: pool.length,
              })
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
