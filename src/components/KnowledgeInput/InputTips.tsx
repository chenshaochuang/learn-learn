import { Card, CardContent } from '@/components/ui/card'

/**
 * 输入提示组件
 */
export function InputTips() {
  const tips = [
    '输入你想要检验理解的知识点',
    '可以是概念、原理、方法等',
    '尽量简洁明了，突出重点',
  ]

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <h3 className="text-sm font-semibold mb-2 text-muted-foreground">输入提示</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

