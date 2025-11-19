// 生成 PWA 图标的脚本
// 需要先安装: npm install sharp --save-dev

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputSvg = path.join(__dirname, '../public/icon.svg');
const outputDir = path.join(__dirname, '../public');

// 检查输入文件是否存在
if (!fs.existsSync(inputSvg)) {
  console.error('错误: 找不到 icon.svg 文件');
  console.log('请确保 public/icon.svg 文件存在');
  process.exit(1);
}

// 生成每个尺寸的图标
async function generateIcons() {
  console.log('开始生成图标...');
  
  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`✓ 已生成: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ 生成 icon-${size}x${size}.png 失败:`, error.message);
    }
  }
  
  console.log('图标生成完成！');
}

generateIcons().catch(console.error);

