<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Logs</h1>

    <div class="max-w-4xl">
      <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">OpenClaw Logs</h3>
          <div class="flex gap-2">
            <button
              @click="refreshLogs"
              :disabled="loading"
              class="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
            <button
              @click="clearLogs"
              class="px-4 py-2 bg-primary-light dark:bg-primary-dark hover:bg-white dark:hover:bg-[#1a1f28] border border-gray-300 dark:border-gray-700 rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Auto-scroll toggle -->
        <div class="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="autoScroll"
            v-model="autoScroll"
            class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
          />
          <label for="autoScroll" class="text-sm text-gray-600 dark:text-gray-400">
            Auto-scroll to bottom
          </label>
        </div>

        <!-- Log Viewer -->
        <div 
          ref="logContainer"
          class="bg-black rounded-lg p-4 font-mono text-xs text-green-400 h-[600px] overflow-auto"
        >
          <div v-if="logs.length === 0" class="text-gray-500">
            No logs available. Click "Refresh" to load logs.
          </div>
          <div v-for="(line, index) in logs" :key="index" class="leading-relaxed">
            {{ line }}
          </div>
        </div>

        <!-- Log Stats -->
        <div class="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{{ logs.length }} lines</span>
          <span v-if="lastRefresh">Last updated: {{ lastRefresh }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

const logs = ref<string[]>([])
const loading = ref(false)
const autoScroll = ref(true)
const lastRefresh = ref('')
const logContainer = ref<HTMLElement | null>(null)
let refreshInterval: number | null = null

const scrollToBottom = () => {
  if (autoScroll.value && logContainer.value) {
    nextTick(() => {
      if (logContainer.value) {
        logContainer.value.scrollTop = logContainer.value.scrollHeight
      }
    })
  }
}

const refreshLogs = async () => {
  loading.value = true
  
  try {
    const result = await window.electronAPI.getLogs()
    if (result.success) {
      logs.value = result.logs.split('\n').filter((line: string) => line.trim())
      lastRefresh.value = new Date().toLocaleTimeString()
      scrollToBottom()
    }
  } catch (error) {
    console.error('Failed to load logs:', error)
  } finally {
    loading.value = false
  }
}

const clearLogs = () => {
  logs.value = []
  lastRefresh.value = ''
}

watch(logs, () => {
  scrollToBottom()
})

onMounted(() => {
  refreshLogs()
  // Auto-refresh every 5 seconds
  refreshInterval = window.setInterval(refreshLogs, 5000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
