import { db } from './database'
import type { KnowledgeRecord } from '@/types/knowledge'

/**
 * 知识点数据仓库
 */
export class KnowledgeRepo {
  /**
   * 创建新的知识点记录
   */
  static async create(record: Omit<KnowledgeRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date()
    const id = crypto.randomUUID()
    
    // 确保所有字段都是有效的
    const safeRecord: KnowledgeRecord = {
      id,
      knowledge: typeof record.knowledge === 'string' ? record.knowledge : '',
      questions: Array.isArray(record.questions) ? record.questions : [],
      answer: typeof record.answer === 'string' ? record.answer : '',
      assessment: record.assessment || null,
      tags: Array.isArray(record.tags) ? record.tags : [],
      createdAt: now,
      updatedAt: now,
    }
    
    // 如果 assessment 存在，确保其内部字段也是有效的
    if (safeRecord.assessment) {
      safeRecord.assessment = {
        ...safeRecord.assessment,
        terminologyList: Array.isArray(safeRecord.assessment.terminologyList) 
          ? safeRecord.assessment.terminologyList 
          : [],
        suggestions: Array.isArray(safeRecord.assessment.suggestions) 
          ? safeRecord.assessment.suggestions 
          : [],
      }
    }
    
    console.log('准备保存的记录:', safeRecord) // 调试日志
    
    try {
      await db.knowledgeRecords.add(safeRecord)
      return id
    } catch (error) {
      console.error('保存记录时出错:', error)
      console.error('记录数据:', safeRecord)
      throw error
    }
  }

  /**
   * 根据 ID 获取记录
   */
  static async getById(id: string): Promise<KnowledgeRecord | undefined> {
    return await db.knowledgeRecords.get(id)
  }

  /**
   * 获取所有记录（按创建时间倒序）
   */
  static async getAll(): Promise<KnowledgeRecord[]> {
    return await db.knowledgeRecords.orderBy('createdAt').reverse().toArray()
  }

  /**
   * 更新记录
   */
  static async update(id: string, updates: Partial<Omit<KnowledgeRecord, 'id' | 'createdAt'>>): Promise<void> {
    await db.knowledgeRecords.update(id, {
      ...updates,
      updatedAt: new Date(),
    })
  }

  /**
   * 删除记录
   */
  static async delete(id: string): Promise<void> {
    await db.knowledgeRecords.delete(id)
  }

  /**
   * 搜索记录（根据知识点内容）
   */
  static async search(keyword: string): Promise<KnowledgeRecord[]> {
    const allRecords = await this.getAll()
    const lowerKeyword = keyword.toLowerCase()
    return allRecords.filter(record => 
      record.knowledge.toLowerCase().includes(lowerKeyword) ||
      record.answer.toLowerCase().includes(lowerKeyword)
    )
  }

  /**
   * 清空所有记录
   */
  static async clearAll(): Promise<void> {
    await db.knowledgeRecords.clear()
  }
}

