/**
 * 模型管理器
 * 提供查看和管理当前使用模型的功能
 */

import { MODEL_LIST, getCurrentModelIndex, resetModelIndex } from './modelConfig'

/**
 * 获取当前使用的模型信息
 */
export function getCurrentModel() {
  const index = getCurrentModelIndex()
  return {
    index,
    model: MODEL_LIST[index],
    isFirst: index === 0,
    isLast: index === MODEL_LIST.length - 1,
  }
}

/**
 * 获取所有可用模型列表
 */
export function getAllModels() {
  return MODEL_LIST.map((model, index) => ({
    ...model,
    index,
    isCurrent: index === getCurrentModelIndex(),
  }))
}

/**
 * 重置到第一个模型
 */
export function resetToFirstModel() {
  resetModelIndex()
}

/**
 * 获取模型使用状态信息（用于显示）
 */
export function getModelStatus() {
  const current = getCurrentModel()
  const total = MODEL_LIST.length
  
  return {
    current: current.model.name,
    currentIndex: current.index + 1,
    total,
    description: current.model.description,
    canSwitch: !current.isLast,
  }
}

