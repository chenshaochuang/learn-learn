/**
 * 记录对比组件
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { KnowledgeRecord } from '@/types/knowledge'
import { formatDate } from '@/utils/formatters'

interface RecordComparisonProps {
  records: KnowledgeRecord[]
  onClose?: () => void
}

export function RecordComparison({ records, onClose }: RecordComparisonProps) {
  if (records.length === 0) {
    return null
  }

  // 按时间排序
  const sortedRecords = [...records].sort((a, b) => 
    a.createdAt.getTime() - b.createdAt.getTime()
  )

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-300'
    if (score >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-red-100 text-red-800 border-red-300'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">对比记录</h2>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            关闭对比
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedRecords.map((record, index) => (
          <Card key={record.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex-1">
                  {record.knowledge}
                </CardTitle>
                <Badge variant="outline" className="ml-2">
                  第 {index + 1} 次
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(record.createdAt)}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 评分对比 */}
              {record.assessment && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">总体评分</span>
                    <Badge className={getScoreColor(record.assessment.overall)}>
                      {record.assessment.overall}/10
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">清晰度:</span>
                      <span className="ml-1 font-medium">{record.assessment.clarity}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">逻辑性:</span>
                      <span className="ml-1 font-medium">{record.assessment.logic}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">完整性:</span>
                      <span className="ml-1 font-medium">{record.assessment.completeness}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 回答内容 */}
              <div>
                <p className="text-sm font-medium mb-2">回答内容</p>
                <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                  {record.answer}
                </p>
              </div>

              {/* 改进建议 */}
              {record.assessment && record.assessment.suggestions && record.assessment.suggestions.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">改进建议</p>
                  <ul className="space-y-1">
                    {record.assessment.suggestions.slice(0, 3).map((suggestion: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start">
                        <span className="mr-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 对比总结 */}
      {sortedRecords.length >= 2 && sortedRecords.every(r => r.assessment) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">对比总结</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {(() => {
                const scores = sortedRecords.map(r => r.assessment!.overall)
                const latest = scores[scores.length - 1]
                const previous = scores[scores.length - 2]
                const improvement = latest - previous

                return (
                  <div>
                    <p className="font-medium mb-1">评分变化</p>
                    <p className="text-muted-foreground">
                      最新评分: <span className="font-semibold text-blue-600">{latest}</span> 分
                      {improvement !== 0 && (
                        <span className={`ml-2 ${improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({improvement > 0 ? '↑' : '↓'} {Math.abs(improvement).toFixed(1)} 分)
                        </span>
                      )}
                    </p>
                    {improvement > 0 && (
                      <p className="text-green-600 text-xs mt-1">
                        🎉 恭喜！你的表达能力有所提升！
                      </p>
                    )}
                    {improvement < 0 && (
                      <p className="text-yellow-600 text-xs mt-1">
                        💡 建议回顾改进建议，继续努力！
                      </p>
                    )}
                  </div>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

