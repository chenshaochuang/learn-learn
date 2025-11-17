import { db } from './database'
import type { Tag } from '@/types/tag'

/**
 * 标签数据仓库
 */
export class TagRepo {
  /**
   * 创建新标签
   */
  static async create(name: string, color?: string): Promise<string> {
    const id = crypto.randomUUID()
    await db.tags.add({
      id,
      name: name.trim(),
      color,
      createdAt: new Date(),
    })
    return id
  }

  /**
   * 根据 ID 获取标签
   */
  static async getById(id: string): Promise<Tag | undefined> {
    return await db.tags.get(id)
  }

  /**
   * 获取所有标签
   */
  static async getAll(): Promise<Tag[]> {
    return await db.tags.orderBy('name').toArray()
  }

  /**
   * 根据名称查找标签
   */
  static async findByName(name: string): Promise<Tag | undefined> {
    return await db.tags.where('name').equals(name.trim()).first()
  }

  /**
   * 更新标签
   */
  static async update(id: string, updates: Partial<Omit<Tag, 'id' | 'createdAt'>>): Promise<void> {
    await db.tags.update(id, updates)
  }

  /**
   * 删除标签
   */
  static async delete(id: string): Promise<void> {
    await db.tags.delete(id)
  }

  /**
   * 批量获取标签
   */
  static async getByIds(ids: string[]): Promise<Tag[]> {
    if (ids.length === 0) return []
    return await db.tags.where('id').anyOf(ids).toArray()
  }
}

