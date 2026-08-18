import type { Question, TopicId } from '../../types'
import { dtDocGroupOf, dtRandCount, isDtDocGroup } from './groups'
import { readDtWrongIds } from '../../lib/dtPractice'

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

export function dtQuestions(_lotId?: string): Question[] {
  return allDtQuestions()
}

export function dtQuestionsByTopic(_lotId: string, topicId?: TopicId): Question[] {
  const all = allDtQuestions()
  if (!topicId || topicId === 'dt-nvcm') return all
  if (topicId === 'dt-sai') {
    const wrong = new Set(readDtWrongIds())
    return all.filter((q) => wrong.has(q.id))
  }
  const rand = dtRandCount(topicId)
  if (rand != null) return all.slice()
  if (isDtDocGroup(topicId)) {
    return all.filter((q) => dtDocGroupOf(q.source) === topicId)
  }
  return all
}

export function dtCountByTopic(_lotId: string, topicId: TopicId): number {
  return dtQuestionsByTopic('', topicId).length
}

export function dtSourceNote(): string {
  return cache?.source ?? SOURCE_FALLBACK
}

export function allDtQuestions(): Question[] {
  const rows = cache?.questions ?? []
  return rows.slice().sort((a, b) => a.stt - b.stt)
}

export function openDtQuestionTotal(): number {
  return 390
}
