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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4">
              还没有生成问题，请先输入知识点
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              返回输入
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>知识点</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{currentKnowledge}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>请回答以下问题</CardTitle>
          <p className="text-sm text-muted-foreground">
            用简单易懂的语言回答，就像向一个小学生解释一样
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {(questions || []).map((question, index) => (
            <div key={index} className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                {index + 1}
              </Badge>
              <p className="flex-1 text-sm">{question}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
          重新输入
        </Button>
        <Button onClick={() => navigate('/answer')} className="flex-1">
          开始回答
        </Button>
      </div>
    </div>
  )
}

