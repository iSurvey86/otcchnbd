import type { Question, TopicId } from '../../types'
import { getDtLot } from './lots'

export interface DtBankFile {
  id: string
  title: string
  source: string
  questions: Array<
    Question & {
      stt: number
      lot: number
    }
  >
}

const SOURCE_FALLBACK = 'Ngân hàng NVCM đấu thầu 390 câu'

let cache: DtBankFile | null = null
let inflight: Promise<DtBankFile | null> | null = null

function asBank(mod: unknown): DtBankFile {
  const raw = mod as DtBankFile & { default?: DtBankFile }
  return (raw.default ?? raw) as DtBankFile
}

export function getCachedDtBank(): DtBankFile | undefined {
  return cache ?? undefined
}

export async function loadDtBank(): Promise<DtBankFile | null> {
  if (cache) return cache
  if (inflight) return inflight

  inflight = import('./bank.json')
    .then((mod) => {
      const file = asBank(mod)
      cache = file
      inflight = null
      return file
    })
    .catch((err) => {
      inflight = null
      console.error('Failed to load Đấu thầu bank', err)
      return null
    })

  return inflight
}

export function dtQuestions(lotId: string): Question[] {
  const lot = getDtLot(lotId)
  if (!lot || !cache) return []
  return cache.questions.filter((q) => q.stt >= lot.sttFrom && q.stt <= lot.sttTo)
}

export function dtQuestionsByTopic(lotId: string, topicId?: TopicId): Question[] {
  const all = dtQuestions(lotId)
  if (!topicId) return all
  return all.filter((q) => q.topic === topicId)
}

export function dtCountByTopic(lotId: string, topicId: TopicId): number {
  return dtQuestions(lotId).filter((q) => q.topic === topicId).length
}

export function dtSourceNote(): string {
  return cache?.source ?? SOURCE_FALLBACK
}

export function allDtQuestions(): Question[] {
  return cache?.questions ?? []
}

export function openDtQuestionTotal(): number {
  return 390
}
