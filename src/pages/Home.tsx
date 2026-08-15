import {
  countByTopicForScope,
  lawSectionLabel,
  questionsForScope,
  sectorTitle,
  skillSectionLabel,
  sourceNoteForScope,
  topicsForScope,
} from '../lib/bank'
import {
  examConfigFor,
  examPassSummary,
  examQuestionCount,
  examTotalMax,
  sectionMax,
} from '../lib/exam'
import type { AppView, StudyScope } from '../types'

interface Props {
  scope: StudyScope
  onNavigate: (view: AppView) => void
}

export function Home({ scope, onNavigate }: Props) {
  const questions = questionsForScope(scope)
  const topics = topicsForScope(scope)
  const exam = examConfigFor(scope)
  const totalQ = examQuestionCount(exam)
  const totalMax = examTotalMax(exam)
  const lawMax = sectionMax('phap-luat', exam)
  const skillMax = sectionMax('kinh-nghiem', exam)
  const lawCount = questions.filter((q) => q.section === 'phap-luat').length
  const skillCount = questions.filter((q) => q.section === 'kinh-nghiem').length
  const title = sectorTitle(scope)

  return (
    <>
      <section className="hero">
        <div className="panel intro-panel">
          <p className="kicker">Luyện đề sát hạch</p>
          <h1 className="hero-title">
            <span>Trắc nghiệm sát hạch</span>
            <span>Cấp chứng chỉ hành nghề</span>
            <span>{title}</span>
          </h1>
          <div className="stats">
            <div className="stat stat-bank">
              <b>{questions.length}</b>
              <span>Ngân hàng câu hỏi</span>
            </div>
            <div className="stat stat-law">
              <b>{lawCount}</b>
              <span>{lawSectionLabel(scope)}</span>
            </div>
            <div className="stat stat-skill">
              <b>{skillCount}</b>
              <span>{skillSectionLabel(scope)}</span>
            </div>
          </div>
          <p className="source-note">
            <span>{sourceNoteForScope(scope)}</span>
          </p>
        </div>
        <div className="panel exam-card">
          <div>
            <p className="kicker" style={{ color: 'var(--gold)' }}>
              Mô phỏng sát hạch
            </p>
            <h2 className="exam-heading">Thi thử</h2>
            <p className="exam-desc">
              {scope.sector === 'xay-dung' ? (
                <>
                  Theo Nghị định 217/2026/NĐ-CP: {totalQ} câu / {exam.minutes} phút —{' '}
                  {exam.lawCount} câu {lawSectionLabel(scope)} ({lawMax} điểm) và{' '}
                  {exam.skillCount} câu {skillSectionLabel(scope)} ({skillMax} điểm).{' '}
                  {examPassSummary(exam)}.
                </>
              ) : (
                <>
                  Đề thi thử: {totalQ} câu / {exam.minutes} phút — {exam.skillCount} câu{' '}
                  {skillSectionLabel(scope)} ({skillMax} điểm) và {exam.lawCount} câu{' '}
                  {lawSectionLabel(scope)} ({lawMax} điểm). {examPassSummary(exam)}.
                </>
              )}
            </p>
            <div className="exam-meta">
              <span className="chip">{totalQ} câu</span>
              <span className="chip">{exam.minutes} phút</span>
              <span className="chip">
                {exam.passMode === 'law-and-total'
                  ? `Đạt ≥ ${exam.totalPassMin}/${totalMax}`
                  : 'Đạt ≥ 80% từng phần'}
              </span>
            </div>
          </div>
          <button
            className="btn copper"
            onClick={() => onNavigate({ name: 'exam', scope })}
          >
            Bắt đầu thi thử
          </button>
        </div>
      </section>

      <div className="section-head">
        <h2>Ôn theo chuyên đề</h2>
        <button
          className="btn amber compact"
          onClick={() => onNavigate({ name: 'practice', scope })}
        >
          Ôn tất cả
        </button>
      </div>
      <div className="topic-grid">
        {topics.map((topic) => (
          <button
            key={topic.id}
            className="topic-card"
            onClick={() => onNavigate({ name: 'practice', scope, topicId: topic.id })}
          >
            <span className="count">{countByTopicForScope(scope, topic.id)} câu</span>
            <h3>{topic.title}</h3>
            <p>{topic.blurb}</p>
          </button>
        ))}
      </div>
    </>
  )
}
