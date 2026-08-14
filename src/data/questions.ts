import { LAW_QUESTIONS } from './questions-law'
import { SKILL_QUESTIONS } from './questions-skill'
import type { Question, TopicId } from '../types'

export const QUESTIONS: Question[] = [...LAW_QUESTIONS, ...SKILL_QUESTIONS]

export function questionsByTopic(topicId?: TopicId): Question[] {
  if (!topicId) return QUESTIONS
  return QUESTIONS.filter((q) => q.topic === topicId)
}

export function countByTopic(topicId: TopicId): number {
  return QUESTIONS.filter((q) => q.topic === topicId).length
}
