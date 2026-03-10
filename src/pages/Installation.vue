<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">{{ t('installationTitle') }}</h1>

    <div class="space-y-6">
      <!-- Dependencies Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Node.js Status -->
        <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold">Node.js</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="nodeStatus.installed ? 'text-green-500' : 'text-gray-400'">
              <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 rounded-full" :class="nodeStatus.installed ? 'bg-green-500' : 'bg-gray-400'"></div>
            <p class="font-medium" :class="nodeStatus.installed ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'">
              {{ nodeStatus.installed ? t('installed') : t('notInstalled') }}
            </p>
          </div>
          <p v-if="nodeStatus.version" class="text-sm text-gray-500 dark:text-gray-400">{{ nodeStatus.version }}</p>
          <p v-else class="text-sm text-gray-500 dark:text-gray-400">{{ t('required') }}</p>
        </div>

        <!-- Git Status -->
        <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold">Git</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="gitStatus.installed ? 'text-orange-500' : 'text-gray-400'">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 rounded-full" :class="gitStatus.installed ? 'bg-orange-500' : 'bg-gray-400'"></div>
            <p class="font-medium" :class="gitStatus.installed ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'">
              {{ gitStatus.installed ? t('installed') : t('notInstalled') }}
            </p>
          </div>
          <p v-if="gitStatus.version" class="text-sm text-gray-500 dark:text-gray-400">{{ gitStatus.version }}</p>
          <p v-else class="text-sm text-gray-500 dark:text-gray-400">{{ t('required') }}</p>
        </div>

        <!-- OpenClaw Status -->
        <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold">OpenClaw</h3>
            <span v-html="icons.package" class="w-6 h-6" :class="openClawStatus.installed ? 'text-primary' : 'text-gray-400'"></span>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 rounded-full" :class="openClawStatus.installed ? 'bg-primary' : 'bg-gray-400'"></div>
            <p class="font-medium" :class="openClawStatus.installed ? 'text-primary' : 'text-gray-500 dark:text-gray-400'">
              {{ openClawStatus.installed ? t('installed') : t('notInstalled') }}
            </p>
          </div>
          <p v-if="openClawStatus.version" class="text-sm text-gray-500 dark:text-gray-400">{{ openClawStatus.version }}</p>
          <p v-else class="text-sm text-gray-500 dark:text-gray-400">{{ t('required') }}</p>
        </div>
      </div>

      <!-- Quick Deploy Button -->
      <div v-if="!allInstalled && !installing" class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold mb-2">{{ t('quickDeploy') }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('quickDeployDesc') }}</p>
          </div>
          <button
            @click="showDeployConfirm"
            class="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm flex items-center gap-2"
          >
            <span v-html="icons.rocket" class="w-5 h-5"></span>
            {{ t('startDeploy') }}
          </button>
        </div>
      </div>

      <!-- All Installed Success -->
      <div v-if="allInstalled && !installing" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
        <div class="flex items-center gap-3">
          <span v-html="icons.check" class="w-6 h-6 text-green-600 dark:text-green-400"></span>
          <div>
            <h3 class="text-lg font-semibold text-green-700 dark:text-green-400">{{ t('allInstalled') }}</h3>
            <p class="text-sm text-green-600 dark:text-green-500">{{ t('allInstalledDesc') }}</p>
          </div>
        </div>
      </div>

      <!-- Installation Progress -->
      <div v-if="installing" class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <h3 class="text-lg font-semibold">{{ currentStep }}</h3>
        </div>
        
        <!-- Progress Steps -->
        <div class="space-y-3 mb-4">
          <div v-for="step in installSteps" :key="step.name" class="flex items-center gap-3">
            <div v-if="step.status === 'completed'" class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <span v-html="icons.check" class="w-3 h-3 text-white"></span>
            </div>
            <div v-else-if="step.status === 'installing'" class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div v-else-if="step.status === 'failed'" class="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <span v-html="icons.x" class="w-3 h-3 text-white"></span>
            </div>
            <div v-else class="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <span class="text-sm" :class="step.status === 'completed' ? 'text-green-600 dark:text-green-400' : step.status === 'failed' ? 'text-red-600 dark:text-red-400' : ''">
              {{ step.label }}
            </span>
          </div>
        </div>

        <!-- Output Terminal -->
        <div class="bg-black rounded-lg p-4 font-mono text-xs text-green-400 h-64 overflow-auto" ref="terminalRef">
          <div v-for="(line, index) in outputLines" :key="index">{{ line }}</div>
        </div>
      </div>

      <!-- Installation Failed -->
      <div v-if="installFailed" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-2">
          <span v-html="icons.x" class="w-6 h-6 text-red-600 dark:text-red-400"></span>
          <h3 class="text-lg font-semibold text-red-700 dark:text-red-400">{{ t('installFailed') }}</h3>
        </div>
        <p class="text-sm text-red-600 dark:text-red-500 mb-4">{{ errorMessage }}</p>
        <button
          @click="resetInstallation"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          {{ t('tryAgain') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useI18n } from '../composables/useI18n'
import { icons } from '../utils/icons'

const { t } = useI18n()

const nodeStatus = ref<{ installed: boolean; version: string | null }>({ installed: false, version: '' })
const gitStatus = ref<{ installed: boolean; version: string | null }>({ installed: false, version: '' })
const openClawStatus = ref<{ installed: boolean; version: string | null }>({ installed: false, version: '' })

const installing = ref(false)
const installFailed = ref(false)
const errorMessage = ref('')
const outputLines = ref<string[]>([])
const currentStep = ref('')
const terminalRef = ref<HTMLElement | null>(null)

interface InstallStep {
  name: string
  label: string
  status: 'pending' | 'installing' | 'completed' | 'failed' | 'skipped'
}

const installSteps = ref<InstallStep[]>([
  { name: 'node', label: 'Node.js', status: 'pending' },
  { name: 'git', label: 'Git', status: 'pending' },
  { name: 'openclaw', label: 'OpenClaw', status: 'pending' }
])

const allInstalled = computed(() => {
  return nodeStatus.value.installed && gitStatus.value.installed && openClawStatus.value.installed
})

const addOutput = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  outputLines.value.push(`[${timestamp}] ${message}`)
  nextTick(() => {
    if (terminalRef.value) {
      terminalRef.value.scrollTop = terminalRef.value.scrollHeight
    }
  })
}

const checkAllStatus = async () => {
  try {
    // Check Node
    const nodeResult = await window.electronAPI.checkNodeVersion()
    nodeStatus.value = nodeResult

    // Check Git
    const gitResult = await window.electronAPI.checkGitVersion()
    gitStatus.value = gitResult

    // Check OpenClaw
    const openClawResult = await window.electronAPI.checkOpenClawInstalled()
    openClawStatus.value = openClawResult
  } catch (error) {
    console.error('Failed to check status:', error)
  }
}

const showDeployConfirm = () => {
  if (confirm(t('deployConfirm'))) {
    startQuickDeploy()
  }
}

const startQuickDeploy = async () => {
  installing.value = true
  installFailed.value = false
  outputLines.value = []
  
  addOutput('========================================')
  addOutput(t('deployStarted'))
  addOutput(t('doNotClose'))
  addOutput('========================================')

  try {
    // Step 1: Install Node.js if not installed
    if (!nodeStatus.value.installed) {
      installSteps.value[0].status = 'installing'
      currentStep.value = t('installingNode')
      addOutput('')
      addOutput(`>>> ${t('installingNode')}...`)
      
      try {
        const result = await window.electronAPI.installNode()
        if (result.success) {
          installSteps.value[0].status = 'completed'
          addOutput(`✓ ${t('nodeInstalled')}`)
          nodeStatus.value = await window.electronAPI.checkNodeVersion()
        } else {
          throw new Error(result.error || 'Node installation failed')
        }
      } catch (error: any) {
        installSteps.value[0].status = 'failed'
        throw error
      }
    } else {
      installSteps.value[0].status = 'skipped'
      addOutput(`✓ Node.js ${t('alreadyInstalled')} (${nodeStatus.value.version})`)
    }

    // Step 2: Install Git if not installed
    if (!gitStatus.value.installed) {
      installSteps.value[1].status = 'installing'
      currentStep.value = t('installingGit')
      addOutput('')
      addOutput(`>>> ${t('installingGit')}...`)
      
      try {
        const result = await window.electronAPI.installGit()
        if (result.success) {
          installSteps.value[1].status = 'completed'
          addOutput(`✓ ${t('gitInstalled')}`)
          gitStatus.value = await window.electronAPI.checkGitVersion()
        } else {
          throw new Error(result.error || 'Git installation failed')
        }
      } catch (error: any) {
        installSteps.value[1].status = 'failed'
        throw error
      }
    } else {
      installSteps.value[1].status = 'skipped'
      addOutput(`✓ Git ${t('alreadyInstalled')} (${gitStatus.value.version})`)
    }

    // Step 3: Install OpenClaw
    if (!openClawStatus.value.installed) {
      installSteps.value[2].status = 'installing'
      currentStep.value = t('installingOpenClaw')
      addOutput('')
      addOutput(`>>> ${t('installingOpenClaw')}...`)
      
      try {
        const result = await window.electronAPI.installOpenClaw()
        if (result.success) {
          installSteps.value[2].status = 'completed'
          addOutput(`✓ ${t('openClawInstalled')}`)
          openClawStatus.value = await window.electronAPI.checkOpenClawInstalled()
        } else {
          throw new Error(result.error || 'OpenClaw installation failed')
        }
      } catch (error: any) {
        installSteps.value[2].status = 'failed'
        throw error
      }
    } else {
      installSteps.value[2].status = 'skipped'
      addOutput(`✓ OpenClaw ${t('alreadyInstalled')} (${openClawStatus.value.version})`)
    }

    addOutput('')
    addOutput('========================================')
    addOutput(`✓ ${t('deployComplete')}`)
    addOutput('========================================')
    
    setTimeout(() => {
      installing.value = false
      checkAllStatus()
    }, 2000)

  } catch (error: any) {
    installFailed.value = true
    errorMessage.value = error.message || t('unknownError')
    addOutput('')
    addOutput(`✗ ${t('deployFailed')}: ${errorMessage.value}`)
    installing.value = false
  }
}

const resetInstallation = () => {
  installing.value = false
  installFailed.value = false
  errorMessage.value = ''
  outputLines.value = []
  installSteps.value.forEach(step => step.status = 'pending')
  checkAllStatus()
}

onMounted(() => {
  checkAllStatus()
})
</script>
