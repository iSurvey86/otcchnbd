'use client'

import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { getViewScope, isStudyView, type AppView } from '../types'

interface Props {
  view: AppView
  onNavigate: (view: AppView) => void
  children: ReactNode
}

function backNavFor(view: AppView): { label: string; target: AppView } | null {
  if (view.name === 'xd-browse' || view.name === 'dt-browse') {
    return { label: '← Chọn ngành', target: { name: 'catalog' } }
  }
  const scope = getViewScope(view)
  if (!scope) return null
  if (scope.sector === 'xay-dung') {
    return {
      label: '← Chọn hạng / chuyên ngành',
      target: { name: 'xd-browse' },
    }
  }
  if (scope.sector === 'dau-thau') {
    return {
      label: '← Chọn lô câu hỏi',
      target: { name: 'dt-browse' },
    }
  }
  return { label: '← Chọn ngành', target: { name: 'catalog' } }
}

export function Layout({ view, onNavigate, children }: Props) {
  const scope = getViewScope(view)
  const showStudyNav = isStudyView(view) && scope
  const back = backNavFor(view)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-lead">
          <button className="brand" onClick={() => onNavigate({ name: 'catalog' })}>
            <span className="brand-mark">ÔN</span>
            <span>
              <small>Ôn thi sát hạch</small>
              <strong>Chứng chỉ hành nghề</strong>
            </span>
          </button>
          {back ? (
            <button
              type="button"
              className="text-link back-link topbar-back"
              onClick={() => onNavigate(back.target)}
            >
              {back.label}
            </button>
          ) : null}
        </div>
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
  const { user, isAdmin, isConfigured, openLogin, signOutUser } =
    useAuth()

  if (!isConfigured) return null

  if (!user) {
    return (
      <div className="auth-bar">
        <button className="btn ghost compact" onClick={() => openLogin()}>
          Đăng nhập
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
      <button
        className="btn ghost compact"
        onClick={() => {
          void signOutUser().finally(() => onNavigate({ name: 'catalog' }))
        }}
      >
        Đăng xuất
      </button>
    </div>
  )
}
