import { KnowledgeInputForm } from './KnowledgeInputForm'
import { InputTips } from './InputTips'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface KnowledgeInputProps {
  onSubmit: (knowledge: string) => void
  isLoading?: boolean
}

/**
 * 知识点输入模块主组件
 */
export function KnowledgeInput({ onSubmit, isLoading = false }: KnowledgeInputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>输入知识点</CardTitle>
        <CardDescription>
          输入你想要检验理解的知识点，AI 将为你生成简单的问题
        </CardDescription>
      </CardHeader>
      <CardContent>
        <KnowledgeInputForm onSubmit={onSubmit} isLoading={isLoading} />
        <InputTips />
      </CardContent>
    </Card>
  )
}

