import type { ReactNode } from 'react'
import { useDdBank } from '../hooks/useDdBank'
import { useDtBank } from '../hooks/useDtBank'
import { useXdBank } from '../hooks/useXdBank'
import type { StudyScope } from '../types'

interface Props {
  scope: StudyScope
  children: ReactNode
}

/** Ensures track/lot/bank JSON is loaded before rendering study UI. */
export function TrackBankGate({ scope, children }: Props) {
  const xdTrackId = scope.sector === 'xay-dung' ? scope.trackId : undefined
  const ddBankId = scope.sector === 'do-dac-ban-do' ? scope.bankId : undefined
  const dtEnabled = scope.sector === 'dau-thau'
  const xd = useXdBank(xdTrackId)
  const dd = useDdBank(ddBankId)
  const dt = useDtBank(dtEnabled)

  if (scope.sector === 'do-dac-ban-do') {
    if (dd.status === 'loading' || dd.status === 'idle') {
      return <div className="panel empty">Đang tải ngân hàng câu hỏi…</div>
    }
    if (dd.status === 'missing' || dd.status === 'error') {
      return (
        <div className="panel empty">
          Chưa có ngân hàng câu hỏi cho bộ đề này.
        </div>
      )
    }
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
