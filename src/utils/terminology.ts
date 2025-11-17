/**
 * 专业术语检测工具
 */

import type { TerminologyItem } from '@/types/assessment'

/**
 * 常见专业术语库（按领域分类）
 */
const TERMINOLOGY_DB: Record<string, string[]> = {
  technology: [
    'API', 'SDK', '框架', '算法', '数据结构', '数据库', '缓存', '分布式',
    '微服务', '容器', 'Docker', 'Kubernetes', 'CI/CD', 'DevOps',
    '前端', '后端', '全栈', '响应式', '异步', '同步', '并发', '多线程',
    '区块链', '智能合约', '加密货币', 'NFT', 'Web3',
    '机器学习', '深度学习', '神经网络', '人工智能', 'AI', 'NLP',
    '云计算', 'SaaS', 'PaaS', 'IaaS', '虚拟化',
  ],
  business: [
    'KPI', 'ROI', '商业模式', '价值链', '供应链', 'B2B', 'B2C', 'C2C',
    '市场定位', '用户画像', '转化率', '留存率', 'DAU', 'MAU',
    'MVP', 'PMF', '增长黑客', 'A/B测试', '数据分析',
  ],
  general: [
    '方法论', '范式', '架构', '设计模式', '最佳实践', '标准化',
    '可扩展性', '可维护性', '可复用性', '耦合', '解耦',
    '抽象', '封装', '继承', '多态', '接口', '实现',
  ],
}

/**
 * 所有术语列表（扁平化）
 */
const ALL_TERMS = Object.values(TERMINOLOGY_DB).flat()

/**
 * 检测文本中的专业术语
 */
export function detectTerminology(text: string): TerminologyItem[] {
  const items: TerminologyItem[] = []
  const lowerText = text.toLowerCase()

  ALL_TERMS.forEach(term => {
    const lowerTerm = term.toLowerCase()
    let index = 0
    
    while ((index = lowerText.indexOf(lowerTerm, index)) !== -1) {
      // 检查是否是完整单词（避免部分匹配）
      const before = index > 0 ? text[index - 1] : ' '
      const after = index + term.length < text.length ? text[index + term.length] : ' '
      
      if (!/[a-zA-Z0-9\u4e00-\u9fa5]/.test(before) && !/[a-zA-Z0-9\u4e00-\u9fa5]/.test(after)) {
        items.push({
          term: text.substring(index, index + term.length),
          position: index,
        })
      }
      
      index += term.length
    }
  })

  return items
}

/**
 * 计算专业术语密度
 */
export function calculateTerminologyDensity(text: string): number {
  const terms = detectTerminology(text)
  const words = text.split(/\s+/).filter(w => w.length > 0)
  return words.length > 0 ? terms.length / words.length : 0
}

/**
 * 获取术语所属领域
 */
export function getTermCategory(term: string): string | null {
  for (const [category, terms] of Object.entries(TERMINOLOGY_DB)) {
    if (terms.includes(term)) {
      return category
    }
  }
  return null
}

