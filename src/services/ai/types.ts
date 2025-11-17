/**
 * AI 服务相关类型定义
 */

export interface AIQuestionGenerator {
  /**
   * 生成问题
   * @param knowledge 知识点内容
   * @returns 问题列表
   */
  generateQuestions(knowledge: string): Promise<string[]>
}

export interface AIAnswerAssessor {
  /**
   * 评估回答质量
   * @param knowledge 知识点
   * @param question 问题
   * @param answer 用户回答
   * @returns 评估结果
   */
  assessAnswer(knowledge: string, question: string, answer: string): Promise<{
    clarity: number
    logic: number
    completeness: number
    terminology: number
    suggestions: string[]
  }>
}

