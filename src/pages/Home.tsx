import { QuotaHint } from '../components/QuotaHint'
import {
  countByTopicForScope,
  lawSectionLabel,
  questionsForScope,
  sectorTitle,
  skillSectionLabel,
  sourceNoteForScope,
  topicsForScope,
} from '../lib/bank'
import type { AppView, StudyScope } from '../types'

interface Props {
  scope: StudyScope
  onNavigate: (view: AppView) => void
}

export function Home({ scope, onNavigate }: Props) {
  const questions = questionsForScope(scope)
  const topics = topicsForScope(scope)
  const lawCount = questions.filter((q) => q.section === 'phap-luat').length
  const skillCount = questions.filter((q) => q.section === 'kinh-nghiem').length
  const title = sectorTitle(scope)
  const backView: AppView =
    scope.sector === 'xay-dung' ? { name: 'xd-browse' } : { name: 'catalog' }
  const backLabel = scope.sector === 'xay-dung' ? '← Chọn hạng / chuyên ngành' : '← Chọn ngành'

  return (
    <>
      <button className="text-link back-link" onClick={() => onNavigate(backView)}>
        {backLabel}
      </button>
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
              Đề thi thử: 40 câu / 45 phút — 24 câu {skillSectionLabel(scope)} (60
              điểm) và 16 câu {lawSectionLabel(scope)} (40 điểm). Đạt khi mỗi phần ≥
              80%: pháp luật ≥ 32/40, chuyên môn / nghề nghiệp ≥ 48/60.
            </p>
            <div className="exam-meta">
              <span className="chip">40 câu</span>
              <span className="chip">45 phút</span>
              <span className="chip">Đạt ≥ 80% từng phần</span>
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

      <QuotaHint />

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
