import { DT_LOTS, dtLotQuestionCount } from '../data/dt/lots'
import { openDtQuestionTotal } from '../data/dt/questions'
import { useDtBank } from '../hooks/useDtBank'
import type { AppView } from '../types'

interface Props {
  onNavigate: (view: AppView) => void
}

export function DtBrowse({ onNavigate }: Props) {
  const { status } = useDtBank(true)
  const total = openDtQuestionTotal()

  return (
    <>
      <div className="catalog-head">
        <h1>Đấu thầu</h1>
        <p className="catalog-sub">
          NVCM – {total} câu · chọn lô khoảng 20 câu để ôn và thi thử
        </p>
      </div>

      {status === 'loading' || status === 'idle' ? (
        <div className="panel empty">Đang tải ngân hàng câu hỏi…</div>
      ) : null}

      {status === 'missing' || status === 'error' ? (
        <div className="panel empty">Chưa tải được ngân hàng NVCM đấu thầu.</div>
      ) : null}

      {status === 'ready' ? (
        <div className="kpi-lot-grid">
          {DT_LOTS.map((lot) => {
            const count = dtLotQuestionCount(lot.id)
            return (
              <button
                key={lot.id}
                type="button"
                className={`kpi-lot-card kpi-pair-${lot.pair}`}
                onClick={() =>
                  onNavigate({
                    name: 'home',
                    scope: { sector: 'dau-thau', trackId: lot.id },
                  })
                }
              >
                <div className="kpi-lot-head">
                  <span className="kpi-lot-badge">{lot.index}</span>
                  <span className="kpi-lot-pill">NVCM</span>
                </div>
                <div className="kpi-lot-body">
                  <h3>{lot.title}</h3>
                  <p>
                    Câu {lot.sttFrom}–{lot.sttTo}
                  </p>
                  <p className="kpi-lot-meta">{count} câu hỏi</p>
                </div>
                <div className="kpi-lot-foot">
                  <span className="kpi-lot-cta">Vào ôn · thi thử</span>
                </div>
              </button>
            )
          })}
        </div>
      ) : null}
    </>
  )
}
