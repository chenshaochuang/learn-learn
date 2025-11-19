/**
 * 日志工具
 * 开发环境输出所有日志，生产环境只输出错误
 */

const isDevelopment = import.meta.env.DEV

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  
  error: (...args: unknown[]) => {
    console.error(...args)
  },
  
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },
}

