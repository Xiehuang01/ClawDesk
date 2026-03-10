# OneStepOpenClaw

A modern desktop application for managing OpenClaw with ease.

## Features

- 🚀 One-click OpenClaw installation
- ⚙️ Easy configuration management
- 🎮 Gateway control (start/stop/restart)
- 📝 Real-time log viewing
- 🎨 Beautiful dark/light theme
- 💻 Cross-platform (Windows & macOS)

## Tech Stack

- **Electron** - Desktop framework
- **Vue 3** - Frontend framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Styling

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Run Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

This will create distributable packages for your platform in the `release` folder.

## Project Structure

```
OneStepOpenClaw/
├── electron/           # Electron main process
│   ├── main.ts        # Main process entry
│   └── preload.ts     # Preload script
├── src/               # Vue frontend
│   ├── pages/         # Application pages
│   ├── App.vue        # Root component
│   ├── main.ts        # Frontend entry
│   └── style.css      # Global styles
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## License

MIT
