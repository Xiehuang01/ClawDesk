#!/bin/bash

# 快速打包脚本

echo "🚀 ClawDesk 打包工具"
echo "================================"
echo ""

# 检查图标文件
echo "📋 检查图标文件..."
if [ ! -f "build/icon.icns" ] && [ "$(uname)" == "Darwin" ]; then
    echo "⚠️  警告: 缺少 macOS 图标文件 (build/icon.icns)"
    echo "   请准备一个 512x512 的 PNG 图标，然后运行:"
    echo "   iconutil -c icns icon.iconset -o build/icon.icns"
fi

if [ ! -f "build/icon.ico" ]; then
    echo "⚠️  警告: 缺少 Windows 图标文件 (build/icon.ico)"
fi

if [ ! -f "build/icon.png" ]; then
    echo "⚠️  警告: 缺少 Linux 图标文件 (build/icon.png)"
fi

echo ""
echo "📦 开始构建..."
echo ""

# 清理旧的构建文件
echo "🧹 清理旧文件..."
rm -rf dist dist-electron release

# 安装依赖
echo "📥 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    pnpm install
fi

# 构建
echo "🔨 构建应用..."
pnpm build

# 检查构建结果
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 构建成功！"
    echo ""
    echo "📦 安装包位置: release/"
    ls -lh release/
    echo ""
    echo "🎉 完成！"
else
    echo ""
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
