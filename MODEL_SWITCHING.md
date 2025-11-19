# 多模型自动切换功能

## ✨ 功能说明

当第一个模型的免费额度用完后，系统会自动切换到列表中的下一个模型，确保服务不中断。

## 🔧 工作原理

1. **模型列表**：按优先级配置了多个模型
2. **自动检测**：当遇到额度用完、模型不可用等错误时，自动识别
3. **自动切换**：从当前模型切换到下一个可用模型
4. **状态保存**：使用 localStorage 保存当前模型索引，下次启动时继续使用

## 📋 配置的模型列表

按优先级排序（所有模型都有 1000K tokens 免费额度）：

### 第一梯队：高性能模型（推荐）
1. **ERNIE-4.5 Turbo 128K** (`ernie-4.5-turbo-128k`) - 高性能，128K上下文
2. **ERNIE-4.5 Turbo 32K** (`ernie-4.5-turbo-32k`) - 高性能，32K上下文
3. **ERNIE-X1 Turbo** (`ernie-x1-turbo-32k`) - ERNIE X1 系列

### 第二梯队：DeepSeek 系列
4. **DeepSeek V3.1** (`deepseek-v3.1-250821`) - DeepSeek 最新版本
5. **DeepSeek V3.1 Think** (`deepseek-v3.1-think-250821`) - 思考增强版
6. **DeepSeek R1** (`deepseek-r1`) - 推理模型

### 第三梯队：通义千问系列
7. **Qwen3 235B** (`qwen3-235b-a22b-instruct-2507`) - 235B 大模型
8. **Qwen3 30B** (`qwen3-30b-a3b-instruct-2507`) - 30B 模型

### 第四梯队：其他备选
9. **Kimi K2** (`kimi-k2-instruct`) - Kimi 指令模型
10. **Qianfan 推荐** (`qianfan-sug-8k`) - 百度千帆推荐

### 最后备选：基础模型
11. **ERNIE-4.0 Turbo** (`ernie-4.0-turbo-8k`) - 标准模型
12. **ERNIE-3.5** (`ernie-3.5-8k`) - 经济型模型
13. **ERNIE-Lite** (`ernie-lite-8k`) - 轻量级模型

## 🔍 触发切换的错误类型

以下错误会触发自动切换：
- 额度用完（quota、limit、exceeded）
- 余额不足
- 模型不可用（model not found、model unavailable）
- 权限错误（unauthorized、forbidden）
- 速率限制（rate limit、429）

## 💾 状态管理

- 当前使用的模型索引保存在 `localStorage` 中
- 键名：`qianfan_model_index`
- 成功使用某个模型后，会保存该模型的索引
- 下次启动时，会从保存的模型开始尝试

## 🛠️ 使用方式

### 自动使用（默认）

无需任何配置，系统会自动处理模型切换。

### 查看当前模型

```typescript
import { getModelStatus } from '@/services/ai'

const status = getModelStatus()
console.log(`当前使用: ${status.current} (${status.currentIndex}/${status.total})`)
```

### 重置到第一个模型

```typescript
import { resetToFirstModel } from '@/services/ai'

// 重置到第一个模型（当第一个模型恢复额度后）
resetToFirstModel()
```

### 获取所有模型信息

```typescript
import { getAllModels } from '@/services/ai'

const models = getAllModels()
models.forEach(model => {
  console.log(`${model.name}: ${model.model} ${model.isCurrent ? '(当前)' : ''}`)
})
```

## 📝 自定义模型列表

如果需要修改模型列表，编辑 `src/services/ai/modelConfig.ts`：

```typescript
export const MODEL_LIST: ModelConfig[] = [
  {
    name: '你的模型名称',
    model: '模型ID',
    description: '模型描述',
  },
  // ... 更多模型
]
```

## 🔔 开发环境提示

在开发环境中，模型切换时会在控制台输出提示信息：
- `模型 XXX 失败，尝试下一个模型: [错误信息]`
- `已切换到模型: XXX`

生产环境中这些日志不会显示。

## ⚠️ 注意事项

1. **所有模型都失败**：如果所有模型都尝试失败，会抛出最后一个错误
2. **非切换错误**：如果是其他类型的错误（如网络错误），不会触发切换
3. **localStorage 限制**：如果浏览器禁用了 localStorage，每次都会从第一个模型开始

## 🎯 最佳实践

1. **定期检查**：如果第一个模型恢复额度，可以调用 `resetToFirstModel()` 重置
2. **监控日志**：在开发环境中关注模型切换日志，了解使用情况
3. **模型配置**：根据实际需求调整模型列表的顺序和内容

