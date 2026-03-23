# 自动化脚本快速操作指南

## 一键运行

```bash
cd /Users/jasinzhai/WorkBuddy/20260320143650
node collect_hot_data.js
```

运行后自动生成：
- ✅ hot_data_2026-03-20.json（带日期）
- ✅ hot_data.json（默认数据）

## 设置每天自动运行（macOS）

```bash
# 编辑定时任务
crontab -e

# 添加以下行（每天晚上8点运行）
0 20 * * * cd /Users/jasinzhai/WorkBuddy/20260320143650 && node collect_hot_data.js >> collect.log 2>&1
```

## 手动运行命令

```bash
# 方式1：直接运行
node collect_hot_data.js

# 方式2：使用npm
npm run collect
```

## 验证数据

```bash
# 查看最新生成的文件
ls -lt hot_data_*.json | head -n 2

# 查看数据条数
cat hot_data_2026-03-20.json | grep -c "title"
```

## 更新到网站

数据生成后，需要手动推送到GitHub：

```bash
git add hot_data_*.json
git commit -m "更新热点数据"
git push origin main
```

## 常用操作

```bash
# 查看定时任务列表
crontab -l

# 删除定时任务
crontab -e
# 然后删除对应的行

# 查看运行日志
cat collect.log
```

## 文件说明

- `collect_hot_data.js` - 主脚本文件
- `package.json` - 项目配置
- `README_COLLECT.md` - 详细文档
- `hot_data_YYYY-MM-DD.json` - 带日期的历史数据
- `hot_data.json` - 默认数据文件

## 问题排查

**脚本运行失败？**
```bash
# 检查Node.js版本
node --version

# 查看详细错误
node collect_hot_data.js 2>&1
```

**定时任务没有运行？**
```bash
# 查看cron日志
tail -f collect.log
```

**生成的数据不对？**
```bash
# 手动删除后重新生成
rm hot_data_*.json
node collect_hot_data.js
```
