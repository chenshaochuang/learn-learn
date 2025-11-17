/**
 * 评估相关类型定义
 */

/**
 * 评估结果
 */
export interface AssessmentResult {
  /** 清晰度评分 (1-10) */
  clarity: number
  /** 逻辑性评分 (1-10) */
  logic: number
  /** 完整性评分 (1-10) */
  completeness: number
  /** 专业术语使用评分 (1-10，分数越低表示使用越少，越好) */
  terminology: number
  /** 总体评分 (1-10) */
  overall: number
  /** 专业术语列表 */
  terminologyList: TerminologyItem[]
  /** 改进建议 */
  suggestions: string[]
  /** 评估时间 */
  assessedAt: Date
}

/**
 * 专业术语项
 */
export interface TerminologyItem {
  /** 术语文本 */
  term: string
  /** 在文本中的位置 */
  position: number
  /** 建议替换 */
  suggestion?: string
}

/**
 * 评估维度
 */
export type AssessmentDimension = 'clarity' | 'logic' | 'completeness' | 'terminology'

