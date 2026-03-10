<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Gateway Control</h1>

    <div class="space-y-6">
      <!-- Status Card -->
      <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Gateway Status</h3>
          <span class="text-3xl">🚀</span>
        </div>
        
        <div class="flex items-center gap-3">
          <div 
            class="w-4 h-4 rounded-full transition-all"
            :class="isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"
          ></div>
          <p class="text-xl font-medium" :class="isRunning ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'">
            {{ isRunning ? 'Running' : 'Stopped' }}
          </p>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="grid grid-cols-3 gap-4">
        <button
          @click="startGateway"
          :disabled="isRunning || loading"
          class="px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors duration-200 shadow-sm flex flex-col items-center gap-2"
        >
          <span v-html="icons.play" class="w-6 h-6"></span>
          Start
        </button>

        <button
          @click="stopGateway"
          :disabled="!isRunning || loading"
          class="px-6 py-4 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors duration-200 shadow-sm flex flex-col items-center gap-2"
        >
          <span v-html="icons.stop" class="w-6 h-6"></span>
          Stop
        </button>

        <button
          @click="restartGateway"
          :disabled="loading"
          class="px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors duration-200 shadow-sm flex flex-col items-center gap-2"
        >
          <span v-html="icons.rotate" class="w-6 h-6"></span>
          Restart
        </button>
      </div>

      <!-- Output Console -->
      <div class="bg-primary-light dark:bg-[#1a1f28] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Console Output</h3>
          <button
            @click="clearOutput"
            class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear
          </button>
        </div>
        
        <div class="bg-black rounded-lg p-4 font-mono text-xs text-green-400 h-64 overflow-auto">
          <div v-if="output.length === 0" class="text-gray-500">
            No output yet. Start the gateway to see logs.
          </div>
          <div v-for="(line, index) in output" :key="index">{{ line }}</div>
        </div>
      </div>

      <!-- Refresh Status -->
      <button
        @click="checkStatus"
        class="w-full px-6 py-3 bg-primary-light dark:bg-primary-dark hover:bg-white dark:hover:bg-[#1a1f28] border border-gray-300 dark:border-gray-700 rounded-lg font-medium transition-colors duration-200"
      >
        Refresh Status
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { icons } from '../utils/icons'

const isRunning = ref(false)
const loading = ref(false)
const output = ref<string[]>([])
let statusInterval: number | null = null

const addOutput = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  output.value.push(`[${timestamp}] ${message}`)
}

const checkStatus = async () => {
  try {
    const result = await window.electronAPI.gatewayStatus()
    isRunning.value = result.running
  } catch (error) {
    isRunning.value = false
  }
}

const startGateway = async () => {
  loading.value = true
  addOutput('Starting gateway...')
  
  try {
    const result = await window.electronAPI.gatewayStart()
    if (result.success) {
      addOutput('Gateway started successfully')
      isRunning.value = true
    } else {
      addOutput(`Failed to start gateway: ${result.error}`)
    }
  } catch (error: any) {
    addOutput(`Error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const stopGateway = async () => {
  loading.value = true
  addOutput('Stopping gateway...')
  
  try {
    const result = await window.electronAPI.gatewayStop()
    if (result.success) {
      addOutput('Gateway stopped successfully')
      isRunning.value = false
    } else {
      addOutput(`Failed to stop gateway: ${result.error}`)
    }
  } catch (error: any) {
    addOutput(`Error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const restartGateway = async () => {
  loading.value = true
  addOutput('Restarting gateway...')
  
  try {
    const result = await window.electronAPI.gatewayRestart()
    if (result.success) {
      addOutput('Gateway restarted successfully')
      isRunning.value = true
    } else {
      addOutput(`Failed to restart gateway: ${result.error}`)
    }
  } catch (error: any) {
    addOutput(`Error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const clearOutput = () => {
  output.value = []
}

onMounted(() => {
  checkStatus()
  statusInterval = window.setInterval(checkStatus, 5000)
})

onUnmounted(() => {
  if (statusInterval) {
    clearInterval(statusInterval)
  }
})
</script>
