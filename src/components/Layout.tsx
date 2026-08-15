import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { getViewScope, isStudyView, type AppView } from '../types'

interface Props {
  view: AppView
  onNavigate: (view: AppView) => void
  children: ReactNode
}

export function Layout({ view, onNavigate, children }: Props) {
  const scope = getViewScope(view)
  const showStudyNav = isStudyView(view) && scope

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
        {showStudyNav && scope ? (
          <nav className="nav-pills">
            <NavButton
              active={view.name === 'home'}
              onClick={() => onNavigate({ name: 'home', scope })}
            >
              Trang chủ
            </NavButton>
            <NavButton
              active={view.name === 'practice'}
              onClick={() => onNavigate({ name: 'practice', scope })}
            >
              Ôn tập
            </NavButton>
            <NavButton
              active={view.name === 'exam'}
              onClick={() => onNavigate({ name: 'exam', scope })}
            >
              Thi thử
            </NavButton>
            <NavButton
              active={view.name === 'history'}
              onClick={() => onNavigate({ name: 'history', scope })}
            >
              Lịch sử
            </NavButton>
          </nav>
        ) : null}
        <AuthBar view={view} onNavigate={onNavigate} />
      </header>
      {children}
    </div>
  )
}

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button className={active ? 'active' : ''} onClick={onClick}>
      {children}
    </button>
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
  if ((view.name === 'catalog' || view.name === 'xd-browse') && !user) return null

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
