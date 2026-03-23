# 妄想山海热点数据自动收集脚本

## 功能说明

自动收集"妄想山海"全平台（抖音、快手、B站、贴吧）的热点数据，每天生成100条最热门内容。

- 每个平台收集25条内容
- 自动生成符合格式的JSON文件
- 按日期命名文件（如：hot_data_2026-03-20.json）
- 同时更新 hot_data.json 作为默认数据

## 使用方法

### 1. 快速开始

```bash
# 直接运行脚本
node collect_hot_data.js

# 或使用 npm
npm run collect
```

### 2. 手动运行

```bash
cd /Users/jasinzhai/WorkBuddy/20260320143650
node collect_hot_data.js
```

运行后会生成两个文件：
- `hot_data_YYYY-MM-DD.json` - 带日期的存档文件
- `hot_data.json` - 默认数据文件

## 定时任务设置

### macOS / Linux (使用 crontab)

编辑定时任务：
```bash
crontab -e
```

添加以下内容（每天晚上8点运行）：
```bash
0 20 * * * cd /Users/jasinzhai/WorkBuddy/20260320143650 && node collect_hot_data.js >> collect.log 2>&1
```

### Windows (使用计划任务)

1. 打开"任务计划程序"
2. 创建基本任务
3. 设置触发器（每天，20:00）
4. 操作：启动程序
   - 程序：`node`
   - 参数：`/Users/jasinzhai/WorkBuddy/20260320143650/collect_hot_data.js`
   - 起始于：`/Users/jasinzhai/WorkBuddy/20260320143650`

## 数据格式

生成的JSON文件包含以下结构：

```json
{
  "date": "2026-03-20",
  "lastUpdate": "2026年3月20日 20:00",
  "todayUpdates": 100,
  "versionUpdate": {
    "title": "神躯外相新异能武器 + 驭兽争霸S1赛季",
    "date": "2026年3月17日",
    "maintenanceTime": "3月17日 08:00（预计停服2小时）",
    "content": [...]
  },
  "douyin": {
    "platform": "抖音",
    "items": [...]
  },
  "kuaishou": {
    "platform": "快手",
    "items": [...]
  },
  "bilibili": {
    "platform": "B站",
    "items": [...]
  },
  "tieba": {
    "platform": "贴吧",
    "items": [...]
  }
}
```

## 自定义配置

在 `collect_hot_data.js` 中可以修改：

```javascript
const PLATFORMS = ['douyin', 'kuaishou', 'bilibili', 'tieba'];  // 平台列表
const ITEMS_PER_PLATFORM = 25;  // 每个平台收集数量
const OUTPUT_DIR = __dirname;  // 输出目录
```

## 注意事项

1. 当前版本使用模拟数据模板生成内容
2. 实际生产环境需要接入各平台API或爬虫
3. 建议每天固定时间运行一次
4. 运行日志会输出到控制台

## 未来改进

- [ ] 接入抖音、快手、B站、贴吧的真实API
- [ ] 添加数据去重和质量过滤
- [ ] 支持手动调整收集时间
- [ ] 添加数据备份和历史版本管理
- [ ] 支持自定义关键词和主题
- [ ] 添加数据统计和分析功能

## 常见问题

**Q: 生成的数据在哪里？**
A: 在项目根目录，文件名为 `hot_data_YYYY-MM-DD.json`

**Q: 如何修改收集时间？**
A: 修改 crontab 或计划任务的时间设置

**Q: 如何增加收集的平台？**
A: 在 `PLATFORMS` 数组中添加新平台，并在 `CONTENT_TEMPLATES` 中添加对应模板

**Q: 生成的数据会自动同步到网站吗？**
A: 不会，需要手动将生成的JSON文件推送到GitHub

## 联系方式

如有问题或建议，请联系开发者。
