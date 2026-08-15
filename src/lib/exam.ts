import { QUESTIONS } from '../data/questions'
import { findQuestionsByIds } from './bank'
import type {
  ExamAttempt,
  ExamConfig,
  Question,
  StudyScope,
  UserAnswer,
} from '../types'

/** Đo đạc và Bản đồ — khung sát hạch hiện dùng trên app. */
export const EXAM_DO_DAC: ExamConfig = {
  lawCount: 16,
  skillCount: 24,
  minutes: 45,
  pointsPerQuestion: 2.5,
  passMode: 'per-section-percent',
  passPercent: 80,
}

/**
 * Xây dựng — Nghị định 217/2026/NĐ-CP (Điều 90 khoản 4).
 * 30 câu / 30 phút · 10 pháp luật + 20 chuyên môn · 1 điểm/câu.
 * Đạt: PL ≥ 7/10 và tổng ≥ 21/30.
 */
export const EXAM_XAY_DUNG: ExamConfig = {
  lawCount: 10,
  skillCount: 20,
  minutes: 30,
  pointsPerQuestion: 1,
  passMode: 'law-and-total',
  lawPassMin: 7,
  totalPassMin: 21,
}

/** @deprecated use examConfigFor(scope) */
export const EXAM = EXAM_DO_DAC

export function examConfigFor(scope: StudyScope): ExamConfig {
  return scope.sector === 'xay-dung' ? EXAM_XAY_DUNG : EXAM_DO_DAC
}

export function examQuestionCount(config: ExamConfig): number {
  return config.lawCount + config.skillCount
}

export function examTotalMax(config: ExamConfig): number {
  return examQuestionCount(config) * config.pointsPerQuestion
}

export function sectionMax(
  section: 'phap-luat' | 'kinh-nghiem',
  config: ExamConfig = EXAM_DO_DAC,
): number {
  const count = section === 'phap-luat' ? config.lawCount : config.skillCount
  return count * config.pointsPerQuestion
}

export function sectionPassMark(max: number, config: ExamConfig = EXAM_DO_DAC): number {
  if (config.passMode === 'law-and-total') {
    return config.lawPassMin ?? 0
  }
  return (max * (config.passPercent ?? 80)) / 100
}

export function isSectionPassed(
  score: number,
  max: number,
  config: ExamConfig = EXAM_DO_DAC,
  section: 'phap-luat' | 'kinh-nghiem' = 'phap-luat',
): boolean {
  if (config.passMode === 'law-and-total') {
    if (section === 'phap-luat') return score >= (config.lawPassMin ?? 0)
    // Chuyên môn không có ngưỡng riêng — chỉ xét qua tổng điểm.
    return true
  }
  return score >= sectionPassMark(max, config)
}

export function isExamPassed(
  lawScore: number,
  skillScore: number,
  config: ExamConfig = EXAM_DO_DAC,
): boolean {
  if (config.passMode === 'law-and-total') {
    const total = lawScore + skillScore
    return (
      lawScore >= (config.lawPassMin ?? 0) &&
      total >= (config.totalPassMin ?? 0)
    )
  }
  return (
    isSectionPassed(lawScore, sectionMax('phap-luat', config), config, 'phap-luat') &&
    isSectionPassed(skillScore, sectionMax('kinh-nghiem', config), config, 'kinh-nghiem')
  )
}

export function examPassSummary(config: ExamConfig): string {
  if (config.passMode === 'law-and-total') {
    return `Đạt khi pháp luật ≥ ${config.lawPassMin}/${sectionMax('phap-luat', config)} và tổng ≥ ${config.totalPassMin}/${examTotalMax(config)}`
  }
  const lawMax = sectionMax('phap-luat', config)
  const skillMax = sectionMax('kinh-nghiem', config)
  return `Đạt khi mỗi phần ≥ ${config.passPercent}%: pháp luật ≥ ${sectionPassMark(lawMax, config)}/${lawMax}, nghề nghiệp ≥ ${sectionPassMark(skillMax, config)}/${skillMax}`
}

export function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = next[i]
    next[i] = next[j] as T
    next[j] = current as T
  }
  return next
}

export function pickExamQuestions(
  pool: Question[] = QUESTIONS,
  config: ExamConfig = EXAM_DO_DAC,
): Question[] {
  const law = shuffle(pool.filter((q) => q.section === 'phap-luat'))
  const skill = shuffle(pool.filter((q) => q.section === 'kinh-nghiem'))
  return [
    ...law.slice(0, config.lawCount),
    ...skill.slice(0, config.skillCount),
  ]
}

export function questionsByIds(ids: string[], pool?: Question[]): Question[] {
  if (pool) {
    const map = new Map(pool.map((q) => [q.id, q]))
    return ids
      .map((id) => map.get(id))
      .filter((q): q is Question => Boolean(q))
  }
  return findQuestionsByIds(ids)
}

export function scoreAttempt(
  questionIds: string[],
  answers: UserAnswer[],
  pool?: Question[],
  config: ExamConfig = EXAM_DO_DAC,
): Pick<
  ExamAttempt,
  'score' | 'lawScore' | 'skillScore' | 'correctCount' | 'passed'
> {
  const questions = questionsByIds(questionIds, pool)
  const choiceById = new Map(answers.map((a) => [a.questionId, a.choice]))
  let lawScore = 0
  let skillScore = 0
  let correctCount = 0

  for (const question of questions) {
    const choice = choiceById.get(question.id)
    if (choice === question.answer) {
      correctCount += 1
      if (question.section === 'phap-luat') lawScore += config.pointsPerQuestion
      else skillScore += config.pointsPerQuestion
    }
  }

  const score = lawScore + skillScore
  return {
    score,
    lawScore,
    skillScore,
    correctCount,
    passed: isExamPassed(lawScore, skillScore, config),
  }
}

export function formatTime(totalSec: number): string {
  const safe = Math.max(0, totalSec)
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function letter(index: number): string {
  return ['A', 'B', 'C', 'D'][index] ?? ''
}
