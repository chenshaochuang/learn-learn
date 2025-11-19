# 生成 PWA 图标说明

## 方法 1：使用在线工具（推荐）

1. 访问 https://realfavicongenerator.net/ 或 https://www.pwabuilder.com/imageGenerator
2. 上传 `icon.svg` 文件
3. 生成并下载所有尺寸的图标
4. 将生成的图标放到 `public/` 目录下：
   - `icon-192x192.png`
   - `icon-512x512.png`

## 方法 2：使用 ImageMagick（命令行）

```bash
# 安装 ImageMagick 后
convert icon.svg -resize 192x192 icon-192x192.png
convert icon.svg -resize 512x512 icon-512x512.png
```

## 方法 3：使用 Node.js 脚本

```bash
npm install sharp --save-dev
```

然后运行：
```javascript
const sharp = require('sharp');
sharp('public/icon.svg')
  .resize(192, 192)
  .toFile('public/icon-192x192.png');
sharp('public/icon.svg')
  .resize(512, 512)
  .toFile('public/icon-512x512.png');
```

## 临时方案

如果暂时没有图标，可以：
1. 使用任何 192x192 和 512x512 的 PNG 图片
2. 或者暂时注释掉 manifest.json 中的 icons 配置
3. 应用仍然可以工作，只是无法添加到主屏幕

