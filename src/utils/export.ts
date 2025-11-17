import type { KnowledgeRecord } from '@/types/knowledge'
import { formatDateTime } from './formatters'

/**
 * 导出工具函数
 */

/**
 * 下载文件
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 导出单条记录为 JSON
 */
export function exportRecordAsJSON(record: KnowledgeRecord) {
  const data = {
    ...record,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    assessment: record.assessment ? {
      ...record.assessment,
      assessedAt: record.assessment.assessedAt.toISOString(),
    } : null,
  }
  const json = JSON.stringify(data, null, 2)
  const filename = `knowledge-record-${record.id.slice(0, 8)}-${formatDateTime(record.createdAt).replace(/[:\s]/g, '-')}.json`
  downloadFile(json, filename, 'application/json')
}

/**
 * 导出所有记录为 JSON
 */
export function exportAllRecordsAsJSON(records: KnowledgeRecord[]) {
  const data = records.map(record => ({
    ...record,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    assessment: record.assessment ? {
      ...record.assessment,
      assessedAt: record.assessment.assessedAt.toISOString(),
    } : null,
  }))
  const json = JSON.stringify(data, null, 2)
  const filename = `knowledge-records-${new Date().toISOString().split('T')[0]}.json`
  downloadFile(json, filename, 'application/json')
}

/**
 * 导出单条记录为 Markdown
 */
export function exportRecordAsMarkdown(record: KnowledgeRecord) {
  const lines: string[] = []
  
  lines.push(`# ${record.knowledge}`)
  lines.push('')
  lines.push(`**创建时间**: ${formatDateTime(record.createdAt)}`)
  if (record.tags && record.tags.length > 0) {
    lines.push(`**标签**: ${record.tags.join(', ')}`)
  }
  lines.push('')
  
  if (record.questions && Array.isArray(record.questions) && record.questions.length > 0) {
    lines.push('## 问题')
    lines.push('')
    record.questions.forEach((q, i) => {
      lines.push(`${i + 1}. ${q}`)
    })
    lines.push('')
  }
  
  if (record.answer) {
    lines.push('## 回答')
    lines.push('')
    lines.push(record.answer)
    lines.push('')
  }
  
  if (record.assessment) {
    lines.push('## 评估结果')
    lines.push('')
    lines.push(`- **总体评分**: ${record.assessment.overall}/10`)
    lines.push(`- **清晰度**: ${record.assessment.clarity}/10`)
    lines.push(`- **逻辑性**: ${record.assessment.logic}/10`)
    lines.push(`- **完整性**: ${record.assessment.completeness}/10`)
    lines.push(`- **术语使用**: ${11 - record.assessment.terminology}/10`)
    lines.push('')
    
    if (record.assessment.terminologyList && Array.isArray(record.assessment.terminologyList) && record.assessment.terminologyList.length > 0) {
      lines.push('### 检测到的专业术语')
      lines.push('')
      record.assessment.terminologyList.forEach((item: { term: string }) => {
        lines.push(`- ${item.term}`)
      })
      lines.push('')
    }
    
    if (record.assessment.suggestions && Array.isArray(record.assessment.suggestions) && record.assessment.suggestions.length > 0) {
      lines.push('### 改进建议')
      lines.push('')
      record.assessment.suggestions.forEach((suggestion: string) => {
        lines.push(`- ${suggestion}`)
      })
      lines.push('')
    }
  }
  
  const markdown = lines.join('\n')
  const filename = `knowledge-record-${record.id.slice(0, 8)}-${formatDateTime(record.createdAt).replace(/[:\s]/g, '-')}.md`
  downloadFile(markdown, filename, 'text/markdown')
}

/**
 * 导出所有记录为 Markdown
 */
export function exportAllRecordsAsMarkdown(records: KnowledgeRecord[]) {
  const lines: string[] = []
  
  lines.push('# 知识点记录报告')
  lines.push('')
  lines.push(`**导出时间**: ${formatDateTime(new Date())}`)
  lines.push(`**记录数量**: ${records.length}`)
  lines.push('')
  
  // 添加统计信息
  const validRecords = records.filter(r => r.assessment)
  if (validRecords.length > 0) {
    const avgScore = validRecords.reduce((sum, r) => sum + r.assessment!.overall, 0) / validRecords.length
    const maxScore = Math.max(...validRecords.map(r => r.assessment!.overall))
    const minScore = Math.min(...validRecords.map(r => r.assessment!.overall))
    
    lines.push('## 📊 学习统计')
    lines.push('')
    lines.push(`- **平均评分**: ${avgScore.toFixed(1)}/10`)
    lines.push(`- **最高评分**: ${maxScore}/10`)
    lines.push(`- **最低评分**: ${minScore}/10`)
    lines.push(`- **训练次数**: ${validRecords.length} 次`)
    lines.push('')
    lines.push('---')
    lines.push('')
  }
  
  records.forEach((record, index) => {
    lines.push(`## ${index + 1}. ${record.knowledge}`)
    lines.push('')
    lines.push(`**创建时间**: ${formatDateTime(record.createdAt)}`)
    if (record.tags && record.tags.length > 0) {
      lines.push(`**标签**: ${record.tags.join(', ')}`)
    }
    lines.push('')
    
    if (record.questions && Array.isArray(record.questions) && record.questions.length > 0) {
      lines.push('### 问题')
      lines.push('')
      record.questions.forEach((q, i) => {
        lines.push(`${i + 1}. ${q}`)
      })
      lines.push('')
    }
    
    if (record.answer) {
      lines.push('### 回答')
      lines.push('')
      lines.push(record.answer)
      lines.push('')
    }
    
    if (record.assessment) {
      lines.push('### 评估结果')
      lines.push('')
      lines.push(`- **总体评分**: ${record.assessment.overall}/10`)
      lines.push(`- **清晰度**: ${record.assessment.clarity}/10`)
      lines.push(`- **逻辑性**: ${record.assessment.logic}/10`)
      lines.push(`- **完整性**: ${record.assessment.completeness}/10`)
      lines.push(`- **通俗性**: ${11 - record.assessment.terminology}/10`)
      lines.push('')
      
      if (record.assessment.suggestions && Array.isArray(record.assessment.suggestions) && record.assessment.suggestions.length > 0) {
        lines.push('#### 改进建议')
        lines.push('')
        record.assessment.suggestions.forEach((suggestion: string) => {
          lines.push(`- ${suggestion}`)
        })
        lines.push('')
      }
    }
    
    lines.push('---')
    lines.push('')
  })
  
  const markdown = lines.join('\n')
  const filename = `knowledge-records-${new Date().toISOString().split('T')[0]}.md`
  downloadFile(markdown, filename, 'text/markdown')
}

/**
 * 导出学习报告（详细版）
 */
export function exportLearningReport(records: KnowledgeRecord[]) {
  const lines: string[] = []
  
  lines.push('# 📚 费曼学习法训练报告')
  lines.push('')
  lines.push(`**生成时间**: ${formatDateTime(new Date())}`)
  lines.push('')
  lines.push('---')
  lines.push('')
  
  // 总体统计
  const validRecords = records.filter(r => r.assessment)
  if (validRecords.length > 0) {
    const scores = validRecords.map(r => r.assessment!.overall)
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length
    const maxScore = Math.max(...scores)
    const minScore = Math.min(...scores)
    
    // 计算趋势
    const recentScores = scores.slice(-5)
    const olderScores = scores.slice(0, Math.max(0, scores.length - 5))
    const recentAvg = recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length
    const olderAvg = olderScores.length > 0 
      ? olderScores.reduce((sum, s) => sum + s, 0) / olderScores.length 
      : recentAvg
    const trend = recentAvg - olderAvg
    
    lines.push('## 📈 总体统计')
    lines.push('')
    lines.push(`- **总训练次数**: ${validRecords.length} 次`)
    lines.push(`- **平均评分**: ${avgScore.toFixed(1)}/10`)
    lines.push(`- **最高评分**: ${maxScore}/10`)
    lines.push(`- **最低评分**: ${minScore}/10`)
    if (trend !== 0) {
      lines.push(`- **进步趋势**: ${trend > 0 ? '↑ 提升' : '↓ 下降'} ${Math.abs(trend).toFixed(1)} 分`)
    }
    lines.push('')
    
    // 各维度平均分
    const avgClarity = validRecords.reduce((sum, r) => sum + r.assessment!.clarity, 0) / validRecords.length
    const avgLogic = validRecords.reduce((sum, r) => sum + r.assessment!.logic, 0) / validRecords.length
    const avgCompleteness = validRecords.reduce((sum, r) => sum + r.assessment!.completeness, 0) / validRecords.length
    const avgTerminology = validRecords.reduce((sum, r) => sum + (11 - r.assessment!.terminology), 0) / validRecords.length
    
    lines.push('## 📊 各维度平均分')
    lines.push('')
    lines.push(`- **清晰度**: ${avgClarity.toFixed(1)}/10`)
    lines.push(`- **逻辑性**: ${avgLogic.toFixed(1)}/10`)
    lines.push(`- **完整性**: ${avgCompleteness.toFixed(1)}/10`)
    lines.push(`- **通俗性**: ${avgTerminology.toFixed(1)}/10`)
    lines.push('')
    lines.push('---')
    lines.push('')
  }
  
  // 详细记录
  lines.push('## 📝 详细记录')
  lines.push('')
  
  records.forEach((record, index) => {
    lines.push(`### ${index + 1}. ${record.knowledge}`)
    lines.push('')
    lines.push(`**时间**: ${formatDateTime(record.createdAt)}`)
    if (record.assessment) {
      lines.push(`**评分**: ${record.assessment.overall}/10`)
    }
    lines.push('')
    
    if (record.answer) {
      lines.push('**回答**:')
      lines.push('')
      lines.push(record.answer)
      lines.push('')
    }
    
    if (record.assessment && record.assessment.suggestions && record.assessment.suggestions.length > 0) {
      lines.push('**改进建议**:')
      lines.push('')
      record.assessment.suggestions.forEach((suggestion: string) => {
        lines.push(`- ${suggestion}`)
      })
      lines.push('')
    }
    
    lines.push('---')
    lines.push('')
  })
  
  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push('*本报告由费曼学习法输出训练器生成*')
  
  const markdown = lines.join('\n')
  const filename = `learning-report-${new Date().toISOString().split('T')[0]}.md`
  downloadFile(markdown, filename, 'text/markdown')
}

