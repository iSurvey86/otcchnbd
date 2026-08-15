import { QUESTIONS, countByTopic, questionsByTopic } from '../data/questions'
import { TOPICS } from '../data/topics'
import {
  allXdQuestions,
  xdCountByTopic,
  xdQuestions,
  xdQuestionsByTopic,
  xdSourceNote,
} from '../data/xd/questions'
import { XD_TOPICS } from '../data/xd/topics'
import { xdTrackLabel } from '../data/xd/tracks'
import type { Question, StudyScope, Topic, TopicId } from '../types'

export function scopeKey(scope: StudyScope): string {
  if (scope.sector === 'xay-dung') return `xd:${scope.trackId ?? ''}`
  return 'do-dac'
}

export function questionsForScope(scope: StudyScope): Question[] {
  if (scope.sector === 'xay-dung' && scope.trackId) {
    return xdQuestions(scope.trackId)
  }
  return QUESTIONS
}

export function questionsByTopicForScope(
  scope: StudyScope,
  topicId?: TopicId,
): Question[] {
  if (scope.sector === 'xay-dung' && scope.trackId) {
    return xdQuestionsByTopic(scope.trackId, topicId)
  }
  return questionsByTopic(topicId)
}

export function topicsForScope(scope: StudyScope): Topic[] {
  if (scope.sector === 'xay-dung') return XD_TOPICS
  return TOPICS
}

export function countByTopicForScope(scope: StudyScope, topicId: TopicId): number {
  if (scope.sector === 'xay-dung' && scope.trackId) {
    return xdCountByTopic(scope.trackId, topicId)
  }
  return countByTopic(topicId)
}

export function sectorTitle(scope: StudyScope): string {
  if (scope.sector === 'xay-dung' && scope.trackId) {
    return `Xây dựng · ${xdTrackLabel(scope.trackId)}`
  }
  return 'Đo đạc và Bản đồ'
}

export function skillSectionLabel(scope: StudyScope): string {
  return scope.sector === 'xay-dung' ? 'Chuyên môn' : 'Kinh nghiệm nghề nghiệp'
}

export function lawSectionLabel(scope: StudyScope): string {
  return scope.sector === 'xay-dung'
    ? 'Kiến thức pháp luật (chung + riêng)'
    : 'Kiến thức pháp luật'
}

export function sourceNoteForScope(scope: StudyScope): string {
  if (scope.sector === 'xay-dung' && scope.trackId) {
    return xdSourceNote(scope.trackId)
  }
  return 'Ngân hàng câu hỏi theo Quyết định 308/QĐ-ĐĐBĐVN ngày 29/12/2020 của Cục Đo đạc, Bản đồ và Thông tin địa lý Việt Nam.'
}

export function findQuestionsByIds(ids: string[]): Question[] {
  const map = new Map(
    [...QUESTIONS, ...allXdQuestions()].map((q) => [q.id, q] as const),
  )
  return ids.map((id) => map.get(id)).filter((q): q is Question => Boolean(q))
}
