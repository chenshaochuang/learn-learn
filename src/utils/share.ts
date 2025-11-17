/**
 * 分享功能工具
 */

import type { KnowledgeRecord } from '@/types/knowledge'
import { formatDateTime } from './formatters'

/**
 * 生成分享文本
 */
export function generateShareText(record: KnowledgeRecord): string {
  const lines: string[] = []
  
  lines.push(`📚 知识点：${record.knowledge}`)
  lines.push('')
  
  if (record.assessment) {
    lines.push(`✨ 评分：${record.assessment.overall}/10`)
    lines.push('')
  }
  
  if (record.answer) {
    lines.push('💭 我的回答：')
    lines.push(record.answer)
    lines.push('')
  }
  
  if (record.assessment && record.assessment.suggestions && record.assessment.suggestions.length > 0) {
    lines.push('💡 改进建议：')
    record.assessment.suggestions.slice(0, 3).forEach(suggestion => {
      lines.push(`• ${suggestion}`)
    })
    lines.push('')
  }
  
  lines.push(`📅 ${formatDateTime(record.createdAt)}`)
  lines.push('')
  lines.push('来自：费曼学习法输出训练器')
  
  return lines.join('\n')
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        document.body.removeChild(textArea)
        return true
      } catch (err) {
        document.body.removeChild(textArea)
        return false
      }
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

/**
 * 分享记录
 */
export async function shareRecord(record: KnowledgeRecord): Promise<boolean> {
  const shareText = generateShareText(record)
  
  // 使用 Web Share API（如果支持）
  if (navigator.share) {
    try {
      await navigator.share({
        title: `知识点：${record.knowledge}`,
        text: shareText,
      })
      return true
    } catch (error) {
      // 用户取消分享或其他错误
      if ((error as Error).name !== 'AbortError') {
        console.error('分享失败:', error)
      }
      return false
    }
  } else {
    // 降级到复制到剪贴板
    return await copyToClipboard(shareText)
  }
}

