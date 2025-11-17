# 快速开始

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run dev
```

项目将在 `http://localhost:5173` 启动

## 构建生产版本

```bash
npm run build
```

## 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── components/        # UI 组件
│   ├── ui/           # 基础 UI 组件（shadcn/ui）
│   └── KnowledgeInput/  # 知识点输入模块
├── pages/            # 页面组件
├── services/         # 业务逻辑服务
│   ├── ai/          # AI 服务（当前使用模拟实现）
│   └── storage/     # 数据存储服务
├── stores/          # Zustand 状态管理
├── types/           # TypeScript 类型定义
└── utils/           # 工具函数
```

## 功能说明

### 当前实现的功能

1. ✅ 知识点输入
2. ✅ AI 问题生成（模拟实现）
3. ✅ 用户回答输入
4. ✅ 回答评估（模拟实现）
5. ✅ 历史记录查看
6. ✅ 本地数据存储（IndexedDB）

### 待实现的功能

- 真实的 AI API 集成（OpenAI/文心一言等）
- 更详细的评估报告
- 知识卡片管理
- 标签分类
- 导出功能

## 注意事项

- 当前 AI 功能使用模拟实现，需要后续集成真实的 AI API
- 数据存储在浏览器本地 IndexedDB 中
- 支持响应式设计，可在移动端使用

