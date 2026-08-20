import type { ReactNode } from 'react'
import { AppLink } from './AppLink'
import { relatedDdBanks } from '../data/dd/banks'
import { DT_DOC_GROUPS } from '../data/dt/groups'
import { relatedXdTracks } from '../data/xd/tracks'
import type { AppView, StudyScope } from '../types'

interface Props {
  scope: StudyScope
}

export function RelatedLinks({ scope }: Props) {
  if (scope.sector === 'xay-dung' && scope.trackId) {
    const related = relatedXdTracks(scope.trackId, 4)
    if (related.length === 0) return null
    return (
      <RelatedBlock title="Chuyên ngành liên quan">
        {related.map((track, index) => (
          <AppLink
            key={track.id}
            className={`topic-card topic-tone-${index % 8}`}
            view={{
              name: 'home',
              scope: { sector: 'xay-dung', trackId: track.id },
            }}
          >
            <span className="topic-card-bar" aria-hidden />
            <span className="count">{track.questionCount} câu</span>
            <h3>
              {track.fieldCode} · {track.title}
            </h3>
            <p>Hạng {track.hang} · cùng nhóm lĩnh vực hoặc cùng mã chuyên ngành</p>
          </AppLink>
        ))}
        <AppLink className="topic-card topic-tone-6 related-kpi-more" view={{ name: 'xd-browse' }}>
          <span className="topic-card-bar" aria-hidden />
          <span className="count">Tất cả</span>
          <h3>Xem tất cả chuyên ngành Xây dựng</h3>
          <p>Chọn hạng và lĩnh vực khác</p>
        </AppLink>
      </RelatedBlock>
    )
  }

  if (scope.sector === 'do-dac-ban-do') {
    const related = relatedDdBanks(scope.bankId, 3)
    if (related.length === 0) return null
    return (
      <RelatedBlock title="Bộ đề Đo đạc khác">
        {related.map((bank, index) => (
          <AppLink
            key={bank.id}
            className={`topic-card topic-tone-${(index + 1) % 8}`}
            view={{
              name: 'home',
              scope: { sector: 'do-dac-ban-do', bankId: bank.id },
            }}
          >
            <span className="topic-card-bar" aria-hidden />
            <span className="count">{bank.questionCountHint ?? '…'} câu</span>
            <h3>{bank.title}</h3>
            <p>
              {bank.kind === 'official' ? 'Ngân hàng chính thức' : 'Bộ cập nhật ONTHICCHN'}
              {bank.periodLabel ? ` · ${bank.periodLabel}` : ''}
            </p>
          </AppLink>
        ))}
        <AppLink className="topic-card topic-tone-0 related-kpi-more" view={{ name: 'dd-browse' }}>
          <span className="topic-card-bar" aria-hidden />
          <span className="count">Danh sách</span>
          <h3>Chọn lại ngân hàng câu hỏi</h3>
          <p>Toàn bộ bộ đề Đo đạc và Bản đồ</p>
        </AppLink>
      </RelatedBlock>
    )
  }

  if (scope.sector === 'dau-thau') {
    return (
      <RelatedBlock title="Ôn tiếp theo văn bản">
        {DT_DOC_GROUPS.slice(0, 4).map((topic, index) => (
          <AppLink
            key={topic.id}
            className={`topic-card topic-tone-${index % 8}`}
            view={{ name: 'practice', scope: { sector: 'dau-thau' }, topicId: topic.id }}
          >
            <span className="topic-card-bar" aria-hidden />
            <span className="count">Ôn tập</span>
            <h3>{topic.title}</h3>
            <p>{topic.blurb}</p>
          </AppLink>
        ))}
        <AppLink
          className="topic-card topic-tone-5 related-kpi-more"
          view={{ name: 'dt-browse' } satisfies AppView}
        >
          <span className="topic-card-bar" aria-hidden />
          <span className="count">Hub</span>
          <h3>Về hub Đấu thầu</h3>
          <p>Thi thử 70 câu và các lối ôn khác</p>
        </AppLink>
      </RelatedBlock>
    )
  }

  return null
}

function RelatedBlock({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="related-block" aria-label={title}>
      <div className="section-head">
        <h2>{title}</h2>
      </div>
      <div className="topic-grid related-kpi-grid">{children}</div>
    </section>
  )
}
