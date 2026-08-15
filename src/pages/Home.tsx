import { QuotaHint } from '../components/QuotaHint'
import { QUESTIONS } from '../data/questions'
import { TOPICS } from '../data/topics'
import { countByTopic } from '../data/questions'
import type { AppView } from '../types'

interface Props {
  onNavigate: (view: AppView) => void
}

export function Home({ onNavigate }: Props) {
  const lawCount = QUESTIONS.filter((q) => q.section === 'phap-luat').length
  const skillCount = QUESTIONS.filter((q) => q.section === 'kinh-nghiem').length

  return (
    <>
      <button className="text-link back-link" onClick={() => onNavigate({ name: 'catalog' })}>
        ← Chọn ngành
      </button>
      <section className="hero">
        <div className="panel intro-panel">
          <p className="kicker">Luyện đề sát hạch</p>
          <h1 className="hero-title">
            <span>Trắc nghiệm sát hạch</span>
            <span>Cấp chứng chỉ hành nghề</span>
            <span>Đo đạc và Bản đồ</span>
          </h1>
          <div className="stats">
            <div className="stat stat-bank">
              <b>{QUESTIONS.length}</b>
              <span>Ngân hàng câu hỏi</span>
            </div>
            <div className="stat stat-law">
              <b>{lawCount}</b>
              <span>Kiến thức pháp luật</span>
            </div>
            <div className="stat stat-skill">
              <b>{skillCount}</b>
              <span>Kinh nghiệm nghề nghiệp</span>
            </div>
          </div>
          <p className="source-note">
            <span>Ngân hàng câu hỏi theo Quyết định 308/QĐ-ĐĐBĐVN ngày 29/12/2020 của</span>
            <span>Cục Đo đạc, Bản đồ và Thông tin địa lý Việt Nam.</span>
          </p>
        </div>
        <div className="panel exam-card">
          <div>
            <p className="kicker" style={{ color: 'var(--gold)' }}>
              Mô phỏng sát hạch
            </p>
            <h2 className="exam-heading">Thi thử</h2>
            <p className="exam-desc">
              Đề thi thử: 40 câu / 45 phút — 24 câu hỏi Kinh nghiệm nghề nghiệp
              (60 điểm) và 16 câu hỏi Kiến thức pháp luật (40 điểm). Đạt khi mỗi
              phần ≥ 80%: Kiến thức pháp luật ≥ 32/40, Kinh nghiệm nghề nghiệp ≥
              48/60.
            </p>
            <div className="exam-meta">
              <span className="chip">40 câu</span>
              <span className="chip">45 phút</span>
              <span className="chip">Đạt ≥ 80% từng phần</span>
            </div>
          </div>
          <button className="btn copper" onClick={() => onNavigate({ name: 'exam' })}>
            Bắt đầu thi thử
          </button>
        </div>
      </section>

      <QuotaHint />

      <div className="section-head">
        <h2>Ôn theo chuyên đề</h2>
        <button className="btn amber compact" onClick={() => onNavigate({ name: 'practice' })}>
          Ôn tất cả
        </button>
      </div>
      <div className="topic-grid">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            className="topic-card"
            onClick={() =>
              onNavigate({ name: 'practice', topicId: topic.id })
            }
          >
            <span className="count">{countByTopic(topic.id)} câu</span>
            <h3>{topic.title}</h3>
            <p>{topic.blurb}</p>
          </button>
        ))}
      </div>
    </>
  )
}
