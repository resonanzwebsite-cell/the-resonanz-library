import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useLibraryStore } from './stores/library'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

useAuthStore(pinia).init()
useLibraryStore(pinia).start()

app.use(router)

app.mount('#app')