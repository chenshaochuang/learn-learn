# Vercel 部署脚本
# 使用方法：在 PowerShell 中运行 .\deploy.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  费曼学习法输出训练器 - Vercel 部署" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 检查是否已登录
Write-Host "步骤 1: 检查 Vercel 登录状态..." -ForegroundColor Yellow
$loginCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "未登录，开始登录流程..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请在浏览器中完成登录，然后按任意键继续..." -ForegroundColor Green
    vercel login
    Write-Host ""
    Write-Host "按任意键继续..." -ForegroundColor Green
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} else {
    Write-Host "已登录: $loginCheck" -ForegroundColor Green
    Write-Host ""
}

# 步骤 2: 构建项目
Write-Host "步骤 2: 构建生产版本..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败！请检查错误信息。" -ForegroundColor Red
    exit 1
}
Write-Host "构建成功！" -ForegroundColor Green
Write-Host ""

# 步骤 3: 部署到 Vercel
Write-Host "步骤 3: 部署到 Vercel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "提示：" -ForegroundColor Cyan
Write-Host "  - 首次部署会询问项目设置，直接回车使用默认值即可" -ForegroundColor Cyan
Write-Host "  - 部署完成后会显示访问 URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "按任意键开始部署..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  部署成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "你的应用已经部署到 Vercel，可以分享给他人访问了！" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "部署失败，请检查错误信息。" -ForegroundColor Red
}

