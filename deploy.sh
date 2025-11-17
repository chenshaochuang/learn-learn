#!/bin/bash
# Vercel 部署脚本（Linux/Mac）
# 使用方法：chmod +x deploy.sh && ./deploy.sh

echo "========================================"
echo "  费曼学习法输出训练器 - Vercel 部署"
echo "========================================"
echo ""

# 步骤 1: 检查是否已登录
echo "步骤 1: 检查 Vercel 登录状态..."
if ! vercel whoami > /dev/null 2>&1; then
    echo "未登录，开始登录流程..."
    echo ""
    echo "请在浏览器中完成登录..."
    vercel login
    echo ""
    read -p "登录完成后，按回车继续..."
else
    echo "已登录: $(vercel whoami)"
    echo ""
fi

# 步骤 2: 构建项目
echo "步骤 2: 构建生产版本..."
npm run build
if [ $? -ne 0 ]; then
    echo "构建失败！请检查错误信息。"
    exit 1
fi
echo "构建成功！"
echo ""

# 步骤 3: 部署到 Vercel
echo "步骤 3: 部署到 Vercel..."
echo ""
echo "提示："
echo "  - 首次部署会询问项目设置，直接回车使用默认值即可"
echo "  - 部署完成后会显示访问 URL"
echo ""
read -p "按回车开始部署..."

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  部署成功！"
    echo "========================================"
    echo ""
    echo "你的应用已经部署到 Vercel，可以分享给他人访问了！"
else
    echo ""
    echo "部署失败，请检查错误信息。"
fi

