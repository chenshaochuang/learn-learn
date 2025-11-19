# 快速开始

## 安装依赖

```bash
npm install
```

## 环境配置

1. 复制环境变量示例文件：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入你的 API 密钥：
   - 百度千帆 API Key 和 Secret Key
   - 获取方式：https://console.bce.baidu.com/qianfan/

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
│   ├── KnowledgeInput/  # 知识点输入模块
│   ├── AdvancedStats.tsx  # 高级统计分析
│   ├── AssessmentChart.tsx  # 评估图表
│   └── ...
├── pages/            # 页面组件
│   ├── HomePage.tsx      # 首页
│   ├── QuestionsPage.tsx # 问题展示页
│   ├── AnswerPage.tsx    # 回答输入页
│   ├── AssessmentPage.tsx # 评估结果页
│   └── HistoryPage.tsx   # 历史记录页
├── services/         # 业务逻辑服务
│   ├── ai/          # AI 服务（百度千帆）
│   └── storage/     # 数据存储服务（IndexedDB）
├── stores/          # Zustand 状态管理
├── types/           # TypeScript 类型定义
└── utils/           # 工具函数
```

## 功能说明

### ✅ 已实现的功能

1. **核心功能**
   - ✅ 知识点输入（支持语音输入）
   - ✅ AI 问题生成（百度千帆 API）
   - ✅ 用户回答输入
   - ✅ 多维度评估（清晰度、逻辑性、完整性、通俗性）
   - ✅ 改进建议生成

2. **数据管理**
   - ✅ 历史记录查看（卡片/列表视图）
   - ✅ 本地数据存储（IndexedDB）
   - ✅ 标签分类和管理
   - ✅ 搜索和筛选功能
   - ✅ 记录对比功能

3. **数据导出**
   - ✅ 导出为 JSON
   - ✅ 导出为 Markdown
   - ✅ 导出学习报告

4. **统计分析**
   - ✅ 学习进度趋势图
   - ✅ 评分分布统计
   - ✅ 知识图谱可视化
   - ✅ 高级统计分析（趋势、维度、建议）

5. **用户体验**
   - ✅ 响应式设计（移动端适配）
   - ✅ PWA 支持（离线访问、添加到主屏幕）
   - ✅ 语音输入支持
   - ✅ 分享功能
   - ✅ 无障碍优化

## 使用流程

1. **输入知识点** - 在首页输入想要检验理解的知识点
2. **查看问题** - AI 会生成"小白问题"引导你思考
3. **回答问题** - 用简单易懂的语言回答所有问题
4. **查看评估** - 获得多维度评估和改进建议
5. **保存记录** - 保存到历史记录，方便回顾和对比

## 注意事项

- 需要配置百度千帆 API 密钥才能使用 AI 功能
- 数据存储在浏览器本地 IndexedDB 中，清除浏览器数据会丢失
- 支持 PWA，可以添加到手机主屏幕使用
- 完全响应式设计，支持各种设备

