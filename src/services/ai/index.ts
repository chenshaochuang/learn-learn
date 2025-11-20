/**
 * AI 服务主入口
 * 
 * 使用百度千帆 AI API
 * 支持多模型自动切换
 */

import type { AIQuestionGenerator, AIAnswerAssessor, AIReferenceAnswerGenerator } from './types'
import { QianfanQuestionGenerator, QianfanAnswerAssessor, QianfanReferenceAnswerGenerator } from './qianfan'
import type { AssessmentResult } from '@/types/assessment'
import { detectTerminology } from '@/utils/terminology'

// 导出类型
export type { AIQuestionGenerator, AIAnswerAssessor, AIReferenceAnswerGenerator }

// 导出模型管理功能
export { getCurrentModel, getAllModels, resetToFirstModel, getModelStatus } from './modelManager'

// 使用百度千帆 API
const questionGenerator: AIQuestionGenerator = new QianfanQuestionGenerator()
const answerAssessor: AIAnswerAssessor = new QianfanAnswerAssessor()
const referenceAnswerGenerator: AIReferenceAnswerGenerator = new QianfanReferenceAnswerGenerator()

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
  answer: string,
  questions?: string[]
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

  // 生成参考版本（如果有问题列表）
  let referenceAnswer: string | undefined
  if (questions && questions.length > 0) {
    try {
      referenceAnswer = await referenceAnswerGenerator.generateReferenceAnswer(knowledge, questions)
    } catch (error) {
      console.error('生成参考版本失败:', error)
      // 参考版本生成失败不影响评估结果
    }
  }

  return {
    ...aiAssessment,
    overall,
    terminologyList,
    assessedAt: new Date(),
    referenceAnswer,
  }
}

