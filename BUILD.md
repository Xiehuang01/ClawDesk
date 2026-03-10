# 打包指南

## 准备工作

### 1. 准备应用图标

在 `build/` 目录下放置应用图标：

- **macOS**: `icon.icns` (512x512 或更大)
- **Windows**: `icon.ico` (256x256 或更大)
- **Linux**: `icon.png` (512x512)

#### 生成图标文件

你可以使用在线工具或命令行工具生成图标：

**在线工具**:
- https://cloudconvert.com/png-to-icns (PNG 转 ICNS)
- https://cloudconvert.com/png-to-ico (PNG 转 ICO)

**命令行工具** (macOS):
```bash
# 安装 iconutil (macOS 自带)
# 从 PNG 生成 ICNS
mkdir icon.iconset
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset -o build/icon.icns
rm -rf icon.iconset
```

### 2. 安装依赖

确保已安装所有依赖：

```bash
pnpm install
```

## 打包命令

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 或者启动 Electron 开发模式
pnpm electron:dev
```

### 构建生产版本

#### macOS

```bash
# 构建 DMG 安装包
pnpm build

# 或者
pnpm electron:build
```

生成的文件位置：`release/OneStepOpenClaw-1.0.0.dmg`

#### Windows

在 Windows 系统上运行：

```bash
# 构建 NSIS 安装包
pnpm build
```

生成的文件位置：`release/OneStepOpenClaw Setup 1.0.0.exe`

#### Linux

```bash
# 构建 AppImage 或 deb 包
pnpm build
```

### 构建多平台

如果需要在一个平台上构建多个平台的安装包（需要额外配置）：

```bash
# 构建所有平台
pnpm build -- -mwl

# 只构建 macOS
pnpm build -- -m

# 只构建 Windows
pnpm build -- -w

# 只构建 Linux
pnpm build -- -l
```

## 高级配置

### 自定义打包配置

编辑 `package.json` 中的 `build` 字段：

```json
{
  "build": {
    "appId": "com.onestep.openclaw",
    "productName": "OneStepOpenClaw",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "dist-electron/**/*"
    ],
    "mac": {
      "target": ["dmg", "zip"],
      "icon": "build/icon.icns",
      "category": "public.app-category.developer-tools"
    },
    "win": {
      "target": ["nsis", "portable"],
      "icon": "build/icon.ico"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "build/icon.png",
      "category": "Development"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

### 代码签名（可选）

#### macOS

```bash
# 设置环境变量
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your_password

# 构建并签名
pnpm build
```

#### Windows

```bash
# 设置环境变量
export CSC_LINK=/path/to/certificate.pfx
export CSC_KEY_PASSWORD=your_password

# 构建并签名
pnpm build
```

## 发布到应用商店

### macOS App Store

1. 准备 App Store 证书
2. 更新 `package.json`:

```json
{
  "build": {
    "mac": {
      "target": ["mas"],
      "provisioningProfile": "path/to/profile.provisionprofile"
    }
  }
}
```

3. 构建：`pnpm build -- --mac mas`

### Microsoft Store

1. 准备 Windows Store 证书
2. 更新 `package.json`:

```json
{
  "build": {
    "win": {
      "target": ["appx"]
    }
  }
}
```

3. 构建：`pnpm build -- --win appx`

## 常见问题

### 1. 构建失败

- 确保已安装所有依赖：`pnpm install`
- 清理缓存：`rm -rf node_modules dist dist-electron release && pnpm install`
- 检查 Node.js 版本（建议 18.x 或更高）

### 2. 图标不显示

- 确保图标文件存在于 `build/` 目录
- 检查图标文件格式和尺寸是否正确
- 清理构建缓存后重新构建

### 3. 应用无法启动

- 检查 `main.js` 路径是否正确
- 确保 `dist` 和 `dist-electron` 目录都已生成
- 查看控制台错误日志

### 4. 打包体积过大

- 使用 `asar` 压缩（默认启用）
- 排除不必要的文件
- 优化依赖项

## 输出文件

构建完成后，安装包将位于 `release/` 目录：

- **macOS**: `OneStepOpenClaw-1.0.0.dmg`
- **Windows**: `OneStepOpenClaw Setup 1.0.0.exe`
- **Linux**: `OneStepOpenClaw-1.0.0.AppImage` 或 `onestep-openclaw_1.0.0_amd64.deb`

## 测试安装包

在发布前，务必测试安装包：

1. 在干净的系统上安装
2. 测试所有功能
3. 检查自动更新（如果配置）
4. 验证卸载流程

## 自动更新（可选）

使用 `electron-updater` 实现自动更新：

```bash
pnpm add electron-updater
```

配置更新服务器并在代码中实现更新逻辑。

## 持续集成

可以使用 GitHub Actions 自动构建：

创建 `.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm build
      
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: release/*
```

## 更多资源

- [Electron Builder 文档](https://www.electron.build/)
- [Electron 官方文档](https://www.electronjs.org/docs)
- [代码签名指南](https://www.electron.build/code-signing)
