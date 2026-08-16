import type { Question, TopicId } from '../../types'
import { getXdTrack, XD_TRACKS } from './tracks'

export interface XdBankFile {
  trackId: string
  fieldCode: string
  hang: string
  title: string
  source: string
  questions: Question[]
}

const SOURCE_FALLBACK = 'Quyết định 163/QĐ-BXD ngày 18/02/2025'

function trackFileName(trackId: string): string | null {
  const m = /^xd-(.+)-hang-(i{1,3})$/i.exec(trackId)
  if (!m) return null
  return `${m[1]}-hang-${m[2].toLowerCase()}.json`
}

const cache = new Map<string, XdBankFile>()
const inflight = new Map<string, Promise<XdBankFile | null>>()

function asBank(mod: unknown): XdBankFile {
  const raw = mod as XdBankFile & { default?: XdBankFile }
  return (raw.default ?? raw) as XdBankFile
}

const knownTrackIds = new Set(XD_TRACKS.map((t) => t.id))

export function hasXdLoader(trackId: string): boolean {
  return knownTrackIds.has(trackId) && Boolean(trackFileName(trackId))
}

export function getCachedXdBank(trackId: string): XdBankFile | undefined {
  return cache.get(trackId)
}

export function xdQuestions(trackId: string): Question[] {
  return cache.get(trackId)?.questions ?? []
}

export async function loadXdBank(trackId: string): Promise<XdBankFile | null> {
  const hit = cache.get(trackId)
  if (hit) return hit

  const pending = inflight.get(trackId)
  if (pending) return pending

  const file = trackFileName(trackId)
  if (!file) return null

  const task = import(
    /* webpackInclude: /[\w.-]+-hang-(i|ii|iii)\.json$/ */
    `./${file}`
  )
    .then((mod) => {
      const bank = asBank(mod)
      cache.set(trackId, bank)
      inflight.delete(trackId)
      return bank
    })
    .catch((err) => {
      inflight.delete(trackId)
      console.error('Failed to load XD bank', trackId, err)
      return null
    })

  inflight.set(trackId, task)
  return task
}

export function xdQuestionsByTopic(trackId: string, topicId?: TopicId): Question[] {
  const all = xdQuestions(trackId)
  if (!topicId) return all
  return all.filter((q) => q.topic === topicId)
}

export function xdCountByTopic(trackId: string, topicId: TopicId): number {
  return xdQuestions(trackId).filter((q) => q.topic === topicId).length
}

export function xdSourceNote(trackId: string): string {
  const cached = cache.get(trackId)
  const source = cached?.source ?? SOURCE_FALLBACK
  const track = getXdTrack(trackId)
  if (!track) return source
  return `${source} – ${track.title}, Hạng ${track.hang}.`
}

export function allXdQuestions(): Question[] {
  return [...cache.values()].flatMap((bank) => bank.questions)
}

export function findXdQuestionsByIds(ids: string[]): Question[] {
  const map = new Map(allXdQuestions().map((q) => [q.id, q] as const))
  return ids.map((id) => map.get(id)).filter((q): q is Question => Boolean(q))
}
