import { useEffect, useMemo, useRef, useState } from 'react'
import { QuestionCard } from '../components/QuestionCard'
import {
  EXAM,
  formatTime,
  pickExamQuestions,
  questionsByIds,
  scoreAttempt,
} from '../lib/exam'
import { saveAttempt } from '../lib/storage'
import type { ExamAttempt, UserAnswer } from '../types'

interface Props {
  onFinish: (attemptId: string) => void
}

interface Session {
  questionIds: string[]
  answers: UserAnswer[]
  startedAt: string
  remaining: number
}

const SESSION_KEY = 'otcchnbd.exam.session'

function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function Exam({ onFinish }: Props) {
  const [session, setSession] = useState<Session | null>(() => readSession())
  const [index, setIndex] = useState(0)
  const [remaining, setRemaining] = useState(
    () => readSession()?.remaining ?? EXAM.minutes * 60,
  )
  const sessionRef = useRef(session)
  const finishing = useRef(false)

  sessionRef.current = session

  const paper = useMemo(
    () => (session ? questionsByIds(session.questionIds) : []),
    [session],
  )

  function persist(next: Session) {
    sessionRef.current = next
    setSession(next)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next))
  }

  function finish(timedOut: boolean) {
    const current = sessionRef.current
    if (!current || finishing.current) return
    finishing.current = true
    const scored = scoreAttempt(current.questionIds, current.answers)
    const attempt: ExamAttempt = {
      id: crypto.randomUUID(),
      startedAt: current.startedAt,
      finishedAt: new Date().toISOString(),
      durationSec: EXAM.minutes * 60 - Math.max(0, current.remaining),
      timedOut,
      answers: current.answers,
      questionIds: current.questionIds,
      ...scored,
    }
    saveAttempt(attempt)
    sessionStorage.removeItem(SESSION_KEY)
    onFinish(attempt.id)
  }

  useEffect(() => {
    if (!session) return
    const timer = window.setInterval(() => {
      setRemaining((sec) => {
        const next = sec - 1
        const current = sessionRef.current
        if (current) {
          const updated = { ...current, remaining: Math.max(0, next) }
          persist(updated)
        }
        if (next <= 0) {
          window.clearInterval(timer)
          finish(true)
        }
        return Math.max(0, next)
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [session?.startedAt])

  function start() {
    finishing.current = false
    const picked = pickExamQuestions()
    const next: Session = {
      questionIds: picked.map((q) => q.id),
      answers: picked.map((q) => ({
        questionId: q.id,
        choice: null,
        flagged: false,
      })),
      startedAt: new Date().toISOString(),
      remaining: EXAM.minutes * 60,
    }
    persist(next)
    setRemaining(next.remaining)
    setIndex(0)
  }

  if (!session || paper.length === 0) {
    return (
      <section className="panel">
        <p className="kicker">Thi thử sát hạch</p>
        <h2>40 câu · 45 phút · đạt ≥ 80% từng phần</h2>
        <p className="lead">
          Đề được rút ngẫu nhiên từ ngân hàng: 16 câu Kiến thức pháp luật và 24
          câu Kinh nghiệm nghề nghiệp. Đạt khi Kiến thức pháp luật ≥ 32/40 và
          Kinh nghiệm nghề nghiệp ≥ 48/60. Bạn có thể đánh dấu câu để xem lại.
          Hết giờ bài thi sẽ được nộp tự động.
        </p>
        <button className="btn primary" onClick={start}>
          Bắt đầu làm bài
        </button>
      </section>
    )
  }

  const current = paper[index]
  const answer = session.answers[index]
  const filled = session.answers.filter((a) => a.choice !== null).length

  return (
    <div className="quiz-layout">
      <aside className="side">
        <div className={remaining <= 60 ? 'timer warn' : 'timer'}>
          {formatTime(remaining)}
        </div>
        <p className="muted">
          Đã trả lời {filled}/{paper.length}
        </p>
        <div className="grid-nav">
          {paper.map((q, i) => {
            const item = session.answers[i]
            const cls = [
              i === index ? 'current' : '',
              item?.choice !== null ? 'filled' : '',
              item?.flagged ? 'flagged' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <button key={q.id} className={cls} onClick={() => setIndex(i)}>
                {i + 1}
              </button>
            )
          })}
        </div>
        <div className="actions">
          <button
            className="btn ghost"
            onClick={() => {
              const answers = session.answers.map((item, i) =>
                i === index ? { ...item, flagged: !item.flagged } : item,
              )
              persist({ ...session, answers, remaining })
            }}
          >
            {answer?.flagged ? 'Bỏ đánh dấu' : 'Đánh dấu'}
          </button>
          <button
            className="btn copper"
            onClick={() => {
              if (window.confirm('Nộp bài thi thử?')) finish(false)
            }}
          >
            Nộp bài
          </button>
          <button
            className="btn ghost"
            onClick={() => {
              if (
                window.confirm(
                  'Hủy bài hiện tại và rút đề mới? Tiến độ sẽ không được lưu.',
                )
              ) {
                sessionStorage.removeItem(SESSION_KEY)
                finishing.current = false
                setSession(null)
              }
            }}
          >
            Làm đề mới
          </button>
        </div>
      </aside>

      {current && answer ? (
        <div>
          <QuestionCard
            question={current}
            index={index}
            total={paper.length}
            choice={answer.choice}
            onChoose={(choice) => {
              const answers = session.answers.map((item, i) =>
                i === index ? { ...item, choice } : item,
              )
              persist({ ...session, answers, remaining })
            }}
          />
          <div className="actions">
            {index > 0 ? (
              <button className="btn ghost" onClick={() => setIndex((i) => i - 1)}>
                Câu trước
              </button>
            ) : null}
            {index < paper.length - 1 ? (
              <button className="btn primary" onClick={() => setIndex((i) => i + 1)}>
                Câu sau
              </button>
            ) : (
              <button
                className="btn copper"
                onClick={() => {
                  if (window.confirm('Nộp bài thi thử?')) finish(false)
                }}
              >
                Nộp bài
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
