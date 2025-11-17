import { create } from 'zustand'
import type { KnowledgeRecord } from '@/types/knowledge'
import { KnowledgeRepo } from '@/services/storage'

interface HistoryState {
  // 历史记录列表
  records: KnowledgeRecord[]
  // 选中的记录
  selectedRecord: KnowledgeRecord | null
  // 加载状态
  isLoading: boolean
  // 错误信息
  error: string | null
  // 搜索关键词
  searchKeyword: string
  // 选中的标签 ID（用于筛选）
  selectedTagIds: string[]

  // Actions
  loadRecords: () => Promise<void>
  selectRecord: (id: string) => Promise<void>
  deleteRecord: (id: string) => Promise<void>
  searchRecords: (keyword: string) => Promise<void>
  clearSearch: () => Promise<void>
  filterByTags: (tagIds: string[]) => Promise<void>
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  records: [],
  selectedRecord: null,
  isLoading: false,
  error: null,
  searchKeyword: '',
  selectedTagIds: [],

  loadRecords: async () => {
    set({ isLoading: true, error: null })
    try {
      const records = await KnowledgeRepo.getAll()
      set({ records, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '加载记录失败',
        isLoading: false 
      })
    }
  },

  selectRecord: async (id: string) => {
    try {
      const record = await KnowledgeRepo.getById(id)
      if (record) {
        set({ selectedRecord: record })
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '加载记录失败'
      })
    }
  },

  deleteRecord: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await KnowledgeRepo.delete(id)
      const records = get().records.filter(r => r.id !== id)
      set({ 
        records,
        selectedRecord: get().selectedRecord?.id === id ? null : get().selectedRecord,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '删除记录失败',
        isLoading: false 
      })
    }
  },

  searchRecords: async (keyword: string) => {
    set({ isLoading: true, error: null, searchKeyword: keyword })
    try {
      if (!keyword.trim()) {
        await get().loadRecords()
        return
      }
      const records = await KnowledgeRepo.search(keyword)
      set({ records, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '搜索失败',
        isLoading: false 
      })
    }
  },

  clearSearch: async () => {
    set({ searchKeyword: '', selectedTagIds: [] })
    await get().loadRecords()
  },

  filterByTags: async (tagIds: string[]) => {
    set({ isLoading: true, error: null, selectedTagIds: tagIds })
    try {
      if (tagIds.length === 0) {
        await get().loadRecords()
        return
      }
      const allRecords = await KnowledgeRepo.getAll()
      const filtered = allRecords.filter(record => 
        record.tags && record.tags.some(tagId => tagIds.includes(tagId))
      )
      set({ records: filtered, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '筛选失败',
        isLoading: false 
      })
    }
  },
}))

