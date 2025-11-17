# 部署指南

本项目可以通过多种方式部署，让其他人访问。以下是推荐的部署方案：

## 🚀 方案一：Vercel 部署（推荐）

Vercel 是最简单快速的部署方式，完全免费，支持自动部署。

### 步骤：

1. **安装 Vercel CLI**（如果还没有）
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   vercel
   ```
   按照提示操作即可，首次部署会询问：
   - 项目名称（直接回车使用默认）
   - 是否覆盖设置（输入 y）
   - 部署目录（直接回车，使用当前目录）

4. **生产环境部署**
   ```bash
   vercel --prod
   ```

5. **访问**
   部署完成后，Vercel 会提供一个 URL，例如：`https://learn-learn.vercel.app`

### 自动部署（可选）

如果项目在 GitHub 上，可以连接 GitHub 仓库，每次 push 代码会自动部署。

---

## 🌐 方案二：Netlify 部署

Netlify 也是免费的静态网站托管平台。

### 步骤：

1. **安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登录 Netlify**
   ```bash
   netlify login
   ```

3. **初始化项目**
   ```bash
   netlify init
   ```

4. **构建并部署**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

---

## 🔧 方案三：使用 ngrok（临时测试）

如果只是想临时分享给他人测试，可以使用 ngrok。

### 步骤：

1. **下载 ngrok**
   - 访问 https://ngrok.com/download
   - 下载并解压到本地

2. **启动本地服务**
   ```bash
   npm run dev
   ```
   确保服务运行在 `http://localhost:5173`

3. **启动 ngrok**
   ```bash
   ngrok http 5173
   ```

4. **分享 URL**
   ngrok 会提供一个公网 URL，例如：`https://xxxx-xxx-xxx.ngrok.io`
   将这个 URL 分享给他人即可访问

**注意**：免费版 ngrok 的 URL 每次启动都会变化，且有时长限制。

---

## 📦 方案四：构建后手动部署

### 步骤：

1. **构建生产版本**
   ```bash
   npm run build
   ```
   构建完成后，会在 `dist` 目录生成静态文件。

2. **部署到静态服务器**
   - 将 `dist` 目录下的所有文件上传到任何静态网站托管服务
   - 例如：GitHub Pages、GitLab Pages、或自己的服务器

---

## 🔐 环境变量配置

如果需要在生产环境使用不同的 API 配置，可以：

1. **在 Vercel 中配置环境变量**
   - 登录 Vercel 控制台
   - 进入项目设置 → Environment Variables
   - 添加需要的环境变量

2. **创建 `.env.production` 文件**（可选）
   ```
   VITE_API_KEY=your-production-api-key
   ```

---

## 📝 部署前检查清单

- [ ] 运行 `npm run build` 确保构建成功
- [ ] 检查 `dist` 目录是否生成
- [ ] 运行 `npm run preview` 本地预览生产版本
- [ ] 确认所有功能正常工作
- [ ] 检查控制台是否有错误

---

## 🎯 推荐方案

**对于快速分享**：使用 Vercel（方案一）
- 最简单
- 完全免费
- 自动 HTTPS
- 全球 CDN 加速

**对于临时测试**：使用 ngrok（方案三）
- 最快
- 无需构建
- 适合快速演示

---

## 📚 更多信息

- Vercel 文档：https://vercel.com/docs
- Netlify 文档：https://docs.netlify.com
- ngrok 文档：https://ngrok.com/docs

