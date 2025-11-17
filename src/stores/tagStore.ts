import { create } from 'zustand'
import type { Tag } from '@/types/tag'
import { TagRepo } from '@/services/storage'

interface TagState {
  tags: Tag[]
  isLoading: boolean
  error: string | null

  loadTags: () => Promise<void>
  createTag: (name: string, color?: string) => Promise<string>
  updateTag: (id: string, updates: Partial<Omit<Tag, 'id' | 'createdAt'>>) => Promise<void>
  deleteTag: (id: string) => Promise<void>
  getTagById: (id: string) => Tag | undefined
  getTagsByIds: (ids: string[]) => Tag[]
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,

  loadTags: async () => {
    set({ isLoading: true, error: null })
    try {
      const tags = await TagRepo.getAll()
      set({ tags, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '加载标签失败',
        isLoading: false,
      })
    }
  },

  createTag: async (name: string, color?: string) => {
    set({ error: null })
    try {
      // 检查是否已存在同名标签
      const existing = await TagRepo.findByName(name)
      if (existing) {
        throw new Error('标签已存在')
      }
      const id = await TagRepo.create(name, color)
      await get().loadTags()
      return id
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建标签失败'
      set({ error: errorMessage })
      throw error
    }
  },

  updateTag: async (id: string, updates: Partial<Omit<Tag, 'id' | 'createdAt'>>) => {
    set({ error: null })
    try {
      await TagRepo.update(id, updates)
      await get().loadTags()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '更新标签失败',
      })
      throw error
    }
  },

  deleteTag: async (id: string) => {
    set({ error: null })
    try {
      await TagRepo.delete(id)
      await get().loadTags()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '删除标签失败',
      })
      throw error
    }
  },

  getTagById: (id: string) => {
    const tags = get().tags || []
    return tags.find(tag => tag.id === id)
  },

  getTagsByIds: (ids: string[]) => {
    const tags = get().tags || []
    if (!Array.isArray(ids) || ids.length === 0) return []
    return tags.filter(tag => ids.includes(tag.id))
  },
}))

