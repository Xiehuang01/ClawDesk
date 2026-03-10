# 构建资源

将应用图标放在这里：

- `icon.icns` - macOS 图标
- `icon.ico` - Windows 图标
- `icon.png` - 通用图标（512x512 或更大）

## 生成图标

你可以使用在线工具或命令行工具从 PNG 生成不同格式的图标：

### macOS (.icns)
```bash
# 使用 iconutil (macOS)
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
iconutil -c icns icon.iconset
```

### Windows (.ico)
使用在线工具如 https://convertio.co/png-ico/ 或安装 ImageMagick：

```bash
convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```
