/**
 * 知识卡片组件
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { KnowledgeRecord } from '@/types/knowledge'
import { formatDate, truncate } from '@/utils/formatters'
import { exportRecordAsJSON, exportRecordAsMarkdown } from '@/utils/export'

interface KnowledgeCardProps {
  record: KnowledgeRecord
  onSelect?: (record: KnowledgeRecord) => void
  onDelete?: (recordId: string) => void
  onToggleCompare?: (record: KnowledgeRecord) => void
  isComparing?: boolean
  viewMode?: 'card' | 'list'
  tagMap?: Map<string, { name: string; color?: string }>
}

export function KnowledgeCard({ record, onSelect, onDelete, onToggleCompare, isComparing, viewMode = 'card', tagMap }: KnowledgeCardProps) {
  const handleClick = () => {
    onSelect?.(record)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('确定要删除这条记录吗？')) {
      onDelete?.(record.id)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-300'
    if (score >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-red-100 text-red-800 border-red-300'
  }

  if (viewMode === 'list') {
    return (
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer group"
        onClick={handleClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{record.knowledge}</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {record.assessment && (
                  <Badge className={getScoreColor(record.assessment.overall)}>
                    评分: {record.assessment.overall}/10
                  </Badge>
                )}
                {record.tags && record.tags.length > 0 && (
                  <>
                    {record.tags.map((tagId) => {
                      const tag = tagMap?.get(tagId)
                      return (
                        <Badge key={tagId} variant="outline" className="text-xs">
                          {tag?.name || tagId}
                        </Badge>
                      )
                    })}
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onToggleCompare && (
                <Button
                  variant={isComparing ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleCompare(record)
                  }}
                  title="对比记录"
                >
                  {isComparing ? '取消' : '对比'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  exportRecordAsJSON(record)
                }}
                title="导出为 JSON"
              >
                JSON
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  exportRecordAsMarkdown(record)
                }}
                title="导出为 Markdown"
              >
                MD
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                >
                  删除
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            {truncate(record.answer, 100)}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDate(record.createdAt)}</span>
            <span>{(record.questions || []).length} 个问题</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 卡片视图
  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-blue-300"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight flex-1">
            {truncate(record.knowledge, 60)}
          </CardTitle>
          {record.assessment && (
            <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(record.assessment.overall)}`}>
              {record.assessment.overall}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {truncate(record.answer, 80)}
        </p>
        
        {record.assessment && (
          <div className="flex gap-2 text-xs">
            <span className="text-muted-foreground">
              清晰度: <span className="font-medium">{record.assessment.clarity}</span>
            </span>
            <span className="text-muted-foreground">
              逻辑性: <span className="font-medium">{record.assessment.logic}</span>
            </span>
            <span className="text-muted-foreground">
              完整性: <span className="font-medium">{record.assessment.completeness}</span>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 flex-wrap">
            {record.tags && record.tags.length > 0 && (
              <>
                {record.tags.slice(0, 3).map((tagId) => {
                  const tag = tagMap?.get(tagId)
                  return (
                    <Badge key={tagId} variant="outline" className="text-xs">
                      {tag?.name || tagId}
                    </Badge>
                  )
                })}
                {record.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{record.tags.length - 3}
                  </Badge>
                )}
              </>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(record.createdAt)}
          </span>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t">
          {onToggleCompare && (
            <Button
              variant={isComparing ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onToggleCompare(record)
              }}
            >
              {isComparing ? '取消对比' : '对比'}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              exportRecordAsJSON(record)
            }}
          >
            导出 JSON
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              exportRecordAsMarkdown(record)
            }}
          >
            导出 MD
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-red-600 hover:text-red-700"
              onClick={handleDelete}
            >
              删除
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

