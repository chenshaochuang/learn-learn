# PWA 快速开始

## 🎉 PWA 功能已实现！

你的应用现在支持：
- ✅ 离线访问
- ✅ 添加到主屏幕
- ✅ 类似原生应用的体验

## 📱 生成图标（必需）

在部署前，你需要生成应用图标。有两种方法：

### 方法 1：使用 HTML 工具（推荐，最简单）

1. 在浏览器中打开：`public/create-icons.html`
2. 点击两个"下载"按钮
3. 将下载的文件放到 `public/` 目录下：
   - `icon-192x192.png`
   - `icon-512x512.png`

### 方法 2：使用在线工具

1. 访问：https://realfavicongenerator.net/
2. 上传 `public/icon.svg`
3. 下载生成的图标
4. 放到 `public/` 目录下

## 🚀 测试步骤

1. **构建项目**：
   ```bash
   npm run build
   ```

2. **本地预览**：
   ```bash
   npm run preview
   ```

3. **检查 PWA**：
   - 打开浏览器开发者工具（F12）
   - 进入 **Application** 标签
   - 查看 **Service Workers** 是否注册成功
   - 查看 **Manifest** 是否正确加载

4. **测试添加到主屏幕**：
   - 在 Chrome/Edge：地址栏右侧会出现安装图标
   - 在手机浏览器：会显示"添加到主屏幕"提示

## 📝 注意事项

- PWA 需要 HTTPS（生产环境）
- 本地开发可以使用 `localhost`
- 确保图标文件存在，否则无法添加到主屏幕

## 🔗 更多信息

查看 [PWA_SETUP.md](./PWA_SETUP.md) 了解详细配置和故障排除。

