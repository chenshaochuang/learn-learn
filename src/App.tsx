import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PageLoading } from './components/ui/loading'

// 懒加载页面组件
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const QuestionsPage = lazy(() => import('./pages/QuestionsPage').then(m => ({ default: m.QuestionsPage })))
const AnswerPage = lazy(() => import('./pages/AnswerPage').then(m => ({ default: m.AnswerPage })))
const AssessmentPage = lazy(() => import('./pages/AssessmentPage').then(m => ({ default: m.AssessmentPage })))
const HistoryPage = lazy(() => import('./pages/HistoryPage').then(m => ({ default: m.HistoryPage })))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/answer" element={<AnswerPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
