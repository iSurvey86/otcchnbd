import type { AppView, SectorId, StudyScope, TopicId } from '../types'

export function scopeBasePath(scope: StudyScope): string {
  if (scope.sector === 'do-dac-ban-do') return '/do-dac-ban-do'
  if (scope.sector === 'xay-dung') {
    return scope.trackId ? `/xay-dung/${encodeURIComponent(scope.trackId)}` : '/xay-dung'
  }
  return scope.trackId ? `/dau-thau/${encodeURIComponent(scope.trackId)}` : '/dau-thau'
}

export function pathForView(view: AppView): string {
  switch (view.name) {
    case 'catalog':
      return '/'
    case 'xd-browse':
      return '/xay-dung'
    case 'dt-browse':
      return '/dau-thau'
    case 'admin':
      return '/admin'
    case 'home':
      return scopeBasePath(view.scope)
    case 'practice': {
      const base = `${scopeBasePath(view.scope)}/practice`
      return view.topicId ? `${base}?topic=${encodeURIComponent(view.topicId)}` : base
    }
    case 'exam':
      return `${scopeBasePath(view.scope)}/exam`
    case 'history':
      return `${scopeBasePath(view.scope)}/history`
    case 'result':
      return `${scopeBasePath(view.scope)}/result/${encodeURIComponent(view.attemptId)}`
    default: {
      const _exhaustive: never = view
      return _exhaustive
    }
  }
}

function isSector(value: string): value is SectorId {
  return value === 'do-dac-ban-do' || value === 'xay-dung' || value === 'dau-thau'
}

function studyView(
  scope: StudyScope,
  action: string | undefined,
  attemptId: string | undefined,
  topicId: TopicId | undefined,
): AppView {
  if (action === 'practice') return { name: 'practice', scope, topicId }
  if (action === 'exam') return { name: 'exam', scope }
  if (action === 'history') return { name: 'history', scope }
  if (action === 'result' && attemptId) {
    return { name: 'result', scope, attemptId: decodeURIComponent(attemptId) }
  }
  return { name: 'home', scope }
}

/** Derive AppView from Next.js pathname + search (for chrome/nav). */
export function viewFromPath(
  pathname: string,
  searchParams?: URLSearchParams | { get(name: string): string | null },
): AppView {
  const path = pathname.replace(/\/+$/, '') || '/'
  const topicRaw = searchParams?.get('topic') ?? undefined
  const topicId = topicRaw as TopicId | undefined

  if (path === '/') return { name: 'catalog' }
  if (path === '/admin') return { name: 'admin' }
  if (path === '/xay-dung') return { name: 'xd-browse' }
  if (path === '/dau-thau') return { name: 'dt-browse' }

  // /do-dac-ban-do[/practice|exam|history|result/:id]
  const doDac = path.match(/^\/do-dac-ban-do(?:\/(practice|exam|history|result)(?:\/([^/]+))?)?$/)
  if (doDac) {
    return studyView({ sector: 'do-dac-ban-do' }, doDac[1], doDac[2], topicId)
  }

  // /xay-dung/:trackId[/...] or /dau-thau/:trackId[/...]
  const tracked = path.match(
    /^\/(xay-dung|dau-thau)\/([^/]+)(?:\/(practice|exam|history|result)(?:\/([^/]+))?)?$/,
  )
  if (tracked && isSector(tracked[1])) {
    const scope: StudyScope = {
      sector: tracked[1],
      trackId: decodeURIComponent(tracked[2]),
    }
    return studyView(scope, tracked[3], tracked[4], topicId)
  }

  return { name: 'catalog' }
}
