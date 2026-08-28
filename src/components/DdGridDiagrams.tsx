'use client'

import { useCallback, useEffect, useState } from 'react'
import { DD_GRID_DIAGRAMS, type DdGridDiagram } from '../data/dd/diagrams'

export function DdGridDiagrams() {
  const [open, setOpen] = useState<DdGridDiagram | null>(null)

  const close = useCallback(() => setOpen(null), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  return (
    <section className="related-block dd-diagrams" aria-label="Sơ đồ lưới tham khảo">
      <div className="section-head">
        <h2>Sơ đồ lưới tham khảo</h2>
      </div>
      <p className="muted dd-diagrams-intro">
        Hệ thống lưới tọa độ, độ cao và lưới GNSS theo TT 68/2015 và TCVN 9401:2024 — minh
        họa ôn phần kinh nghiệm nghề nghiệp.
      </p>
      <div className="dd-diagram-grid">
        {DD_GRID_DIAGRAMS.map((diagram) => (
          <button
            key={diagram.id}
            type="button"
            className="dd-diagram-card"
            onClick={() => setOpen(diagram)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={diagram.src} alt="" loading="lazy" />
            <div className="dd-diagram-caption">
              <span className="dd-diagram-source">{diagram.source}</span>
              <h3>{diagram.title}</h3>
              <p>{diagram.blurb}</p>
            </div>
          </button>
        ))}
      </div>

      {open ? (
        <div className="modal-backdrop" onClick={close} role="presentation">
          <figure
            className="dd-diagram-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
          >
            <figcaption className="dd-diagram-modal-cap">
              <span>{open.source}</span>
              <strong>{open.title}</strong>
            </figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.src} alt={open.title} />
            <button type="button" className="btn ghost compact" onClick={close}>
              Đóng
            </button>
          </figure>
        </div>
      ) : null}
    </section>
  )
}
