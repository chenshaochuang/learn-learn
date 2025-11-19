/**
 * 高级统计分析组件
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { KnowledgeRecord } from '@/types/knowledge'

interface AdvancedStatsProps {
  records: KnowledgeRecord[]
}

/**
 * 趋势分析
 */
export function TrendAnalysis({ records }: AdvancedStatsProps) {
  const validRecords = records
    .filter(r => r.assessment)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  if (validRecords.length < 2) {
    return null
  }

  // 计算最近7天和之前7天的平均分
  const now = Date.now()
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

  const recentRecords = validRecords.filter(r => r.createdAt.getTime() >= sevenDaysAgo)
  const olderRecords = validRecords.filter(r => r.createdAt.getTime() < sevenDaysAgo)

  const recentAvg = recentRecords.length > 0
    ? recentRecords.reduce((sum, r) => sum + r.assessment!.overall, 0) / recentRecords.length
    : 0

  const olderAvg = olderRecords.length > 0
    ? olderRecords.reduce((sum, r) => sum + r.assessment!.overall, 0) / olderRecords.length
    : recentAvg

  const trend = recentAvg - olderAvg
  const trendPercent = olderAvg > 0 ? ((trend / olderAvg) * 100).toFixed(1) : '0'

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">趋势分析</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">最近7天平均分</p>
            <p className="text-xl sm:text-2xl font-bold">{recentAvg.toFixed(1)}</p>
          </div>
          {olderRecords.length > 0 && (
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">之前平均分</p>
              <p className="text-lg sm:text-xl">{olderAvg.toFixed(1)}</p>
            </div>
          )}
          {trend !== 0 && (
            <div className="pt-2 border-t">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">变化趋势：</span>
                <Badge variant={trend > 0 ? "default" : "outline"} className={`text-xs sm:text-sm ${trend > 0 ? "bg-green-500" : ""}`}>
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)} 分 ({trendPercent}%)
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 维度分析
 */
export function DimensionAnalysis({ records }: AdvancedStatsProps) {
  const validRecords = records.filter(r => r.assessment)

  if (validRecords.length === 0) {
    return null
  }

  const dimensions = [
    { name: '清晰度', key: 'clarity' as const },
    { name: '逻辑性', key: 'logic' as const },
    { name: '完整性', key: 'completeness' as const },
    { name: '通俗性', key: 'terminology' as const },
  ]

  const stats = dimensions.map(dim => {
    const values = validRecords.map(r => {
      if (dim.key === 'terminology') {
        return 11 - r.assessment!.terminology
      }
      return r.assessment![dim.key]
    })
    
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length
    const max = Math.max(...values)
    const min = Math.min(...values)
    
    return { ...dim, avg, max, min }
  })

  // 找出最强和最弱维度
  const strongest = stats.reduce((prev, curr) => curr.avg > prev.avg ? curr : prev)
  const weakest = stats.reduce((prev, curr) => curr.avg < prev.avg ? curr : prev)

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">维度分析</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {stats.map((stat) => (
            <div key={stat.key} className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="font-medium text-xs sm:text-sm">{stat.name}</span>
                <span className="text-[10px] sm:text-sm text-muted-foreground">
                  平均 {stat.avg.toFixed(1)} / 最高 {stat.max} / 最低 {stat.min}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    stat.key === strongest.key ? 'bg-green-500' : 
                    stat.key === weakest.key ? 'bg-red-500' : 
                    'bg-blue-500'
                  }`}
                  style={{ width: `${(stat.avg / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <div className="pt-2 border-t mt-3 sm:mt-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              💪 最强维度：<span className="font-medium text-green-600">{strongest.name}</span>
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              📈 需改进：<span className="font-medium text-red-600">{weakest.name}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 学习建议
 */
export function LearningSuggestions({ records }: AdvancedStatsProps) {
  const validRecords = records.filter(r => r.assessment)

  if (validRecords.length === 0) {
    return null
  }

  const suggestions: string[] = []

  // 分析最近的表现
  const recentRecords = validRecords.slice(-5)
  const recentAvg = recentRecords.reduce((sum, r) => sum + r.assessment!.overall, 0) / recentRecords.length

  if (recentAvg < 6) {
    suggestions.push('最近评分较低，建议多练习基础概念的解释')
  } else if (recentAvg >= 8) {
    suggestions.push('表现优秀！继续保持，可以尝试更复杂的概念')
  }

  // 分析维度
  const avgClarity = validRecords.reduce((sum, r) => sum + r.assessment!.clarity, 0) / validRecords.length
  const avgLogic = validRecords.reduce((sum, r) => sum + r.assessment!.logic, 0) / validRecords.length
  const avgCompleteness = validRecords.reduce((sum, r) => sum + r.assessment!.completeness, 0) / validRecords.length

  if (avgClarity < 7) {
    suggestions.push('建议使用更多简单易懂的词汇，避免专业术语')
  }
  if (avgLogic < 7) {
    suggestions.push('建议使用"因为"、"所以"等连接词，让逻辑更清晰')
  }
  if (avgCompleteness < 7) {
    suggestions.push('建议补充更多细节和例子，让回答更完整')

  }

  // 训练频率建议
  const daysSinceLast = validRecords.length > 0
    ? (Date.now() - validRecords[validRecords.length - 1].createdAt.getTime()) / (24 * 60 * 60 * 1000)
    : 0

  if (daysSinceLast > 7) {
    suggestions.push('距离上次训练已超过7天，建议保持定期练习')
  }

  if (suggestions.length === 0) {
    suggestions.push('继续保持当前的学习节奏！')
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">学习建议</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1.5 sm:space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="text-xs sm:text-sm text-muted-foreground flex items-start">
              <span className="mr-2 shrink-0">💡</span>
              <span className="break-words">{suggestion}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

