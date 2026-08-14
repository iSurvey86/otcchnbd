import { useState } from 'react'
import { Layout } from './components/Layout'
import { Exam } from './pages/Exam'
import { History } from './pages/History'
import { Home } from './pages/Home'
import { Practice } from './pages/Practice'
import { Result } from './pages/Result'
import type { AppView } from './types'

export default function App() {
  const [view, setView] = useState<AppView>({ name: 'home' })

  return (
    <Layout view={view} onNavigate={setView}>
      {view.name === 'home' ? <Home onNavigate={setView} /> : null}
      {view.name === 'practice' ? (
        <Practice key={view.topicId ?? 'all'} topicId={view.topicId} />
      ) : null}
      {view.name === 'exam' ? (
        <Exam onFinish={(attemptId) => setView({ name: 'result', attemptId })} />
      ) : null}
      {view.name === 'result' ? (
        <Result attemptId={view.attemptId} onNavigate={setView} />
      ) : null}
      {view.name === 'history' ? <History onNavigate={setView} /> : null}
    </Layout>
  )
}
