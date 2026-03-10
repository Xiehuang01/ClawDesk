# 图标文件目录

请在此目录放置应用图标文件：

## 所需文件

- `icon.icns` - macOS 图标 (512x512 或更大)
- `icon.ico` - Windows 图标 (256x256 或更大)
- `icon.png` - Linux 图标 (512x512)

## 生成图标

你可以使用以下工具生成图标：

### 在线工具
- https://cloudconvert.com/png-to-icns
- https://cloudconvert.com/png-to-ico

### 命令行工具 (macOS)
```bash
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
iconutil -c icns icon.iconset -o icon.icns
rm -rf icon.iconset
```

## 图标设计建议

- 使用简洁的设计
- 确保在小尺寸下清晰可见
- 使用透明背景
- 遵循各平台的设计规范
