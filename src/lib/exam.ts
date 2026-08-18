import { QUESTIONS } from '../data/questions'
import { dtLotQuestionCount } from '../data/dt/lots'
import { findQuestionsByIds } from './bank'
import type {
  ExamAttempt,
  ExamConfig,
  Question,
  StudyScope,
  UserAnswer,
} from '../types'

/** Đo đạc và Bản đồ – khung sát hạch hiện dùng trên app. */
export const EXAM_DO_DAC: ExamConfig = {
  lawCount: 16,
  skillCount: 24,
  minutes: 45,
  pointsPerQuestion: 2.5,
  passMode: 'per-section-percent',
  passPercent: 80,
}

/**
 * Xây dựng – Nghị định 217/2026/NĐ-CP (Điều 90 khoản 4).
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

/**
 * Đấu thầu NVCM – Thông báo 1891/TB-QLĐT: 70 câu / 60 phút / 100 điểm.
 * Đạt ≥ 50% tổng điểm (Điều 20 Thông tư 02/2024/TT-BKHĐT).
 */
export const EXAM_DAU_THAU: ExamConfig = {
  lawCount: 0,
  skillCount: 70,
  minutes: 60,
  pointsPerQuestion: 100 / 70,
  passMode: 'per-section-percent',
  passPercent: 50,
}

/** Đề lô cũ (trước khi chuyển 70 câu) — dùng đọc lịch sử. */
export function examDauThauForLot(lotId: string | undefined): ExamConfig {
  const n = Math.max(1, dtLotQuestionCount(lotId))
  return {
    lawCount: 0,
    skillCount: n,
    minutes: Math.max(15, Math.round(n * 1.25)),
    pointsPerQuestion: 1,
    passMode: 'per-section-percent',
    passPercent: 80,
  }
}

/** @deprecated use examConfigFor(scope) */
export const EXAM = EXAM_DO_DAC

export function examConfigFor(scope: StudyScope): ExamConfig {
  if (scope.sector === 'xay-dung') return EXAM_XAY_DUNG
  if (scope.sector === 'dau-thau') {
    if (scope.trackId?.startsWith('dt-lo-')) return examDauThauForLot(scope.trackId)
    return EXAM_DAU_THAU
  }
  return EXAM_DO_DAC
}

export function examGradeLabel(score: number, totalMax: number): string {
  if (totalMax <= 0) return 'Không đạt'
  const p = score / totalMax
  if (p > 0.9) return 'Xuất sắc'
  if (p >= 0.8) return 'Giỏi'
  if (p >= 0.6) return 'Khá'
  if (p >= 0.5) return 'Trung bình'
  return 'Không đạt'
}

export function examQuestionCount(config: ExamConfig): number {
  return config.lawCount + config.skillCount
}

export function examTotalMax(config: ExamConfig): number {
  const raw = examQuestionCount(config) * config.pointsPerQuestion
  return Math.round(raw * 10) / 10
}

export function formatExamScore(value: number): string {
  return value.toLocaleString('vi-VN', { maximumFractionDigits: 1 })
}

/** Ngưỡng điểm tổng để coi là đạt (hiển thị nhật ký). */
export function examPassMark(config: ExamConfig): number {
  if (config.passMode === 'law-and-total') {
    return config.totalPassMin ?? examTotalMax(config)
  }
  return (examTotalMax(config) * (config.passPercent ?? 80)) / 100
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
    // Chuyên môn không có ngưỡng riêng – chỉ xét qua tổng điểm.
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
  if (config.lawCount === 0) {
    const skillMax = sectionMax('kinh-nghiem', config)
    return `Đạt khi ≥ ${config.passPercent}%: ≥ ${sectionPassMark(skillMax, config)}/${skillMax}`
  }
  if (config.skillCount === 0) {
    const lawMax = sectionMax('phap-luat', config)
    return `Đạt khi ≥ ${config.passPercent}%: ≥ ${sectionPassMark(lawMax, config)}/${lawMax}`
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
  if (config.lawCount === 0) {
    return shuffle(pool).slice(0, config.skillCount)
  }
  if (config.skillCount === 0) {
    return shuffle(pool).slice(0, config.lawCount)
  }
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

  const lawRounded = Math.round(lawScore * 10) / 10
  const skillRounded = Math.round(skillScore * 10) / 10
  const score = Math.round((lawRounded + skillRounded) * 10) / 10
  return {
    score,
    lawScore: lawRounded,
    skillScore: skillRounded,
    correctCount,
    passed: isExamPassed(lawRounded, skillRounded, config),
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
