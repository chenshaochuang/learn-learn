/**
 * 版本信息显示组件（隐蔽位置）
 */

import { useState, useEffect } from 'react'
import { getVersionInfo, formatVersion, checkForUpdate } from '@/utils/version'
import { useToast } from './ui/toast'

export function VersionInfo() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasUpdate, setHasUpdate] = useState(false)
  const { showInfo } = useToast()
  const versionInfo = getVersionInfo()

  useEffect(() => {
    // 检查是否有新版本
    checkForUpdate().then(setHasUpdate)
    
    // 监听 Service Worker 更新事件
    const handleUpdateAvailable = () => {
      setHasUpdate(true)
    }
    window.addEventListener('sw-update-available', handleUpdateAvailable)
    
    // 定期检查更新（每5分钟）
    const interval = setInterval(() => {
      checkForUpdate().then(setHasUpdate)
    }, 5 * 60 * 1000)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('sw-update-available', handleUpdateAvailable)
    }
  }, [])

  const handleClick = () => {
    setIsVisible(!isVisible)
    if (hasUpdate) {
      showInfo('检测到新版本，请刷新页面获取最新功能')
    }
  }

  const handleRefresh = () => {
    // 清除缓存并刷新
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister()
        })
        // 清除缓存
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName)
          })
          window.location.reload()
        })
      })
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="fixed bottom-2 right-2 z-50">
      <button
        onClick={handleClick}
        className={`
          text-[10px] sm:text-xs text-muted-foreground/40 hover:text-muted-foreground/70 
          transition-colors p-1 rounded font-mono
          ${hasUpdate ? 'animate-pulse text-orange-500/60' : ''}
        `}
        title={hasUpdate ? '有新版本可用，点击查看详情' : '点击查看版本信息'}
        aria-label="版本信息"
      >
        {formatVersion()}
        {hasUpdate && <span className="ml-1 text-orange-500">●</span>}
      </button>
      
      {isVisible && (
        <div className="absolute bottom-8 right-0 bg-card border rounded-lg shadow-lg p-3 min-w-[220px] sm:min-w-[260px] text-xs space-y-2 z-50">
          <div className="font-medium text-foreground">版本信息</div>
          <div className="space-y-1 text-muted-foreground text-[10px] sm:text-xs">
            <div>版本: <span className="font-mono">v{versionInfo.version}</span></div>
            <div>构建时间: <span className="font-mono">{versionInfo.buildDate}</span></div>
            {hasUpdate && (
              <div className="text-orange-500 font-medium mt-2 p-2 bg-orange-50 rounded">
                ⚠️ 检测到新版本可用
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-2 border-t">
            <button
              onClick={handleRefresh}
              className="text-primary hover:underline text-xs flex-1 text-center py-1 px-2 bg-primary/10 rounded hover:bg-primary/20 transition-colors"
            >
              清除缓存并刷新
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:underline text-xs px-2 py-1"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

