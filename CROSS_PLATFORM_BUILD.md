# 跨平台构建指南

## 为什么只有 macOS 安装包？

因为你在 macOS 上构建，electron-builder 默认只为当前平台生成安装包。

## 解决方案

### 方案 1：在各平台上分别构建（推荐）

这是最可靠的方法：

#### macOS
```bash
pnpm build
# 生成: OneStepOpenClaw-1.0.0-mac.dmg
```

#### Windows
在 Windows 电脑上：
```bash
pnpm build
# 生成: OneStepOpenClaw-1.0.0-win.exe
```

#### Linux
在 Linux 电脑上：
```bash
pnpm build
# 生成: OneStepOpenClaw-1.0.0-linux.AppImage
```

### 方案 2：macOS 交叉编译 Linux（有限制）

在 macOS 上可以构建 Linux 包：

```bash
# 只构建 Linux
pnpm build -- --linux

# 同时构建 macOS 和 Linux
pnpm build -- -ml
```

**限制**：
- ✅ macOS → Linux：可以
- ❌ macOS → Windows：不可以（需要 Windows 特定工具）
- ✅ Linux → Windows：可以（需要安装 wine）
- ✅ Windows → Linux：可以

### 方案 3：使用 GitHub Actions（最佳方案）

我已经创建了 `.github/workflows/build.yml` 文件。

#### 使用步骤：

1. **将代码推送到 GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/QuickClaw.git
git push -u origin main
```

2. **创建版本标签触发构建**
```bash
git tag v1.0.0
git push origin v1.0.0
```

3. **等待构建完成**
- GitHub Actions 会自动在 macOS、Windows、Linux 三个平台上构建
- 构建完成后会自动创建 Release
- 所有平台的安装包都会附加到 Release 中

4. **手动触发构建**
- 访问 GitHub 仓库的 Actions 页面
- 选择 "Build and Release" workflow
- 点击 "Run workflow"

#### 查看构建结果

构建完成后，在 GitHub 仓库的 Releases 页面可以看到：
- `OneStepOpenClaw-1.0.0-mac.dmg` (macOS)
- `OneStepOpenClaw-1.0.0-win.exe` (Windows)
- `OneStepOpenClaw-1.0.0-linux.AppImage` (Linux)

### 方案 4：使用 Docker（高级）

如果你想在本地构建所有平台，可以使用 Docker：

```bash
# 安装 Docker Desktop for Mac

# 使用 electron-builder 的 Docker 镜像
docker run --rm -ti \
  --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
  --env ELECTRON_CACHE="/root/.cache/electron" \
  --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
  -v ${PWD}:/project \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  electronuserland/builder:wine \
  /bin/bash -c "pnpm install && pnpm build -- -wl"
```

## 推荐流程

### 开发阶段
- 在 macOS 上开发和测试
- 只构建 macOS 版本：`pnpm build`

### 发布阶段
- 使用 GitHub Actions 自动构建所有平台
- 或者在各平台上分别构建

## 当前配置

你的 `package.json` 已经配置好了所有平台：

```json
{
  "build": {
    "mac": {
      "target": ["dmg", "zip"]
    },
    "win": {
      "target": ["nsis", "portable"]
    },
    "linux": {
      "target": ["AppImage", "deb"]
    }
  }
}
```

## 快速开始

如果你想立即获得所有平台的安装包：

1. **推送代码到 GitHub**
2. **创建标签**: `git tag v1.0.0 && git push origin v1.0.0`
3. **等待 5-10 分钟**
4. **下载所有平台的安装包**

就这么简单！🎉
