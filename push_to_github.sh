#!/bin/bash

# 妄想山海热点追踪 - 推送到GitHub

echo "=========================================="
echo "  妄想山海热点追踪 - GitHub部署脚本"
echo "=========================================="
echo ""

# 1. 进入正确的目录
cd /Users/jasinzhai/WorkBuddy/20260320143650
echo "✓ 已进入项目目录"
echo ""

# 2. 添加所有文件
echo "正在添加文件到Git..."
git add index.html hot_data.json 妄想山海2026年最新热点汇总报告.md 妄想山海各平台热点汇总报告.md README.md .gitignore GITHUB_DEPLOY_STEPS.md
echo "✓ 文件已添加"
echo ""

# 3. 提交代码
echo "正在提交代码..."
git commit -m "Update: 添加部署指南和完整项目文件"
echo "✓ 代码已提交"
echo ""

# 4. 添加远程仓库（如果还没有添加）
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "请输入你的GitHub仓库地址："
    echo "格式: https://github.com/你的用户名/wangxiangshanhai-hot-tracker.git"
    read -p "> " REPO_URL
    git remote add origin "$REPO_URL"
    echo "✓ 远程仓库已添加"
    echo ""
fi

# 5. 推送代码
echo "正在推送代码到GitHub..."
echo ""
git push -u origin main

echo ""
echo "=========================================="
echo "  推送完成！"
echo "=========================================="
echo ""
echo "接下来请："
echo "1. 访问你的GitHub仓库"
echo "2. 进入 Settings → Pages"
echo "3. 配置 Source: Deploy from a branch"
echo "4. 配置 Branch: main, Folder: / (root)"
echo "5. 点击 Save"
echo ""
echo "等待1-2分钟后，访问你的网站！"
echo ""
