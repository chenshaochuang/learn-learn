/**
 * AI 模型配置
 * 支持多个模型，当第一个模型失败时自动切换到下一个
 */

export interface ModelConfig {
  name: string // 模型名称（用于显示）
  model: string // 模型 ID
  description?: string // 模型描述
}

/**
 * 模型列表（按优先级排序）
 * 当第一个模型失败时，会自动尝试下一个
 * 所有模型都有 1000K tokens 免费额度
 */
export const MODEL_LIST: ModelConfig[] = [
  // 第一梯队：高性能模型（推荐）
  {
    name: 'ERNIE-4.5 Turbo 128K',
    model: 'ernie-4.5-turbo-128k',
    description: '高性能模型，128K上下文（推荐）',
  },
  {
    name: 'ERNIE-4.5 Turbo 32K',
    model: 'ernie-4.5-turbo-32k',
    description: '高性能模型，32K上下文',
  },
  {
    name: 'ERNIE-X1 Turbo',
    model: 'ernie-x1-turbo-32k',
    description: 'ERNIE X1 系列，32K上下文',
  },
  
  // 第二梯队：DeepSeek 系列（高质量备选）
  {
    name: 'DeepSeek V3.1',
    model: 'deepseek-v3.1-250821',
    description: 'DeepSeek 最新版本',
  },
  {
    name: 'DeepSeek V3.1 Think',
    model: 'deepseek-v3.1-think-250821',
    description: 'DeepSeek 思考增强版',
  },
  {
    name: 'DeepSeek R1',
    model: 'deepseek-r1',
    description: 'DeepSeek R1 推理模型',
  },
  
  // 第三梯队：通义千问系列
  {
    name: 'Qwen3 235B',
    model: 'qwen3-235b-a22b-instruct-2507',
    description: '通义千问 235B 大模型',
  },
  {
    name: 'Qwen3 30B',
    model: 'qwen3-30b-a3b-instruct-2507',
    description: '通义千问 30B 模型',
  },
  
  // 第四梯队：其他备选
  {
    name: 'Kimi K2',
    model: 'kimi-k2-instruct',
    description: 'Kimi K2 指令模型',
  },
  {
    name: 'Qianfan 推荐',
    model: 'qianfan-sug-8k',
    description: '百度千帆推荐模型',
  },
  
  // 最后备选：基础模型
  {
    name: 'ERNIE-4.0 Turbo',
    model: 'ernie-4.0-turbo-8k',
    description: '标准模型',
  },
  {
    name: 'ERNIE-3.5',
    model: 'ernie-3.5-8k',
    description: '经济型模型',
  },
  {
    name: 'ERNIE-Lite',
    model: 'ernie-lite-8k',
    description: '轻量级模型',
  },
]

/**
 * 判断错误是否应该触发模型切换
 * 包括：额度用完、模型不可用、权限错误等
 */
export function shouldSwitchModel(error: Error | string): boolean {
  const errorMessage = typeof error === 'string' ? error : error.message
  const lowerMessage = errorMessage.toLowerCase()
  
  // 检测常见的需要切换模型的错误
  const switchTriggers = [
    'quota', // 额度
    'limit', // 限制
    'exceeded', // 超出
    'insufficient', // 不足
    'unauthorized', // 未授权
    'forbidden', // 禁止访问
    'model not found', // 模型不存在
    'model unavailable', // 模型不可用
    'rate limit', // 速率限制
    '429', // HTTP 429 状态码
    '余额不足',
    '额度',
    '配额',
    '超出限制',
  ]
  
  return switchTriggers.some(trigger => lowerMessage.includes(trigger))
}

/**
 * 获取当前使用的模型索引（从 localStorage）
 */
export function getCurrentModelIndex(): number {
  try {
    const saved = localStorage.getItem('qianfan_model_index')
    if (saved) {
      const index = parseInt(saved, 10)
      if (index >= 0 && index < MODEL_LIST.length) {
        return index
      }
    }
  } catch (error) {
    console.warn('读取模型索引失败:', error)
  }
  return 0 // 默认使用第一个模型
}

/**
 * 保存当前使用的模型索引
 */
export function saveCurrentModelIndex(index: number): void {
  try {
    localStorage.setItem('qianfan_model_index', index.toString())
  } catch (error) {
    console.warn('保存模型索引失败:', error)
  }
}

/**
 * 重置模型索引（回到第一个模型）
 */
export function resetModelIndex(): void {
  try {
    localStorage.removeItem('qianfan_model_index')
  } catch (error) {
    console.warn('重置模型索引失败:', error)
  }
}

