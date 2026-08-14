import { letter } from '../lib/exam'
import type { Question } from '../types'

interface Props {
  question: Question
  index: number
  total: number
  choice: number | null
  revealed?: boolean
  onChoose: (choice: number) => void
}

export function QuestionCard({
  question,
  index,
  total,
  choice,
  revealed = false,
  onChoose,
}: Props) {
  return (
    <article className="panel q-card">
      <div className="badge-row">
        <span className="badge">
          Câu {index + 1}/{total}
        </span>
        <span className="badge">
          {question.section === 'phap-luat'
            ? 'Kiến thức pháp luật'
            : 'Kinh nghiệm nghề nghiệp'}
        </span>
      </div>
      <h2>{question.prompt}</h2>
      <div className="options">
        {question.options.map((text, i) => {
          let cls = 'option'
          if (revealed) {
            if (i === question.answer) cls += ' correct'
            else if (choice === i) cls += ' wrong'
          } else if (choice === i) {
            cls += ' selected'
          }
          return (
            <button
              key={text}
              className={cls}
              disabled={revealed}
              onClick={() => onChoose(i)}
            >
              <b>{letter(i)}</b>
              <span>{text}</span>
            </button>
          )
        })}
      </div>
      {revealed ? (
        <div className="explain">
          <strong>Giải thích.</strong> {question.explanation}
          <div className="muted" style={{ marginTop: 8 }}>
            Nguồn: {question.source}
          </div>
        </div>
      ) : null}
    </article>
  )
}
