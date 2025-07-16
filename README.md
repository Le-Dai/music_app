# 🎵 音乐播放器 App

基于 Taro4 + Vue3 + TypeScript + Sass 开发的跨平台音乐播放器应用。

## ✨ 功能特性

- 🎶 音乐列表展示
- ▶️ 音乐播放控制（播放/暂停/上一首/下一首）
- 🔄 播放模式切换（顺序/循环/随机）
- 🔍 音乐搜索功能
- 📱 响应式设计，支持多端运行
- 🎨 美观的 UI 界面
- 💾 搜索历史记录
- 📊 播放进度控制
- 🔊 音量控制

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

#### 微信小程序
```bash
npm run dev:weapp
```

#### H5
```bash
npm run dev:h5
```

#### 支付宝小程序
```bash
npm run dev:alipay
```

### 生产环境构建

#### 微信小程序
```bash
npm run build:weapp
```

#### H5
```bash
npm run build:h5
```

## 📁 项目结构

```
src/
├── components/          # 组件
│   └── MiniPlayer/     # 迷你播放器组件
├── pages/              # 页面
│   ├── index/          # 首页
│   ├── player/         # 播放器页面
│   └── search/         # 搜索页面
├── store/              # 状态管理
│   └── music.ts        # 音乐相关状态
├── styles/             # 样式文件
│   └── variables.scss  # SCSS 变量
├── types/              # TypeScript 类型定义
│   └── music.ts        # 音乐相关类型
├── app.config.ts       # 应用配置
├── app.scss           # 全局样式
└── app.ts             # 应用入口
```

## 🛠️ 技术栈

- **框架**: Taro4
- **前端**: Vue3 + TypeScript
- **状态管理**: Pinia
- **样式**: Sass
- **构建工具**: Webpack5
- **包管理**: npm

## 📋 主要页面

### 首页 (pages/index)
- 轮播图展示
- 推荐歌单
- 热门歌曲列表
- 迷你播放器

### 播放器页面 (pages/player)
- 专辑封面显示
- 播放控制按钮
- 进度条控制
- 播放模式切换
- 音量控制

### 搜索页面 (pages/search)
- 搜索框
- 热门搜索标签
- 搜索历史
- 搜索结果展示

## 🎯 核心功能

### 音乐播放
- 支持播放/暂停
- 上一首/下一首切换
- 播放进度控制
- 音量调节

### 播放模式
- 顺序播放
- 单曲循环
- 随机播放

### 搜索功能
- 实时搜索
- 搜索历史记录
- 热门搜索推荐

## 📱 支持平台

- 微信小程序
- 支付宝小程序
- H5
- React Native (需额外配置)

## 📄 许可证

MIT License