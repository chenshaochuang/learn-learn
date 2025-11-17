/**
 * 知识点相关类型定义
 */

import type { AssessmentResult } from './assessment'

/**
 * 标签
 */
export interface Tag {
  id: string
  name: string
  color?: string // 标签颜色（可选）
  createdAt: Date
}

/**
 * 知识点记录
 */
export interface KnowledgeRecord {
  id: string
  knowledge: string // 输入的知识点
  questions: string[] // AI 生成的问题
  answer: string // 用户回答
  assessment: AssessmentResult | null // 评估结果
  tags: string[] // 标签 ID 列表
  createdAt: Date
  updatedAt: Date
}

/**
 * 知识点输入数据
 */
export interface KnowledgeInput {
  knowledge: string
  tags?: string[] // 标签 ID 列表（可选）
}

