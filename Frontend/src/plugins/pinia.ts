import { vueApp } from '@/app.ts'
import { createPinia } from 'pinia'

const pinia = createPinia()
vueApp.use(pinia)
