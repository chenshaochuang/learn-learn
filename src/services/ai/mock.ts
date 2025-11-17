/**
 * 模拟 AI 服务（用于开发和测试）
 */

import type { AIQuestionGenerator, AIAnswerAssessor } from './types'
import type { AssessmentResult } from '@/types/assessment'
import { detectTerminology, calculateTerminologyDensity } from '@/utils/terminology'

/**
 * 模拟问题生成器
 */
export class MockQuestionGenerator implements AIQuestionGenerator {
  async generateQuestions(knowledge: string): Promise<string[]> {
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 根据知识点内容生成简单问题
    const questions = [
      '这是什么？',
      '它有什么用？',
      '为什么需要它？',
      '它是怎么工作的？',
      '能举个例子吗？',
    ]

    // 如果知识点较短，只返回前3个问题
    return knowledge.length < 50 ? questions.slice(0, 3) : questions
  }
}

/**
 * 模拟回答评估器
 */
export class MockAnswerAssessor implements AIAnswerAssessor {
  async assessAnswer(
    knowledge: string,
    question: string,
    answer: string
  ): Promise<{
    clarity: number
    logic: number
    completeness: number
    terminology: number
    suggestions: string[]
  }> {
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 基于规则的基础评估
    const terminologyDensity = calculateTerminologyDensity(answer)
    const answerLength = answer.length
    const hasExamples = /例如|比如|举例|就像/.test(answer)
    const hasConnectors = /因为|所以|因此|首先|然后|最后/.test(answer)

    // 清晰度：基于长度和结构
    const clarity = Math.min(10, Math.max(5, 
      5 + (answerLength > 50 ? 2 : 0) + (hasExamples ? 2 : 0) + (hasConnectors ? 1 : 0)
    ))

    // 逻辑性：基于连接词
    const logic = Math.min(10, Math.max(5,
      5 + (hasConnectors ? 3 : 0) + (answerLength > 100 ? 2 : 0)
    ))

    // 完整性：基于长度和是否回答问题
    const completeness = Math.min(10, Math.max(5,
      5 + (answerLength > 80 ? 3 : 0) + (answer.includes('？') || answer.length > 50 ? 2 : 0)
    ))

    // 专业术语：密度越低越好
    const terminology = Math.max(1, Math.min(10, 
      10 - Math.floor(terminologyDensity * 20)
    ))

    // 生成建议
    const suggestions: string[] = []
    if (terminologyDensity > 0.1) {
      suggestions.push('建议减少专业术语的使用，用更通俗的语言解释')
    }
    if (answerLength < 50) {
      suggestions.push('回答可以更详细一些，补充更多说明')
    }
    if (!hasExamples) {
      suggestions.push('可以添加具体的例子帮助理解')
    }
    if (!hasConnectors) {
      suggestions.push('可以使用"因为"、"所以"等连接词，让逻辑更清晰')
    }
    if (suggestions.length === 0) {
      suggestions.push('回答质量不错，继续保持！')
    }

    return {
      clarity,
      logic,
      completeness,
      terminology,
      suggestions,
    }
  }
}

