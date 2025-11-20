/**
 * 版本信息管理
 */

// 这些值会在构建时被注入（通过 vite.config.ts）
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '0.1.0'
export const BUILD_TIME = import.meta.env.VITE_BUILD_TIME || new Date().toISOString()

/**
 * 获取版本信息
 */
export function getVersionInfo() {
  return {
    version: APP_VERSION,
    buildTime: BUILD_TIME,
    buildDate: new Date(BUILD_TIME).toLocaleString('zh-CN'),
  }
}

/**
 * 格式化版本显示
 */
export function formatVersion(): string {
  const info = getVersionInfo()
  const date = new Date(info.buildTime)
  const dateStr = date.toLocaleDateString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  return `v${info.version} (${dateStr})`
}

/**
 * 检查是否有新版本（通过检查 Service Worker 更新）
 */
export async function checkForUpdate(): Promise<boolean> {
  try {
    // 检查 Service Worker 是否有更新
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        // 如果有新的 Service Worker，说明有新版本
        await registration.update()
        return registration.waiting !== null
      }
    }
    
    return false
  } catch (error) {
    console.warn('检查更新失败:', error)
    return false
  }
}

/**
 * 从服务器获取版本信息
 */
export async function getServerVersion(): Promise<{ version: string; buildTime: string } | null> {
  try {
    // 添加时间戳防止缓存
    const response = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return {
      version: data.version || '',
      buildTime: data.buildTime || ''
    }
  } catch (error) {
    console.warn('获取服务器版本失败:', error)
    return null
  }
}

/**
 * 检查版本是否一致，如果不一致则强制刷新
 * @param silent 是否静默模式（不显示日志）
 */
export async function checkVersionAndRefresh(silent: boolean = false): Promise<boolean> {
  try {
    const serverVersion = await getServerVersion()
    if (!serverVersion) {
      // 如果无法获取服务器版本，不强制刷新（可能是开发环境或网络问题）
      if (!silent && import.meta.env.MODE === 'development') {
        console.log('无法获取服务器版本，跳过版本检查')
      }
      return false
    }
    
    const clientVersion = APP_VERSION
    
    // 如果版本不一致，强制清除缓存并刷新
    if (serverVersion.version !== clientVersion) {
      if (!silent) {
        console.log(`检测到版本不一致: 客户端=${clientVersion}, 服务器=${serverVersion.version}`)
        console.log('正在清除缓存并刷新...')
      }
      
      // 清除所有应用缓存（只清除应用缓存，保留IndexedDB）
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys()
          const appCacheNames = cacheNames.filter(name => name.startsWith('feynman-trainer-'))
          if (appCacheNames.length > 0) {
            await Promise.all(appCacheNames.map(cacheName => {
              if (!silent) {
                console.log(`清除缓存: ${cacheName}`)
              }
              return caches.delete(cacheName)
            }))
          }
        } catch (error) {
          console.warn('清除缓存失败:', error)
        }
      }
      
      // 更新Service Worker
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations()
          await Promise.all(registrations.map(registration => registration.update()))
        } catch (error) {
          console.warn('更新Service Worker失败:', error)
        }
      }
      
      // 延迟一下确保清理完成，然后强制刷新页面
      setTimeout(() => {
        window.location.reload()
      }, 100)
      
      return true
    }
    
    return false
  } catch (error) {
    console.warn('版本检查失败:', error)
    return false
  }
}

