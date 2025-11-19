# PWA 设置说明

## ✅ 已完成的 PWA 功能

1. ✅ **Web App Manifest** (`public/manifest.json`)
   - 应用名称、图标、主题色配置
   - 支持添加到主屏幕

2. ✅ **Service Worker** (`public/sw.js`)
   - 离线缓存支持
   - 资源缓存策略
   - 自动更新机制

3. ✅ **Service Worker 注册** (`src/main.tsx`)
   - 自动注册 Service Worker
   - 更新检测和提示

4. ✅ **HTML Meta 标签** (`index.html`)
   - PWA 相关 meta 标签
   - Apple 设备支持

## 📱 生成应用图标

### 方法 1：使用 HTML 工具（最简单）

1. 在浏览器中打开 `public/create-icons.html`
2. 点击"下载"按钮保存图标
3. 将下载的图标放到 `public/` 目录下

### 方法 2：使用 Node.js 脚本

1. 安装依赖：
   ```bash
   npm install sharp --save-dev
   ```

2. 运行脚本：
   ```bash
   npm run generate-icons
   ```

3. 图标将自动生成到 `public/` 目录

### 方法 3：使用在线工具

1. 访问 https://realfavicongenerator.net/
2. 上传 `public/icon.svg`
3. 下载生成的图标
4. 放到 `public/` 目录下

## 🚀 测试 PWA 功能

### 本地测试

1. 构建项目：
   ```bash
   npm run build
   ```

2. 预览构建结果：
   ```bash
   npm run preview
   ```

3. 在浏览器中打开 `http://localhost:4173`

4. 打开开发者工具（F12）：
   - **Application** 标签 → **Service Workers**：检查是否注册成功
   - **Application** 标签 → **Manifest**：检查 manifest 是否正确加载
   - **Application** 标签 → **Cache Storage**：检查缓存是否工作

### 移动端测试

1. 部署到生产环境（Vercel/Netlify）
2. 在手机浏览器中访问
3. 查看是否出现"添加到主屏幕"提示
4. 测试离线功能：
   - 添加到主屏幕
   - 断开网络
   - 打开应用，应该仍能访问

## 📋 PWA 功能清单

- [x] Web App Manifest
- [x] Service Worker
- [x] 离线缓存
- [x] 添加到主屏幕支持
- [x] 应用图标
- [x] 主题色配置
- [x] 自动更新机制

## 🔧 故障排除

### Service Worker 未注册

1. 检查是否使用 HTTPS（本地开发可以使用 localhost）
2. 检查浏览器控制台是否有错误
3. 检查 `public/sw.js` 文件是否存在

### 图标不显示

1. 确保 `icon-192x192.png` 和 `icon-512x512.png` 存在
2. 检查 `manifest.json` 中的图标路径是否正确
3. 清除浏览器缓存后重试

### 无法添加到主屏幕

1. 确保满足 PWA 安装条件：
   - HTTPS（或 localhost）
   - 有效的 manifest.json
   - 注册的 Service Worker
   - 至少一个图标

2. 检查浏览器是否支持 PWA（Chrome、Edge、Safari 等）

## 📚 参考资源

- [MDN: Progressive Web Apps](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)
- [Web.dev: PWA](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)

