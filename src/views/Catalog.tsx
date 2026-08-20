import { ddOpenQuestionTotal } from '../data/dd/banks'
import { openDtQuestionTotal } from '../data/dt/questions'
import { SECTORS } from '../data/sectors'
import { openXdQuestionTotal } from '../data/xd/tracks'
import { AppLink } from '../components/AppLink'
import type { AppView, SectorId } from '../types'

function sectorBadge(id: SectorId): string {
  if (id === 'do-dac-ban-do') return `${ddOpenQuestionTotal()} câu`
  if (id === 'xay-dung') return `${openXdQuestionTotal()} câu`
  if (id === 'dau-thau') return `${openDtQuestionTotal()} câu`
  return ''
}

function sectorTarget(id: SectorId): AppView {
  if (id === 'xay-dung') return { name: 'xd-browse' }
  if (id === 'dau-thau') return { name: 'dt-browse' }
  return { name: 'dd-browse' }
}

function sectorCta(id: SectorId): string {
  if (id === 'xay-dung') return 'Chọn hạng và chuyên ngành'
  if (id === 'dau-thau') return 'Ôn và thi thử'
  return 'Chọn ngân hàng câu hỏi'
}

/** Mỗi ngành một tông màu (kiểu KPI workflow ksnpsc). */
function sectorTone(id: SectorId): string {
  if (id === 'xay-dung') return 'sector-tone-sky'
  if (id === 'dau-thau') return 'sector-tone-amber'
  return 'sector-tone-teal'
}

export function Catalog() {
  return (
    <>
      <div className="catalog-head">
        <h1>Ôn thi sát hạch</h1>
        <p className="catalog-sub">Chọn ngành</p>
      </div>
      <div className="sector-grid">
        {SECTORS.filter((sector) => sector.visible).map((sector) => {
          const tone = sectorTone(sector.id)

          if (!sector.open) {
            return (
              <div
                key={sector.id}
                className={`sector-card sector-card-soon ${tone}`}
              >
                <span className="sector-card-bar" aria-hidden />
                <span className="badge">Sắp mở</span>
                <h2>{sector.title}</h2>
                <p>{sector.blurb}</p>
              </div>
            )
          }

          return (
            <AppLink
              key={sector.id}
              className={`sector-card sector-card-open ${tone}`}
              view={sectorTarget(sector.id)}
            >
              <span className="sector-card-bar" aria-hidden />
              <span className="badge">{sectorBadge(sector.id)}</span>
              <h2>{sector.title}</h2>
              <p>{sector.blurb}</p>
              <span className="sector-cta">{sectorCta(sector.id)}</span>
            </AppLink>
          )
        })}
      </div>
    </>
  )
}
