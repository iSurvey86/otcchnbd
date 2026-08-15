import { useState } from 'react'
import { Layout } from './components/Layout'
import { LoginModal } from './components/LoginModal'
import { TrackBankGate } from './components/TrackBankGate'
import { Admin } from './pages/Admin'
import { Catalog } from './pages/Catalog'
import { Exam } from './pages/Exam'
import { History } from './pages/History'
import { Home } from './pages/Home'
import { Practice } from './pages/Practice'
import { Result } from './pages/Result'
import { XdBrowse } from './pages/XdBrowse'
import type { AppView } from './types'

export default function App() {
  const [view, setView] = useState<AppView>({ name: 'catalog' })

  return (
    <Layout view={view} onNavigate={setView}>
      {view.name === 'catalog' ? <Catalog onNavigate={setView} /> : null}
      {view.name === 'xd-browse' ? <XdBrowse onNavigate={setView} /> : null}
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
