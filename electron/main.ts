import { app, BrowserWindow, ipcMain } from 'electron'
import { exec, spawn } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const execAsync = promisify(exec)

// Cache for status checks
interface StatusCache {
  openclawInstalled: { data: any; timestamp: number } | null
  nodeVersion: { data: any; timestamp: number } | null
  gitVersion: { data: any; timestamp: number } | null
  gatewayStatus: { data: any; timestamp: number } | null
  currentModel: { data: any; timestamp: number } | null
}

const statusCache: StatusCache = {
  openclawInstalled: null,
  nodeVersion: null,
  gitVersion: null,
  gatewayStatus: null,
  currentModel: null
}

const CACHE_DURATION = 60000 // 60 seconds

function getCachedData<T>(cacheKey: keyof StatusCache): T | null {
  const cached = statusCache[cacheKey]
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for ${cacheKey}`)
    return cached.data as T
  }
  return null
}

function setCachedData(cacheKey: keyof StatusCache, data: any) {
  statusCache[cacheKey] = {
    data,
    timestamp: Date.now()
  }
}

// Helper function to execute openclaw commands with proper environment
function execOpenClaw(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn('/usr/local/bin/openclaw', args, {
      env: {
        ...process.env,
        PATH: `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin`,
        HOME: process.env.HOME,
        USER: process.env.USER,
        SHELL: '/bin/zsh'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    })

    let stdout = ''
    let stderr = ''

    child.stdout?.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr?.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0 || stdout.length > 0) {
        resolve(stdout || stderr)
      } else {
        reject(new Error(stderr || `Command failed with code ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })

    // Timeout after 30 seconds
    setTimeout(() => {
      child.kill()
      reject(new Error('Command timeout'))
    }, 30000)
  })
}

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#181C23',
    show: false,
    frame: true
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPC Handlers

// Check if OpenClaw is installed
ipcMain.handle('check-openclaw-installed', async () => {
  // Check cache first
  const cached = getCachedData<any>('openclawInstalled')
  if (cached) return cached

  try {
    console.log('Checking OpenClaw installation...')
    const version = await execOpenClaw(['--version'])
    const result = { installed: true, version: version.trim() }
    setCachedData('openclawInstalled', result)
    console.log('OpenClaw version:', version.trim())
    return result
  } catch (error: any) {
    console.error('OpenClaw check failed:', error.message)
    const result = { installed: false, version: null }
    setCachedData('openclawInstalled', result)
    return result
  }
})

// Check Node.js version
ipcMain.handle('check-node-version', async () => {
  // Check cache first
  const cached = getCachedData<any>('nodeVersion')
  if (cached) return cached

  try {
    const { stdout } = await execAsync('node --version', {
      timeout: 3000,
      env: { ...process.env, PATH: `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin` }
    })
    const result = { installed: true, version: stdout.trim() }
    setCachedData('nodeVersion', result)
    return result
  } catch (error) {
    const result = { installed: false, version: null }
    setCachedData('nodeVersion', result)
    return result
  }
})

// Check Git version
ipcMain.handle('check-git-version', async () => {
  // Check cache first
  const cached = getCachedData<any>('gitVersion')
  if (cached) return cached

  try {
    const { stdout } = await execAsync('git --version', {
      timeout: 3000,
      env: { ...process.env, PATH: `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin` }
    })
    const result = { installed: true, version: stdout.trim().replace('git version ', '') }
    setCachedData('gitVersion', result)
    return result
  } catch (error) {
    const result = { installed: false, version: null }
    setCachedData('gitVersion', result)
    return result
  }
})

// Install Node.js
ipcMain.handle('install-node', async (event) => {
  return new Promise((resolve, reject) => {
    const platform = process.platform
    let installCommand = ''
    
    if (platform === 'darwin') {
      // macOS - use Homebrew
      installCommand = 'brew install node'
    } else if (platform === 'win32') {
      // Windows - use Chocolatey or download installer
      installCommand = 'choco install nodejs -y'
    } else {
      // Linux - use apt or yum
      installCommand = 'curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs'
    }
    
    const child = exec(installCommand, {
      env: { ...process.env, PATH: `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin` }
    })
    
    child.stdout?.on('data', (data) => {
      event.sender.send('install-output', data.toString())
    })
    
    child.stderr?.on('data', (data) => {
      event.sender.send('install-output', data.toString())
    })
    
    child.on('close', (code) => {
      // Clear cache
      statusCache.nodeVersion = null
      
      if (code === 0) {
        resolve({ success: true })
      } else {
        reject(new Error(`Node.js installation failed with code ${code}`))
      }
    })
    
    child.on('error', (error) => {
      reject(error)
    })
  })
})

// Install Git
ipcMain.handle('install-git', async (event) => {
  return new Promise((resolve, reject) => {
    const platform = process.platform
    let installCommand = ''
    
    if (platform === 'darwin') {
      // macOS - use Homebrew
      installCommand = 'brew install git'
    } else if (platform === 'win32') {
      // Windows - use Chocolatey
      installCommand = 'choco install git -y'
    } else {
      // Linux - use apt
      installCommand = 'sudo apt-get update && sudo apt-get install -y git'
    }
    
    const child = exec(installCommand, {
      env: { ...process.env, PATH: `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin` }
    })
    
    child.stdout?.on('data', (data) => {
      event.sender.send('install-output', data.toString())
    })
    
    child.stderr?.on('data', (data) => {
      event.sender.send('install-output', data.toString())
    })
    
    child.on('close', (code) => {
      // Clear cache
      statusCache.gitVersion = null
      
      if (code === 0) {
        resolve({ success: true })
      } else {
        reject(new Error(`Git installation failed with code ${code}`))
      }
    })
    
    child.on('error', (error) => {
      reject(error)
    })
  })
})

// Install OpenClaw
ipcMain.handle('install-openclaw', async (event) => {
  return new Promise((resolve, reject) => {
    const platform = process.platform
    let installCommand = ''
    
    if (platform === 'darwin') {
      // macOS - use Homebrew
      installCommand = 'brew install openclaw'
    } else if (platform === 'win32') {
      // Windows - use npm
      installCommand = 'npm install -g openclaw'
    } else {
      // Linux - use npm
      installCommand = 'npm install -g openclaw'
    }
    
    const child = exec(installCommand, {
      env: { ...process.env, PATH: `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin` }
    })
    
    child.stdout?.on('data', (data) => {
      event.sender.send('install-output', data.toString())
    })
    
    child.stderr?.on('data', (data) => {
      event.sender.send('install-output', data.toString())
    })
    
    child.on('close', (code) => {
      // Clear cache
      statusCache.openclawInstalled = null
      
      if (code === 0) {
        resolve({ success: true })
      } else {
        reject(new Error(`OpenClaw installation failed with code ${code}`))
      }
    })
    
    child.on('error', (error) => {
      reject(error)
    })
  })
})

// Gateway control
ipcMain.handle('gateway-start', async () => {
  try {
    const { stdout } = await execAsync('openclaw gateway start', { timeout: 10000 })
    return { success: true, output: stdout }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('gateway-stop', async () => {
  try {
    const { stdout } = await execAsync('openclaw gateway stop', { timeout: 10000 })
    return { success: true, output: stdout }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('gateway-restart', async () => {
  try {
    const { stdout } = await execAsync('openclaw gateway restart', { timeout: 10000 })
    return { success: true, output: stdout }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('gateway-status', async () => {
  // Check cache first
  const cached = getCachedData<any>('gatewayStatus')
  if (cached) return cached

  try {
    console.log('Checking gateway status...')
    const output = await execOpenClaw(['status'])
    // Check if gateway service is running
    const running = output.includes('running') && output.includes('Gateway service')
    console.log('Gateway status:', running ? 'running' : 'stopped')
    const result = { running, output }
    setCachedData('gatewayStatus', result)
    return result
  } catch (error: any) {
    console.log('Gateway status check error:', error.message)
    const result = { running: false, output: '' }
    setCachedData('gatewayStatus', result)
    return result
  }
})

// Get current model from OpenClaw status
ipcMain.handle('get-current-model', async () => {
  // Check cache first
  const cached = getCachedData<any>('currentModel')
  if (cached) return cached

  try {
    console.log('Getting current model...')
    const output = await execOpenClaw(['status'])
    
    // Method 1: Parse from Overview section
    const overviewMatch = output.match(/Sessions\s*│[^│]*default\s+([^\s(]+)/)
    if (overviewMatch && overviewMatch[1]) {
      console.log('Model from overview:', overviewMatch[1])
      const result = { success: true, model: overviewMatch[1] }
      setCachedData('currentModel', result)
      return result
    }
    
    // Method 2: Parse from Sessions table
    const tableMatch = output.match(/agent:main:main[^│]*│[^│]*│[^│]*│\s*([^\s│]+)/)
    if (tableMatch && tableMatch[1]) {
      console.log('Model from table:', tableMatch[1])
      const result = { success: true, model: tableMatch[1] }
      setCachedData('currentModel', result)
      return result
    }
    
    console.log('Could not parse model from openclaw status')
    const result = { success: false, model: null }
    setCachedData('currentModel', result)
    return result
  } catch (error: any) {
    console.log('Get model error:', error.message)
    const result = { success: false, model: null }
    setCachedData('currentModel', result)
    return result
  }
})

// Configuration management - OpenClaw uses its own config system
ipcMain.handle('save-config', async (event, config) => {
  try {
    // OpenClaw config is managed through CLI commands
    // For now, we'll save to a local JSON file for reference
    const configPath = path.join(app.getPath('userData'), 'openclaw-config.json')
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('load-config', async () => {
  try {
    const configPath = path.join(app.getPath('userData'), 'openclaw-config.json')
    const content = await fs.readFile(configPath, 'utf-8')
    const config = JSON.parse(content)
    return { success: true, config }
  } catch (error) {
    return { success: true, config: {} }
  }
})

// Get logs
ipcMain.handle('get-logs', async () => {
  try {
    const { stdout } = await execAsync('openclaw logs --tail 100', { timeout: 5000 })
    return { success: true, logs: stdout }
  } catch (error: any) {
    return { success: false, logs: error.message }
  }
})
