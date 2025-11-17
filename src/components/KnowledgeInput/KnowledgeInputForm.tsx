import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useKnowledgeStore } from '@/stores/knowledgeStore'

interface KnowledgeInputFormProps {
  onSubmit: (knowledge: string) => void
  isLoading?: boolean
}

/**
 * 知识点输入表单组件
 */
export function KnowledgeInputForm({ onSubmit, isLoading = false }: KnowledgeInputFormProps) {
  const { currentKnowledge, setKnowledge } = useKnowledgeStore()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmed = currentKnowledge.trim()
    
    if (!trimmed) {
      setError('请输入知识点')
      return
    }

    if (trimmed.length < 5) {
      setError('知识点内容太短，请至少输入5个字符')
      return
    }

    if (trimmed.length > 1000) {
      setError('知识点内容太长，请控制在1000个字符以内')
      return
    }

    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="knowledge" className="block text-sm font-medium mb-2">
          知识点
        </label>
        <Textarea
          id="knowledge"
          value={currentKnowledge}
          onChange={(e) => {
            setKnowledge(e.target.value)
            setError(null)
          }}
          placeholder="例如：什么是机器学习？机器学习是一种让计算机从数据中学习的方法..."
          className="min-h-[120px]"
          disabled={isLoading}
        />
        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          {currentKnowledge.length} / 1000 字符
        </p>
      </div>
      <Button 
        type="submit" 
        disabled={isLoading || !currentKnowledge.trim()}
        className="w-full"
      >
        {isLoading ? '处理中...' : '开始训练'}
      </Button>
    </form>
  )
}

