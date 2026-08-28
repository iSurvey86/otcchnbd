import { AppLink } from '../components/AppLink'
import { DdGridDiagrams } from '../components/DdGridDiagrams'
import { RelatedLinks } from '../components/RelatedLinks'
import { DD_SECTION_TOPICS } from '../data/topics'
import {
  countByTopicForScope,
  lawSectionLabel,
  questionsForScope,
  sectorTitle,
  skillSectionLabel,
  sourceNoteForScope,
  topicsForScope,
} from '../lib/bank'
import { getDdBank } from '../data/dd/banks'
import {
  examConfigFor,
  examPassSummary,
  examQuestionCount,
  examTotalMax,
  sectionMax,
} from '../lib/exam'
import type { StudyScope } from '../types'

interface Props {
  scope: StudyScope
}

export function Home({ scope }: Props) {
  const questions = questionsForScope(scope)
  const topics = topicsForScope(scope).filter(
    (topic) => countByTopicForScope(scope, topic.id) > 0,
  )
  const exam = examConfigFor(scope, questions.length)
  const totalQ = examQuestionCount(exam)
  const totalMax = examTotalMax(exam)
  const lawMax = sectionMax('phap-luat', exam)
  const skillMax = sectionMax('kinh-nghiem', exam)
  const lawCount = questions.filter((q) => q.section === 'phap-luat').length
  const skillCount = questions.filter((q) => q.section === 'kinh-nghiem').length
  const title = sectorTitle(scope)
  const bankMeta =
    scope.sector === 'do-dac-ban-do' && scope.bankId
      ? getDdBank(scope.bankId)
      : undefined

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
          <div className={`stats${scope.sector === 'dau-thau' ? ' stats-dt' : ''}`}>
            <div className="stat stat-bank">
              <span className="stat-bar" aria-hidden />
              <b>{questions.length}</b>
              <span>Ngân hàng câu hỏi</span>
            </div>
            {scope.sector === 'dau-thau' ? (
              <div className="stat stat-skill">
                <span className="stat-bar" aria-hidden />
                <b>{skillCount}</b>
                <span>{skillSectionLabel(scope)}</span>
              </div>
            ) : (
              <>
                <div className="stat stat-law">
                  <span className="stat-bar" aria-hidden />
                  <b>{lawCount}</b>
                  <span>{lawSectionLabel(scope)}</span>
                </div>
                <div className="stat stat-skill">
                  <span className="stat-bar" aria-hidden />
                  <b>{skillCount}</b>
                  <span>{skillSectionLabel(scope)}</span>
                </div>
              </>
            )}
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
                  Theo Nghị định 217/2026/NĐ-CP: {totalQ} câu / {exam.minutes} phút –{' '}
                  {exam.lawCount} câu {lawSectionLabel(scope)} ({lawMax} điểm) và{' '}
                  {exam.skillCount} câu {skillSectionLabel(scope)} ({skillMax} điểm).{' '}
                  {examPassSummary(exam)}.
                </>
              ) : scope.sector === 'dau-thau' ? (
                <>
                  Theo Thông báo 1891/TB-QLĐT: {totalQ} câu / {exam.minutes} phút /
                  100 điểm, rút từ ngân hàng NVCM. {examPassSummary(exam)}.
                </>
              ) : bankMeta?.examKind === 'whole-pool' ? (
                <>
                  Thi thử: {totalQ} câu / {exam.minutes} phút (toàn bộ bộ{' '}
                  {bankMeta.periodLabel}). {examPassSummary(exam)}.
                </>
              ) : (
                <>
                  Đề thi thử: {totalQ} câu / {exam.minutes} phút – {exam.skillCount} câu{' '}
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
                  : exam.passMode === 'total-percent'
                    ? 'Đạt ≥ 80% tổng'
                    : scope.sector === 'dau-thau'
                      ? 'Đạt ≥ 50/100'
                      : 'Đạt ≥ 80% từng phần'}
              </span>
            </div>
          </div>
          <AppLink className="btn copper" view={{ name: 'exam', scope }}>
            Bắt đầu thi thử
          </AppLink>
        </div>
      </section>

      <div className="section-head">
        <h2>Ôn theo chuyên đề</h2>
        <AppLink className="btn amber compact" view={{ name: 'practice', scope }}>
          Ôn tất cả
        </AppLink>
      </div>
      {scope.sector === 'do-dac-ban-do' ? (
        <div className="topic-grid dd-section-topic-grid">
          {DD_SECTION_TOPICS.map((topic) => {
            const n = countByTopicForScope(scope, topic.id)
            if (n <= 0) return null
            return (
              <AppLink
                key={topic.id}
                className={`topic-card topic-card-section ${topic.id === 'dd-phap-luat' ? 'dd-section-tone-law' : 'dd-section-tone-skill'}`}
                view={{ name: 'practice', scope, topicId: topic.id }}
              >
                <span className="topic-card-bar" aria-hidden />
                <span className="count">{n} câu</span>
                <h3>Ôn {topic.title.toLowerCase()}</h3>
                <p>{topic.blurb}</p>
              </AppLink>
            )
          })}
        </div>
      ) : null}
      <div className="topic-grid">
        {topics.map((topic, index) => (
          <AppLink
            key={topic.id}
            className={`topic-card topic-tone-${index % 8}`}
            view={{ name: 'practice', scope, topicId: topic.id }}
          >
            <span className="topic-card-bar" aria-hidden />
            <span className="count">{countByTopicForScope(scope, topic.id)} câu</span>
            <h3>{topic.title}</h3>
            <p>{topic.blurb}</p>
          </AppLink>
        ))}
      </div>

      {scope.sector === 'do-dac-ban-do' ? <DdGridDiagrams /> : null}

      <RelatedLinks scope={scope} />
    </>
  )
}
