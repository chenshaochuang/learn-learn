/**
 * AI 服务主入口
 * 
 * 使用百度千帆 AI API
 */

import type { AIQuestionGenerator, AIAnswerAssessor } from './types'
import { QianfanQuestionGenerator, QianfanAnswerAssessor } from './qianfan'
import type { AssessmentResult } from '@/types/assessment'
import { detectTerminology } from '@/utils/terminology'

// 导出类型
export type { AIQuestionGenerator, AIAnswerAssessor }

// 使用百度千帆 API
const questionGenerator: AIQuestionGenerator = new QianfanQuestionGenerator()
const answerAssessor: AIAnswerAssessor = new QianfanAnswerAssessor()

/**
 * 生成问题
 */
export async function generateQuestions(knowledge: string): Promise<string[]> {
  if (!knowledge.trim()) {
    throw new Error('知识点不能为空')
  }
  return await questionGenerator.generateQuestions(knowledge)
}

/**
 * 评估回答
 */
export async function assessAnswer(
  knowledge: string,
  question: string,
  answer: string
): Promise<AssessmentResult> {
  if (!answer.trim()) {
    throw new Error('回答不能为空')
  }

  // 获取 AI 评估结果
  const aiAssessment = await answerAssessor.assessAnswer(knowledge, question, answer)

  // 结合本地术语检测
  const terminologyList = detectTerminology(answer)

  // 计算总体评分（加权平均）
  const overall = Math.round(
    (aiAssessment.clarity * 0.3 +
     aiAssessment.logic * 0.25 +
     aiAssessment.completeness * 0.25 +
     (11 - aiAssessment.terminology) * 0.2) // 术语分数越低越好，所以取反
  )

  return {
    ...aiAssessment,
    overall,
    terminologyList,
    assessedAt: new Date(),
  }
}

