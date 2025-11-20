import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useKnowledgeStore } from '@/stores/knowledgeStore'
import { assessAnswer } from '@/services/ai'
import { useToast } from '@/components/ui/toast'
import { Loading } from '@/components/ui/loading'
import { VoiceInput } from '@/components/VoiceInput'

/**
 * 回答输入页面
 */
export function AnswerPage() {
  const navigate = useNavigate()
  const { questions, currentKnowledge, answer, setAnswer, setAssessment, setLoading, setError } = useKnowledgeStore()
  const { showError, showSuccess } = useToast()
  const [isAssessing, setIsAssessing] = useState(false)
  const [localAnswer, setLocalAnswer] = useState(answer)

  const handleSubmit = async () => {
    if (!localAnswer.trim()) {
      showError('请先输入回答')
      return
    }

    setIsAssessing(true)
    setLoading(true)
    setError(null)

    try {
      // 使用第一个问题作为评估基准（后续可以改进为评估所有问题）
      const question = (questions && questions.length > 0) ? questions[0] : '请解释这个知识点'
      const assessment = await assessAnswer(currentKnowledge, question, localAnswer, questions)
      
      setAnswer(localAnswer)
      setAssessment(assessment)
      showSuccess('评估完成！')
      
      // 跳转到评估结果页面
      navigate('/assessment')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '评估失败'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setIsAssessing(false)
      setLoading(false)
    }
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4 text-sm sm:text-base">
              请先回答问题
            </p>
            <Button onClick={() => navigate('/questions')} className="w-full text-sm sm:text-base">
              返回问题
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-2xl">
      {isAssessing ? (
        <Card>
          <CardContent className="pt-6">
            <Loading size="lg" text="正在评估你的回答..." />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">请回答以下问题</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">问题：</p>
                  <div className="space-y-2 mb-3 sm:mb-4">
                    {(questions || []).map((question, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5 text-xs sm:text-sm shrink-0">
                          {index + 1}
                        </Badge>
                        <p className="flex-1 text-xs sm:text-sm text-muted-foreground break-words">{question}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="answer" className="block text-xs sm:text-sm font-medium mb-2">
                    你的回答：
                  </label>
                  <Textarea
                    id="answer"
                    value={localAnswer}
                    onChange={(e) => setLocalAnswer(e.target.value)}
                    placeholder="用简单易懂的语言回答以上所有问题，就像向一个小学生解释一样..."
                    className="min-h-[180px] sm:min-h-[200px] text-sm sm:text-base"
                    disabled={isAssessing}
                    aria-label="回答输入框"
                    aria-describedby="answer-hint"
                  />
                  <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <p id="answer-hint" className="text-xs text-muted-foreground" aria-live="polite">
                      {localAnswer.length} 字符
                    </p>
                    <div className="w-full sm:w-32">
                      <VoiceInput
                        onTranscript={(text) => {
                          const newText = localAnswer ? `${localAnswer} ${text}` : text
                          setLocalAnswer(newText)
                        }}
                        disabled={isAssessing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/questions')} 
              className="flex-1 text-sm sm:text-base"
              disabled={isAssessing}
            >
              返回
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 text-sm sm:text-base"
              disabled={isAssessing || !localAnswer.trim()}
            >
              {isAssessing ? '评估中...' : '提交评估'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

