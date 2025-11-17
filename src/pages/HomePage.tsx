import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KnowledgeInput } from '@/components/KnowledgeInput'
import { useKnowledgeStore } from '@/stores/knowledgeStore'
import { generateQuestions } from '@/services/ai'
import { useToast } from '@/components/ui/toast'
import { Loading } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'

/**
 * 首页：知识点输入
 */
export function HomePage() {
  const navigate = useNavigate()
  const { setQuestions, setLoading, setError } = useKnowledgeStore()
  const { showError, showSuccess } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (knowledge: string) => {
    setIsGenerating(true)
    setLoading(true)
    setError(null)

    try {
      // 生成问题
      const questions = await generateQuestions(knowledge)
      setQuestions(questions)
      showSuccess('问题生成成功！')
      
      // 跳转到问题页面
      navigate('/questions')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '生成问题失败'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setIsGenerating(false)
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <header className="mb-8 text-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          费曼学习法输出训练器
        </h1>
        <p className="text-muted-foreground mb-6 text-lg">
          通过向"小白"解释来检验你的理解深度
        </p>
        <Button
          variant="outline"
          onClick={() => navigate('/history')}
          className="mb-4 hover:scale-105 transition-transform"
          aria-label="查看历史记录"
        >
          查看历史记录
        </Button>
      </header>
      {isGenerating ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="正在生成问题..." />
        </div>
      ) : (
        <KnowledgeInput onSubmit={handleSubmit} isLoading={isGenerating} />
      )}
    </div>
  )
}

