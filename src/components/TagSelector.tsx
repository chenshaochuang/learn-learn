import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useTagStore } from '@/stores/tagStore'
import { useToast } from '@/components/ui/toast'

interface TagSelectorProps {
  selectedTagIds: string[]
  onChange: (tagIds: string[]) => void
}

/**
 * 标签选择器组件
 */
export function TagSelector({ selectedTagIds, onChange }: TagSelectorProps) {
  const { tags, isLoading, loadTags, createTag } = useTagStore()
  const { showError, showSuccess } = useToast()
  const [newTagName, setNewTagName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // 确保 selectedTagIds 是数组
  const safeSelectedTagIds = Array.isArray(selectedTagIds) ? selectedTagIds : []

  useEffect(() => {
    loadTags()
  }, [loadTags])

  const handleToggleTag = (tagId: string) => {
    if (safeSelectedTagIds.includes(tagId)) {
      onChange(safeSelectedTagIds.filter(id => id !== tagId))
    } else {
      onChange([...safeSelectedTagIds, tagId])
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      showError('请输入标签名称')
      return
    }

    setIsCreating(true)
    try {
      await createTag(newTagName.trim())
      setNewTagName('')
      showSuccess('标签创建成功')
    } catch (error) {
      showError(error instanceof Error ? error.message : '创建标签失败')
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">加载标签中...</div>
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(tags || []).map(tag => (
          <Badge
            key={tag.id}
            variant={safeSelectedTagIds.includes(tag.id) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleToggleTag(tag.id)}
            style={tag.color ? { backgroundColor: tag.color } : undefined}
          >
            {tag.name}
          </Badge>
        ))}
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="输入新标签名称..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateTag()
                }
              }}
              disabled={isCreating}
            />
            <Button
              onClick={handleCreateTag}
              disabled={isCreating || !newTagName.trim()}
              size="sm"
            >
              {isCreating ? '创建中...' : '创建'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

