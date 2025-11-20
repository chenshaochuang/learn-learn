import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readFileSync, writeFileSync } from 'fs'

// 读取 package.json 获取版本号
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
const appVersion = packageJson.version
const buildTime = new Date().toISOString()

// 插件：在构建时注入版本号到 Service Worker 和生成版本文件
const injectVersionPlugin = () => {
  return {
    name: 'inject-version-to-sw',
    buildStart() {
      // 在构建开始时生成版本文件到public目录
      try {
        const versionData = {
          version: appVersion,
          buildTime: buildTime
        }
        const versionPath = path.resolve(__dirname, 'public/version.json')
        writeFileSync(versionPath, JSON.stringify(versionData, null, 2), 'utf-8')
        if (import.meta.env?.MODE !== 'test') {
          console.log(`✓ 版本文件已生成: ${appVersion}`)
        }
      } catch (error: any) {
        console.warn('生成版本文件时出错:', error)
      }
    },
    closeBundle() {
      // 在构建完成后，处理输出目录中的 Service Worker 文件
      // public目录的文件会被自动复制到dist目录，所以在这里处理
      const distSwPath = path.resolve(__dirname, 'dist/sw.js')
      try {
        let swContent = readFileSync(distSwPath, 'utf-8')
        // 替换版本号占位符
        swContent = swContent.replace(/__APP_VERSION__/g, appVersion)
        writeFileSync(distSwPath, swContent, 'utf-8')
        if (import.meta.env?.MODE !== 'test') {
          console.log(`✓ Service Worker 版本号已注入: ${appVersion}`)
        }
      } catch (error: any) {
        // 如果文件不存在，可能是第一次构建或文件路径问题
        if (error?.code !== 'ENOENT') {
          console.warn('处理 Service Worker 文件时出错:', error)
        }
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), injectVersionPlugin()],
    base: '/', // 确保基础路径正确
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
    // PWA 配置：确保 Service Worker 和 manifest 被正确复制
    publicDir: 'public',
    // 定义环境变量（在构建时注入）
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
      'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTime),
    },
  }
})

