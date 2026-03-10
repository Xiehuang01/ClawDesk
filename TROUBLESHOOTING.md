# 构建问题排查

## 问题：构建时出现 "operation not permitted" 错误

### 原因
macOS 的安全机制阻止了 electron-builder 访问缓存目录。

### 解决方案

#### 方案 1：授予终端完全磁盘访问权限（推荐）

1. 打开 **系统偏好设置** > **安全性与隐私** > **隐私**
2. 在左侧列表中选择 **完全磁盘访问权限**
3. 点击左下角的锁图标解锁
4. 点击 **+** 按钮
5. 添加你使用的终端应用：
   - **终端.app**: `/Applications/Utilities/Terminal.app`
   - **iTerm2**: `/Applications/iTerm.app`
   - **Cursor**: `/Applications/Cursor.app`
6. 重启终端应用
7. 重新运行构建命令

#### 方案 2：手动清理并重新下载

```bash
# 清理 Electron 缓存
rm -rf ~/Library/Caches/electron

# 清理项目构建文件
cd /Users/xie/Desktop/QuickClaw
rm -rf dist dist-electron release

# 重新构建
pnpm build
```

#### 方案 3：使用环境变量跳过缓存

```bash
# 设置环境变量
export ELECTRON_BUILDER_CACHE=/tmp/electron-builder-cache

# 构建
pnpm build
```

#### 方案 4：使用已安装的 Electron

如果你已经在 node_modules 中有 Electron，可以跳过下载：

```bash
# 设置使用本地 Electron
export ELECTRON_SKIP_BINARY_DOWNLOAD=1

# 重新安装依赖
pnpm install

# 构建
pnpm build
```

#### 方案 5：降级 electron-builder

如果上述方法都不行，可以尝试降级：

```bash
# 编辑 package.json，将 electron-builder 版本改为
"electron-builder": "^23.6.0"

# 重新安装
pnpm install

# 构建
pnpm build
```

## 其他常见问题

### 1. TypeScript 编译错误

**问题**: 类型不匹配错误

**解决**: 
```bash
# 清理并重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 2. 图标文件缺失

**问题**: 构建时提示缺少图标文件

**解决**: 
- 在 `build/` 目录创建占位图标
- 或者暂时注释掉 package.json 中的 icon 配置

### 3. 构建速度慢

**问题**: 下载 Electron 很慢

**解决**: 
```bash
# 使用国内镜像
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/

# 构建
pnpm build
```

### 4. 内存不足

**问题**: 构建时内存溢出

**解决**: 
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# 构建
pnpm build
```

## 验证构建是否成功

构建成功后，你应该看到：

```
✓ built in XXs
• electron-builder  version=24.13.3
• packaging       platform=darwin arch=x64
• building        target=macOS zip
• building        target=DMG
• building block map  blockMapFile=release/OneStepOpenClaw-1.0.0-mac.dmg.blockmap
```

输出文件位于 `release/` 目录。

## 需要帮助？

如果以上方法都无法解决问题，请：

1. 检查终端输出的完整错误信息
2. 确认 macOS 版本和权限设置
3. 尝试在不同的目录下构建
4. 查看 electron-builder 官方文档：https://www.electron.build/
