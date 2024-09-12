import { ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings.store.ts'

const selectedTheme = ref<AvailableTheme | null>(null)

/**
 *  @description Change the current theme of the web-app
 */
export const useThemeConfig = () => {
  selectedTheme.value = getThemeFromAppSettings()

  const applyTheme = () => {
    // Handle light theme (also the default theme)
    if (!selectedTheme.value || selectedTheme.value.value === 'light') {
      document.body.classList.add('theme-light')
      return document.body.classList.remove('dark')
    }

    // Handle dark theme
    document.body.classList.add('dark')
    document.body.classList.remove('theme-light')
  }

  watch(
    () => selectedTheme.value,
    () => {
      applyTheme()
    }
  )

  return { selectedTheme, applyTheme }
}

const getThemeFromAppSettings = () => {
  const settingsStore = useSettingsStore()
  if (!settingsStore.appSettings) return null

  for (const setting of settingsStore.appSettings) {
    if (setting.name === 'theme') {
      return setting as AvailableTheme
    }
  }

  return null
}

/** Typings */
export type AvailableTheme = {
  value: 'light' | 'dark'
  name: 'Light' | 'Dark'
}
