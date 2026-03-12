const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // System checks
  checkOpenClawInstalled: () => ipcRenderer.invoke('check-openclaw-installed'),
  checkNodeVersion: () => ipcRenderer.invoke('check-node-version'),
  checkGitVersion: () => ipcRenderer.invoke('check-git-version'),
  
  // Installation
  installNode: () => ipcRenderer.invoke('install-node'),
  installGit: () => ipcRenderer.invoke('install-git'),
  installOpenClaw: () => ipcRenderer.invoke('install-openclaw'),
  onInstallOutput: (callback) => {
    ipcRenderer.on('install-output', (_, data) => callback(data))
  },
  
  // Gateway control
  gatewayStart: () => ipcRenderer.invoke('gateway-start'),
  gatewayStop: () => ipcRenderer.invoke('gateway-stop'),
  gatewayRestart: () => ipcRenderer.invoke('gateway-restart'),
  gatewayStatus: () => ipcRenderer.invoke('gateway-status'),
  getCurrentModel: () => ipcRenderer.invoke('get-current-model'),
  
  // Configuration
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  
  // Logs
  getLogs: () => ipcRenderer.invoke('get-logs')
})
