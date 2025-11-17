# 快速部署指南

## 🚀 最快方式：Vercel 一键部署

### 方法 1：使用部署脚本（最简单）

**Windows (PowerShell):**
```powershell
.\deploy.ps1
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### 方法 2：手动执行命令

```bash
# 1. 安装 Vercel CLI（如果还没安装）
npm install -g vercel

# 2. 登录 Vercel（首次需要）
vercel login

# 3. 构建项目
npm run build

# 4. 部署到生产环境
vercel --prod
```

### 方法 3：通过 Vercel 网站（最简单，推荐新手）

1. 访问 https://vercel.com
2. 使用 GitHub/GitLab/Bitbucket 账号登录
3. 点击 "New Project"
4. 导入你的 Git 仓库（如果没有，可以先 push 到 GitHub）
5. Vercel 会自动检测 Vite 项目并配置
6. 点击 "Deploy" 即可

---

## ⚡ 临时分享：使用 ngrok

如果想快速分享给他人测试（无需部署）：

```bash
# 1. 确保本地服务正在运行
npm run dev

# 2. 下载 ngrok：https://ngrok.com/download
# 3. 运行 ngrok（在另一个终端）
ngrok http 5173

# 4. 复制 ngrok 提供的 URL 分享给他人
```

---

## 📦 构建生产版本

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

构建后的文件在 `dist` 目录，可以部署到任何静态网站托管服务。

