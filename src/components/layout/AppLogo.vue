<script setup lang="ts">
import { computed } from 'vue'

type AppLogoProps = {
  iconOnly?: boolean
  color?: 'primary' | 'light' | 'dark'
}
const props = withDefaults(defineProps<AppLogoProps>(), {
  iconOnly: false,
  color: 'primary',
})

const colorClasses = computed(() => {
  switch (props.color) {
    case 'primary':
      return { text: 'text-primary-500', ring: 'ring-primary-500' }
    case 'light':
      return { text: 'text-surface-0', ring: 'ring-surface-0' }
    case 'dark':
      return { text: 'text-surface-900', ring: 'ring-surface-800' }
    default:
      return { text: 'text-primary-500', ring: 'ring-primary-500' }
  }
})
</script>

<template>
  <div :class="`flex ${colorClasses.text}`">
    <i
      :class="`pi pi-prime mr-2 h-6 w-6 rounded-full p-1 ${colorClasses.ring} ${
        props.iconOnly ? 'mb-1.5 mr-0 h-12 w-12 p-0 text-[1.5em]' : 'ring-2'
      }`"
    ></i>
    <h1 v-if="!props.iconOnly" class="font-menu text-xl font-bold">WebkitPrime</h1>
  </div>
</template>
