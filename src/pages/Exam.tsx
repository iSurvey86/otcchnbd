import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { QuestionCard } from '../components/QuestionCard'
import { QuotaHint } from '../components/QuotaHint'
import { useAuth } from '../context/AuthContext'
import { lawSectionLabel, questionsForScope, skillSectionLabel } from '../lib/bank'
import {
  EXAM,
  formatTime,
  pickExamQuestions,
  questionsByIds,
  scoreAttempt,
} from '../lib/exam'
import { saveAttempt } from '../lib/storage'
import type { ExamAttempt, StudyScope, UserAnswer } from '../types'

interface Props {
  scope: StudyScope
  onFinish: (attemptId: string) => void
}

interface Session {
  candidateName: string
  questionIds: string[]
  answers: UserAnswer[]
  startedAt: string
  remaining: number
  scopeKey: string
}

function scopeStorageKey(scope: StudyScope): string {
  return scope.sector === 'xay-dung'
    ? `xd:${scope.trackId ?? ''}`
    : 'do-dac'
}

function sessionKey(scope: StudyScope): string {
  return `otcchnbd.exam.session.${scopeStorageKey(scope)}`
}

const NAME_KEY = 'otcchnbd.exam.candidateName'

function readSession(scope: StudyScope): Session | null {
  try {
    const raw = sessionStorage.getItem(sessionKey(scope))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (!parsed.candidateName || !Array.isArray(parsed.questionIds)) return null
    if (parsed.scopeKey !== scopeStorageKey(scope)) return null
    return parsed
  } catch {
    return null
  }
}

function readSavedName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? ''
  } catch {
    return ''
  }
}

function isValidName(name: string): boolean {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.length >= 2 && name.trim().length >= 5
}

export function Exam({ scope, onFinish }: Props) {
  const pool = useMemo(() => questionsForScope(scope), [scope])
  const storageKey = scopeStorageKey(scope)
  const { tryRecordAnswer, notifyExamStarted, notifyExamSubmitted } = useAuth()
  const [session, setSession] = useState<Session | null>(() => readSession(scope))
  const [candidateName, setCandidateName] = useState(
    () => readSession(scope)?.candidateName ?? readSavedName(),
  )
  const [nameError, setNameError] = useState<string | null>(null)
  const [confirmKind, setConfirmKind] = useState<'submit' | 'reset' | null>(null)
  const [index, setIndex] = useState(0)
  const [remaining, setRemaining] = useState(
    () => readSession(scope)?.remaining ?? EXAM.minutes * 60,
  )
  const sessionRef = useRef(session)
  const finishing = useRef(false)
  const trackRef = useRef({ tryRecordAnswer, notifyExamStarted, notifyExamSubmitted })

  sessionRef.current = session
  trackRef.current = { tryRecordAnswer, notifyExamStarted, notifyExamSubmitted }

  const paper = useMemo(
    () => (session ? questionsByIds(session.questionIds, pool) : []),
    [session, pool],
  )
  const canStart = isValidName(candidateName)

  function persist(next: Session) {
    sessionRef.current = next
    setSession(next)
    sessionStorage.setItem(sessionKey(scope), JSON.stringify(next))
  }

  function finish(timedOut: boolean) {
    const current = sessionRef.current
    if (!current || finishing.current) return
    finishing.current = true
    const scored = scoreAttempt(current.questionIds, current.answers, pool)
    const attempt: ExamAttempt = {
      id: crypto.randomUUID(),
      candidateName: current.candidateName,
      sector: scope.sector,
      trackId: scope.trackId,
      startedAt: current.startedAt,
      finishedAt: new Date().toISOString(),
      durationSec: EXAM.minutes * 60 - Math.max(0, current.remaining),
      timedOut,
      answers: current.answers,
      questionIds: current.questionIds,
      ...scored,
    }
    saveAttempt(attempt)
    sessionStorage.removeItem(sessionKey(scope))
    trackRef.current.notifyExamSubmitted({
      attemptId: attempt.id,
      score: attempt.score,
      lawScore: attempt.lawScore,
      skillScore: attempt.skillScore,
      correctCount: attempt.correctCount,
      passed: attempt.passed,
      timedOut,
    })
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
  }, [session?.startedAt, storageKey])

  function start(event?: FormEvent) {
    event?.preventDefault()
    const name = candidateName.trim().replace(/\s+/g, ' ')
    if (!isValidName(name)) {
      setNameError('Nhập đầy đủ họ và tên (ít nhất hai từ).')
      return
    }
    setNameError(null)
    if (!trackRef.current.notifyExamStarted()) return
    localStorage.setItem(NAME_KEY, name)
    setCandidateName(name)
    finishing.current = false
    const picked = pickExamQuestions(pool)
    const next: Session = {
      candidateName: name,
      questionIds: picked.map((q) => q.id),
      answers: picked.map((q) => ({
        questionId: q.id,
        choice: null,
        flagged: false,
      })),
      startedAt: new Date().toISOString(),
      remaining: EXAM.minutes * 60,
      scopeKey: storageKey,
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
        <p className="lead justified">
          Đề được rút ngẫu nhiên từ ngân hàng: 16 câu {lawSectionLabel(scope)} và 24
          câu {skillSectionLabel(scope)}. Đạt khi pháp luật ≥ 32/40 và{' '}
          {skillSectionLabel(scope).toLowerCase()} ≥ 48/60. Bạn có thể đánh dấu câu để
          xem lại. Hết giờ bài thi sẽ được nộp tự động.
        </p>
        <QuotaHint />
        <form className="exam-start-form" onSubmit={start}>
          <p className="kicker">Trước khi làm bài</p>
          <label className="exam-name-field">
            Họ và tên
            <input
              type="text"
              autoComplete="name"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={candidateName}
              onChange={(e) => {
                setCandidateName(e.target.value)
                if (nameError) setNameError(null)
              }}
            />
          </label>
          <p className="muted exam-name-hint">
            Họ tên sẽ in trên chứng nhận khi bạn đạt bài thi thử. Đây là chứng nhận
            luyện đề trên onthicchn.org, không thay thế chứng chỉ nhà nước.
          </p>
          {nameError ? <p className="auth-error">{nameError}</p> : null}
          {canStart ? (
            <div className="cta-right">
              <button className="btn primary" type="submit">
                Bắt đầu làm bài
              </button>
            </div>
          ) : null}
        </form>
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
        <p className="muted exam-candidate">{session.candidateName}</p>
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
          <button className="btn copper" onClick={() => setConfirmKind('submit')}>
            Nộp bài
          </button>
          <button className="btn ghost" onClick={() => setConfirmKind('reset')}>
            Làm đề mới
          </button>
        </div>
        <div
          className="answer-progress"
          style={{
            ['--p' as string]: paper.length
              ? Math.round((filled / paper.length) * 100)
              : 0,
          }}
          aria-label={`Đã trả lời ${filled} trên ${paper.length} câu`}
        >
          <div className="answer-progress-ring">
            <span>
              <b>{paper.length ? Math.round((filled / paper.length) * 100) : 0}%</b>
              <small>đã làm</small>
            </span>
          </div>
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
              const wasEmpty = session.answers[index]?.choice === null
              if (
                wasEmpty &&
                !tryRecordAnswer({
                  questionId: current.id,
                  section: current.section,
                  topicId: current.topic,
                  mode: 'exam',
                })
              ) {
                return
              }
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
              <button className="btn copper" onClick={() => setConfirmKind('submit')}>
                Nộp bài
              </button>
            )}
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmKind === 'submit'}
        title="Nộp bài thi thử?"
        message="Bài sẽ được chấm ngay. Bạn vẫn có thể xem lại từng câu sau khi nộp."
        confirmLabel="Nộp bài"
        cancelLabel="Tiếp tục làm"
        onCancel={() => setConfirmKind(null)}
        onConfirm={() => {
          setConfirmKind(null)
          finish(false)
        }}
      />
      <ConfirmDialog
        open={confirmKind === 'reset'}
        title="Làm đề mới?"
        message="Hủy bài hiện tại và rút đề mới. Tiến độ sẽ không được lưu."
        confirmLabel="Làm đề mới"
        cancelLabel="Giữ bài này"
        danger
        onCancel={() => setConfirmKind(null)}
        onConfirm={() => {
          setConfirmKind(null)
          sessionStorage.removeItem(sessionKey(scope))
          finishing.current = false
          setSession(null)
        }}
      />
    </div>
  )
}
