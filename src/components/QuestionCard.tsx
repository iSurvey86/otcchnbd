import { ExplanationBody } from './ExplanationBody'
import { letter } from '../lib/exam'
import { normalizeLegalCaps } from '../lib/legalCite'
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
          <strong className="explain-title">Giải thích</strong>
          {question.explanation ? (
            <ExplanationBody text={question.explanation} />
          ) : (
            <div className="explain-body muted">Chưa có giải thích chi tiết cho câu này.</div>
          )}
          <div className="explain-foot">
            <div className="explain-source muted">
              Nguồn: {normalizeLegalCaps(question.source)}
            </div>
            <button
              type="button"
              className="explain-feedback explain-callout"
              title="Góp ý về đáp án hoặc giải thích (sẽ mở form sau)"
              onClick={() => {
                /* Phase sau: mở form phản hồi theo câu hỏi */
              }}
            >
              <span className="explain-callout-text">Phản hồi / Góp ý</span>
            </button>
          </div>
        </div>
      ) : null}
    </article>
  )
}
