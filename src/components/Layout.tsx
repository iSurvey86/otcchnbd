'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { AppLink } from './AppLink'
import { useAuth } from '../context/AuthContext'
import { getViewScope, isStudyView, type AppView } from '../types'

interface Props {
  view: AppView
  onNavigate: (view: AppView) => void
  children: ReactNode
}

function backNavFor(view: AppView): { label: string; target: AppView } | null {
  if (view.name === 'dd-browse' || view.name === 'xd-browse' || view.name === 'dt-browse') {
    return { label: '← Chọn ngành', target: { name: 'catalog' } }
  }
  const scope = getViewScope(view)
  if (!scope) return null
  if (scope.sector === 'do-dac-ban-do') {
    return {
      label: '← Chọn bộ đề',
      target: { name: 'dd-browse' },
    }
  }
  if (scope.sector === 'xay-dung') {
    return {
      label: '← Chọn hạng / chuyên ngành',
      target: { name: 'xd-browse' },
    }
  }
  if (scope.sector === 'dau-thau') {
    return {
      label: '← Đấu thầu',
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
          <AppLink className="brand" view={{ name: 'catalog' }}>
            <span className="brand-mark">ÔN</span>
            <span>
              <small>Ôn thi sát hạch</small>
              <strong>Chứng chỉ hành nghề</strong>
            </span>
          </AppLink>
          {back ? (
            <AppLink className="text-link back-link topbar-back" view={back.target}>
              {back.label}
            </AppLink>
          ) : null}
        </div>
        {showStudyNav && scope ? (
          <nav className="nav-pills">
            <NavLink
              active={
                view.name === 'home' ||
                (scope.sector === 'dau-thau' && view.name === 'dt-browse')
              }
              view={
                scope.sector === 'dau-thau'
                  ? { name: 'dt-browse' }
                  : { name: 'home', scope }
              }
            >
              Trang chủ
            </NavLink>
            <NavLink
              active={view.name === 'practice'}
              view={{ name: 'practice', scope }}
            >
              Ôn tập
            </NavLink>
            <NavLink active={view.name === 'exam'} view={{ name: 'exam', scope }}>
              Thi thử
            </NavLink>
            <NavLink
              active={view.name === 'history'}
              view={{ name: 'history', scope }}
            >
              Lịch sử
            </NavLink>
          </nav>
        ) : null}
        <AuthBar view={view} onNavigate={onNavigate} />
      </header>
      {children}
    </div>
  )
}

function NavLink({
  active,
  view,
  children,
}: {
  active: boolean
  view: AppView
  children: ReactNode
}) {
  return (
    <AppLink className={active ? 'active' : undefined} view={view}>
      {children}
    </AppLink>
  )
}

function AuthBar({
  view,
  onNavigate,
}: {
  view: AppView
  onNavigate: (view: AppView) => void
}) {
  const { user, isAdmin, isConfigured, openLogin, signOutUser } = useAuth()

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
        <AppLink
          className={view.name === 'admin' ? 'btn primary compact' : 'btn ghost compact'}
          view={{ name: 'admin' }}
        >
          Quản lý
        </AppLink>
      ) : null}
      <span className="user-chip">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt=""
            width={28}
            height={28}
            referrerPolicy="no-referrer"
          />
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
