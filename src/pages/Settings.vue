<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">{{ t('settingsTitle') }}</h1>

    <div class="space-y-6">
      <!-- Appearance Settings -->
      <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 class="text-lg font-semibold mb-4">{{ t('appearance') }}</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ t('theme') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('themeHelp') }}</p>
            </div>
            <select
              v-model="settings.theme"
              @change="autoSave"
              class="px-4 py-2 bg-white dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="dark">{{ t('dark') }}</option>
              <option value="light">{{ t('light') }}</option>
              <option value="system">{{ t('system') }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Language Settings -->
      <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 class="text-lg font-semibold mb-4">{{ t('language') }}</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ t('language') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('languageHelp') }}</p>
            </div>
            <select
              v-model="settings.language"
              @change="autoSave"
              class="px-4 py-2 bg-white dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Application Settings -->
      <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 class="text-lg font-semibold mb-4">{{ t('application') }}</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ t('launchAtStartup') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('launchAtStartupHelp') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.launchAtStartup"
                @change="autoSave"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ t('autoStartGateway') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('autoStartGatewayHelp') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.autoStartGateway"
                @change="autoSave"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Model Settings -->
      <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 class="text-lg font-semibold mb-4">{{ t('defaultModel') }}</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('selectDefaultModel') }}</label>
            <select
              v-model="settings.defaultModel"
              @change="autoSave"
              class="w-full px-4 py-3 bg-white dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
              <option value="claude-2.1">Claude 2.1</option>
              <option value="claude-2.0">Claude 2.0</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Auto-save indicator -->
      <transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="saveSuccess" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p class="text-sm text-green-700 dark:text-green-400">✅ {{ t('settingsSaved') }}</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import type { Language } from '../utils/i18n'

const { t, setLanguage, initLanguage } = useI18n()

const settings = ref({
  theme: 'dark',
  language: 'en' as Language,
  launchAtStartup: false,
  autoStartGateway: false,
  defaultModel: 'claude-3-opus-20240229'
})

const saveSuccess = ref(false)
let saveTimeout: number | null = null

const loadSettings = () => {
  const savedSettings = localStorage.getItem('app-settings')
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings)
  }
  applyTheme()
  setLanguage(settings.value.language)
}

const applyTheme = () => {
  const html = document.documentElement
  if (settings.value.theme === 'dark') {
    html.classList.add('dark')
  } else if (settings.value.theme === 'light') {
    html.classList.remove('dark')
  } else {
    // System theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }
  localStorage.setItem('theme', settings.value.theme)
}

const autoSave = () => {
  // Save settings immediately
  localStorage.setItem('app-settings', JSON.stringify(settings.value))
  applyTheme()
  setLanguage(settings.value.language)
  
  // Show success message
  saveSuccess.value = true
  
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  
  // Hide success message after 2 seconds
  saveTimeout = setTimeout(() => {
    saveSuccess.value = false
  }, 2000)
}

onMounted(() => {
  initLanguage()
  loadSettings()
})
</script>
