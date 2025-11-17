# 模块化开发计划

## 📐 项目结构设计

```
learn_learn/
├── public/                 # 静态资源
├── src/
│   ├── components/         # UI 组件
│   │   ├── ui/            # 基础 UI 组件（shadcn/ui）
│   │   ├── KnowledgeInput/    # 知识点输入模块
│   │   ├── AIQuestion/        # AI 提问展示模块
│   │   ├── UserAnswer/         # 用户回答输入模块
│   │   ├── Assessment/         # 评估结果展示模块
│   │   └── History/            # 历史记录模块
│   ├── services/          # 业务逻辑服务
│   │   ├── ai/            # AI 集成服务
│   │   ├── storage/       # 数据存储服务
│   │   └── assessment/    # 评估算法服务
│   ├── stores/           # 状态管理（Zustand）
│   │   ├── knowledgeStore.ts
│   │   └── historyStore.ts
│   ├── types/            # TypeScript 类型定义
│   │   ├── knowledge.ts
│   │   └── assessment.ts
│   ├── utils/            # 工具函数
│   │   ├── terminology.ts    # 专业术语检测
│   │   └── formatters.ts     # 格式化工具
│   ├── hooks/            # 自定义 Hooks
│   │   ├── useAI.ts
│   │   └── useStorage.ts
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── .env.example          # 环境变量示例
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🧩 模块划分

### 1. UI 基础组件模块
**位置**：`src/components/ui/`
**职责**：提供可复用的基础 UI 组件
**技术**：shadcn/ui + Tailwind CSS

**组件列表**：
- Button（按钮）
- Input（输入框）
- Textarea（多行输入）
- Card（卡片）
- Badge（标签）
- Dialog（对话框）
- Toast（提示消息）
- Loading（加载状态）

**开发步骤**：
1. 安装 shadcn/ui
2. 配置 Tailwind CSS
3. 添加基础组件（Button, Input, Textarea）
4. 添加布局组件（Card, Container）
5. 添加反馈组件（Toast, Loading）

**时间估算**：2-3 天

---

### 2. 知识点输入模块
**位置**：`src/components/KnowledgeInput/`
**职责**：提供知识点输入界面和验证

**功能**：
- 文本输入框（支持多行）
- 输入验证（非空、长度限制）
- 输入提示和建议
- 快速输入模板

**组件结构**：
```
KnowledgeInput/
├── index.tsx           # 主组件
├── KnowledgeInputForm.tsx  # 输入表单
└── InputTips.tsx       # 输入提示组件
```

**开发步骤**：
1. 创建 KnowledgeInput 组件基础结构
2. 实现文本输入功能
3. 添加输入验证逻辑
4. 实现输入提示功能
5. 添加快速模板功能
6. UI 样式优化

**时间估算**：1-2 天

---

### 3. AI 集成模块
**位置**：`src/services/ai/`
**职责**：处理与 AI API 的交互

**功能**：
- 调用 AI API 生成"小白问题"
- 错误处理和重试机制
- API 密钥管理
- 请求限流处理

**文件结构**：
```
services/ai/
├── index.ts            # 导出接口
├── openai.ts           # OpenAI 实现
├── wenxin.ts           # 文心一言实现（可选）
├── types.ts            # AI 相关类型
└── prompts.ts          # Prompt 模板
```

**核心代码结构**：
```typescript
// services/ai/index.ts
export interface AIQuestionGenerator {
  generateQuestions(knowledge: string): Promise<string[]>;
}

// services/ai/prompts.ts
export const FEYNMAN_PROMPT = `
你是一个完全不懂技术的小白。请针对以下知识点，提出3-5个简单的问题：
知识点：{knowledge}

要求：
1. 问题要简单易懂，像小学生会问的问题
2. 不要使用专业术语
3. 问题要有层次（从基础到深入）
`;
```

**开发步骤**：
1. 创建 AI 服务接口定义
2. 实现 OpenAI API 集成
3. 设计 Prompt 模板
4. 实现错误处理和重试
5. 添加加载状态管理
6. 实现 API 密钥配置
7. 添加备选 AI 服务（可选）

**时间估算**：2-3 天

---

### 4. 评估算法模块
**位置**：`src/services/assessment/`
**职责**：评估用户回答的质量

**功能**：
- 专业术语检测
- 清晰度评估
- 逻辑性评估
- 完整性评估
- 生成改进建议

**文件结构**：
```
services/assessment/
├── index.ts            # 导出接口
├── terminology.ts      # 专业术语检测
├── clarity.ts          # 清晰度评估
├── logic.ts            # 逻辑性评估
├── completeness.ts     # 完整性评估
└── suggestions.ts      # 改进建议生成
```

**评估维度**：
1. **专业术语密度**：统计专业术语数量 / 总词数
2. **句子长度**：平均句子长度（过长可能不够清晰）
3. **逻辑连接词**：是否使用"因为"、"所以"等连接词
4. **举例说明**：是否包含具体例子
5. **类比使用**：是否使用类比帮助理解

**开发步骤**：
1. 创建评估接口定义
2. 实现专业术语检测（维护术语库）
3. 实现清晰度评估算法
4. 实现逻辑性评估算法
5. 实现完整性评估算法
6. 整合评估结果
7. 生成改进建议
8. 优化评估算法准确性

**时间估算**：2-3 天

---

### 5. 数据存储模块
**位置**：`src/services/storage/`
**职责**：管理本地数据存储

**功能**：
- 使用 IndexedDB 存储训练记录
- 数据增删改查
- 数据导出/导入
- 数据清理

**文件结构**：
```
services/storage/
├── index.ts            # 导出接口
├── database.ts         # IndexedDB 配置（Dexie.js）
├── knowledgeRepo.ts    # 知识点数据操作
└── historyRepo.ts      # 历史记录数据操作
```

**数据模型**：
```typescript
interface KnowledgeRecord {
  id: string;
  knowledge: string;           // 输入的知识点
  questions: string[];         // AI 生成的问题
  answer: string;              // 用户回答
  assessment: AssessmentResult; // 评估结果
  createdAt: Date;
  updatedAt: Date;
}
```

**开发步骤**：
1. 安装和配置 Dexie.js
2. 定义数据库 Schema
3. 实现知识点存储功能
4. 实现历史记录查询功能
5. 实现数据更新功能
6. 实现数据删除功能
7. 实现数据导出功能（JSON）
8. 添加数据迁移逻辑

**时间估算**：1-2 天

---

### 6. 历史记录模块
**位置**：`src/components/History/`
**职责**：展示和管理历史训练记录

**功能**：
- 历史记录列表展示
- 记录详情查看
- 记录搜索和筛选
- 记录删除
- 记录对比（查看进步）

**组件结构**：
```
History/
├── index.tsx           # 主组件
├── HistoryList.tsx     # 列表组件
├── HistoryItem.tsx     # 单项组件
├── HistoryDetail.tsx   # 详情组件
└── HistoryFilter.tsx   # 筛选组件
```

**开发步骤**：
1. 创建历史记录组件基础结构
2. 实现列表展示功能
3. 实现详情查看功能
4. 实现搜索功能
5. 实现筛选功能（按时间、评估分数）
6. 实现删除功能
7. 实现记录对比功能
8. UI 样式优化

**时间估算**：1-2 天

---

### 7. 状态管理模块
**位置**：`src/stores/`
**职责**：使用 Zustand 管理全局状态

**Store 设计**：
```typescript
// stores/knowledgeStore.ts
interface KnowledgeState {
  currentKnowledge: string;
  questions: string[];
  answer: string;
  assessment: AssessmentResult | null;
  isLoading: boolean;
  setKnowledge: (knowledge: string) => void;
  setQuestions: (questions: string[]) => void;
  setAnswer: (answer: string) => void;
  setAssessment: (assessment: AssessmentResult) => void;
  reset: () => void;
}

// stores/historyStore.ts
interface HistoryState {
  records: KnowledgeRecord[];
  selectedRecord: KnowledgeRecord | null;
  loadRecords: () => Promise<void>;
  selectRecord: (id: string) => void;
  deleteRecord: (id: string) => void;
}
```

**开发步骤**：
1. 安装 Zustand
2. 创建 knowledgeStore
3. 创建 historyStore
4. 在组件中集成 Store
5. 优化状态更新逻辑

**时间估算**：1 天

---

### 8. 主应用集成
**位置**：`src/App.tsx`
**职责**：整合所有模块，实现完整流程

**页面流程**：
1. 知识点输入页面
2. AI 提问展示页面
3. 用户回答输入页面
4. 评估结果展示页面
5. 历史记录页面

**开发步骤**：
1. 设计页面路由结构
2. 实现主页面布局
3. 集成知识点输入模块
4. 集成 AI 提问模块
5. 集成用户回答模块
6. 集成评估结果模块
7. 集成历史记录模块
8. 实现页面间导航
9. 添加加载和错误状态
10. UI/UX 优化

**时间估算**：3-5 天

---

## 📅 开发优先级和时间表

### 阶段一：项目初始化（1-2 天）

**Day 1：环境搭建**
- [ ] 初始化 Vite + React + TypeScript 项目
- [ ] 配置 Tailwind CSS
- [ ] 安装基础依赖（React Router, Zustand）
- [ ] 配置 ESLint 和 Prettier
- [ ] 创建项目目录结构
- [ ] 配置 Git 仓库

**Day 2：基础配置**
- [ ] 安装和配置 shadcn/ui
- [ ] 创建基础 UI 组件（Button, Input, Card）
- [ ] 配置环境变量管理
- [ ] 设置开发环境

---

### 阶段二：核心模块开发（按优先级，8-12 天）

**Week 1：核心功能**

**Day 3-4：UI 基础组件模块**
- [ ] 完成所有基础 UI 组件
- [ ] 组件样式统一
- [ ] 响应式设计

**Day 5-6：知识点输入模块**
- [ ] 完成输入组件
- [ ] 实现验证逻辑
- [ ] 添加输入提示

**Day 7-9：AI 集成模块**
- [ ] 完成 AI 服务接口
- [ ] 实现 OpenAI 集成
- [ ] 设计 Prompt 模板
- [ ] 错误处理

**Day 10-12：评估算法模块**
- [ ] 实现专业术语检测
- [ ] 实现各项评估算法
- [ ] 生成改进建议

**Week 2：数据与历史**

**Day 13-14：数据存储模块**
- [ ] 配置 IndexedDB
- [ ] 实现数据 CRUD
- [ ] 数据导出功能

**Day 15-16：历史记录模块**
- [ ] 完成历史记录组件
- [ ] 实现搜索和筛选
- [ ] 记录详情和对比

**Day 17：状态管理模块**
- [ ] 创建 Zustand Stores
- [ ] 集成到组件中

---

### 阶段三：功能整合与优化（3-5 天）

**Day 18-20：主应用集成**
- [ ] 整合所有模块
- [ ] 实现完整用户流程
- [ ] 页面路由和导航
- [ ] 错误处理和边界情况

**Day 21-22：优化与测试**
- [ ] UI/UX 优化
- [ ] 性能优化
- [ ] 响应式设计完善
- [ ] 浏览器兼容性测试
- [ ] 功能测试

---

### 阶段四：部署与发布（1-2 天）

**Day 23：部署准备**
- [ ] 配置 Vercel 部署
- [ ] 环境变量配置
- [ ] 构建优化
- [ ] 部署测试

**Day 24：文档与发布**
- [ ] 完善 README
- [ ] 编写使用文档
- [ ] 准备发布说明
- [ ] 正式发布

---

## 🔧 技术实现细节

### AI Prompt 设计

**生成问题的 Prompt**：
```
你是一个完全不懂技术的小白。请针对以下知识点，提出3-5个简单的问题：

知识点：{knowledge}

要求：
1. 问题要简单易懂，像小学生会问的问题
2. 不要使用专业术语
3. 问题要有层次（从基础到深入）
4. 问题要能帮助检验理解深度

请直接返回问题列表，每行一个问题，不要添加其他说明。
```

**评估回答的 Prompt**：
```
请评估以下回答的质量：

知识点：{knowledge}
问题：{question}
回答：{answer}

请从以下维度评估（1-10分）：
1. 清晰度：是否用简单语言解释清楚
2. 逻辑性：是否有清晰的逻辑结构
3. 完整性：是否回答了问题的核心
4. 专业术语使用：是否过度使用专业术语

并给出具体的改进建议。
```

### 专业术语检测

**实现方案**：
1. 维护常见专业术语库（按领域分类）
2. 使用正则表达式匹配
3. 统计术语密度
4. 标记术语位置，提供替换建议

**术语库结构**：
```typescript
const TERMINOLOGY_DB = {
  technology: ['API', 'SDK', '框架', '算法', '数据结构'],
  business: ['KPI', 'ROI', '商业模式', '价值链'],
  // ... 更多领域
};
```

### 数据存储 Schema

```typescript
// 使用 Dexie.js
import Dexie from 'dexie';

class LearnLearnDB extends Dexie {
  knowledgeRecords!: Table<KnowledgeRecord>;

  constructor() {
    super('LearnLearnDB');
    this.version(1).stores({
      knowledgeRecords: '++id, knowledge, createdAt, updatedAt'
    });
  }
}

export const db = new LearnLearnDB();
```

### 状态管理示例

```typescript
// stores/knowledgeStore.ts
import { create } from 'zustand';

interface KnowledgeState {
  currentKnowledge: string;
  questions: string[];
  answer: string;
  assessment: AssessmentResult | null;
  isLoading: boolean;
  setKnowledge: (knowledge: string) => void;
  generateQuestions: () => Promise<void>;
  setAnswer: (answer: string) => void;
  assessAnswer: () => Promise<void>;
  reset: () => void;
}

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  currentKnowledge: '',
  questions: [],
  answer: '',
  assessment: null,
  isLoading: false,
  
  setKnowledge: (knowledge) => set({ currentKnowledge: knowledge }),
  
  generateQuestions: async () => {
    set({ isLoading: true });
    try {
      const questions = await aiService.generateQuestions(get().currentKnowledge);
      set({ questions, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  // ... 其他方法
}));
```

---

## 📝 开发注意事项

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用函数式组件 + Hooks
- 使用有意义的变量和函数命名
- 添加必要的注释

### 错误处理
- 所有异步操作都要有错误处理
- 提供用户友好的错误提示
- 记录错误日志（开发环境）
- API 调用失败要有重试机制

### 性能优化
- 使用 React.memo 优化组件渲染
- 合理使用 useMemo 和 useCallback
- 图片和资源懒加载
- 代码分割（Code Splitting）

### 用户体验
- 加载状态要有明确的提示
- 操作要有即时反馈
- 支持键盘快捷键
- 响应式设计，适配移动端

### 安全性
- API 密钥不要提交到代码仓库
- 使用环境变量管理敏感信息
- 用户输入要做验证和清理
- 防止 XSS 攻击

---

## 🧪 测试计划

### 单元测试
- 评估算法函数测试
- 工具函数测试
- 数据存储操作测试

### 集成测试
- AI 服务集成测试
- 组件交互测试
- 完整流程测试

### 端到端测试
- 用户完整使用流程
- 跨浏览器测试
- 移动端测试

---

## 📦 部署清单

### 部署前检查
- [ ] 所有功能测试通过
- [ ] 环境变量配置正确
- [ ] 构建无错误和警告
- [ ] 性能测试通过
- [ ] 浏览器兼容性测试
- [ ] 移动端适配测试
- [ ] 文档完善

### Vercel 部署配置
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_OPENAI_API_KEY": "@openai_api_key"
  }
}
