# 📍 查看 Vercel 部署地址

## 🎯 方法一：在 Vercel 项目页面查看（推荐）

1. **访问 Vercel Dashboard**：https://vercel.com/dashboard
2. **找到你的项目** `learn-learn`（或你创建的项目名）
3. **点击项目名称**进入项目详情页
4. **在页面顶部**可以看到：
   - **Production URL**（生产环境）：`https://learn-learn.vercel.app`
   - **Preview URLs**（预览环境）：每次部署都会生成新的预览链接

## 🎯 方法二：在部署详情页查看

1. 在项目页面，点击 **"Deployments"** 标签
2. 找到最新的部署记录（通常在最上面）
3. 点击部署记录，可以看到：
   - **Visit** 按钮 - 点击直接访问
   - **URL** 显示在页面顶部

## 🎯 方法三：通过命令行查看

如果你已经配置了 Vercel CLI，可以运行：

```powershell
vercel ls
```

这会列出所有项目的部署地址。

## 📝 部署地址格式

Vercel 的部署地址通常是：
- **生产环境**：`https://你的项目名.vercel.app`
- **预览环境**：`https://你的项目名-随机字符.vercel.app`

## ✨ 分享给他人

直接将 **Production URL**（生产环境地址）分享给他人即可！

例如：
```
https://learn-learn.vercel.app
```

任何人都可以通过这个链接访问你的应用。

## 🔗 自定义域名（可选）

如果你想使用自己的域名：
1. 在项目设置 → **Domains**
2. 添加你的域名
3. 按照提示配置 DNS 记录

