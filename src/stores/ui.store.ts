import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalUiStore = defineStore('ui', () => {
  /** States */
  const sidebarMinimized = ref(false)
  const showRateLimitToast = ref<Date | null>(null)

  /** Actions */
  const toggleSidebar = (): boolean => {
    sidebarMinimized.value = !sidebarMinimized.value
    return sidebarMinimized.value
  }

  return {
    sidebarMinimized,
    toggleSidebar,
    showRateLimitToast,
  }
})
