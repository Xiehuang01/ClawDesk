animport { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Pages
import Dashboard from './pages/Dashboard.vue'
import Installation from './pages/Installation.vue'
import Configuration from './pages/Configuration.vue'
import Gateway from './pages/Gateway.vue'
import Logs from './pages/Logs.vue'
import Settings from './pages/Settings.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/install', component: Installation },
  { path: '/config', component: Configuration },
  { path: '/gateway', component: Gateway },
  { path: '/logs', component: Logs },
  { path: '/settings', component: Settings }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
