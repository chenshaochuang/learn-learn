/**
 * 知识图谱组件
 * 可视化知识点之间的关系和标签分布
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { KnowledgeRecord } from '@/types/knowledge'
import type { Tag } from '@/types/tag'

interface KnowledgeGraphProps {
  records: KnowledgeRecord[]
  tags: Tag[]
}

/**
 * 标签云组件
 */
export function TagCloud({ records, tags }: KnowledgeGraphProps) {
  // 统计每个标签的使用次数
  const tagCounts = new Map<string, { count: number; tag: Tag }>()
  
  records.forEach(record => {
    if (record.tags && record.tags.length > 0) {
      record.tags.forEach(tagId => {
        const tag = tags.find(t => t.id === tagId)
        if (tag) {
          const current = tagCounts.get(tagId) || { count: 0, tag }
          tagCounts.set(tagId, { count: current.count + 1, tag })
        }
      })
    }
  })

  const tagArray = Array.from(tagCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20) // 只显示前20个

  if (tagArray.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            暂无标签数据
          </p>
        </CardContent>
      </Card>
    )
  }

  const maxCount = Math.max(...tagArray.map(t => t.count))
  const minCount = Math.min(...tagArray.map(t => t.count))

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">标签云</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          标签使用频率分布
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
          {tagArray.map(({ tag, count }) => {
            // 根据使用频率计算字体大小（移动端稍小）
            const baseSize = minCount === maxCount ? 12 : 10
            const size = minCount === maxCount 
              ? baseSize 
              : baseSize + ((count - minCount) / (maxCount - minCount)) * 6
            
            return (
              <Badge
                key={tag.id}
                variant="outline"
                className="cursor-pointer hover:scale-110 transition-transform text-xs sm:text-sm"
                style={{
                  fontSize: `${size}px`,
                  backgroundColor: tag.color ? `${tag.color}20` : undefined,
                  borderColor: tag.color || undefined,
                }}
                title={`使用 ${count} 次`}
              >
                {tag.name} ({count})
              </Badge>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 知识点分布统计
 */
export function KnowledgeDistribution({ records }: { records: KnowledgeRecord[] }) {
  // 按知识点分组统计
  const knowledgeMap = new Map<string, { knowledge: string; count: number; totalScore: number }>()
  
  records.forEach(record => {
    const key = record.knowledge
    const existing = knowledgeMap.get(key) || { knowledge: key, count: 0, totalScore: 0 }
    
    existing.count++
    if (record.assessment) {
      existing.totalScore += record.assessment.overall
    }
    
    knowledgeMap.set(key, existing)
  })

  // 计算平均分
  const knowledgeArray = Array.from(knowledgeMap.values())
    .map(item => ({
      knowledge: item.knowledge,
      count: item.count,
      avgScore: item.count > 0 ? item.totalScore / item.count : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // 只显示前10个

  if (knowledgeArray.length === 0) {
    return null
  }

  const maxCount = Math.max(...knowledgeArray.map(k => k.count))

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">知识点分布</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          训练次数最多的知识点
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {knowledgeArray.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="font-medium truncate text-xs sm:text-sm flex-1">{item.knowledge}</span>
                <span className="text-xs sm:text-sm text-muted-foreground shrink-0">
                  {item.count} 次
                  {item.avgScore > 0 && (
                    <span className="ml-1 sm:ml-2 text-blue-600">
                      (平均 {item.avgScore.toFixed(1)} 分)
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 学习时间分布
 */
export function LearningTimeDistribution({ records }: { records: KnowledgeRecord[] }) {
  // 按日期统计训练次数
  const dateMap = new Map<string, number>()
  
  records.forEach(record => {
    const date = new Date(record.createdAt).toLocaleDateString('zh-CN')
    dateMap.set(date, (dateMap.get(date) || 0) + 1)
  })

  const dateArray = Array.from(dateMap.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-14) // 最近14天

  if (dateArray.length === 0) {
    return null
  }

  const maxCount = Math.max(...dateArray.map(([, count]) => count))

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">学习时间分布</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          最近 14 天的训练频率
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5 sm:space-y-2">
          {dateArray.map(([date, count]) => (
            <div key={date} className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-xs text-muted-foreground w-16 sm:w-20 shrink-0">{date}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2.5 sm:h-3">
                <div
                  className="bg-green-500 h-2.5 sm:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-[10px] sm:text-xs font-medium w-6 sm:w-8 text-right shrink-0">{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

