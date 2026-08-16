import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { LoginModal } from './components/LoginModal'
import { TrackBankGate } from './components/TrackBankGate'
import { useAuth } from './context/AuthContext'
import { Admin } from './pages/Admin'
import { Catalog } from './pages/Catalog'
import { DtBrowse } from './pages/DtBrowse'
import { Exam } from './pages/Exam'
import { History } from './pages/History'
import { Home } from './pages/Home'
import { Practice } from './pages/Practice'
import { Result } from './pages/Result'
import { XdBrowse } from './pages/XdBrowse'
import type { AppView } from './types'

export default function App() {
  const [view, setView] = useState<AppView>({ name: 'catalog' })
  const { user, isAdmin, loading } = useAuth()

  // Thoát trang quản lý khi đăng xuất / không còn quyền admin
  useEffect(() => {
    if (loading) return
    if (view.name === 'admin' && (!user || !isAdmin)) {
      setView({ name: 'catalog' })
    }
  }, [view.name, user, isAdmin, loading])

  return (
    <Layout view={view} onNavigate={setView}>
      {view.name === 'catalog' ? <Catalog onNavigate={setView} /> : null}
      {view.name === 'xd-browse' ? <XdBrowse onNavigate={setView} /> : null}
      {view.name === 'dt-browse' ? <DtBrowse onNavigate={setView} /> : null}
      {view.name === 'home' ? (
        <TrackBankGate scope={view.scope}>
          <Home scope={view.scope} onNavigate={setView} />
        </TrackBankGate>
      ) : null}
      {view.name === 'practice' ? (
        <TrackBankGate scope={view.scope}>
          <Practice
            key={`${view.scope.sector}:${view.scope.trackId ?? ''}:${view.topicId ?? 'all'}`}
            scope={view.scope}
            topicId={view.topicId}
          />
        </TrackBankGate>
      ) : null}
      {view.name === 'exam' ? (
        <TrackBankGate scope={view.scope}>
          <Exam
            key={`${view.scope.sector}:${view.scope.trackId ?? ''}`}
            scope={view.scope}
            onFinish={(attemptId) =>
              setView({ name: 'result', scope: view.scope, attemptId })
            }
          />
        </TrackBankGate>
      ) : null}
      {view.name === 'result' ? (
        <TrackBankGate scope={view.scope}>
          <Result
            attemptId={view.attemptId}
            scope={view.scope}
            onNavigate={setView}
          />
        </TrackBankGate>
      ) : null}
      {view.name === 'history' ? (
        <History scope={view.scope} onNavigate={setView} />
      ) : null}
      {view.name === 'admin' ? <Admin /> : null}
      <LoginModal />
    </Layout>
  )
}
