import { QUESTIONS } from '../data/questions'
import { SECTORS } from '../data/sectors'
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
          return (
            <button
              key={sector.id}
              className="sector-card sector-card-open"
              onClick={() => onNavigate({ name: 'home' })}
            >
              <span className="badge">{QUESTIONS.length} câu</span>
              <h2>{sector.title}</h2>
              <p>{sector.blurb}</p>
              <span className="sector-cta">Vào ôn và thi thử</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
