import { QUESTIONS } from '../data/questions'
import type {
  ExamAttempt,
  ExamConfig,
  Question,
  UserAnswer,
} from '../types'

export const EXAM: ExamConfig = {
  lawCount: 16,
  skillCount: 24,
  minutes: 45,
  pointsPerQuestion: 2.5,
  passPercent: 80,
}

export function sectionMax(section: 'phap-luat' | 'kinh-nghiem'): number {
  const count = section === 'phap-luat' ? EXAM.lawCount : EXAM.skillCount
  return count * EXAM.pointsPerQuestion
}

export function sectionPassMark(max: number): number {
  return (max * EXAM.passPercent) / 100
}

export function isSectionPassed(score: number, max: number): boolean {
  return score >= sectionPassMark(max)
}

export function isExamPassed(lawScore: number, skillScore: number): boolean {
  return (
    isSectionPassed(lawScore, sectionMax('phap-luat')) &&
    isSectionPassed(skillScore, sectionMax('kinh-nghiem'))
  )
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

export function pickExamQuestions(): Question[] {
  const law = shuffle(QUESTIONS.filter((q) => q.section === 'phap-luat'))
  const skill = shuffle(QUESTIONS.filter((q) => q.section === 'kinh-nghiem'))
  return [
    ...law.slice(0, EXAM.lawCount),
    ...skill.slice(0, EXAM.skillCount),
  ]
}

export function questionsByIds(ids: string[]): Question[] {
  const map = new Map(QUESTIONS.map((q) => [q.id, q]))
  return ids
    .map((id) => map.get(id))
    .filter((q): q is Question => Boolean(q))
}

export function scoreAttempt(
  questionIds: string[],
  answers: UserAnswer[],
): Pick<
  ExamAttempt,
  'score' | 'lawScore' | 'skillScore' | 'correctCount' | 'passed'
> {
  const questions = questionsByIds(questionIds)
  const choiceById = new Map(answers.map((a) => [a.questionId, a.choice]))
  let lawScore = 0
  let skillScore = 0
  let correctCount = 0

  for (const question of questions) {
    const choice = choiceById.get(question.id)
    if (choice === question.answer) {
      correctCount += 1
      if (question.section === 'phap-luat') lawScore += EXAM.pointsPerQuestion
      else skillScore += EXAM.pointsPerQuestion
    }
  }

  const score = lawScore + skillScore
  return {
    score,
    lawScore,
    skillScore,
    correctCount,
    passed: isExamPassed(lawScore, skillScore),
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
