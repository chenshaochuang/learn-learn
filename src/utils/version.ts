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
 * 检查是否有新版本（通过比较构建时间）
 */
export async function checkForUpdate(): Promise<boolean> {
  try {
    // 获取当前页面的构建时间
    const currentBuildTime = BUILD_TIME
    
    // 尝试获取服务器上的版本信息（通过 manifest.json 或版本接口）
    // 这里使用一个简单的方案：检查 Service Worker 是否有更新
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

