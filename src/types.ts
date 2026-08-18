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
  | 'pl-chung'
  | 'pl-rieng'
  | 'chuyen-mon'
  | 'dt-nvcm'
  | 'dt-luat'
  | 'dt-nd214'
  | 'dt-tt79'
  | 'dt-hon-hop'
  | 'dt-khac'
  | 'dt-sai'
  | 'dt-rand-10'
  | 'dt-rand-20'
  | 'dt-rand-30'

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
  /** per-section-percent = đo đạc; law-and-total = xây dựng NĐ 217 */
  passMode: 'per-section-percent' | 'law-and-total'
  passPercent?: number
  lawPassMin?: number
  totalPassMin?: number
}

export interface UserAnswer {
  questionId: string
  choice: number | null
  flagged: boolean
}

export type SectorId = 'do-dac-ban-do' | 'xay-dung' | 'dau-thau'

export type HangId = 'I' | 'II' | 'III'

export type XdGroupId =
  | 'khao-sat'
  | 'thiet-ke'
  | 'giam-sat'
  | 'dinh-gia'
  | 'quan-ly-du-an'

export interface StudyScope {
  sector: SectorId
  /** Required when sector is xay-dung (track) */
  trackId?: string
}

export interface ExamAttempt {
  id: string
  candidateName?: string
  sector?: SectorId
  trackId?: string
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

export type AppView =
  | { name: 'catalog' }
  | { name: 'xd-browse' }
  | { name: 'dt-browse' }
  | { name: 'home'; scope: StudyScope }
  | { name: 'practice'; scope: StudyScope; topicId?: TopicId }
  | { name: 'exam'; scope: StudyScope }
  | { name: 'result'; scope: StudyScope; attemptId: string }
  | { name: 'history'; scope: StudyScope }
  | { name: 'admin' }

export function isStudyView(view: AppView): boolean {
  return (
    view.name === 'home' ||
    view.name === 'practice' ||
    view.name === 'exam' ||
    view.name === 'result' ||
    view.name === 'history'
  )
}

export function getViewScope(view: AppView): StudyScope | null {
  if (
    view.name === 'home' ||
    view.name === 'practice' ||
    view.name === 'exam' ||
    view.name === 'result' ||
    view.name === 'history'
  ) {
    return view.scope
  }
  return null
}

/** @deprecated use isStudyView */
export function isDoDacView(view: AppView): boolean {
  return isStudyView(view)
}
