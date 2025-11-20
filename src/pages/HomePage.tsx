import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { KnowledgeInput } from '@/components/KnowledgeInput'
import { useKnowledgeStore } from '@/stores/knowledgeStore'
import { generateQuestions } from '@/services/ai'
import { useToast } from '@/components/ui/toast'
import { Loading } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import { VersionInfo } from '@/components/VersionInfo'
import { checkVersionAndRefresh } from '@/utils/version'

/**
 * 首页：知识点输入
 */
export function HomePage() {
  const navigate = useNavigate()
  const { setQuestions, setLoading, setError } = useKnowledgeStore()
  const { showError, showSuccess } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  // 在首页加载时检查版本，如果不一致则强制刷新
  useEffect(() => {
    // 只在生产环境或非开发模式时检查版本
    if (import.meta.env.MODE === 'production' || import.meta.env.PROD) {
      // 延迟一下，确保页面已加载，避免影响用户体验
      const timer = setTimeout(() => {
        checkVersionAndRefresh(true).catch(error => {
          // 静默处理错误，不影响用户体验
          if (import.meta.env.MODE === 'development') {
            console.warn('版本检查失败:', error)
          }
        })
      }, 1000) // 延迟1秒，让页面先渲染
      
      return () => clearTimeout(timer)
    }
  }, [])

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
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-2xl relative">
      <header className="mb-6 sm:mb-8 text-center animate-fade-in">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-2">
          费曼学习法输出训练器
        </h1>
        <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base md:text-lg px-2">
          通过向"小白"解释来检验你的理解深度
        </p>
        <Button
          variant="outline"
          onClick={() => navigate('/history')}
          className="mb-4 hover:scale-105 transition-transform text-sm sm:text-base"
          aria-label="查看历史记录"
        >
          查看历史记录
        </Button>
      </header>
      {isGenerating ? (
        <div className="flex justify-center py-8 sm:py-12">
          <Loading size="lg" text="正在生成问题..." />
        </div>
      ) : (
        <KnowledgeInput onSubmit={handleSubmit} isLoading={isGenerating} />
      )}
      {/* 版本信息（右下角隐蔽位置） */}
      <VersionInfo />
    </div>
  )
}

