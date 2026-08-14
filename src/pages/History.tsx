import { formatTime, isExamPassed } from '../lib/exam'
import { loadAttempts } from '../lib/storage'
import type { AppView } from '../types'

interface Props {
  onNavigate: (view: AppView) => void
}

export function History({ onNavigate }: Props) {
  const attempts = loadAttempts()

  return (
    <section className="panel">
      <p className="kicker">Lịch sử thi thử</p>
      <h2>Các lần làm bài trên máy này</h2>
      {attempts.length === 0 ? (
        <p className="empty">Chưa có bài thi nào. Hãy làm một đề thi thử.</p>
      ) : (
        <div className="history-list">
          {attempts.map((item) => (
            <button
              key={item.id}
              className="history-item topic-card"
              onClick={() => onNavigate({ name: 'result', attemptId: item.id })}
            >
              <span>
                <strong>
                  {new Date(item.finishedAt).toLocaleString('vi-VN')}
                </strong>
                <div className="muted">
                  {formatTime(item.durationSec)} · {item.correctCount}/40 câu
                </div>
              </span>
              <span className={isExamPassed(item.lawScore, item.skillScore) ? 'pass' : 'fail'}>
                {item.score} điểm{' '}
                {isExamPassed(item.lawScore, item.skillScore) ? '· Đạt' : '· Chưa đạt'}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
