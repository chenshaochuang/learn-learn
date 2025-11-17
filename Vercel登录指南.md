# Vercel 登录指南（使用 GitHub PAT）

## 问题
Vercel 要求使用 GitHub Personal Access Token (PAT) 进行认证。

## 解决步骤

### 步骤 1：创建 GitHub Personal Access Token

1. **访问 GitHub 设置页面**：
   - 打开：https://github.com/settings/tokens
   - 或者：GitHub 头像 → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **点击 "Generate new token" → "Generate new token (classic)"**

3. **填写 Token 信息**：
   - **Note（备注）**：`Vercel CLI`（或任意名称）
   - **Expiration（过期时间）**：选择 `90 days` 或 `No expiration`
   - **Select scopes（权限）**：至少勾选以下权限：
     - ✅ `repo`（完整仓库访问权限）
     - ✅ `read:org`（读取组织信息，如果需要）

4. **点击 "Generate token"**

5. **复制生成的 Token**（只显示一次，务必保存！）
   - 格式类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 步骤 2：使用 PAT 登录 Vercel

在终端中运行：

```powershell
vercel login
```

当提示输入时，选择：
- 输入 `GitHub` 或按提示选择
- 粘贴刚才复制的 Personal Access Token
- 按回车确认

### 步骤 3：验证登录

```powershell
vercel whoami
```

如果显示你的用户名，说明登录成功！

### 步骤 4：继续部署

登录成功后，运行：

```powershell
vercel --prod --yes
```

---

## 替代方案：通过 Vercel 网站部署

如果 PAT 方式有问题，可以直接通过网站部署：

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录（网站登录不需要 PAT）
3. 点击 "Add New Project"
4. 导入你的 Git 仓库
5. 点击 "Deploy"

---

## 注意事项

- **PAT 安全**：不要将 PAT 分享给他人或提交到代码仓库
- **PAT 过期**：如果 Token 过期，需要重新生成
- **权限最小化**：只授予必要的权限（`repo` 即可）

