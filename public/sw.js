// Service Worker for PWA
const CACHE_NAME = 'feynman-trainer-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
]

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: 缓存已打开')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error('Service Worker: 缓存失败', error)
      })
  )
  // 强制激活新的 Service Worker
  self.skipWaiting()
})

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 删除旧缓存', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  // 立即控制所有客户端
  return self.clients.claim()
})

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') {
    return
  }

  // 跳过跨域请求
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有，直接返回
        if (response) {
          return response
        }

        // 否则从网络获取
        return fetch(event.request)
          .then((response) => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // 克隆响应（因为响应是流，只能使用一次）
            const responseToCache = response.clone()

            // 将响应添加到缓存
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // 网络请求失败，尝试返回离线页面
            if (event.request.destination === 'document') {
              return caches.match('/index.html')
            }
          })
      })
  )
})

// 处理后台同步（可选）
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 这里可以添加后台同步逻辑
      Promise.resolve()
    )
  }
})

// 处理推送通知（可选，未来扩展）
self.addEventListener('push', (event) => {
  // 推送通知处理逻辑
  console.log('Service Worker: 收到推送通知', event)
})

