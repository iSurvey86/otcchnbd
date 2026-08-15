import { useMemo, useState } from 'react'
import { XD_FIELDS, XD_GROUPS, XD_HANGS, getXdTrack, trackIdFor } from '../data/xd/tracks'
import type { AppView, HangId, XdGroupId } from '../types'

interface Props {
  onNavigate: (view: AppView) => void
}

function hangTone(hang: HangId): 'i' | 'ii' | 'iii' {
  if (hang === 'I') return 'i'
  if (hang === 'II') return 'ii'
  return 'iii'
}

export function XdBrowse({ onNavigate }: Props) {
  const [hang, setHang] = useState<HangId>('I')
  const [group, setGroup] = useState<XdGroupId | 'all'>('all')
  const tone = hangTone(hang)

  const fields = useMemo(() => {
    return XD_FIELDS.filter((f) => group === 'all' || f.group === group)
  }, [group])

  return (
    <>
      <div className="catalog-head">
        <h1>Xây dựng</h1>
        <p className="catalog-sub">Chọn hạng và chuyên ngành</p>
      </div>

      <section className="panel xd-browse">
        <div className="xd-browse-cols">
          <div className="xd-browse-col">
            <p className="kicker">Hạng chứng chỉ</p>
            <div className="xd-hang-row">
              {XD_HANGS.map((h) => {
                const active = hang === h
                return (
                  <button
                    key={h}
                    type="button"
                    className={`xd-chip xd-chip-${hangTone(h)}${active ? ' is-active' : ''}`}
                    onClick={() => setHang(h)}
                  >
                    Hạng {h}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="xd-browse-col">
            <p className="kicker">Nhóm lĩnh vực</p>
            <div className="xd-hang-row">
              <button
                type="button"
                className={`xd-chip xd-chip-${tone}${group === 'all' ? ' is-active' : ''}`}
                onClick={() => setGroup('all')}
              >
                Tất cả
              </button>
              {XD_GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`xd-chip xd-chip-${tone}${group === g.id ? ' is-active' : ''}`}
                  onClick={() => setGroup(g.id)}
                >
                  {g.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-head">
        <h2>Chuyên ngành – Hạng {hang}</h2>
      </div>
      <div className="topic-grid">
        {fields.map((field) => {
          const id = trackIdFor(field.code, hang)
          const track = getXdTrack(id)
          const open = Boolean(track?.open)
          const count = track?.questionCount ?? 0
          const groupTitle =
            XD_GROUPS.find((g) => g.id === field.group)?.title ?? field.group

          if (!open) {
            return (
              <div key={id} className="topic-card topic-card-soon">
                <span className="count">Sắp mở</span>
                <h3>
                  {field.code} · {field.title}
                </h3>
                <p>
                  {groupTitle} · Hạng {hang}. Ngân hàng câu hỏi đang bổ sung.
                </p>
              </div>
            )
          }

          return (
            <button
              key={id}
              type="button"
              className="topic-card"
              onClick={() =>
                onNavigate({
                  name: 'home',
                  scope: { sector: 'xay-dung', trackId: id },
                })
              }
            >
              <span className="count">{count} câu</span>
              <h3>
                {field.code} · {field.title}
              </h3>
              <p>
                {groupTitle} · Hạng {hang}. Pháp luật chung, pháp luật riêng và
                chuyên môn.
              </p>
            </button>
          )
        })}
      </div>
    </>
  )
}
