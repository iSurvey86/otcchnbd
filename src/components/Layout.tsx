import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { isDoDacView, type AppView } from '../types'

interface Props {
  view: AppView
  onNavigate: (view: AppView) => void
  children: ReactNode
}

export function Layout({ view, onNavigate, children }: Props) {
  const showDoDacNav = isDoDacView(view)

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => onNavigate({ name: 'catalog' })}>
          <span className="brand-mark">ÔN</span>
          <span>
            <small>Ôn thi sát hạch</small>
            <strong>Chứng chỉ hành nghề</strong>
          </span>
        </button>
        {showDoDacNav ? (
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
        ) : null}
        <AuthBar view={view} onNavigate={onNavigate} />
      </header>
      {children}
    </div>
  )
}

function AuthBar({
  view,
  onNavigate,
}: {
  view: AppView
  onNavigate: (view: AppView) => void
}) {
  const { user, isAdmin, remaining, guestLimit, isConfigured, openLogin, signOutUser } =
    useAuth()

  if (!isConfigured) return null
  if (view.name === 'catalog' && !user) return null

  if (!user) {
    return (
      <div className="auth-bar">
        <span className="muted auth-note">
          Còn {remaining}/{guestLimit} câu miễn phí
        </span>
        <button className="btn ghost compact" onClick={() => openLogin()}>
          Đăng nhập Google
        </button>
      </div>
    )
  }

  return (
    <div className="auth-bar">
      {isAdmin ? (
        <button
          className={view.name === 'admin' ? 'btn primary compact' : 'btn ghost compact'}
          onClick={() => onNavigate({ name: 'admin' })}
        >
          Quản lý
        </button>
      ) : null}
      <span className="user-chip">
        {user.photoURL ? (
          <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />
        ) : (
          <span className="user-fallback">{(user.displayName ?? 'U').slice(0, 1)}</span>
        )}
        <span className="user-name">{user.displayName ?? user.email}</span>
      </span>
      <button className="btn ghost compact" onClick={() => void signOutUser()}>
        Đăng xuất
      </button>
    </div>
  )
}
