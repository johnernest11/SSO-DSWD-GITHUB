<script setup lang="ts">
import Button from 'primevue/button'
import AnimatedFloaters from '@/components/misc/AnimatedFloaters.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const handleNavigateToHome = async () => {
  await router.replace({ name: 'dashboard' })
}
</script>
<template>
  <div
    class="flex h-[100vh] w-[100vw] flex-col items-center justify-start bg-gradient-to-b from-primary-500 to-primary-900 pt-16 md:justify-center md:pt-0"
  >
    <AnimatedFloaters />
    <h1 class="font-menu text-[7rem] font-bold text-surface-200">404</h1>
    <p class="text-surface-200">Sorry, the page you're looking for does not exists.</p>
    <Button @click="handleNavigateToHome" size="large" icon="pi pi-home" label="Go to Homepage" class="mt-6"></Button>
  </div>
</template>
