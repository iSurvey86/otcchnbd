import { sectorTitle } from '../lib/bank'
import { examConfigFor, examTotalMax, formatTime, isExamPassed } from '../lib/exam'
import { loadAttempts } from '../lib/storage'
import type { AppView, StudyScope } from '../types'

interface Props {
  scope: StudyScope
  onNavigate: (view: AppView) => void
}

export function History({ scope, onNavigate }: Props) {
  const attempts = loadAttempts().filter((item) => {
    if (scope.sector === 'xay-dung') {
      return item.sector === 'xay-dung' && item.trackId === scope.trackId
    }
    return !item.sector || item.sector === 'do-dac-ban-do'
  })

  return (
    <section className="panel">
      <p className="kicker">Lịch sử thi thử</p>
      <h2>Các lần làm bài trên máy này</h2>
      <p className="muted" style={{ marginTop: -6 }}>
        {sectorTitle(scope)}
      </p>
      {attempts.length === 0 ? (
        <p className="empty">Chưa có bài thi nào. Hãy làm một đề thi thử.</p>
      ) : (
        <div className="history-list">
          {attempts.map((item) => {
            const itemScope: StudyScope = {
              sector: item.sector ?? 'do-dac-ban-do',
              trackId: item.trackId,
            }
            const exam = examConfigFor(itemScope)
            const totalMax = examTotalMax(exam)
            const passed = isExamPassed(item.lawScore, item.skillScore, exam)
            return (
              <button
                key={item.id}
                className="history-item topic-card"
                onClick={() =>
                  onNavigate({
                    name: 'result',
                    scope: itemScope,
                    attemptId: item.id,
                  })
                }
              >
                <span>
                  <strong>
                    {new Date(item.finishedAt).toLocaleString('vi-VN')}
                  </strong>
                  <div className="muted">
                    {item.candidateName ? `${item.candidateName} · ` : ''}
                    {formatTime(item.durationSec)} · {item.correctCount}/
                    {item.questionIds.length || exam.lawCount + exam.skillCount} câu
                  </div>
                </span>
                <span className={passed ? 'pass' : 'fail'}>
                  {item.score}/{totalMax} điểm {passed ? '· Đạt' : '· Chưa đạt'}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
