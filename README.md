# ClawDesk

<p align="center">
  <a href="./README.md">English</a> | <a href="./README.zh.md">中文</a>
</p>

A modern desktop management tool for OpenClaw.

## Features

- 🚀 One-click OpenClaw installation
- ⚙️ Simple configuration management
- 🎮 Gateway control (start / stop / restart)
- 📝 Real-time log viewer
- 🎨 Beautiful dark / light theme
- 🌍 Bilingual support (English & Chinese)
- 💻 Cross-platform (Windows & macOS)

## Download

Visit the [Releases](https://github.com/xiehuang01/QuickClaw/releases) page to download the latest version:

- **macOS**: Download the `.dmg` file
- **Windows**: Download the `.exe` file

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Install dependencies

```bash
pnpm install
```

### Development mode

```bash
pnpm dev
```

### Build

```bash
# Build for all platforms
pnpm build

# Build for macOS only
pnpm build:mac

# Build for Windows only
pnpm build:win
```

## Releasing a new version

1. Update the version number in `package.json`
2. Commit the changes
3. Create and push a tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

4. GitHub Actions will automatically build and create a Release

## Tech Stack

- **Electron** - Desktop framework
- **Vue 3** - Frontend framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Styling

## Project Structure

```
QuickClaw/
├── electron/           # Electron main process
│   ├── main.ts        # Main process entry
│   └── preload.js     # Preload script
├── src/               # Vue frontend
│   ├── pages/         # App pages
│   ├── components/    # Components
│   ├── utils/         # Utilities
│   └── composables/   # Composables
├── .github/           # GitHub Actions
└── build/             # Build assets
```

## License

MIT
