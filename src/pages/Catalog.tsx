import { QUESTIONS } from '../data/questions'
import { openDtQuestionTotal } from '../data/dt/questions'
import { SECTORS } from '../data/sectors'
import { openXdQuestionTotal } from '../data/xd/tracks'
import type { AppView, SectorId } from '../types'

interface Props {
  onNavigate: (view: AppView) => void
}

function sectorBadge(id: SectorId): string {
  if (id === 'do-dac-ban-do') return `${QUESTIONS.length} câu`
  if (id === 'xay-dung') return `${openXdQuestionTotal()} câu`
  if (id === 'dau-thau') return `${openDtQuestionTotal()} câu`
  return ''
}

function sectorTarget(id: SectorId): AppView {
  if (id === 'xay-dung') return { name: 'xd-browse' }
  if (id === 'dau-thau') return { name: 'dt-browse' }
  return { name: 'home', scope: { sector: 'do-dac-ban-do' } }
}

function sectorCta(id: SectorId): string {
  if (id === 'xay-dung') return 'Chọn hạng và chuyên ngành'
  if (id === 'dau-thau') return 'Chọn lô câu hỏi'
  return 'Vào ôn và thi thử'
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
              onClick={() => onNavigate(sectorTarget(sector.id))}
            >
              <span className="badge">{sectorBadge(sector.id)}</span>
              <h2>{sector.title}</h2>
              <p>{sector.blurb}</p>
              <span className="sector-cta">{sectorCta(sector.id)}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
