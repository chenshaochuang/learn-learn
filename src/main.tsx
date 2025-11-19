import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './components/ui/toast'
import './index.css'

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        if (import.meta.env.MODE === 'development') {
          console.log('Service Worker 注册成功:', registration.scope)
        }
        
        // 检查更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 新版本可用，触发自定义事件通知组件
                window.dispatchEvent(new CustomEvent('sw-update-available'))
                if (import.meta.env.MODE === 'development') {
                  console.log('新版本可用，请刷新页面')
                }
              }
            })
          }
        })
        
        // 定期检查更新（每小时）
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)
      })
      .catch((error) => {
        console.error('Service Worker 注册失败:', error)
      })
  })

  // 监听 Service Worker 更新
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true
      // 延迟一下，确保新 Service Worker 已激活
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

