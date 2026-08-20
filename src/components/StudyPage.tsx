'use client'

import { TrackBankGate } from '@/components/TrackBankGate'
import { Exam } from '@/views/Exam'
import { History } from '@/views/History'
import { Home } from '@/views/Home'
import { Practice } from '@/views/Practice'
import { Result } from '@/views/Result'
import { useAppNavigate } from '@/lib/useAppNavigate'
import type { SectorId, StudyScope, TopicId } from '@/types'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

type StudyMode = 'home' | 'practice' | 'exam' | 'history' | 'result'

export function StudyPage({
  sector,
  trackId,
  bankId,
  mode,
  attemptId,
}: {
  sector: SectorId
  trackId?: string
  bankId?: string
  mode: StudyMode
  attemptId?: string
}) {
  const scope: StudyScope = { sector, trackId, bankId }
  const onNavigate = useAppNavigate()

  return (
    <Suspense fallback={<p className="empty">Đang tải…</p>}>
      <StudyBody
        scope={scope}
        mode={mode}
        attemptId={attemptId}
        onNavigate={onNavigate}
      />
    </Suspense>
  )
}

function StudyBody({
  scope,
  mode,
  attemptId,
  onNavigate,
}: {
  scope: StudyScope
  mode: StudyMode
  attemptId?: string
  onNavigate: ReturnType<typeof useAppNavigate>
}) {
  const searchParams = useSearchParams()
  const topicId = (searchParams.get('topic') as TopicId | null) ?? undefined

  if (mode === 'home') {
    return (
      <TrackBankGate scope={scope}>
        <Home scope={scope} />
      </TrackBankGate>
    )
  }

  if (mode === 'practice') {
    return (
      <TrackBankGate scope={scope}>
        <Practice
          key={`${scope.sector}:${scope.trackId ?? ''}:${scope.bankId ?? ''}:${topicId ?? 'all'}`}
          scope={scope}
          topicId={topicId}
        />
      </TrackBankGate>
    )
  }

  if (mode === 'exam') {
    return (
      <TrackBankGate scope={scope}>
        <Exam
          key={`${scope.sector}:${scope.trackId ?? ''}:${scope.bankId ?? ''}`}
          scope={scope}
          onFinish={(id) =>
            onNavigate({ name: 'result', scope, attemptId: id })
          }
        />
      </TrackBankGate>
    )
  }

  if (mode === 'history') {
    return <History scope={scope} />
  }

  if (mode === 'result' && attemptId) {
    return (
      <TrackBankGate scope={scope}>
        <Result attemptId={attemptId} scope={scope} />
      </TrackBankGate>
    )
  }

  return <p className="empty">Không tìm thấy trang.</p>
}
