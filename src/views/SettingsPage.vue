<script setup lang="ts">
import ThemeConfigCard from '@/components/settings-page/ThemeConfigCard.vue'
import MfaConfigCard from '@/components/settings-page/MfaConfigCard.vue'
import { useSettingsStore } from '@/stores/settings.store.ts'

const settingsStore = useSettingsStore()
</script>

<template>
  <div class="mx-auto h-[100%] w-full">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <MfaConfigCard v-if="settingsStore.mfaIsConfigurable" />
      <ThemeConfigCard />
    </div>
  </div>
</template>
