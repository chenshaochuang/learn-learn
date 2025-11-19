import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useHistoryStore } from '@/stores/historyStore'
import { useKnowledgeStore } from '@/stores/knowledgeStore'
import { useTagStore } from '@/stores/tagStore'
import type { KnowledgeRecord } from '@/types/knowledge'
import { useToast } from '@/components/ui/toast'
import { PageLoading } from '@/components/ui/loading'
import { exportAllRecordsAsJSON, exportAllRecordsAsMarkdown, exportLearningReport } from '@/utils/export'
import { KnowledgeCard } from '@/components/KnowledgeCard'
import { ProgressChart, ScoreDistribution } from '@/components/ProgressChart'
import { RecordComparison } from '@/components/RecordComparison'
import { TagCloud, KnowledgeDistribution, LearningTimeDistribution } from '@/components/KnowledgeGraph'
import { TrendAnalysis, DimensionAnalysis, LearningSuggestions } from '@/components/AdvancedStats'

/**
 * 历史记录页面
 */
export function HistoryPage() {
  const navigate = useNavigate()
  const { records, isLoading, searchKeyword, selectedTagIds, loadRecords, searchRecords, clearSearch, deleteRecord, filterByTags } = useHistoryStore()
  const { loadFromRecord } = useKnowledgeStore()
  const { tags, loadTags } = useTagStore()
  const { showSuccess, showError } = useToast()
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [comparingRecords, setComparingRecords] = useState<KnowledgeRecord[]>([])

  useEffect(() => {
    loadRecords()
    loadTags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRecordSelect = (record: KnowledgeRecord) => {
    loadFromRecord(record)
    navigate('/assessment')
  }

  const handleRecordDelete = async (recordId: string) => {
    try {
      await deleteRecord(recordId)
      showSuccess('记录已删除')
      // 如果删除的记录在对比列表中，移除它
      setComparingRecords(prev => prev.filter(r => r.id !== recordId))
    } catch (error) {
      showError('删除失败')
    }
  }

  const handleToggleCompare = (record: KnowledgeRecord) => {
    setComparingRecords(prev => {
      const exists = prev.find(r => r.id === record.id)
      if (exists) {
        return prev.filter(r => r.id !== record.id)
      } else {
        // 只允许对比同一知识点的记录
        const sameKnowledge = prev.length > 0 && prev[0].knowledge === record.knowledge
        if (sameKnowledge || prev.length === 0) {
          return [...prev, record].slice(0, 3) // 最多对比3条
        } else {
          showError('只能对比同一知识点的记录')
          return prev
        }
      }
    })
  }

  const handleShare = (success: boolean) => {
    if (success) {
      showSuccess('已复制到剪贴板')
    } else {
      showError('分享失败，请重试')
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-4xl">
      <header className="mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">历史记录</h1>
          <Button 
            onClick={() => navigate('/')} 
            aria-label="新建训练"
            className="text-xs sm:text-sm"
            size="sm"
          >
            新建训练
          </Button>
        </div>
        {records.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === 'card' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('card')}
                className="text-xs sm:text-sm"
              >
                卡片
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="text-xs sm:text-sm"
              >
                列表
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => exportAllRecordsAsJSON(records)}
              size="sm"
              className="text-xs sm:text-sm"
            >
              导出 JSON
            </Button>
            <Button
              variant="outline"
              onClick={() => exportAllRecordsAsMarkdown(records)}
              size="sm"
              className="text-xs sm:text-sm"
            >
              导出 MD
            </Button>
            <Button
              variant="outline"
              onClick={() => exportLearningReport(records)}
              size="sm"
              className="text-xs sm:text-sm"
            >
              导出报告
            </Button>
          </div>
        )}
      </header>

      {/* 记录对比 */}
      {comparingRecords.length > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <RecordComparison
              records={comparingRecords}
              onClose={() => setComparingRecords([])}
            />
          </CardContent>
        </Card>
      )}

      {/* 学习进度统计 */}
      {records.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <ProgressChart records={records} />
            <ScoreDistribution records={records} />
          </div>
          
          {/* 知识图谱和分布统计 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <TagCloud records={records} tags={tags} />
            <KnowledgeDistribution records={records} />
            <LearningTimeDistribution records={records} />
          </div>

          {/* 高级统计分析 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <TrendAnalysis records={records} />
            <DimensionAnalysis records={records} />
            <LearningSuggestions records={records} />
          </div>
        </>
      )}

      {/* 搜索框和标签筛选 */}
      <Card className="mb-4 sm:mb-6">
        <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
          <Input
            placeholder="搜索知识点或回答..."
            value={searchKeyword}
            onChange={(e) => {
              const keyword = e.target.value
              if (keyword) {
                searchRecords(keyword)
              } else {
                clearSearch()
              }
            }}
            aria-label="搜索记录"
            className="text-sm sm:text-base"
          />
          {tags.length > 0 && (
            <div>
              <p className="text-xs sm:text-sm font-medium mb-2">按标签筛选</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer text-xs sm:text-sm"
                    onClick={() => {
                      const newTagIds = selectedTagIds.includes(tag.id)
                        ? selectedTagIds.filter(id => id !== tag.id)
                        : [...selectedTagIds, tag.id]
                      filterByTags(newTagIds)
                    }}
                    style={tag.color && selectedTagIds.includes(tag.id) ? { backgroundColor: tag.color } : undefined}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {selectedTagIds.length > 0 && (
                  <Badge
                    variant="outline"
                    className="cursor-pointer text-xs sm:text-sm"
                    onClick={() => filterByTags([])}
                  >
                    清除筛选
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 记录列表 */}
      {isLoading ? (
        <PageLoading />
      ) : records.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4">
              {searchKeyword ? '没有找到相关记录' : '还没有训练记录'}
            </p>
            {!searchKeyword && (
              <Button onClick={() => navigate('/')} className="w-full">
                开始第一次训练
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'card' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4' : 'space-y-3 sm:space-y-4'}>
          {records.map((record) => {
            // 创建标签映射
            const tagMap = new Map(
              tags.map(tag => [tag.id, { name: tag.name, color: tag.color }])
            )

            return (
              <KnowledgeCard
                key={record.id}
                record={record}
                onSelect={handleRecordSelect}
                onDelete={handleRecordDelete}
                onToggleCompare={handleToggleCompare}
                onShare={handleShare}
                isComparing={comparingRecords.some(r => r.id === record.id)}
                viewMode={viewMode}
                tagMap={tagMap}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

