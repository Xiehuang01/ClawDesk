export {}

declare global {
  interface Window {
    electronAPI: {
      checkOpenClawInstalled: () => Promise<{ installed: boolean; version: string | null }>
      checkNodeVersion: () => Promise<{ installed: boolean; version: string | null }>
      checkGitVersion: () => Promise<{ installed: boolean; version: string | null }>
      installNode: () => Promise<{ success: boolean; error?: string }>
      installGit: () => Promise<{ success: boolean; error?: string }>
      installOpenClaw: () => Promise<{ success: boolean; error?: string }>
      onInstallOutput: (callback: (data: string) => void) => void
      gatewayStart: () => Promise<{ success: boolean; output?: string; error?: string }>
      gatewayStop: () => Promise<{ success: boolean; output?: string; error?: string }>
      gatewayRestart: () => Promise<{ success: boolean; output?: string; error?: string }>
      gatewayStatus: () => Promise<{ running: boolean; output: string }>
      getCurrentModel: () => Promise<{ success: boolean; model: string | null }>
      saveConfig: (config: Record<string, string>) => Promise<{ success: boolean; error?: string }>
      loadConfig: () => Promise<{ success: boolean; config: Record<string, string> }>
      getLogs: () => Promise<{ success: boolean; logs: string }>
    }
  }
}
