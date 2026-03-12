<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">{{ t('configurationTitle') }}</h1>

    <div class="space-y-6">
      <!-- Basic Configuration -->
      <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 class="text-xl font-semibold mb-6">{{ t('basicSettings') }}</h2>
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

      <!-- Model Management -->
      <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 class="text-xl font-semibold mb-6">Model Management</h2>

        <!-- Add New Model -->
        <div class="mb-6 p-4 bg-white dark:bg-primary-dark rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="flex gap-3 mb-3">
            <input
              v-model="newModel.name"
              type="text"
              placeholder="Model name (e.g., claude-3-opus-20240229)"
              class="flex-1 px-4 py-2 bg-white dark:bg-[#0f1419] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
            />
            <button
              @click="addModel"
              :disabled="!newModel.name.trim()"
              class="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              Add Model
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Enter the model ID to add it to your saved models</p>
        </div>

        <!-- Models List -->
        <div class="space-y-2">
          <div v-if="models.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No models saved yet. Add one above to get started.</p>
          </div>

          <div
            v-for="(model, index) in models"
            :key="index"
            class="flex items-center justify-between p-4 bg-white dark:bg-[#0f1419] rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
          >
            <div class="flex-1">
              <p class="font-medium text-sm">{{ model.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Added: {{ formatDate(model.addedAt) }}</p>
            </div>

            <div class="flex gap-2">
              <button
                @click="setDefaultModel(model.name)"
                :class="[
                  'px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200',
                  config.ANTHROPIC_DEFAULT_MODEL === model.name
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                ]"
              >
                {{ config.ANTHROPIC_DEFAULT_MODEL === model.name ? 'Active' : 'Set as Default' }}
              </button>

              <button
                @click="deleteModel(index)"
                class="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg font-medium text-sm transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
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

interface Model {
  name: string
  addedAt: number
}

interface Config {
  ANTHROPIC_AUTH_TOKEN: string
  ANTHROPIC_BASE_URL: string
  ANTHROPIC_DEFAULT_MODEL: string
  MODELS?: Model[]
}

const config = ref<Config>({
  ANTHROPIC_AUTH_TOKEN: '',
  ANTHROPIC_BASE_URL: 'https://api.anthropic.com',
  ANTHROPIC_DEFAULT_MODEL: 'claude-3-opus-20240229',
  MODELS: []
})

const models = ref<Model[]>([])
const newModel = ref({ name: '' })
const saving = ref(false)
const saveSuccess = ref(false)
const saveError = ref(false)

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

const loadConfiguration = async () => {
  try {
    const result = await window.electronAPI.loadConfig()
    if (result.success && result.config) {
      config.value = {
        ANTHROPIC_AUTH_TOKEN: result.config.ANTHROPIC_AUTH_TOKEN || '',
        ANTHROPIC_BASE_URL: result.config.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
        ANTHROPIC_DEFAULT_MODEL: result.config.ANTHROPIC_DEFAULT_MODEL || 'claude-3-opus-20240229',
        MODELS: []
      }
      
      // Parse MODELS from JSON string
      if (result.config.MODELS) {
        try {
          models.value = typeof result.config.MODELS === 'string' 
            ? JSON.parse(result.config.MODELS) 
            : result.config.MODELS
        } catch (e) {
          models.value = []
        }
      }
    }
  } catch (error) {
    console.error('Failed to load config:', error)
  }
}

const addModel = () => {
  if (!newModel.value.name.trim()) return

  const modelExists = models.value.some(m => m.name === newModel.value.name)
  if (modelExists) {
    alert('This model is already in your list')
    return
  }

  models.value.push({
    name: newModel.value.name.trim(),
    addedAt: Date.now()
  })

  newModel.value.name = ''
  saveModels()
}

const deleteModel = (index: number) => {
  const deletedModel = models.value[index]
  models.value.splice(index, 1)

  // If deleted model was default, set first model as default
  if (config.value.ANTHROPIC_DEFAULT_MODEL === deletedModel.name && models.value.length > 0) {
    config.value.ANTHROPIC_DEFAULT_MODEL = models.value[0].name
  }

  saveModels()
}

const setDefaultModel = (modelName: string) => {
  config.value.ANTHROPIC_DEFAULT_MODEL = modelName
  saveModels()
}

const saveModels = async () => {
  try {
    const configToSave = {
      ANTHROPIC_AUTH_TOKEN: config.value.ANTHROPIC_AUTH_TOKEN,
      ANTHROPIC_BASE_URL: config.value.ANTHROPIC_BASE_URL,
      ANTHROPIC_DEFAULT_MODEL: config.value.ANTHROPIC_DEFAULT_MODEL,
      MODELS: JSON.stringify(models.value)
    }
    const result = await window.electronAPI.saveConfig(configToSave)
    if (result.success) {
      saveSuccess.value = true
      setTimeout(() => {
        saveSuccess.value = false
      }, 3000)
    }
  } catch (error) {
    console.error('Failed to save models:', error)
  }
}

const saveConfiguration = async () => {
  saving.value = true
  saveSuccess.value = false
  saveError.value = false

  try {
    const configToSave = {
      ANTHROPIC_AUTH_TOKEN: config.value.ANTHROPIC_AUTH_TOKEN,
      ANTHROPIC_BASE_URL: config.value.ANTHROPIC_BASE_URL,
      ANTHROPIC_DEFAULT_MODEL: config.value.ANTHROPIC_DEFAULT_MODEL,
      MODELS: JSON.stringify(models.value)
    }
    const result = await window.electronAPI.saveConfig(configToSave)
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
