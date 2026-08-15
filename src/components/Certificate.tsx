import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { lawSectionLabel, sectorTitle, skillSectionLabel } from '../lib/bank'
import {
  examConfigFor,
  examPassSummary,
  examQuestionCount,
  examTotalMax,
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

  async function renderCanvas() {
    if (!cardRef.current) return null
    return html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: passed ? '#fffdf7' : '#f7f4ec',
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
        <div className="certificate-ornament certificate-ornament-tl" aria-hidden />
        <div className="certificate-ornament certificate-ornament-br" aria-hidden />
        <div className="certificate-inner">
          <div className="certificate-brand">
            <span className="certificate-mark">ÔN</span>
            <span>
              <small>Ôn thi sát hạch</small>
              <strong>onthicchn.org</strong>
            </span>
          </div>

          {passed ? (
            <>
              <p className="certificate-eyebrow">Chứng nhận hoàn thành</p>
              <h3 className="certificate-title">Thi thử sát hạch trắc nghiệm</h3>
              <p className="certificate-awarded">Chứng nhận trao cho</p>
              <p className="certificate-name">{attempt.candidateName}</p>
              <p className="certificate-body">
                Đã hoàn thành bài thi thử Chứng chỉ hành nghề {title} – {totalQ} câu /{' '}
                {exam.minutes} phút. {examPassSummary(exam)}.
              </p>
            </>
          ) : (
            <>
              <p className="certificate-eyebrow">Phiếu ghi nhận luyện tập</p>
              <h3 className="certificate-title">Đang rèn luyện sát hạch</h3>
              <p className="certificate-awarded">Gửi lời động viên tới</p>
              <p className="certificate-name">{attempt.candidateName}</p>
              <p className="certificate-body">
                Vừa hoàn thành một đề thi thử Chứng chỉ hành nghề {title}.
                Đúng <strong>{attempt.correctCount}/{totalQ}</strong> câu – chưa đạt lần
                này, nhưng mỗi lần làm là thêm một bước gần đích. Cùng ôn tiếp nhé!
              </p>
            </>
          )}

          <div className="certificate-scores">
            <div>
              <b>
                {attempt.lawScore}/{lawMax}
              </b>
              <span>{lawSectionLabel(scope)}</span>
            </div>
            <div>
              <b>
                {attempt.skillScore}/{skillMax}
              </b>
              <span>{skillSectionLabel(scope)}</span>
            </div>
            <div>
              <b>
                {passed
                  ? `${attempt.score}/${totalMax}`
                  : `${attempt.correctCount}/${totalQ}`}
              </b>
              <span>{passed ? 'Tổng điểm' : 'Câu đúng'}</span>
            </div>
          </div>

          <div className="certificate-meta">
            <span>Ngày {dateLabel}</span>
            <span className={passed ? 'certificate-seal' : 'certificate-seal practice'}>
              {passed ? 'ĐẠT' : 'ÔN TIẾP'}
            </span>
            <span>Mã {code}</span>
          </div>
          <p className="certificate-disclaimer">
            {passed
              ? 'Chứng nhận luyện đề trên onthicchn.org – không thay thế chứng chỉ do cơ quan nhà nước cấp.'
              : 'Phiếu luyện tập trên onthicchn.org – ghi nhận nỗ lực ôn thi, không phải kết quả sát hạch chính thức.'}
          </p>
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
