import type { ReactNode } from 'react'
import type { AppView } from '../types'

interface Props {
  view: AppView
  onNavigate: (view: AppView) => void
  children: ReactNode
}

export function Layout({ view, onNavigate, children }: Props) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => onNavigate({ name: 'home' })}>
          <span className="brand-mark">ĐĐ</span>
          <span>
            <small>Ôn thi sát hạch</small>
            <strong>Chứng chỉ hành nghề đo đạc bản đồ</strong>
          </span>
        </button>
        <nav className="nav-pills">
          <button
            className={view.name === 'home' ? 'active' : ''}
            onClick={() => onNavigate({ name: 'home' })}
          >
            Trang chủ
          </button>
          <button
            className={view.name === 'practice' ? 'active' : ''}
            onClick={() => onNavigate({ name: 'practice' })}
          >
            Ôn tập
          </button>
          <button
            className={view.name === 'exam' ? 'active' : ''}
            onClick={() => onNavigate({ name: 'exam' })}
          >
            Thi thử
          </button>
          <button
            className={view.name === 'history' ? 'active' : ''}
            onClick={() => onNavigate({ name: 'history' })}
          >
            Lịch sử
          </button>
        </nav>
      </header>
      {children}
    </div>
  )
}
