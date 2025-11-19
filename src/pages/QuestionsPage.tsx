import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useKnowledgeStore } from '@/stores/knowledgeStore'

/**
 * 问题展示页面
 */
export function QuestionsPage() {
  const navigate = useNavigate()
  const { questions, currentKnowledge } = useKnowledgeStore()

  if (!questions || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4 text-sm sm:text-base">
              还没有生成问题，请先输入知识点
            </p>
            <Button onClick={() => navigate('/')} className="w-full text-sm sm:text-base">
              返回输入
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-2xl">
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">知识点</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-muted-foreground break-words">{currentKnowledge}</p>
        </CardContent>
      </Card>

      <Card className="mb-4 sm:mb-6">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">请回答以下问题</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            用简单易懂的语言回答，就像向一个小学生解释一样
          </p>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {(questions || []).map((question, index) => (
            <div key={index} className="flex items-start gap-2 sm:gap-3">
              <Badge variant="outline" className="mt-1 text-xs sm:text-sm shrink-0">
                {index + 1}
              </Badge>
              <p className="flex-1 text-xs sm:text-sm break-words">{question}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button variant="outline" onClick={() => navigate('/')} className="flex-1 text-sm sm:text-base">
          重新输入
        </Button>
        <Button onClick={() => navigate('/answer')} className="flex-1 text-sm sm:text-base">
          开始回答
        </Button>
      </div>
    </div>
  )
}

