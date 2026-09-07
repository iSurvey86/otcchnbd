import type { Question, Section, StudyScope, TopicId } from '../types'
import { resolveDdBankId } from '../data/dd/banks'

export interface QuestionOverride {
  id: string
  sector: string
  bankId: string
  trackId: string
  questionId: string
  prompt: string | null
  options: [string, string, string, string] | null
  answer: 0 | 1 | 2 | 3 | null
  explanation: string | null
  source: string | null
  section: Section | null
  topic: TopicId | null
  note: string | null
  updatedByEmail: string | null
  updatedAt: string
}

export type QuestionOverrideDbRow = {
  id: string
  sector: string
  bank_id: string
  track_id: string
  question_id: string
  prompt: string | null
  options: unknown
  answer: number | null
  explanation: string | null
  source: string | null
  section: string | null
  topic: string | null
  note: string | null
  updated_by_email: string | null
  updated_at: string
  created_at?: string
}

export const QUESTION_OVERRIDE_SELECT =
  'id, sector, bank_id, track_id, question_id, prompt, options, answer, explanation, source, section, topic, note, updated_by_email, updated_at, created_at'

export function scopeOverrideKeys(scope: StudyScope): {
  sector: string
  bankId: string
  trackId: string
} {
  if (scope.sector === 'do-dac-ban-do') {
    return {
      sector: scope.sector,
      bankId: resolveDdBankId(scope.bankId),
      trackId: '',
    }
  }
  if (scope.sector === 'xay-dung') {
    return {
      sector: scope.sector,
      bankId: '',
      trackId: scope.trackId ?? '',
    }
  }
  return { sector: 'dau-thau', bankId: '', trackId: '' }
}

export function overrideLookupKey(
  sector: string,
  bankId: string,
  trackId: string,
  questionId: string,
): string {
  return `${sector}|${bankId || ''}|${trackId || ''}|${questionId}`
}

export function overrideKeyFromScope(scope: StudyScope, questionId: string): string {
  const k = scopeOverrideKeys(scope)
  return overrideLookupKey(k.sector, k.bankId, k.trackId, questionId)
}

function parseOptions(raw: unknown): [string, string, string, string] | null {
  if (!Array.isArray(raw) || raw.length !== 4) return null
  const opts = raw.map((x) => String(x ?? '').trim())
  if (opts.some((x) => !x)) return null
  return [opts[0], opts[1], opts[2], opts[3]]
}

export function mapQuestionOverrideRow(row: QuestionOverrideDbRow): QuestionOverride {
  const answer =
    row.answer === 0 || row.answer === 1 || row.answer === 2 || row.answer === 3
      ? row.answer
      : null
  const section =
    row.section === 'phap-luat' || row.section === 'kinh-nghiem'
      ? row.section
      : null
  return {
    id: row.id,
    sector: row.sector,
    bankId: row.bank_id ?? '',
    trackId: row.track_id ?? '',
    questionId: row.question_id,
    prompt: row.prompt,
    options: parseOptions(row.options),
    answer,
    explanation: row.explanation,
    source: row.source,
    section,
    topic: (row.topic as TopicId | null) ?? null,
    note: row.note,
    updatedByEmail: row.updated_by_email,
    updatedAt: row.updated_at,
  }
}

export function applyOverride(
  question: Question,
  override: QuestionOverride | undefined,
): Question {
  if (!override) return question
  const note = String(override.note || '').trim()
  return {
    ...question,
    prompt: override.prompt ?? question.prompt,
    options: override.options ?? question.options,
    answer: override.answer ?? question.answer,
    explanation: override.explanation ?? question.explanation,
    source: override.source ?? question.source,
    section: override.section ?? question.section,
    topic: override.topic ?? question.topic,
    adminNote: note || undefined,
  }
}

export function applyOverridesToList(
  questions: Question[],
  scope: StudyScope,
  byKey: Map<string, QuestionOverride>,
): Question[] {
  if (byKey.size === 0) return questions
  return questions.map((q) =>
    applyOverride(q, byKey.get(overrideKeyFromScope(scope, q.id))),
  )
}

export function buildOverrideMap(
  rows: QuestionOverride[],
): Map<string, QuestionOverride> {
  const map = new Map<string, QuestionOverride>()
  for (const row of rows) {
    map.set(
      overrideLookupKey(row.sector, row.bankId, row.trackId, row.questionId),
      row,
    )
  }
  return map
}
