<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">{{ t('dashboard') }}</h1>

    <!-- Loading Overlay -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500 dark:text-gray-400">{{ t('checking') }}</p>
      </div>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- OpenClaw Status Card -->
        <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('openclawStatus') }}</h3>
            <span v-html="icons.package" class="w-6 h-6 text-primary"></span>
          </div>
          <div class="space-y-2">
            <p class="text-2xl font-bold" :class="openClawStatus.installed ? 'text-green-500' : 'text-gray-400'">
              {{ openClawStatus.installed ? t('installed') : t('notInstalled') }}
            </p>
            <p v-if="openClawStatus.version" class="text-sm text-gray-500 dark:text-gray-400">
              {{ openClawStatus.version }}
            </p>
          </div>
        </div>

        <!-- Node Version Card -->
        <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('nodeVersion') }}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="nodeVersion.installed ? 'text-green-500' : 'text-gray-400'"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          </div>
          <div class="space-y-2">
            <p class="text-2xl font-bold" :class="nodeVersion.installed ? 'text-green-500' : 'text-gray-400'">
              {{ nodeVersion.version || 'N/A' }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('runtime') }}</p>
          </div>
        </div>

        <!-- Git Version Card -->
        <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('gitVersion') }}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="gitVersion.installed ? 'text-orange-500' : 'text-gray-400'"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </div>
          <div class="space-y-2">
            <p class="text-2xl font-bold" :class="gitVersion.installed ? 'text-orange-500' : 'text-gray-400'">
              {{ gitVersion.version || 'N/A' }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('versionControl') }}</p>
          </div>
        </div>

        <!-- Gateway Status Card -->
        <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('gatewayStatus') }}</h3>
            <span v-html="icons.rocket" class="w-6 h-6 text-primary"></span>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <div 
                class="w-3 h-3 rounded-full"
                :class="gatewayRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"
              ></div>
              <p class="text-2xl font-bold" :class="gatewayRunning ? 'text-green-500' : 'text-gray-400'">
                {{ gatewayRunning ? t('running') : t('stopped') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Model Card - Full Width -->
      <div class="mt-6 bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <div>
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ t('currentModel') }}</h3>
              <p class="text-2xl font-bold text-primary dark:text-white">
                {{ currentModel || t('notSet') }}
              </p>
            </div>
          </div>
          <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
            {{ t('active') }}
          </span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8">
        <h2 class="text-xl font-bold mb-4">{{ t('quickActions') }}</h2>
        <div class="flex gap-4">
          <button
            @click="refreshStatus"
            :disabled="loading"
            class="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm flex items-center gap-2"
          >
            <span v-html="icons.refresh" class="w-4 h-4" :class="{ 'animate-spin': loading }"></span>
            {{ t('refreshStatus') }}
          </button>
          <router-link
            to="/gateway"
            class="px-6 py-3 bg-primary-light dark:bg-[#1a1f28] hover:bg-white dark:hover:bg-primary-dark text-gray-900 dark:text-white rounded-lg font-medium transition-colors duration-200 border border-gray-200 dark:border-gray-800 flex items-center gap-2"
          >
            <span v-html="icons.rocket" class="w-4 h-4"></span>
            {{ t('manageGateway') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { icons } from '../utils/icons'

const { t } = useI18n()

const loading = ref(true)
const openClawStatus = ref<{ installed: boolean; version: string | null }>({ installed: false, version: null })
const nodeVersion = ref<{ installed: boolean; version: string | null }>({ installed: false, version: null })
const gitVersion = ref<{ installed: boolean; version: string | null }>({ installed: false, version: null })
const gatewayRunning = ref(false)
const currentModel = ref('claude-3-opus')

const checkStatus = async () => {
  loading.value = true
  try {
    // Run checks in parallel for faster loading
    const results = await Promise.allSettled([
      window.electronAPI.checkOpenClawInstalled(),
      window.electronAPI.checkNodeVersion(),
      window.electronAPI.checkGitVersion(),
      window.electronAPI.gatewayStatus(),
      window.electronAPI.getCurrentModel()
    ])
    
    // Handle OpenClaw status
    if (results[0].status === 'fulfilled') {
      openClawStatus.value = results[0].value
    }
    
    // Handle Node version
    if (results[1].status === 'fulfilled') {
      nodeVersion.value = results[1].value
    }
    
    // Handle Git version
    if (results[2].status === 'fulfilled') {
      gitVersion.value = results[2].value
    }
    
    // Handle Gateway status
    if (results[3].status === 'fulfilled') {
      gatewayRunning.value = results[3].value.running
      console.log('Gateway status:', results[3].value)
    }
    
    // Handle Model
    if (results[4].status === 'fulfilled' && results[4].value.success && results[4].value.model) {
      currentModel.value = results[4].value.model
      console.log('Current model:', results[4].value.model)
    }
  } catch (error) {
    console.error('Failed to check status:', error)
  } finally {
    loading.value = false
  }
}

const refreshStatus = () => {
  checkStatus()
}

onMounted(() => {
  checkStatus()
})
</script>
