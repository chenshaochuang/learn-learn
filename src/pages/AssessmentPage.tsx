import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useKnowledgeStore } from '@/stores/knowledgeStore'
import { KnowledgeRepo } from '@/services/storage'
import { useToast } from '@/components/ui/toast'
import { Loading } from '@/components/ui/loading'
import { TagSelector } from '@/components/TagSelector'
import { AssessmentChart, AssessmentRadar } from '@/components/AssessmentChart'

/**
 * 评估结果页面
 */
export function AssessmentPage() {
  const navigate = useNavigate()
  const { 
    currentKnowledge, 
    questions, 
    answer, 
    assessment,
    selectedTags,
    setSelectedTags,
    reset 
  } = useKnowledgeStore()
  const { showSuccess, showError } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!assessment) return

    setIsSaving(true)
    try {
      // 验证数据完整性
      const recordData = {
        knowledge: currentKnowledge || '',
        questions: Array.isArray(questions) ? questions : [],
        answer: answer || '',
        assessment: {
          ...assessment,
          terminologyList: Array.isArray(assessment.terminologyList) ? assessment.terminologyList : [],
          suggestions: Array.isArray(assessment.suggestions) ? assessment.suggestions : [],
        },
        tags: Array.isArray(selectedTags) ? selectedTags : [],
      }

      await KnowledgeRepo.create(recordData)
      
      showSuccess('记录保存成功！')
      reset()
      navigate('/history')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '保存失败'
      showError(errorMessage)
      console.error('保存失败:', error)
      // 输出详细错误信息
      if (error instanceof Error) {
        console.error('错误堆栈:', error.stack)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleRestart = () => {
    reset()
    navigate('/')
  }

  if (!assessment) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4 text-sm sm:text-base">
              还没有评估结果
            </p>
            <Button onClick={() => navigate('/answer')} className="w-full text-sm sm:text-base">
              返回回答
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-2xl animate-fade-in">
      <Card className="mb-4 sm:mb-6 animate-slide-up">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl">评估结果</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:space-y-6">
            {/* 总体评分 */}
            <div className="text-center animate-scale-in">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">总体评分</p>
              <div className={`text-5xl sm:text-6xl font-bold ${getScoreColor(assessment.overall)} transition-all duration-300`}>
                {assessment.overall}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">满分 10 分</p>
            </div>

            {/* 可视化图表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <AssessmentChart assessment={assessment} />
              <AssessmentRadar assessment={assessment} />
            </div>

            {/* 专业术语 */}
            {assessment.terminologyList && assessment.terminologyList.length > 0 && (
              <div>
                <p className="text-xs sm:text-sm font-medium mb-2">检测到的专业术语</p>
                <div className="flex flex-wrap gap-2">
                  {assessment.terminologyList.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs sm:text-sm">
                      {item.term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 改进建议 */}
            <div>
              <p className="text-xs sm:text-sm font-medium mb-2">改进建议</p>
              <ul className="space-y-1.5 sm:space-y-2">
                {(assessment.suggestions || []).map((suggestion, index) => (
                  <li key={index} className="text-xs sm:text-sm text-muted-foreground flex items-start">
                    <span className="mr-2 shrink-0">•</span>
                    <span className="break-words">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 标签选择 */}
            <div>
              <p className="text-xs sm:text-sm font-medium mb-2">添加标签（可选）</p>
              <TagSelector
                selectedTagIds={selectedTags || []}
                onChange={(tags) => {
                  setSelectedTags(Array.isArray(tags) ? tags : [])
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button variant="outline" onClick={handleRestart} className="flex-1 text-sm sm:text-base" disabled={isSaving}>
          重新开始
        </Button>
        <Button onClick={handleSave} className="flex-1 text-sm sm:text-base" disabled={isSaving}>
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loading size="sm" />
              保存中...
            </span>
          ) : (
            '保存记录'
          )}
        </Button>
      </div>
    </div>
  )
}

