# 儿童作业习惯养成系统

> 帮助小学生建立正确坐姿与良好作业习惯的智能辅助工具

## 📖 项目简介

本项目是一个基于 UniApp 开发的儿童作业习惯养成系统，通过实时摄像头监控、行为检测和智能提醒，帮助 6-12 岁小朋友在写作业过程中建立正确的坐姿和专注习惯。

### 核心价值

- 🎯 **客观记录**：通过摄像头实时检测，客观记录作业行为，减少主观判断
- 🔔 **实时提醒**：当检测到不良行为时，及时语音提醒，帮助小朋友自我纠正
- 📊 **数据可视化**：将作业过程数据化，生成清晰的习惯报告
- 👨‍👩‍👧 **家长友好**：为家长提供可理解的作业习惯分析，辅助家庭教育

## ✨ 功能特性

### 已实现功能

- ✅ **作业流程管理**
  - 开始作业准备（设置预期时长）
  - 实时监控页面（摄像头预览、状态显示）
  - 作业报告生成（评分、统计、照片回看）
  - 历史记录查看

- ✅ **实时行为检测**（Mock 实现）
  - 坐姿状态检测（端正/弯腰/趴桌/离开）
  - 专注状态检测（专注/走神）
  - 作业状态检测（书写/思考/发呆）

- ✅ **智能提醒系统**
  - 连续不良行为触发提醒
  - 儿童友好的语音提示文案
  - 提醒历史记录

- ✅ **评分与报告**
  - 多维度评分（专注力、坐姿习惯、作业效率、综合评分）
  - 详细统计数据（总时长、专注时长、走神次数、提醒次数）
  - 文字总结报告

- ✅ **照片记录功能**
  - 每30秒自动拍照记录
  - SQLite 数据库存储
  - 报告页面照片回看

- ✅ **摄像头功能**
  - 实时摄像头预览（使用 live-pusher）
  - 前后摄像头切换
  - 权限申请与管理

### 开发中功能

- 🚧 **真实行为识别**：接入大模型进行实际的行为分析
- 🚧 **云端数据同步**：支持多设备数据同步
- 🚧 **激励机制**：连续专注奖励、成长值系统

## 🛠 技术栈

- **框架**：UniApp (Vue 3)
- **平台**：Android / iOS / H5
- **数据库**：SQLite（本地存储）
- **摄像头**：live-pusher 组件
- **存储**：uni.setStorageSync / uni.getStorageSync

## 📁 项目结构

```
xgzs/
├── pages/                    # 页面目录
│   ├── index/                # 首页（入口卡片）
│   ├── session/             # 作业会话相关
│   │   ├── start.vue        # 作业准备页
│   │   ├── doing.nvue       # 作业监控页（nvue）
│   │   └── report.vue       # 作业报告页
│   └── history/             # 历史记录
│       └── list.vue         # 历史记录列表
├── common/                   # 公共模块
│   ├── models.js            # 数据模型定义
│   ├── storageService.js    # 本地存储服务
│   ├── detectionService.js  # 行为检测服务（Mock）
│   ├── scoringService.js    # 评分计算服务
│   ├── photoStorage.js      # 照片存储服务（SQLite）
│   ├── voiceReminder.js     # 语音提醒服务
│   ├── reminderPhrases.js   # 提醒文案
│   ├── timeUtils.js         # 时间工具函数
│   └── reportUtils.js       # 报告生成工具
├── config/                   # 配置文件
│   └── model.config.js      # 模型配置（预留）
├── manifest.json            # 应用配置
├── pages.json               # 页面路由配置
└── App.vue                  # 应用入口
```

## 🚀 快速开始

### 环境要求

- HBuilderX 4.85+
- Node.js 14+
- Android 开发环境（用于打包 Android App）

### 安装与运行

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd students-homework-habit-assistant
   ```

2. **使用 HBuilderX 打开项目**
   - 打开 HBuilderX
   - 文件 → 打开目录 → 选择 `students-homework-habit-assistant` 文件夹

3. **运行项目**
   - **H5 运行**：运行 → 运行到浏览器 → Chrome
   - **App 运行**：运行 → 运行到手机或模拟器 → 选择设备
   - **打包**：发行 → 原生 App-云打包 → 选择 Android

### 权限配置

应用需要以下权限（已在 `manifest.json` 中配置）：

- 📷 **摄像头权限**：用于实时监控
- 💾 **存储权限**：用于保存照片和数据库

首次运行时，应用会自动申请这些权限。

## 📱 使用流程

1. **开始作业**
   - 打开应用，点击「开始写作业」
   - 选择预期作业时长（30/45/60分钟）
   - 点击「开始写作业」按钮

2. **作业监控**
   - 将手机放置在合适位置，摄像头对准小朋友
   - 系统自动检测坐姿、专注度等状态
   - 当检测到不良行为时，会语音提醒

3. **结束作业**
   - 点击「结束作业」按钮
   - 系统自动生成作业报告

4. **查看报告**
   - 查看本次作业的评分和统计
   - 回看作业过程中的照片
   - 查看历史记录

## 🎨 设计理念

### 儿童友好设计

- 🌈 **明亮柔和的配色**：使用蓝、绿等温暖色调
- 🎭 **图形化反馈**：使用图标、卡片等视觉元素
- 💬 **鼓励式语言**：避免命令式、批评式表达
- ✨ **简单直观**：减少复杂操作，降低使用门槛

### 家长友好设计

- 📊 **数据清晰**：结构化展示统计数据
- 📈 **趋势分析**：展示习惯变化趋势
- 💡 **实用建议**：提供可操作的建议

## 🔧 开发说明

### 核心模块

#### 1. 行为检测服务 (`detectionService.js`)
- 当前使用 Mock 数据模拟行为检测
- 每 3 秒生成一次检测快照
- 支持随机生成坐姿、专注、作业状态

#### 2. 评分服务 (`scoringService.js`)
- 基于检测快照计算各项评分
- 支持专注力、坐姿、效率、综合评分
- 使用线性映射和扣分制算法

#### 3. 照片存储服务 (`photoStorage.js`)
- 使用 SQLite 数据库存储照片信息
- 支持按会话 ID 查询照片
- 自动管理数据库连接

### 数据模型

#### HomeworkSession
```javascript
{
  id: string,              // 会话ID
  startTime: number,       // 开始时间戳
  endTime: number,         // 结束时间戳
  duration: number,        // 总时长（毫秒）
  focusDuration: number,   // 专注时长（毫秒）
  distractCount: number,   // 走神次数
  reminderCount: number,   // 提醒次数
  postureGoodRatio: number, // 坐姿良好占比
  scores: {                // 各项评分
    focus: number,
    posture: number,
    efficiency: number,
    overall: number
  },
  notesSummary: string,    // 文字总结
  snapshots: Array,        // 检测快照列表
  photos: Array           // 照片列表
}
```

#### DetectionSnapshot
```javascript
{
  timestamp: number,       // 时间戳
  postureState: string,    // 坐姿状态：good/bend/lie/leave
  focusState: string,     // 专注状态：focus/distract
  taskState: string       // 作业状态：writing/thinking/idle
}
```

## 🐛 已知问题

- ⚠️ 当前行为检测使用 Mock 数据，真实识别功能待开发
- ⚠️ 照片存储在某些设备上可能需要手动授予存储权限
- ⚠️ 部分 Android 设备上 live-pusher 预览可能存在兼容性问题

## 📝 开发计划

### 近期计划

- [ ] 接入真实的大模型行为识别
- [ ] 优化照片存储和查询性能
- [ ] 完善错误处理和用户提示
- [ ] 添加更多儿童友好的动画效果

### 未来规划

- [ ] 云端数据同步
- [ ] 多孩子账号支持
- [ ] 激励机制（星星、勋章）
- [ ] 作业类型区分（写字/阅读）
- [ ] 家长端独立应用

## 🤝 贡献指南

项目正在积极开发中，欢迎提出问题和建议！

## 📄 许可证

[Apache License 2.0]

## 👥 联系方式

如有问题或建议，请通过 Issue 反馈。

---

**注意**：本项目正在开发中，部分功能可能不稳定。建议在测试环境使用。

