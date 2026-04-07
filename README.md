# 妄想山海热点追踪 - 部署指南

## 📋 项目概述

这是一个《妄想山海》游戏热点追踪网页，自动收集和展示各平台（抖音、快手、B站、贴吧）的最新热点内容和讨论。

### ✨ 功能特点

- 🔄 **自动更新**: 每天早上8点自动收集最新热点
- 📊 **数据可视化**: 饼图展示各平台热点分布
- 📱 **响应式设计**: 支持电脑、平板、手机浏览
- ⚡ **实时刷新**: 每5分钟自动刷新数据
- 🎨 **精美界面**: 渐变背景、卡片式布局

---

## 🚀 快速部署

### 方案一：Vercel部署（推荐）

#### 1. 准备工作

确保你已经注册了以下账号：
- [GitHub](https://github.com/) 代码托管
- [Vercel](https://vercel.com/) 免费网站托管

#### 2. 部署步骤

**步骤1**: 创建GitHub仓库
```bash
# 在项目目录初始化git仓库
git init
git add .
git commit -m "Initial commit"

# 创建GitHub仓库后，推送代码
git remote add origin https://github.com/你的用户名/redian.git
git push -u origin main
```

**步骤2**: 部署到Vercel

1. 访问 [vercel.com](https://vercel.com/)
2. 点击 "New Project"
3. 选择你刚创建的GitHub仓库
4. 点击 "Deploy"
5. 等待部署完成（通常1-2分钟）
6. Vercel会给你一个域名，如 `https://redian.vercel.app`

**优点**:
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 每次push代码自动部署

**注意事项**:
- 数据文件需要手动更新或配置自动化脚本

---

### 方案二：GitHub Pages部署（免费）

#### 部署步骤

**步骤1**: 创建GitHub仓库并上传代码
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/redian.git
git push -u origin main
```

**步骤2**: 启用GitHub Pages

1. 进入仓库的 "Settings" 页面
2. 左侧菜单选择 "Pages"
3. "Source" 选择 "Deploy from a branch"
4. "Branch" 选择 "main"，文件夹选择 "/ (root)"
5. 点击 "Save"
6. 等待1-2分钟，页面会显示你的网站地址
   - 格式：`https://你的用户名.github.io/redian`

**优点**:
- ✅ 完全免费
- ✅ GitHub原生支持
- ✅ 自动HTTPS

**注意事项**:
- 更新数据需要手动push

---

### 方案三：Netlify部署（免费）

#### 部署步骤

1. 访问 [netlify.com](https://www.netlify.com/)
2. 注册账号
3. 点击 "Add new site" → "Deploy manually"
4. 将整个项目文件夹拖拽上传
5. 等待部署完成
6. Netlify会给你一个域名，如 `https://你的项目名.netlify.app`

或者通过Git部署：
1. 连接你的GitHub仓库
2. 选择需要部署的分支（main）
3. 点击 "Deploy site"

**优点**:
- ✅ 完全免费
- ✅ 支持自定义域名
- ✅ 拖拽上传，操作简单

---

### 方案四：Cloudflare Pages（免费）

#### 部署步骤

1. 访问 [pages.cloudflare.com](https://pages.cloudflare.com/)
2. 连接你的GitHub仓库
3. 选择项目仓库
4. 配置构建设置（静态网站无需配置）
5. 点击 "Create Project"
6. 等待部署完成

**优点**:
- ✅ 免费额度很大
- ✅ 全球CDN
- ✅ 每日10万次请求免费

---

### 方案五：自己的服务器（需要服务器）

#### 使用Nginx部署

如果你有自己的服务器（阿里云、腾讯云等），可以这样部署：

**步骤1**: 上传文件到服务器
```bash
# 使用scp上传（本地执行）
scp -r index.html hot_data.json 用户名@服务器IP:/var/www/wangxiangshanhai/

# 或者使用Git
git clone https://github.com/你的用户名/redian.git
cd redian
```

**步骤2**: 配置Nginx

```nginx
server {
    listen 80;
    server_name 你的域名.com;

    root /var/www/wangxiangshanhai;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # 启用缓存
    location ~* \.(json)$ {
        add_header Cache-Control "no-store";
    }
}
```

**步骤3**: 重启Nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
```

**优点**:
- ✅ 完全控制
- ✅ 可以配置自动化更新脚本

**缺点**:
- ❌ 需要服务器费用
- ❌ 需要技术维护

---

## 🔄 数据自动更新方案

由于前端静态页面无法自动收集数据，以下是几种解决方案：

### 方案A：GitHub Actions自动更新（推荐）

在GitHub仓库中创建 `.github/workflows/update.yml`:

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
      
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      
      - name: Install dependencies
        run: |
          pip install requests beautifulsoup4
      
      - name: Update hot_data.json
        run: |
          python scripts/update_data.py
      
      - name: Commit and push
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git add hot_data.json 妄想山海2026年最新热点汇总报告.md
          git diff --quiet && git diff --staged --quiet || git commit -m "Auto update hot data [skip ci]"
          git push
```

创建 `scripts/update_data.py` 脚本来收集数据（需要自己实现数据收集逻辑）。

---

### 方案B：手动更新

每天手动运行数据收集脚本，然后push到仓库。

```bash
# 在本地运行数据收集脚本
python collect_data.py

# 更新到仓库
git add hot_data.json 妄想山海2026年最新热点汇总报告.md
git commit -m "Update hot data"
git push
```

---

### 方案C：使用云函数

使用阿里云函数计算、腾讯云SCF等无服务器平台：

1. 创建定时触发器
2. 编写数据收集函数
3. 自动更新到GitHub仓库或CDN

---

## 📁 项目文件说明

```
redian/
├── index.html                      # 主网页文件
├── hot_data.json                   # 热点数据文件（JSON格式）
├── 妄想山海2026年最新热点汇总报告.md   # 详细报告
├── README.md                       # 本文件
└── .github/
    └── workflows/
        └── update.yml              # GitHub Actions自动更新配置（可选）
```

---

## 🎨 自定义配置

### 修改自动刷新时间

在 `index.html` 中找到：
```javascript
// 每5分钟自动刷新
setInterval(renderPage, 5 * 60 * 1000);
```

修改 `5 * 60 * 1000` 为你想要的间隔时间（毫秒）。

### 修改数据更新频率

修改自动化任务的 `rrule` 参数：
```toml
# 每天早上8点
rrule = "FREQ=DAILY;BYHOUR=8"

# 每6小时
rrule = "FREQ=HOURLY;INTERVAL=6"

# 每周
rrule = "FREQ=WEEKLY;BYDAY=MO"
```

---

## 🔧 故障排查

### 数据无法加载

**问题**: 网页显示"暂无数据，请等待数据更新"

**解决方案**:
1. 检查 `hot_data.json` 文件是否存在
2. 检查JSON格式是否正确（可以使用 [JSONLint](https://jsonlint.com/) 验证）
3. 查看浏览器控制台是否有错误信息

### 自动更新不工作

**问题**: 数据没有自动更新

**解决方案**:
1. 检查GitHub Actions是否正常运行
2. 查看Actions日志是否有错误
3. 确认API请求是否有访问限制

### 网页打不开

**问题**: 部署后网页无法访问

**解决方案**:
1. 检查部署平台是否正常
2. 确认域名是否正确
3. 检查DNS解析是否生效

---

## 📞 技术支持

如果遇到问题：
1. 查看部署平台的状态页面
2. 检查浏览器控制台错误信息
3. 查看自动化任务的运行日志
4. 确认所有文件路径正确

---

## 📄 许可证

本项目仅供学习和个人使用。

---

**部署成功后，你的妄想山海热点追踪网页就可以全天候自动更新了！** 🎉
