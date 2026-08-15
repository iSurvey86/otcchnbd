export type Section = 'phap-luat' | 'kinh-nghiem'

export type TopicId =
  | 'luat-chung'
  | 'giay-phep-chung-chi'
  | 'cong-trinh-ha-tang'
  | 'csdl-ban-do'
  | 'toan-ban-do'
  | 'do-truc-tiep'
  | 'anh-vien-tham'
  | 'chat-luong-de-an'

export interface Topic {
  id: TopicId
  section: Section
  title: string
  blurb: string
}

export interface Question {
  id: string
  section: Section
  topic: TopicId
  prompt: string
  options: [string, string, string, string]
  answer: 0 | 1 | 2 | 3
  explanation: string
  source: string
}

export interface ExamConfig {
  lawCount: number
  skillCount: number
  minutes: number
  pointsPerQuestion: number
  passPercent: number
}

export interface UserAnswer {
  questionId: string
  choice: number | null
  flagged: boolean
}

export interface ExamAttempt {
  id: string
  startedAt: string
  finishedAt: string
  durationSec: number
  timedOut: boolean
  answers: UserAnswer[]
  questionIds: string[]
  score: number
  lawScore: number
  skillScore: number
  correctCount: number
  passed: boolean
}

export type SectorId = 'do-dac-ban-do' | 'xay-dung'

export type AppView =
  | { name: 'catalog' }
  | { name: 'home' }
  | { name: 'practice'; topicId?: TopicId }
  | { name: 'exam' }
  | { name: 'result'; attemptId: string }
  | { name: 'history' }
  | { name: 'admin' }

export function isDoDacView(view: AppView): boolean {
  return (
    view.name === 'home' ||
    view.name === 'practice' ||
    view.name === 'exam' ||
    view.name === 'result' ||
    view.name === 'history'
  )
}
