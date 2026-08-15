import type { ReactNode } from 'react'
import { useXdBank } from '../hooks/useXdBank'
import type { StudyScope } from '../types'

interface Props {
  scope: StudyScope
  children: ReactNode
}

/** Ensures Xây dựng track JSON is loaded before rendering study UI. */
export function TrackBankGate({ scope, children }: Props) {
  const trackId = scope.sector === 'xay-dung' ? scope.trackId : undefined
  const { status } = useXdBank(trackId)

  if (scope.sector !== 'xay-dung') {
    return <>{children}</>
  }

  if (status === 'loading' || status === 'idle') {
    return <div className="panel empty">Đang tải ngân hàng câu hỏi…</div>
  }

  if (status === 'missing' || status === 'error') {
    return (
      <div className="panel empty">
        Chưa có ngân hàng câu hỏi cho chuyên ngành này.
      </div>
    )
  }

  return <>{children}</>
}
