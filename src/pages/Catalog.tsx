import { QUESTIONS } from '../data/questions'
import { SECTORS } from '../data/sectors'
import { openXdQuestionTotal } from '../data/xd/tracks'
import type { AppView } from '../types'

interface Props {
  onNavigate: (view: AppView) => void
}

export function Catalog({ onNavigate }: Props) {
  return (
    <>
      <div className="catalog-head">
        <h1>Ôn thi sát hạch</h1>
        <p className="catalog-sub">Chọn ngành</p>
      </div>
      <div className="sector-grid">
        {SECTORS.filter((sector) => sector.visible).map((sector) => {
          if (!sector.open) {
            return (
              <div key={sector.id} className="sector-card sector-card-soon">
                <span className="badge">Sắp mở</span>
                <h2>{sector.title}</h2>
                <p>{sector.blurb}</p>
              </div>
            )
          }

          const badge =
            sector.id === 'do-dac-ban-do'
              ? `${QUESTIONS.length} câu`
              : `${openXdQuestionTotal()} câu`

          return (
            <button
              key={sector.id}
              className="sector-card sector-card-open"
              onClick={() =>
                onNavigate(
                  sector.id === 'xay-dung'
                    ? { name: 'xd-browse' }
                    : { name: 'home', scope: { sector: 'do-dac-ban-do' } },
                )
              }
            >
              <span className="badge">{badge}</span>
              <h2>{sector.title}</h2>
              <p>{sector.blurb}</p>
              <span className="sector-cta">
                {sector.id === 'xay-dung'
                  ? 'Chọn hạng và chuyên ngành'
                  : 'Vào ôn và thi thử'}
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}
