import { Certificate } from '../components/Certificate'
import { QuestionCard } from '../components/QuestionCard'
import { lawSectionLabel, skillSectionLabel } from '../lib/bank'
import {
  formatTime,
  isExamPassed,
  isSectionPassed,
  questionsByIds,
  sectionMax,
  sectionPassMark,
} from '../lib/exam'
import { getAttempt } from '../lib/storage'
import type { AppView, StudyScope } from '../types'

interface Props {
  attemptId: string
  scope: StudyScope
  onNavigate: (view: AppView) => void
}

export function Result({ attemptId, scope, onNavigate }: Props) {
  const attempt = getAttempt(attemptId)

  if (!attempt) {
    return (
      <section className="panel empty">
        Không tìm thấy bài thi. Có thể dữ liệu trình duyệt đã bị xóa.
        <div className="actions">
          <button className="btn primary" onClick={() => onNavigate({ name: 'exam', scope })}>
            Thi lại
          </button>
        </div>
      </section>
    )
  }

  const paper = questionsByIds(attempt.questionIds)
  const choiceById = new Map(attempt.answers.map((a) => [a.questionId, a.choice]))
  const lawMax = sectionMax('phap-luat')
  const skillMax = sectionMax('kinh-nghiem')
  const lawPassed = isSectionPassed(attempt.lawScore, lawMax)
  const skillPassed = isSectionPassed(attempt.skillScore, skillMax)
  const passed = isExamPassed(attempt.lawScore, attempt.skillScore)
  const percent = Math.round(attempt.score)
  const resultScope: StudyScope = {
    sector: attempt.sector ?? scope.sector,
    trackId: attempt.trackId ?? scope.trackId,
  }

  return (
    <>
      <section className="panel">
        <div className="result-hero">
          <div className="ring" style={{ ['--p' as string]: percent }}>
            <span>
              <b>{attempt.score}</b>
              <small className="muted">/ 100</small>
            </span>
          </div>
          <div>
            <p className="kicker">Kết quả sát hạch thử</p>
            <h2 className={passed ? 'pass' : 'fail'}>
              {passed
                ? 'Đạt yêu cầu (mỗi phần ≥ 80%)'
                : 'Chưa đạt — cần ≥ 80% từng phần'}
            </h2>
            <p className="lead">
              Đúng {attempt.correctCount}/{paper.length} câu · Thời gian{' '}
              {formatTime(attempt.durationSec)}
              {attempt.timedOut ? ' · Hết giờ, bài đã được nộp tự động' : ''}.
              Pháp luật tối thiểu {sectionPassMark(lawMax)}/{lawMax};{' '}
              {skillSectionLabel(resultScope).toLowerCase()} tối thiểu{' '}
              {sectionPassMark(skillMax)}/{skillMax}.
            </p>
            <div className="stats">
              <div className="stat">
                <b className={lawPassed ? 'pass' : 'fail'}>{attempt.lawScore}</b>
                <span>
                  {lawSectionLabel(resultScope)} / {lawMax} ·{' '}
                  {lawPassed ? 'Đạt' : 'Chưa đạt'} (≥ {sectionPassMark(lawMax)})
                </span>
              </div>
              <div className="stat">
                <b className={skillPassed ? 'pass' : 'fail'}>{attempt.skillScore}</b>
                <span>
                  {skillSectionLabel(resultScope)} / {skillMax} ·{' '}
                  {skillPassed ? 'Đạt' : 'Chưa đạt'} (≥ {sectionPassMark(skillMax)})
                </span>
              </div>
              <div className="stat">
                <b>{attempt.correctCount}</b>
                <span>câu đúng</span>
              </div>
            </div>
            <div className="actions">
              <button
                className="btn primary"
                onClick={() => onNavigate({ name: 'exam', scope: resultScope })}
              >
                Thi đề khác
              </button>
              <button
                className="btn ghost"
                onClick={() => onNavigate({ name: 'practice', scope: resultScope })}
              >
                Ôn lại
              </button>
            </div>
          </div>
        </div>
      </section>

      {attempt.candidateName ? (
        <Certificate
          attempt={{ ...attempt, candidateName: attempt.candidateName }}
          passed={passed}
          scope={resultScope}
        />
      ) : null}

      <div className="section-head">
        <h2>Xem lại từng câu</h2>
      </div>
      {paper.map((question, i) => (
        <div key={question.id} className="review-item">
          <QuestionCard
            question={question}
            index={i}
            total={paper.length}
            choice={choiceById.get(question.id) ?? null}
            revealed
            onChoose={() => undefined}
          />
        </div>
      ))}
    </>
  )
}
