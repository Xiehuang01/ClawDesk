<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">{{ t('configurationTitle') }}</h1>

    <div>
      <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <form @submit.prevent="saveConfiguration" class="space-y-6">
          <!-- API Key -->
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('apiKey') }}</label>
            <input
              v-model="config.ANTHROPIC_AUTH_TOKEN"
              type="password"
              :placeholder="t('apiKeyPlaceholder')"
              class="w-full px-4 py-3 bg-white dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('apiKeyHelp') }}</p>
          </div>

          <!-- Base URL -->
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('baseUrl') }}</label>
            <input
              v-model="config.ANTHROPIC_BASE_URL"
              type="text"
              :placeholder="t('baseUrlPlaceholder')"
              class="w-full px-4 py-3 bg-white dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('baseUrlHelp') }}</p>
          </div>

          <!-- Default Model -->
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('defaultModel') }}</label>
            <select
              v-model="config.ANTHROPIC_DEFAULT_MODEL"
              class="w-full px-4 py-3 bg-white dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
              <option value="claude-2.1">Claude 2.1</option>
              <option value="claude-2.0">Claude 2.0</option>
            </select>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('selectModel') }}</p>
          </div>

          <!-- Save Button -->
          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm"
            >
              {{ saving ? t('saving') : t('saveConfiguration') }}
            </button>
            <button
              type="button"
              @click="loadConfiguration"
              class="px-6 py-3 bg-primary-light dark:bg-primary-dark hover:bg-white dark:hover:bg-[#1a1f28] border border-gray-300 dark:border-gray-700 rounded-lg font-medium transition-colors duration-200"
            >
              {{ t('reset') }}
            </button>
          </div>
        </form>

        <!-- Success Message -->
        <div v-if="saveSuccess" class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p class="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
            <span v-html="icons.check" class="w-4 h-4"></span>
            {{ t('configSaved') }}
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="saveError" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
            <span v-html="icons.x" class="w-4 h-4"></span>
            {{ t('configFailed') }}
          </p>
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

const config = ref({
  ANTHROPIC_AUTH_TOKEN: '',
  ANTHROPIC_BASE_URL: 'https://api.anthropic.com',
  ANTHROPIC_DEFAULT_MODEL: 'claude-3-opus-20240229'
})

const saving = ref(false)
const saveSuccess = ref(false)
const saveError = ref(false)

const loadConfiguration = async () => {
  try {
    const result = await window.electronAPI.loadConfig()
    if (result.success && result.config) {
      config.value = {
        ANTHROPIC_AUTH_TOKEN: result.config.ANTHROPIC_AUTH_TOKEN || '',
        ANTHROPIC_BASE_URL: result.config.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
        ANTHROPIC_DEFAULT_MODEL: result.config.ANTHROPIC_DEFAULT_MODEL || 'claude-3-opus-20240229'
      }
    }
  } catch (error) {
    console.error('Failed to load config:', error)
  }
}

const saveConfiguration = async () => {
  saving.value = true
  saveSuccess.value = false
  saveError.value = false

  try {
    const result = await window.electronAPI.saveConfig(config.value)
    if (result.success) {
      saveSuccess.value = true
      setTimeout(() => {
        saveSuccess.value = false
      }, 3000)
    } else {
      saveError.value = true
    }
  } catch (error) {
    saveError.value = true
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadConfiguration()
})
</script>
