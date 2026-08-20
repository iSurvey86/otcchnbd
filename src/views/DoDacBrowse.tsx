'use client'

import { AppLink } from '../components/AppLink'
import {
  EXAM_DO_DAC,
  examPassSummary,
  examQuestionCount,
  sectionMax,
} from '../lib/exam'
import {
  bankKindLabel,
  latestOnthicchnBank,
  officialDdBanks,
  onthicchnDdBanks,
  recommendedDdBank,
  type DdBankMeta,
} from '../data/dd/banks'
import { ddQuestions } from '../data/dd/questions'
import type { AppView } from '../types'

function formatPublished(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function questionCountFor(bank: DdBankMeta): number {
  if (bank.id === 'official-2020') return ddQuestions(bank.id).length
  return bank.questionCountHint ?? ddQuestions(bank.id).length
}

function examLineOfficial(): string {
  const exam = EXAM_DO_DAC
  const totalQ = examQuestionCount(exam)
  const lawMax = sectionMax('phap-luat', exam)
  const skillMax = sectionMax('kinh-nghiem', exam)
  return `Thi thử: ${totalQ} câu / ${exam.minutes} phút · ${exam.lawCount} PL (${lawMax} điểm) + ${exam.skillCount} KN (${skillMax} điểm) · ${examPassSummary(exam)}`
}

function examLineOnthicchn(bank: DdBankMeta): string {
  const n = questionCountFor(bank)
  const minutes = bank.examMinutes ?? 45
  return `Thi thử: ${n} câu / ${minutes} phút (toàn bộ bộ ${bank.periodLabel}) · Đạt ≥ 80% tổng`
}

function bankHomeView(bank: DdBankMeta): AppView {
  return {
    name: 'home',
    scope: { sector: 'do-dac-ban-do', bankId: bank.id },
  }
}

function BankTitle({ bank, showNew }: { bank: DdBankMeta; showNew?: boolean }) {
  if (bank.kind === 'onthicchn') {
    return (
      <>
        Bộ câu hỏi cập nhật tháng {bank.periodLabel}
        {showNew ? (
          <sup className="dd-bank-new-icon" aria-label="Mới">
            New
          </sup>
        ) : null}
      </>
    )
  }
  return <>{bank.title}</>
}

function bankToneClass(
  bank: DdBankMeta,
  options: { featured?: boolean; index?: number } = {},
): string {
  if (options.featured) return 'topic-tone-0'
  if (bank.kind === 'onthicchn') {
    return `topic-tone-${(options.index ?? 0) % 2 === 0 ? 1 : 2}`
  }
  return `topic-tone-${6 + ((options.index ?? 0) % 2)}`
}

function BankCard({
  bank,
  featured,
  toneIndex = 0,
}: {
  bank: DdBankMeta
  featured?: boolean
  toneIndex?: number
}) {
  const count = questionCountFor(bank)
  const isLatestOnthicchn = latestOnthicchnBank()?.id === bank.id
  const examLine =
    bank.examKind === 'standard-do-dac' ? examLineOfficial() : examLineOnthicchn(bank)

  return (
    <article
      className={`dd-bank-card topic-card ${bankToneClass(bank, { featured, index: toneIndex })}${featured ? ' dd-bank-card-featured' : ''}${!bank.ready ? ' dd-bank-card-soon' : ''}`}
    >
      <span className="topic-card-bar" aria-hidden />
      {featured ? (
        <p className="kicker dd-bank-kicker">★ Khuyến nghị cho kỳ thi hiện tại</p>
      ) : null}
      <div className="dd-bank-head">
        <h3 className="dd-bank-title">
          <BankTitle bank={bank} showNew={isLatestOnthicchn} />
        </h3>
        {bank.kind === 'official' ? (
          <span className="dd-bank-badge">{bankKindLabel(bank)}</span>
        ) : null}
      </div>
      {bank.legalRef ? <p className="dd-bank-ref">{bank.legalRef}</p> : null}
      {bank.supersededNote ? (
        <p className="muted dd-bank-note">{bank.supersededNote}</p>
      ) : null}
      {bank.blurb && bank.kind === 'onthicchn' ? (
        <p className="muted dd-bank-note">{bank.blurb}</p>
      ) : null}
      {bank.publishedAt ? (
        <p className="muted dd-bank-meta">
          {count} câu · cập nhật {formatPublished(bank.publishedAt)}
        </p>
      ) : (
        <p className="muted dd-bank-meta">{count} câu hỏi</p>
      )}
      {bank.legalRefs?.length ? (
        <p className="muted dd-bank-meta">Căn cứ: {bank.legalRefs.join(', ')}</p>
      ) : null}
      <p className="dd-bank-exam">{examLine}</p>
      {bank.ready ? (
        <div className="dd-bank-cta">
          <AppLink className="btn dd-bank-btn" view={bankHomeView(bank)}>
            Vào ôn &amp; thi thử
          </AppLink>
        </div>
      ) : (
        <p className="muted dd-bank-soon">Đang bổ sung ngân hàng câu hỏi này.</p>
      )}
    </article>
  )
}

export function DoDacBrowse() {
  const recommended = recommendedDdBank()
  const officials = officialDdBanks()
  const onthicchn = onthicchnDdBanks()

  return (
    <>
      <div className="catalog-head dd-browse-head">
        <h1>Đo đạc và Bản đồ</h1>
        <p className="catalog-sub">
          Chọn ngân hàng câu hỏi
          <br />
          để ôn và thi thử
        </p>
      </div>

      <BankCard bank={recommended} featured />

      {onthicchn.length > 0 || officials.length > 0 ? (
        <div className="dd-browse-columns">
          {onthicchn.length > 0 ? (
            <section className="dd-browse-col">
              <div className="section-head dd-section-head">
                <div>
                  <h2>Bộ câu hỏi cập nhật từ ONTHICCHN</h2>
                </div>
              </div>
              <div className="dd-bank-list">
                {onthicchn.map((bank, index) => (
                  <BankCard key={bank.id} bank={bank} toneIndex={index} />
                ))}
              </div>
            </section>
          ) : null}

          {officials.length > 0 ? (
            <section className="dd-browse-col dd-browse-col-official">
              <div className="section-head dd-section-head">
                <div>
                  <h2>Ngân hàng câu hỏi chính thức đã được công bố</h2>
                </div>
              </div>
              <div className="dd-bank-list">
                {officials.map((bank, index) => (
                  <BankCard key={bank.id} bank={bank} toneIndex={index} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
