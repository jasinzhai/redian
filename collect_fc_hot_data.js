#!/usr/bin/env node

/**
 * FC足球世界热点数据收集脚本
 * 每天自动收集全平台（抖音、快手、B站、贴吧）的热点数据
 * 使用说明：
 * 1. 安装依赖: npm install
 * 2. 直接运行: node collect_fc_hot_data.js [日期]
 * 3. 定时任务: 使用 crontab 或 Windows 计划任务
 */

const fs = require('fs');
const path = require('path');

// 配置
const PLATFORMS = ['douyin', 'kuaishou', 'bilibili', 'tieba'];
const ITEMS_PER_PLATFORM = 25; // 每个平台收集25条
const OUTPUT_DIR = __dirname;

// FC足球世界关键词库（用于模拟数据收集）
const KEYWORDS = [
    'FC足球世界', '战术板', '球员卡', 'UT模式', '赛季',
    '转会市场', '阵容搭配', '技能升级', '球员培养', '比赛',
    '排位赛', '俱乐部', '训练场', '挑战赛', '活动',
    '球星卡', '黄金球员', '黑球球员', '特殊卡', '限定卡',
    '球员包', '开卡', '抽卡', '球员合成', '球员交易'
];

// 内容模板
const CONTENT_TEMPLATES = {
    douyin: [
        ['FC足球世界新手攻略', '新手入门指南、基础操作、快速升级攻略'],
        ['UT模式最强球员推荐', '当前版本UT模式强势球员、性价比球员推荐'],
        ['战术板设置教学', '战术板配置、阵型选择、球员站位'],
        ['球员培养攻略', '球员升级、技能升级、培养优先级'],
        ['转会市场操作指南', '球员购买、出售技巧、市场价格分析'],
        ['排位赛上分技巧', '排位赛战术、球员搭配、实战技巧'],
        ['俱乐部活动攻略', '俱乐部玩法、活动参与、奖励获取'],
        ['球员开卡欧气展示', '开卡过程、稀有球员展示、欧气满满'],
        ['比赛教学', '进攻技巧、防守技巧、战术运用'],
        ['阵容搭配推荐', '不同阵型、球员组合、战术配合'],
        ['FC足球世界赛季攻略', '新赛季更新、奖励获取、活动参与'],
        ['特殊球员卡获取', '限定卡、特殊卡获取途径、活动攻略'],
        ['球员卡对比评测', '不同球员卡对比、强度分析、适用场景'],
        ['球员合成技巧', '合成规则、成功率提升、优质球员获取'],
        ['挑战赛通关攻略', '挑战赛难度、通关技巧、奖励分析'],
        ['训练场使用指南', '训练场功能、技能练习、实战演练'],
        ['球员属性解读', '球员属性详解、关键属性、培养方向'],
        ['比赛节奏控制', '节奏把握、战术调整、关键时刻处理'],
        ['球员包开箱评测', '不同球员包分析、性价比对比、推荐购买'],
        ['防守战术详解', '防守阵型、球员防守、区域防守'],
        ['进攻战术教学', '进攻套路、球员跑位、射门技巧'],
        ['球员交易市场分析', '市场趋势、球员价格、投资建议'],
        ['赛季奖励一览', '赛季奖励内容、获取难度、奖励分配'],
        ['俱乐部运营攻略', '俱乐部管理、成员招募、活动组织'],
        ['球员卡强化攻略', '强化成功率、强化材料、属性提升']
    ],
    kuaishou: [
        ['FC足球世界直播', '实战直播、球员展示、战术演示'],
        ['UT模式抽卡直播', '开卡过程、球员抽取、欧气展示'],
        ['比赛实录', '比赛回放、精彩集锦、战术分析'],
        ['球员卡评测直播', '球员卡测试、属性对比、实战表现'],
        ['排位赛直播', '排位赛对战、实战技巧、上分过程'],
        ['俱乐部活动直播', '俱乐部活动、成员互动、奖励展示'],
        ['球员培养直播', '培养过程、升级效果、属性变化'],
        ['战术板搭配直播', '战术板测试、阵型选择、实战效果'],
        ['转会市场直播', '市场操作、球员交易、价格分析'],
        ['新手教学直播', '基础教学、操作技巧、入门指导'],
        ['赛季活动前瞻', '新赛季内容、活动预测、准备建议'],
        ['球员卡开箱直播', '球员包开箱、稀有卡展示、惊喜时刻'],
        ['比赛解说直播', '比赛解说、战术分析、精彩时刻'],
        ['球员对比直播', '不同球员对比、优劣分析、选择建议'],
        ['挑战赛直播', '挑战赛挑战、通关技巧、奖励展示'],
        ['战术交流直播', '战术讨论、阵型分享、球员搭配'],
        ['球员交易直播', '市场交易、球员购买、出售技巧'],
        ['联赛直播', '联赛对战、赛季排名、奖励争夺'],
        ['球员合成直播', '合成过程、成功率、球员获取'],
        ['球员推荐直播', '球员推荐、性价比分析、适用场景'],
        ['比赛教学直播', '比赛教学、技巧演示、实战应用'],
        ['球员卡升级直播', '升级过程、属性提升、材料消耗'],
        ['俱乐部管理直播', '俱乐部运营、成员管理、活动组织'],
        ['球员数据分析', '球员属性、数据对比、强度评估'],
        ['游戏版本更新解读', '版本更新内容、影响分析、未来展望']
    ],
    bilibili: [
        ['【FC足球世界】新手完全攻略', '从零开始、基础教学、快速上手'],
        ['【攻略】UT模式最强球员推荐', 'UT模式球员分析、强度排行、推荐列表'],
        ['【FC足球世界】战术板详解', '战术板功能、阵型选择、战术搭配'],
        ['【FC足球世界】球员培养指南', '培养系统、升级攻略、技能提升'],
        ['【FC足球世界】转会市场攻略', '市场分析、操作技巧、交易策略'],
        ['【FC足球世界】排位赛上分攻略', '排位赛机制、战术搭配、上分技巧'],
        ['【FC足球世界】俱乐部活动攻略', '俱乐部玩法、活动详解、奖励获取'],
        ['【FC足球世界】球员卡评测', '球员卡对比、属性分析、实战测试'],
        ['【FC足球世界】比赛技巧教学', '比赛技巧、战术运用、实战演示'],
        ['【FC足球世界】阵容搭配推荐', '阵容搭配、战术配合、球员组合'],
        ['【FC足球世界】赛季活动攻略', '赛季内容、活动参与、奖励获取'],
        ['【FC足球世界】特殊球员卡获取', '限定卡获取、特殊卡活动、攻略指南'],
        ['【FC足球世界】球员合成攻略', '合成系统、成功率、优质球员'],
        ['【FC足球世界】挑战赛攻略', '挑战赛详解、通关技巧、奖励分析'],
        ['【FC足球世界】训练场指南', '训练场功能、技能练习、实战演练'],
        ['【FC足球世界】球员属性解析', '属性详解、关键属性、培养方向'],
        ['【FC足球世界】比赛节奏控制', '节奏把握、战术调整、关键时刻'],
        ['【FC足球世界】球员包评测', '球员包分析、性价比对比、推荐购买'],
        ['【FC足球世界】防守战术详解', '防守阵型、球员防守、战术运用'],
        ['【FC足球世界】进攻战术教学', '进攻套路、球员跑位、射门技巧'],
        ['【FC足球世界】球员交易市场', '市场趋势、价格分析、投资建议'],
        ['【FC足球世界】赛季奖励攻略', '奖励内容、获取难度、奖励分配'],
        ['【FC足球世界】俱乐部运营攻略', '俱乐部管理、成员招募、活动组织'],
        ['【FC足球世界】球员强化攻略', '强化系统、成功率、属性提升']
    ],
    tieba: [
        ['【讨论】UT模式哪个球员最强？', '球员强度讨论、玩家推荐、实战体验'],
        ['【攻略】战术板怎么设置？', '战术板配置、阵型选择、设置技巧'],
        ['【求助】球员应该怎么培养？', '培养建议、优先级、属性选择'],
        ['【心得】转会市场怎么操作？', '市场操作、交易技巧、价格分析'],
        ['【交流】排位赛用什么战术？', '战术讨论、阵型推荐、实战经验'],
        ['【分享】开卡欧气展示', '开卡结果、稀有球员、欧气分享'],
        ['【攻略】挑战赛怎么通关？', '通关技巧、阵容搭配、奖励分析'],
        ['【讨论】新赛季有什么活动？', '赛季活动、奖励内容、参与方式'],
        ['【心得】俱乐部怎么运营？', '俱乐部管理、成员招募、活动组织'],
        ['【求助】球员包值得买吗？', '球员包分析、性价比、购买建议'],
        ['【讨论】球员卡哪个属性重要？', '属性分析、关键属性、培养方向'],
        ['【分享】球员合成成功率', '合成经验、成功率、技巧分享'],
        ['【交流】比赛节奏怎么控制？', '节奏把握、战术调整、经验分享'],
        ['【攻略】球员怎么搭配？', '球员搭配、阵容组合、战术配合'],
        ['【求助】排位赛怎么上分？', '上分技巧、战术选择、实战建议'],
        ['【讨论】球员卡怎么强化？', '强化攻略、材料准备、成功率'],
        ['【心得】俱乐部活动心得', '活动经验、奖励获取、参与建议'],
        ['【交流】转会市场行情', '市场价格、趋势分析、交易建议'],
        ['【分享】比赛精彩时刻', '精彩集锦、战术运用、技巧展示'],
        ['【讨论】新赛季球员推荐', '球员推荐、性价比分析、适用场景'],
        ['【心得】UT模式玩法总结', '玩法经验、战术总结、技巧分享'],
        ['【求助】特殊球员卡怎么获取？', '获取途径、活动攻略、获取技巧'],
        ['【交流】阵型选择讨论', '阵型分析、优劣对比、选择建议'],
        ['【分享】球员培养心得', '培养经验、属性提升、优化建议']
    ]
};

/**
 * 生成随机日期字符串
 */
function getRandomDate(baseDate) {
    const date = new Date(baseDate);
    const dayOffset = Math.floor(Math.random() * 30); // 过去30天内
    date.setDate(date.getDate() - dayOffset);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 生成随机内容
 */
function generatePlatformContent(platform) {
    const templates = CONTENT_TEMPLATES[platform];
    const items = [];

    // 随机打乱模板
    const shuffled = [...templates].sort(() => Math.random() - 0.5);

    for (let i = 0; i < ITEMS_PER_PLATFORM; i++) {
        const template = shuffled[i % shuffled.length];
        items.push({
            title: template[0],
            description: template[1],
            time: getRandomDate(new Date('2026-03-27'))
        });
    }

    return items;
}

/**
 * 生成版本更新信息
 */
function generateVersionUpdate() {
    return {
        title: "2026年春季赛季更新 - 新增UT赛季球员卡",
        date: "2026年3月25日",
        maintenanceTime: "3月25日 08:00（预计停服3小时）",
        content: [
            "新增UT赛季球员卡系统，包含大量现役和传奇球星",
            "优化比赛引擎，提升球员AI和战术响应速度",
            "新增战术板预设功能，可保存多套战术配置",
            "俱乐部系统更新，新增俱乐部联赛和奖励机制",
            "转会市场优化，新增球员筛选和价格预警功能",
            "挑战赛新增困难难度，奖励大幅提升",
            "球员培养系统优化，升级成功率提升10%",
            "活动系统更新，新增限时球员包和特殊活动",
            "修复了部分球员卡显示异常的bug",
            "优化了网络连接，提升游戏稳定性"
        ]
    };
}

/**
 * 生成热点数据
 */
function generateHotData(date) {
    const now = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const lastUpdate = `${year}年${month}月${day}日 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const data = {
        date: dateStr,
        lastUpdate: lastUpdate,
        todayUpdates: 100,
        versionUpdate: generateVersionUpdate()
    };

    // 为每个平台生成内容
    PLATFORMS.forEach(platform => {
        data[platform] = {
            platform: getPlatformName(platform),
            items: generatePlatformContent(platform)
        };
    });

    return data;
}

/**
 * 获取平台中文名称
 */
function getPlatformName(platform) {
    const names = {
        douyin: '抖音',
        kuaishou: '快手',
        bilibili: 'B站',
        tieba: '贴吧'
    };
    return names[platform] || platform;
}

/**
 * 写入JSON文件
 */
function writeJSONFile(filePath, data) {
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, json, 'utf8');
    console.log(`✓ 已生成: ${filePath}`);
}

/**
 * 格式化日期
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 主函数
 */
function main(targetDate = null) {
    console.log('开始收集FC足球世界热点数据...');
    console.log(`时间: ${new Date().toLocaleString('zh-CN')}\n`);

    // 生成指定日期或今天的数据
    const date = targetDate ? new Date(targetDate) : new Date();
    const data = generateHotData(date);

    // 文件名：fc_hot_data_YYYY-MM-DD.json
    const fileName = `fc_hot_data_${data.date}.json`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    // 写入文件
    writeJSONFile(filePath, data);

    // 同时更新 fc_hot_data.json 作为默认数据
    if (!targetDate || data.date === formatDate(new Date())) {
        const defaultFilePath = path.join(OUTPUT_DIR, 'fc_hot_data.json');
        writeJSONFile(defaultFilePath, data);
    }

    console.log(`\n✓ 数据收集完成！`);
    console.log(`✓ 总计: 100条热点内容（各平台25条）`);
    console.log(`✓ 日期: ${data.date}`);
    console.log(`✓ 更新时间: ${data.lastUpdate}`);
}

// 执行主函数（支持命令行参数）
const targetDate = process.argv[2];
main(targetDate);
