import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { lawSectionLabel, sectorTitle, skillSectionLabel } from '../lib/bank'
import {
  examConfigFor,
  examGradeLabel,
  examPassSummary,
  examQuestionCount,
  examTotalMax,
  formatExamScore,
  sectionMax,
} from '../lib/exam'
import type { ExamAttempt, StudyScope } from '../types'

interface Props {
  attempt: ExamAttempt & { candidateName: string }
  passed: boolean
  scope: StudyScope
}

export function Certificate({ attempt, passed, scope }: Props) {
  const cardRef = useRef<HTMLElement>(null)
  const [saving, setSaving] = useState(false)
  const exam = examConfigFor(scope)
  const lawMax = sectionMax('phap-luat', exam)
  const skillMax = sectionMax('kinh-nghiem', exam)
  const totalMax = examTotalMax(exam)
  const totalQ = attempt.questionIds.length || examQuestionCount(exam)
  const title = sectorTitle(scope)
  const grade = examGradeLabel(attempt.score, totalMax)
  const code = `OTC-${attempt.id.slice(0, 8).toUpperCase()}`
  const dateLabel = new Date(attempt.finishedAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const safeName = attempt.candidateName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
  const plate = passed ? '/certificates/phoi-dat.png' : '/certificates/phoi-chua-dat.png'

  const scoreBits = [
    exam.lawCount > 0
      ? `${lawSectionLabel(scope)} ${formatExamScore(attempt.lawScore)}/${formatExamScore(lawMax)}`
      : null,
    `${skillSectionLabel(scope)} ${formatExamScore(attempt.skillScore)}/${formatExamScore(skillMax)}`,
    `Tổng ${formatExamScore(attempt.score)}/${formatExamScore(totalMax)}`,
  ].filter(Boolean)

  async function renderCanvas() {
    if (!cardRef.current) return null
    return html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
    })
  }

  async function downloadPng() {
    if (saving) return
    setSaving(true)
    try {
      const canvas = await renderCanvas()
      if (!canvas) return
      const link = document.createElement('a')
      link.download = passed
        ? `chung-nhan-dat-${safeName || 'thi-sinh'}.png`
        : `phieu-luyen-tap-${safeName || 'thi-sinh'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setSaving(false)
    }
  }

  async function share() {
    try {
      const canvas = await renderCanvas()
      if (!canvas) return
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png'),
      )
      if (!blob) {
        await downloadPng()
        return
      }
      const file = new File(
        [blob],
        passed ? 'chung-nhan-dat.png' : 'phieu-luyen-tap.png',
        { type: 'image/png' },
      )
      const text = passed
        ? `${attempt.candidateName} đã đạt bài thi thử ${title} trên onthicchn.org`
        : `${attempt.candidateName} vừa thi thử ${attempt.correctCount}/${totalQ} câu đúng – đang rèn luyện thêm trên onthicchn.org`
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: passed ? 'Chứng nhận thi thử sát hạch' : 'Phiếu luyện tập thi thử',
          text,
          files: [file],
        })
        return
      }
      await downloadPng()
    } catch {
      await downloadPng()
    }
  }

  return (
    <section className="certificate-block">
      <div className="section-head">
        <div>
          <p className="kicker">{passed ? 'Chứng nhận' : 'Phiếu luyện tập'}</p>
          <h2>{passed ? 'Khoe với bạn bè' : 'Chia sẻ hành trình ôn luyện'}</h2>
        </div>
      </div>

      <article
        className={passed ? 'certificate certificate-pass' : 'certificate certificate-practice'}
        ref={cardRef}
      >
        <img className="certificate-plate" src={plate} alt="" />
        {!passed ? (
          <>
            <span className="certificate-hoa-mask" aria-hidden />
            <div className="certificate-hoa-stack">
              <div className="certificate-brand">
                <span className="certificate-mark">ÔN</span>
                <strong>ONTHICCHN.ORG</strong>
              </div>
              <img
                className="certificate-hoa"
                src="/certificates/hoa-chua-dat.png"
                alt=""
              />
            </div>
          </>
        ) : null}

        <div className="certificate-inner">
          <div className="certificate-top">
            {passed ? (
              <div className="certificate-brand">
                <span className="certificate-mark">ÔN</span>
                <strong>ONTHICCHN.ORG</strong>
              </div>
            ) : null}
            <p className="certificate-eyebrow">
              {passed ? 'Chứng nhận' : 'Giấy ghi nhận'}
            </p>
            <h3 className="certificate-title">
              {passed ? 'Thi thử sát hạch' : 'Luyện tập thi thử'}
            </h3>
            <p className="certificate-awarded">
              {passed ? 'Trân trọng trao tặng' : 'Trân trọng gửi tới'}
            </p>
          </div>

          <p className="certificate-name">{attempt.candidateName}</p>

          <div className="certificate-mid">
            <p className="certificate-body">
              {passed ? (
                <>
                  Đã hoàn thành bài thi thử Chứng chỉ hành nghề {title} ngày {dateLabel}.
                  Kết quả: Đạt {formatExamScore(attempt.score)}/{formatExamScore(totalMax)} điểm
                  ({attempt.correctCount}/{totalQ} câu đúng)
                  {scope.sector === 'dau-thau' ? ` · xếp loại ${grade}` : ''}.
                </>
              ) : (
                <>
                  Đã hoàn thành bài thi thử Chứng chỉ hành nghề {title} ngày {dateLabel}.
                  Kết quả: {formatExamScore(attempt.score)}/{formatExamScore(totalMax)} điểm
                  ({attempt.correctCount}/{totalQ} câu đúng) — chưa đạt lần này.
                </>
              )}
            </p>
            <p className="certificate-body certificate-body-sub">
              {scoreBits.join('  ·  ')}.
            </p>
            <p className="certificate-body certificate-body-rule">{examPassSummary(exam)}.</p>
          </div>

          <div className="certificate-foot">
            <p className="certificate-sign-mark">Onthi CCHN</p>
            <strong>ONTHICCHN.ORG</strong>
            <small>Nền tảng ôn thi sát hạch</small>
            <div className="certificate-meta">
              <span>Ngày {dateLabel}</span>
              <span className={passed ? 'certificate-seal' : 'certificate-seal practice'}>
                {passed ? 'ĐẠT' : 'ÔN TIẾP'}
              </span>
              <span>Mã {code}</span>
            </div>
            <p className="certificate-disclaimer">
              {passed ? (
                <>
                  Chứng nhận luyện đề trên <span>onthicchn.org</span> – không thay thế chứng
                  chỉ do cơ quan nhà nước cấp.
                </>
              ) : (
                <>
                  Phiếu luyện tập trên <span>onthicchn.org</span> – ghi nhận nỗ lực ôn thi,
                  không phải kết quả sát hạch chính thức.
                </>
              )}
            </p>
          </div>
        </div>
      </article>

      <div className="actions certificate-actions">
        <button
          className="btn primary"
          type="button"
          onClick={() => void downloadPng()}
          disabled={saving}
        >
          {saving ? 'Đang tạo ảnh…' : 'Tải ảnh PNG'}
        </button>
        <button className="btn copper" type="button" onClick={() => void share()}>
          Chia sẻ
        </button>
      </div>
    </section>
  )
}
