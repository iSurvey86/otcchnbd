import type { Question, TopicId } from '../../types'
import { getXdTrack } from './tracks'

export interface XdBankFile {
  trackId: string
  fieldCode: string
  hang: string
  title: string
  source: string
  questions: Question[]
}

const SOURCE_FALLBACK = 'Quyết định 163/QĐ-BXD ngày 18/02/2025'

/** Vite code-splits every bank JSON (excludes manifest). */
const modules = import.meta.glob(['./*-hang-*.json'])

function trackFilePath(trackId: string): string | null {
  const m = /^xd-(.+)-hang-(i{1,3})$/i.exec(trackId)
  if (!m) return null
  return `./${m[1]}-hang-${m[2].toLowerCase()}.json`
}

const cache = new Map<string, XdBankFile>()
const inflight = new Map<string, Promise<XdBankFile | null>>()

function asBank(mod: unknown): XdBankFile {
  const raw = mod as XdBankFile & { default?: XdBankFile }
  return (raw.default ?? raw) as XdBankFile
}

export function hasXdLoader(trackId: string): boolean {
  const path = trackFilePath(trackId)
  return Boolean(path && modules[path])
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

  const path = trackFilePath(trackId)
  const loader = path ? modules[path] : undefined
  if (!loader) return null

  const task = loader()
    .then((mod) => {
      const file = asBank(mod)
      cache.set(trackId, file)
      inflight.delete(trackId)
      return file
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
