import { useMemo, useState } from 'react'
import { QuestionCard } from '../components/QuestionCard'
import { QuotaHint } from '../components/QuotaHint'
import { useAuth } from '../context/AuthContext'
import { questionsByTopic } from '../data/questions'
import { TOPICS } from '../data/topics'
import { shuffle } from '../lib/exam'
import type { TopicId } from '../types'

interface Props {
  topicId?: TopicId
}

export function Practice({ topicId }: Props) {
  const { tryRecordAnswer } = useAuth()
  const pool = useMemo(() => shuffle(questionsByTopic(topicId)), [topicId])
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  const topic = TOPICS.find((t) => t.id === topicId)
  const question = pool[index]
  const revealed = choice !== null

  if (pool.length === 0) {
    return <div className="panel empty">Chưa có câu hỏi trong chuyên đề này.</div>
  }

  if (done) {
    return (
      <section className="panel">
        <p className="kicker">Kết thúc ôn tập</p>
        <h2>
          {correct}/{pool.length} câu đúng
        </h2>
        <p className="lead">
          {topic
            ? `Chuyên đề: ${topic.title}.`
            : 'Bạn đã ôn hết ngân hàng câu hỏi đã chọn.'}{' '}
          Làm lại để củng cố những câu còn sai.
        </p>
        <button
          className="btn primary"
          onClick={() => {
            setIndex(0)
            setChoice(null)
            setCorrect(0)
            setDone(false)
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
          <h2>{topic ? topic.title : 'Tất cả chuyên đề'}</h2>
        </div>
        <span className="muted">
          Đúng {correct} · Còn {pool.length - index - (revealed ? 1 : 0)} câu
        </span>
      </div>
      <QuotaHint />
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
          onChoose={(next) => {
            if (choice !== null) return
            if (
              !tryRecordAnswer({
                questionId: question.id,
                section: question.section,
                topicId: question.topic,
                mode: 'practice',
              })
            ) {
              return
            }
            setChoice(next)
            if (next === question.answer) setCorrect((n) => n + 1)
          }}
        />
      ) : null}
      <div className="actions">
        <button
          className="btn primary"
          disabled={!revealed}
          onClick={() => {
            if (index + 1 >= pool.length) {
              setDone(true)
              return
            }
            setIndex((i) => i + 1)
            setChoice(null)
          }}
        >
          {index + 1 >= pool.length ? 'Xem kết quả' : 'Câu tiếp'}
        </button>
      </div>
    </>
  )
}
