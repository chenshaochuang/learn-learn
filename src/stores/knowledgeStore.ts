import { create } from 'zustand'
import type { KnowledgeRecord } from '@/types/knowledge'
import type { AssessmentResult } from '@/types/assessment'

interface KnowledgeState {
  // 当前知识点输入
  currentKnowledge: string
  // AI 生成的问题
  questions: string[]
  // 用户回答
  answer: string
  // 评估结果
  assessment: AssessmentResult | null
  // 加载状态
  isLoading: boolean
  // 错误信息
  error: string | null
  // 当前记录 ID（用于更新已有记录）
  currentRecordId: string | null

  // Actions
  setKnowledge: (knowledge: string) => void
  setQuestions: (questions: string[]) => void
  setAnswer: (answer: string) => void
  setAssessment: (assessment: AssessmentResult) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setCurrentRecordId: (id: string | null) => void
  loadFromRecord: (record: KnowledgeRecord) => void
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  reset: () => void
}

const initialState = {
  currentKnowledge: '',
  questions: [],
  answer: '',
  assessment: null,
  isLoading: false,
  error: null,
  currentRecordId: null,
  selectedTags: [],
}

export const useKnowledgeStore = create<KnowledgeState>((set) => ({
  ...initialState,

  setKnowledge: (knowledge) => set({ currentKnowledge: knowledge }),

  setQuestions: (questions) => set({ questions }),

  setAnswer: (answer) => set({ answer }),

  setAssessment: (assessment) => set({ assessment }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setCurrentRecordId: (id) => set({ currentRecordId: id }),

  setSelectedTags: (tags) => set({ selectedTags: tags }),

  loadFromRecord: (record) => set({
    currentKnowledge: record.knowledge,
    questions: record.questions,
    answer: record.answer,
    assessment: record.assessment,
    currentRecordId: record.id,
    selectedTags: record.tags || [],
  }),

  reset: () => set(initialState),
}))

