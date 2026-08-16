export interface DtLot {
  id: string
  index: number
  title: string
  sttFrom: number
  sttTo: number
  /** 0–9: cặp màu (lô 1–2 cùng pair 0, 3–4 pair 1, …) */
  pair: number
}

export const DT_LOT_COUNT = 20
export const DT_QUESTIONS_PER_LOT = 20

export const DT_LOTS: DtLot[] = Array.from({ length: DT_LOT_COUNT }, (_, i) => {
  const index = i + 1
  const sttFrom = i * DT_QUESTIONS_PER_LOT + 1
  const sttTo = Math.min(sttFrom + DT_QUESTIONS_PER_LOT - 1, 390)
  return {
    id: `dt-lo-${String(index).padStart(2, '0')}`,
    index,
    title: `Lô ${String(index).padStart(2, '0')}`,
    sttFrom,
    sttTo,
    pair: Math.floor(i / 2),
  }
})

export function getDtLot(lotId: string | undefined): DtLot | undefined {
  if (!lotId) return undefined
  return DT_LOTS.find((l) => l.id === lotId)
}

export function dtLotLabel(lotId: string | undefined): string {
  const lot = getDtLot(lotId)
  if (!lot) return 'Đấu thầu'
  return `${lot.title} (câu ${lot.sttFrom}–${lot.sttTo})`
}

export function dtLotQuestionCount(lotId: string | undefined): number {
  const lot = getDtLot(lotId)
  if (!lot) return 0
  return lot.sttTo - lot.sttFrom + 1
}
