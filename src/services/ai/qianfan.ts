/**
 * 百度千帆 AI 服务实现（OpenAI 兼容方式）
 */

import type { AIQuestionGenerator, AIAnswerAssessor } from './types'
import { FEYNMAN_QUESTION_PROMPT, FEYNMAN_ASSESSMENT_PROMPT } from './prompts'

// 百度千帆 API 配置（OpenAI 兼容方式）
const API_KEY = 'bce-v3/ALTAK-q7eMOif1lG6HMJb6k35K9/a0b5e81a031f966f32bc88acfc487a5d763e92c6'
const BASE_URL = 'https://qianfan.baidubce.com/v2'
const MODEL = 'ernie-4.0-turbo-8k'
// 可选：appid（如果有的话）
// const APPID = 'app-xxxxxx'

/**
 * 调用百度千帆 API（OpenAI 兼容方式）
 */
async function callQianfanAPI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  }
  
  // 如果有 appid，添加到 headers
  // if (APPID) {
  //   headers['appid'] = APPID
  // }

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API 调用失败: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  
  // 处理错误响应
  if (data.error) {
    throw new Error(`API 错误: ${data.error.message || data.error.code || '未知错误'}`)
  }

  // OpenAI 兼容格式：从 choices[0].message.content 获取结果
  if (data.choices && data.choices.length > 0) {
    const content = data.choices[0].message?.content
    if (content) {
      return content
    }
  }
  
  // 兼容其他可能的返回格式
  if (data.result) {
    return data.result
  }
  if (data.content) {
    return data.content
  }
  
  throw new Error('API 返回格式异常，未找到有效内容')
}

/**
 * 百度千帆问题生成器
 */
export class QianfanQuestionGenerator implements AIQuestionGenerator {
  async generateQuestions(knowledge: string): Promise<string[]> {
    const prompt = FEYNMAN_QUESTION_PROMPT.replace('{knowledge}', knowledge)
    
    const messages = [
      {
        role: 'user',
        content: prompt,
      },
    ]

    const response = await callQianfanAPI(messages)
    
    // 解析返回的问题列表
    const questions = response
      .split('\n')
      .map(q => q.trim())
      .filter(q => q && !q.match(/^\d+[\.、]/)) // 移除编号
      .map(q => q.replace(/^\d+[\.、]\s*/, '')) // 移除开头的编号
      .filter(q => q.length > 0)
      .slice(0, 5) // 最多5个问题

    if (questions.length === 0) {
      // 如果解析失败，返回默认问题
      return [
        '这是什么？',
        '它有什么用？',
        '为什么需要它？',
      ]
    }

    return questions
  }
}

/**
 * 百度千帆回答评估器
 */
export class QianfanAnswerAssessor implements AIAnswerAssessor {
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
    const prompt = FEYNMAN_ASSESSMENT_PROMPT
      .replace('{knowledge}', knowledge)
      .replace('{question}', question)
      .replace('{answer}', answer)

    const messages = [
      {
        role: 'user',
        content: prompt,
      },
    ]

    const response = await callQianfanAPI(messages)
    
    // 尝试解析 JSON 响应
    try {
      // 提取 JSON 部分（可能包含 markdown 代码块）
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                       response.match(/```\s*([\s\S]*?)\s*```/) ||
                       [null, response]
      
      const jsonStr = jsonMatch[1] || response
      const assessment = JSON.parse(jsonStr.trim())

      return {
        clarity: Math.max(1, Math.min(10, assessment.clarity || 5)),
        logic: Math.max(1, Math.min(10, assessment.logic || 5)),
        completeness: Math.max(1, Math.min(10, assessment.completeness || 5)),
        terminology: Math.max(1, Math.min(10, assessment.terminology || 5)),
        suggestions: Array.isArray(assessment.suggestions) 
          ? assessment.suggestions 
          : ['继续努力，提升表达清晰度'],
      }
    } catch (error) {
      // 如果解析失败，返回默认评估
      console.error('解析评估结果失败:', error, response)
      return {
        clarity: 5,
        logic: 5,
        completeness: 5,
        terminology: 5,
        suggestions: ['AI 评估解析失败，请重试'],
      }
    }
  }
}

