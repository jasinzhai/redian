# GitHub Pages 部署步骤指南

## ✅ 已完成的工作

1. ✅ Git仓库已初始化
2. ✅ 文件已添加到Git
3. ✅ 代码已提交到本地仓库

## 📝 接下来需要手动完成的步骤

### 第一步：创建GitHub仓库

1. **访问GitHub**
   - 打开浏览器，访问：https://github.com/new

2. **创建新仓库**
   - Repository name（仓库名）: 输入 `wangxiangshanhai-hot-tracker`
   - Description（描述）: 妄想山海热点追踪网页
   - 设置仓库为 **Public**（公开）- *注意：只有公开仓库才能使用GitHub Pages免费服务*
   - **不要**勾选 "Add a README file"（我们已经有了）
   - **不要**勾选其他选项
   - 点击 **"Create repository"** 绿色按钮

3. **获取仓库地址**
   - 创建完成后，GitHub会显示你的仓库地址
   - 地址格式：`https://github.com/你的用户名/wangxiangshanhai-hot-tracker.git`

### 第二步：推送代码到GitHub

在终端中执行以下命令：

```bash
# 添加远程仓库地址（替换下面的用户名）
git remote add origin https://github.com/jasinzhai/wangxiangshanhai-hot-tracker.git

# 推送代码到GitHub
git push -u origin main
```

**注意**：如果你的GitHub用户名不是 `jasinzhai`，请将上面的 `jasinzhai` 替换为你的实际用户名。

### 第三步：配置GitHub Pages

1. **进入仓库设置**
   - 在GitHub仓库页面，点击右上角的 **"Settings"** 标签
   - 在左侧菜单中找到并点击 **"Pages"**

2. **配置部署设置**
   - **Source**: 选择 "Deploy from a branch"
   - **Branch**: 选择 "main" 分支
   - **Folder**: 选择 "/ (root)"
   - 点击 **"Save"** 按钮

3. **等待部署完成**
   - 等待1-2分钟
   - 页面会显示 "Your site is live at: https://jasinzhai.github.io/wangxiangshanhai-hot-tracker"
   - 这就是你的网站地址！

4. **访问你的网站**
   - 点击页面上的链接，或者直接在浏览器中访问
   - 你应该能看到妄想山海热点追踪网页了

## 🔧 常见问题解决

### 问题1：推送时提示需要认证

**错误信息**：
```
Support for password authentication was removed on August 13, 2021.
```

**解决方案**：
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置名称为 "GitHub Pages"
4. 勾选 "repo" 权限
5. 点击 "Generate token"
6. 复制生成的token（注意：token只显示一次）
7. 使用以下命令推送：
```bash
git remote set-url origin https://你的用户名:你的token@github.com/你的用户名/wangxiangshanhai-hot-tracker.git
git push -u origin main
```

### 问题2：页面显示404

**可能原因**：
- 仓库设置为私有（Private）- 必须设置为公开（Public）
- 还在部署中，需要等待1-2分钟
- 配置的分支或文件夹不对

**解决方案**：
1. 确认仓库是公开的（Settings → General → Danger Zone → Change visibility）
2. 等待2分钟后刷新页面
3. 检查Pages配置是否正确

### 问题3：数据无法加载

**检查项**：
- hot_data.json 文件是否在仓库中
- 检查浏览器控制台是否有错误
- 确认JSON格式正确

## 🔄 如何更新数据

### 方式1：手动更新（最简单）

当你想更新热点数据时：

1. 修改 `hot_data.json` 文件
2. 执行以下命令提交：
```bash
git add hot_data.json
git commit -m "Update hot data"
git push
```

GitHub Pages会在1-2分钟内自动部署更新。

### 方式2：使用GitHub Actions自动更新

如果想要自动更新，可以创建 `.github/workflows/update.yml` 文件：

```yaml
name: Update Hot Data

on:
  schedule:
    - cron: '0 0 * * *'  # 每天0点（UTC时间）执行
  workflow_dispatch:  # 允许手动触发

jobs:
  update:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Create empty commit
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          # 这里需要你编写数据收集脚本
          # git add hot_data.json
          # git commit -m "Auto update hot data [skip ci]"
          # git push
```

注意：你需要自己编写数据收集逻辑（使用API或爬虫）。

## 📊 验证部署成功

1. 访问你的GitHub Pages网址
2. 应该能看到完整的网页界面
3. 检查数据是否正常加载
4. 测试响应式设计（缩小浏览器窗口）

## 🎉 部署成功后

恭喜！你的妄想山海热点追踪网页已经成功部署到GitHub Pages了！

**你的网站地址**：`https://jasinzhai.github.io/wangxiangshanhai-hot-tracker`

**接下来可以做的事**：
1. 分享你的网站地址给朋友
2. 定期更新热点数据
3. 配置自动更新（如果需要）
4. 自定义域名（可选）

---

## 📞 需要帮助？

如果遇到问题：
1. 查看GitHub Pages官方文档：https://docs.github.com/en/pages
2. 检查Actions日志（如果使用自动更新）
3. 查看浏览器控制台错误信息

---

**准备好创建GitHub仓库了吗？请按照上面的步骤操作即可！** 🚀
