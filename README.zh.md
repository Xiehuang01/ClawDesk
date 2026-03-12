<div align="center">
  <img src="build/icon.icns" alt="ClawDesk" width="128" height="128">
  
  # ClawDesk
  
  <p>
    <a href="./README.md">English</a> | <a href="./README.zh.md">中文</a>
  </p>
  
  <p>
    <strong>一个现代化的 OpenClaw 桌面管理工具</strong>
  </p>
  
  <p>
    <em>通过直观的图形界面简化 OpenClaw 的部署、配置和网关管理</em>
  </p>
</div>

## 功能特性

- 🚀 一键安装 OpenClaw
- ⚙️ 简单的配置管理
- 🎮 网关控制（启动/停止/重启）
- 📝 实时日志查看
- 🎨 精美的暗色/亮色主题
- 🌍 中英文双语支持
- 💻 跨平台支持（Windows & macOS）

## 下载

前往 [Releases](https://github.com/Xiehuang01/ClawDesk/releases) 页面下载最新版本：

- **macOS**: 下载 `.dmg` 文件
- **Windows**: 下载 `.exe` 文件

## 开发

### 环境要求

- Node.js 18+
- pnpm

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建

```bash
# 构建所有平台
pnpm build

# 仅构建 macOS
pnpm build:mac

# 仅构建 Windows
pnpm build:win
```

## 发布新版本

1. 更新 `package.json` 中的版本号
2. 提交更改
3. 创建并推送 tag：

```bash
git tag v1.0.0
git push origin v1.0.0
```

4. GitHub Actions 会自动构建并创建 Release

## 技术栈

- **Electron** - 桌面框架
- **Vue 3** - 前端框架
- **Vite** - 构建工具
- **TypeScript** - 类型安全
- **TailwindCSS** - 样式框架

## 项目结构

```
QuickClaw/
├── electron/           # Electron 主进程
│   ├── main.ts        # 主进程入口
│   └── preload.js     # 预加载脚本
├── src/               # Vue 前端
│   ├── pages/         # 应用页面
│   ├── components/    # 组件
│   ├── utils/         # 工具函数
│   └── composables/   # 组合式函数
├── .github/           # GitHub Actions
└── build/             # 构建资源
```

## 许可证

MIT

