// Dynamically import all modules under the plugins dir for the side effects
import.meta.glob('@/plugins/*.ts', { eager: true })

// Register routes to the vueApp
import '@/router/index.ts'

// Import custom styles
import '@/assets/css/main.css'

// Finally import the Vue instance that the above imports used
import { vueApp } from '@/app.ts'

vueApp.mount('#app')
