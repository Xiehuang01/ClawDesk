<template>
  <div :class="{ 'dark': isDarkMode }" class="h-screen w-screen overflow-hidden">
    <div class="flex h-full bg-white dark:bg-primary-dark text-gray-900 dark:text-white transition-colors duration-300">
      <!-- Sidebar -->
      <aside class="w-64 bg-primary-light dark:bg-[#1a1f28] border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <!-- Logo with drag area -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-800" style="-webkit-app-region: drag">
          <h1 class="text-xl font-bold text-primary dark:text-white">{{ t('appName') }}</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('appSubtitle') }}</p>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white dark:hover:bg-primary-dark"
            active-class="bg-white dark:bg-primary-dark shadow-sm"
          >
            <span v-html="item.icon" class="w-5 h-5 flex-shrink-0"></span>
            <span class="font-medium">{{ t(item.labelKey) }}</span>
          </router-link>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-800">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            <p>{{ t('version') }} 1.0.0</p>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from './composables/useI18n'
import { icons } from './utils/icons'
import type { TranslationKey } from './utils/i18n'

const isDarkMode = ref(true)
const { t, initLanguage } = useI18n()

const navItems = [
  { path: '/', labelKey: 'dashboard' as TranslationKey, icon: icons.dashboard },
  { path: '/install', labelKey: 'installation' as TranslationKey, icon: icons.package },
  { path: '/config', labelKey: 'configuration' as TranslationKey, icon: icons.settings },
  { path: '/gateway', labelKey: 'gateway' as TranslationKey, icon: icons.rocket },
  { path: '/logs', labelKey: 'logs' as TranslationKey, icon: icons.logs },
  { path: '/settings', labelKey: 'settings' as TranslationKey, icon: icons.tool }
]

const updateTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light') {
    isDarkMode.value = false
  } else if (savedTheme === 'dark') {
    isDarkMode.value = true
  } else {
    // System theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDarkMode.value = prefersDark
  }
}

onMounted(() => {
  initLanguage()
  updateTheme()
  
  // Listen for theme changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      updateTheme()
    }
  })
  
  // Also check periodically in case settings page changed it
  setInterval(updateTheme, 500)
})
</script>
