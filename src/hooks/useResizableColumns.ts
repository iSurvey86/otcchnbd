'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'

export function useResizableColumns(
  storageKey: string,
  defaults: Record<string, number>,
  mins: Record<string, number>,
) {
  const [widths, setWidths] = useState(defaults)
  const [hydrated, setHydrated] = useState(false)
  const widthsRef = useRef(widths)
  widthsRef.current = widths

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>
        setWidths((prev) => {
          const next = { ...prev }
          for (const key of Object.keys(defaults)) {
            const n = parsed[key]
            if (typeof n === 'number' && Number.isFinite(n)) {
              next[key] = Math.max(mins[key] ?? 40, Math.round(n))
            }
          }
          return next
        })
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [storageKey, defaults, mins])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(widths))
    } catch {
      /* ignore */
    }
  }, [hydrated, storageKey, widths])

  const onResizeStart = useCallback(
    (key: string, event: PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const startX = event.clientX
      const startW = widthsRef.current[key] ?? defaults[key] ?? 80
      const min = mins[key] ?? 40
      const handle = event.currentTarget
      handle.setPointerCapture(event.pointerId)
      document.body.classList.add('col-resizing')

      const onMove = (ev: globalThis.PointerEvent) => {
        const next = Math.max(min, Math.round(startW + ev.clientX - startX))
        setWidths((prev) => (prev[key] === next ? prev : { ...prev, [key]: next }))
      }
      const onUp = (ev: globalThis.PointerEvent) => {
        try {
          handle.releasePointerCapture(ev.pointerId)
        } catch {
          /* ignore */
        }
        handle.removeEventListener('pointermove', onMove)
        handle.removeEventListener('pointerup', onUp)
        document.body.classList.remove('col-resizing')
      }
      handle.addEventListener('pointermove', onMove)
      handle.addEventListener('pointerup', onUp)
    },
    [defaults, mins],
  )

  const tableWidth = Object.values(widths).reduce((sum, n) => sum + n, 0)
  return { widths, tableWidth, onResizeStart }
}
