import Dexie, { Table } from 'dexie'
import type { KnowledgeRecord } from '@/types/knowledge'
import type { Tag } from '@/types/tag'

/**
 * IndexedDB 数据库配置
 */
class LearnLearnDB extends Dexie {
  knowledgeRecords!: Table<KnowledgeRecord>
  tags!: Table<Tag>

  constructor() {
    super('LearnLearnDB')
    
    // 版本 31：当前版本（兼容已有数据）
    // 如果数据库版本已经是 30，直接使用版本 31 来兼容
    this.version(31).stores({
      knowledgeRecords: 'id, knowledge, createdAt, updatedAt, *tags',
      tags: 'id, name, createdAt'
    }).upgrade(async (tx) => {
      // 迁移：为现有记录添加空标签数组（如果还没有）
      try {
        const records = await tx.table('knowledgeRecords').toCollection().toArray()
        if (!Array.isArray(records)) {
          return
        }
        for (const record of records) {
          if (record && record.id) {
            const updates: any = {}
            
            // 确保 tags 字段存在且是数组
            if (!('tags' in record) || !Array.isArray(record.tags)) {
              updates.tags = []
            }
            
            // 确保 questions 字段存在且是数组
            if (!('questions' in record) || !Array.isArray(record.questions)) {
              updates.questions = []
            }
            
            // 确保 answer 字段存在
            if (!('answer' in record) || typeof record.answer !== 'string') {
              updates.answer = ''
            }
            
            // 确保 knowledge 字段存在
            if (!('knowledge' in record) || typeof record.knowledge !== 'string') {
              updates.knowledge = ''
            }
            
            // 批量更新
            if (Object.keys(updates).length > 0) {
              await tx.table('knowledgeRecords').update(record.id, updates)
            }
          }
        }
      } catch (error) {
        console.warn('数据库迁移警告:', error)
        // 不抛出错误，允许继续运行
      }
    })
  }
}

export const db = new LearnLearnDB()

