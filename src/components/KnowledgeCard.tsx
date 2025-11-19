/**
 * 知识卡片组件
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { KnowledgeRecord } from '@/types/knowledge'
import { formatDate, truncate } from '@/utils/formatters'
import { exportRecordAsJSON, exportRecordAsMarkdown } from '@/utils/export'
import { shareRecord } from '@/utils/share'

interface KnowledgeCardProps {
  record: KnowledgeRecord
  onSelect?: (record: KnowledgeRecord) => void
  onDelete?: (recordId: string) => void
  onToggleCompare?: (record: KnowledgeRecord) => void
  onShare?: (success: boolean) => void
  isComparing?: boolean
  viewMode?: 'card' | 'list'
  tagMap?: Map<string, { name: string; color?: string }>
}

export function KnowledgeCard({ record, onSelect, onDelete, onToggleCompare, onShare, isComparing, viewMode = 'card', tagMap }: KnowledgeCardProps) {
  const handleClick = () => {
    onSelect?.(record)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('确定要删除这条记录吗？')) {
      onDelete?.(record.id)
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const success = await shareRecord(record)
    onShare?.(success)
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
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="flex-1 w-full sm:w-auto">
              <CardTitle className="text-base sm:text-lg mb-2 break-words">{record.knowledge}</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {record.assessment && (
                  <Badge className={`${getScoreColor(record.assessment.overall)} text-xs sm:text-sm`}>
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
            <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-wrap w-full sm:w-auto">
              {onToggleCompare && (
                <Button
                  variant={isComparing ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleCompare(record)
                  }}
                  title="对比记录"
                  className="text-xs sm:text-sm"
                >
                  {isComparing ? '取消' : '对比'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                title="分享记录"
                className="text-xs sm:text-sm"
              >
                分享
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  exportRecordAsJSON(record)
                }}
                title="导出为 JSON"
                className="text-xs sm:text-sm"
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
                className="text-xs sm:text-sm"
              >
                MD
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-xs sm:text-sm"
                >
                  删除
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-words">
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
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-lg leading-tight flex-1 break-words">
            {truncate(record.knowledge, 60)}
          </CardTitle>
          {record.assessment && (
            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold border shrink-0 ${getScoreColor(record.assessment.overall)}`}>
              {record.assessment.overall}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 break-words">
          {truncate(record.answer, 80)}
        </p>
        
        {record.assessment && (
          <div className="flex flex-wrap gap-2 text-xs">
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
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
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
          <span className="text-xs text-muted-foreground shrink-0 ml-2">
            {formatDate(record.createdAt)}
          </span>
        </div>

        <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pt-2 border-t flex-wrap">
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
            className="text-xs"
            onClick={handleShare}
            title="分享记录"
          >
            分享
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={(e) => {
              e.stopPropagation()
              exportRecordAsJSON(record)
            }}
          >
            JSON
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={(e) => {
              e.stopPropagation()
              exportRecordAsMarkdown(record)
            }}
          >
            MD
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

