import { Certificate } from '../components/Certificate'
import { QuestionCard } from '../components/QuestionCard'
import { lawSectionLabel, sectorTitle, skillSectionLabel } from '../lib/bank'
import {
  examConfigFor,
  examPassSummary,
  examTotalMax,
  formatTime,
  isExamPassed,
  isSectionPassed,
  letter,
  questionsByIds,
  sectionMax,
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

  const resultScope: StudyScope = {
    sector: attempt.sector ?? scope.sector,
    trackId: attempt.trackId ?? scope.trackId,
  }
  const exam = examConfigFor(resultScope)
  const paper = questionsByIds(attempt.questionIds)
  const choiceById = new Map(attempt.answers.map((a) => [a.questionId, a.choice]))
  const lawMax = sectionMax('phap-luat', exam)
  const skillMax = sectionMax('kinh-nghiem', exam)
  const totalMax = examTotalMax(exam)
  const lawPassed = isSectionPassed(attempt.lawScore, lawMax, exam, 'phap-luat')
  const skillPassed = isSectionPassed(attempt.skillScore, skillMax, exam, 'kinh-nghiem')
  const passed = isExamPassed(attempt.lawScore, attempt.skillScore, exam)
  const ringPercent = Math.round((attempt.score / totalMax) * 100)
  const dateLabel = new Date(attempt.finishedAt).toLocaleString('vi-VN')

  function printPaper() {
    window.print()
  }

  return (
    <>
      <section className="panel no-print">
        <div className="result-hero">
          <div className="ring" style={{ ['--p' as string]: ringPercent }}>
            <span>
              <b>{attempt.score}</b>
              <small className="muted">/ {totalMax}</small>
            </span>
          </div>
          <div>
            <p className="kicker">Kết quả sát hạch thử</p>
            <h2 className={passed ? 'pass' : 'fail'}>
              {passed
                ? exam.passMode === 'law-and-total'
                  ? 'Đạt yêu cầu (NĐ 217)'
                  : 'Đạt yêu cầu (mỗi phần ≥ 80%)'
                : exam.passMode === 'law-and-total'
                  ? `Chưa đạt – cần PL ≥ ${exam.lawPassMin}/${lawMax} và tổng ≥ ${exam.totalPassMin}/${totalMax}`
                  : 'Chưa đạt – cần ≥ 80% từng phần'}
            </h2>
            <p className="lead">
              Đúng {attempt.correctCount}/{paper.length} câu · Thời gian{' '}
              {formatTime(attempt.durationSec)}
              {attempt.timedOut ? ' · Hết giờ, bài đã được nộp tự động' : ''}.{' '}
              {examPassSummary(exam)}.
            </p>
            <div className="stats">
              <div className="stat">
                <b className={lawPassed ? 'pass' : 'fail'}>{attempt.lawScore}</b>
                <span>
                  {lawSectionLabel(resultScope)} / {lawMax} ·{' '}
                  {lawPassed ? 'Đạt' : 'Chưa đạt'}
                  {exam.passMode === 'law-and-total'
                    ? ` (≥ ${exam.lawPassMin})`
                    : ''}
                </span>
              </div>
              <div className="stat">
                <b className={
                  exam.passMode === 'law-and-total'
                    ? ''
                    : skillPassed
                      ? 'pass'
                      : 'fail'
                }>
                  {attempt.skillScore}
                </b>
                <span>
                  {skillSectionLabel(resultScope)} / {skillMax}
                  {exam.passMode === 'law-and-total'
                    ? ' · không có ngưỡng riêng'
                    : ` · ${skillPassed ? 'Đạt' : 'Chưa đạt'}`}
                </span>
              </div>
              <div className="stat">
                <b className={passed ? 'pass' : 'fail'}>{attempt.score}</b>
                <span>
                  tổng / {totalMax}
                  {exam.passMode === 'law-and-total'
                    ? ` · ≥ ${exam.totalPassMin}`
                    : ''}
                </span>
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
              <button className="btn copper" type="button" onClick={printPaper}>
                In / PDF đề
              </button>
            </div>
          </div>
        </div>
      </section>

      {attempt.candidateName ? (
        <div className="no-print">
          <Certificate
            attempt={{ ...attempt, candidateName: attempt.candidateName }}
            passed={passed}
            scope={resultScope}
          />
        </div>
      ) : null}

      <div className="section-head no-print">
        <h2>Xem lại từng câu</h2>
        <button className="btn copper compact" type="button" onClick={printPaper}>
          In / PDF đề
        </button>
      </div>

      <section className="exam-print-sheet" aria-label="Đề thi thử để in">
        <header className="exam-print-head">
          <p className="exam-print-brand">onthicchn.org · Ôn thi sát hạch</p>
          <h1>Đề thi thử – {sectorTitle(resultScope)}</h1>
          <div className="exam-print-meta">
            <span>
              Thí sinh: <strong>{attempt.candidateName ?? '–'}</strong>
            </span>
            <span>
              Kết quả:{' '}
              <strong className={passed ? 'pass' : 'fail'}>
                {attempt.score}/{totalMax} · {passed ? 'Đạt' : 'Chưa đạt'} · đúng{' '}
                {attempt.correctCount}/{paper.length}
              </strong>
            </span>
            <span>Thời gian: {formatTime(attempt.durationSec)}</span>
            <span>Nộp lúc: {dateLabel}</span>
          </div>
          <p className="exam-print-note">
            {examPassSummary(exam)}. Đáp án chọn của bạn được đánh dấu · Đáp án đúng in
            đậm xanh · Đề luyện trên onthicchn.org, không thay thế sát hạch chính thức.
          </p>
        </header>

        {paper.map((question, i) => {
          const choice = choiceById.get(question.id) ?? null
          const ok = choice === question.answer
          return (
            <article key={question.id} className="exam-print-q">
              <div className="exam-print-q-head">
                <span>
                  Câu {i + 1}/{paper.length}
                </span>
                <span>
                  {question.section === 'phap-luat'
                    ? lawSectionLabel(resultScope)
                    : skillSectionLabel(resultScope)}
                </span>
                <span className={ok ? 'pass' : 'fail'}>
                  {choice === null ? 'Chưa chọn' : ok ? 'Đúng' : 'Sai'}
                </span>
              </div>
              <p className="exam-print-prompt">{question.prompt}</p>
              <ol className="exam-print-options">
                {question.options.map((text, opt) => {
                  const isCorrect = opt === question.answer
                  const isChosen = choice === opt
                  return (
                    <li
                      key={text}
                      className={[
                        isCorrect ? 'is-correct' : '',
                        isChosen && !isCorrect ? 'is-wrong' : '',
                        isChosen ? 'is-chosen' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <b>{letter(opt)}.</b> {text}
                      {isChosen ? ' ← bạn chọn' : ''}
                      {isCorrect ? ' ✓ đáp án đúng' : ''}
                    </li>
                  )
                })}
              </ol>
              <p className="exam-print-explain">
                <strong>Giải thích.</strong> {question.explanation}
              </p>
            </article>
          )
        })}
      </section>

      <div className="exam-print-screen-only">
        {paper.map((question, i) => (
          <div key={question.id} className="review-item">
            <QuestionCard
              question={question}
              index={i}
              total={paper.length}
              choice={choiceById.get(question.id) ?? null}
              revealed
              scope={scope}
              onChoose={() => undefined}
            />
          </div>
        ))}
      </div>
    </>
  )
}
