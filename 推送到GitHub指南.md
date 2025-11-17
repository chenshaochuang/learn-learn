# 将本地代码推送到 GitHub

## 📋 步骤概览

1. 在 GitHub 上创建新仓库
2. 添加所有文件到 Git
3. 提交更改
4. 添加远程仓库
5. 推送到 GitHub

---

## 🚀 详细步骤

### 步骤 1：在 GitHub 上创建新仓库

1. **访问 GitHub**：https://github.com
2. **登录你的账号**
3. **点击右上角 "+" → "New repository"**
4. **填写仓库信息**：
   - **Repository name**：`learn-learn`（或你喜欢的名字）
   - **Description**：`费曼学习法输出训练器`
   - **Visibility**：选择 `Public`（公开）或 `Private`（私有）
   - **不要**勾选 "Initialize this repository with a README"（因为本地已有代码）
5. **点击 "Create repository"**

### 步骤 2：复制仓库 URL

创建完成后，GitHub 会显示仓库 URL，类似：
```
https://github.com/你的用户名/learn-learn.git
```
或者 SSH 格式：
```
git@github.com:你的用户名/learn-learn.git
```

**复制这个 URL**，稍后会用到。

### 步骤 3：在本地执行 Git 命令

在项目目录下运行以下命令：

```powershell
# 1. 添加所有文件（包括新创建的文档）
git add .

# 2. 提交更改
git commit -m "Initial commit: 费曼学习法输出训练器"

# 3. 添加远程仓库（替换为你的实际 URL）
git remote add origin https://github.com/你的用户名/learn-learn.git

# 4. 推送到 GitHub
git push -u origin main
```

**注意**：如果使用 SSH URL，将 `https://` 替换为 `git@github.com:` 格式。

---

## 🔐 如果遇到认证问题

### 方式 1：使用 Personal Access Token（推荐）

1. **创建 PAT**：https://github.com/settings/tokens
   - 勾选 `repo` 权限
   - 生成并复制 Token

2. **推送时使用 Token**：
   ```powershell
   # 当提示输入密码时，输入 Token（不是 GitHub 密码）
   git push -u origin main
   ```

### 方式 2：使用 GitHub CLI

```powershell
# 安装 GitHub CLI
winget install GitHub.cli

# 登录
gh auth login

# 然后正常推送
git push -u origin main
```

### 方式 3：配置 SSH 密钥

1. **生成 SSH 密钥**：
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **添加到 GitHub**：
   - 复制 `~/.ssh/id_ed25519.pub` 内容
   - GitHub → Settings → SSH and GPG keys → New SSH key

3. **使用 SSH URL**：
   ```powershell
   git remote set-url origin git@github.com:你的用户名/learn-learn.git
   ```

---

## ✅ 验证推送成功

推送完成后：

1. **刷新 GitHub 仓库页面**，应该能看到所有文件
2. **检查远程仓库**：
   ```powershell
   git remote -v
   ```

---

## 📝 后续更新

以后每次修改代码后：

```powershell
git add .
git commit -m "描述你的更改"
git push
```

---

## 🎯 推送完成后

推送成功后，你就可以：
1. ✅ 在 Vercel 网站导入 GitHub 仓库进行部署
2. ✅ 或者继续使用命令行部署

---

## 💡 提示

- **首次推送**：使用 `git push -u origin main`（`-u` 设置上游分支）
- **后续推送**：直接使用 `git push` 即可
- **查看状态**：使用 `git status` 查看当前状态

