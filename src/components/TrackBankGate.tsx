import type { ReactNode } from 'react'
import { useDtBank } from '../hooks/useDtBank'
import { useXdBank } from '../hooks/useXdBank'
import type { StudyScope } from '../types'

interface Props {
  scope: StudyScope
  children: ReactNode
}

/** Ensures track/lot JSON is loaded before rendering study UI. */
export function TrackBankGate({ scope, children }: Props) {
  const xdTrackId = scope.sector === 'xay-dung' ? scope.trackId : undefined
  const dtEnabled = scope.sector === 'dau-thau'
  const xd = useXdBank(xdTrackId)
  const dt = useDtBank(dtEnabled)

  if (scope.sector === 'do-dac-ban-do') {
    return <>{children}</>
  }

  if (scope.sector === 'xay-dung') {
    if (xd.status === 'loading' || xd.status === 'idle') {
      return <div className="panel empty">Đang tải ngân hàng câu hỏi…</div>
    }
    if (xd.status === 'missing' || xd.status === 'error') {
      return (
        <div className="panel empty">
          Chưa có ngân hàng câu hỏi cho chuyên ngành này.
        </div>
      )
    }
    return <>{children}</>
  }

  if (scope.sector === 'dau-thau') {
    if (dt.status === 'loading' || dt.status === 'idle') {
      return <div className="panel empty">Đang tải ngân hàng câu hỏi…</div>
    }
    if (dt.status === 'missing' || dt.status === 'error') {
      return (
        <div className="panel empty">Chưa tải được ngân hàng NVCM đấu thầu.</div>
      )
    }
    return <>{children}</>
  }

  return <>{children}</>
}
