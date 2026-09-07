'use client'

import { useCallback, useEffect, useState } from 'react'
import { DD_GRID_DIAGRAMS, type DdGridDiagram } from '../data/dd/diagrams'

export function DdGridDiagrams() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<DdGridDiagram | null>(null)

  const closeLightbox = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, closeLightbox])

  return (
    <section className="related-block dd-diagrams" aria-label="Sơ đồ lưới tham khảo">
      <div className="section-head">
        <h2>Sơ đồ lưới tham khảo</h2>
      </div>
      <ul className="dd-diagram-list">
        {DD_GRID_DIAGRAMS.map((diagram, index) => {
          const open = expandedId === diagram.id
          return (
            <li key={diagram.id} className={`dd-diagram-item${open ? ' is-open' : ''}`}>
              <button
                type="button"
                className="dd-diagram-toggle"
                aria-expanded={open}
                onClick={() => setExpandedId(open ? null : diagram.id)}
              >
                <span className="dd-diagram-toggle-title">
                  {index + 1}. {diagram.title}{' '}
                  <span className="dd-diagram-source">({diagram.source})</span>
                </span>
                <span className="dd-diagram-chevron" aria-hidden>
                  {open ? '▾' : '▸'}
                </span>
              </button>
              {open ? (
                <div className="dd-diagram-panel">
                  <p className="dd-diagram-blurb">{diagram.blurb}</p>
                  <button
                    type="button"
                    className="dd-diagram-preview"
                    onClick={() => setLightbox(diagram)}
                    aria-label={`Phóng to: ${diagram.title}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={diagram.src} alt="" loading="lazy" />
                  </button>
                  <p className="muted dd-diagram-hint">Bấm ảnh để phóng to</p>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>

      {lightbox ? (
        <div className="modal-backdrop" onClick={closeLightbox} role="presentation">
          <figure
            className="dd-diagram-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.title}
          >
            <figcaption className="dd-diagram-modal-cap">
              <span>{lightbox.source}</span>
              <strong>{lightbox.title}</strong>
            </figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightbox.src} alt={lightbox.title} />
            <button type="button" className="btn ghost compact" onClick={closeLightbox}>
              Đóng
            </button>
          </figure>
        </div>
      ) : null}
    </section>
  )
}
