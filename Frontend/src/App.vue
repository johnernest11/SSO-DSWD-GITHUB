<script setup lang="ts">
import AppDesktopToolbar from '@/components/layout/app-toolbar/AppDesktopToolbar.vue'
import AppDesktopSidebar from '@/components/layout/app-sidebar/AppDesktopSidebar.vue'
import { useGlobalUiStore } from '@/stores/ui.store.ts'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import { useProfileStore } from '@/stores/profile.store.ts'
import AppMobileToolbar from '@/components/layout/app-toolbar/AppMobileToolbar.vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useThemeConfig } from '@/composables/theme.ts'
import { useSettingsStore } from '@/stores/settings.store.ts'
import AppConfirmDialog from '@/components/layout/AppConfirmDialog.vue'
import { sleep } from '@/utils/helpers.ts'
import AppFullScreenLoader from '@/components/layout/AppFullScreenLoader.vue'

const uiStore = useGlobalUiStore()
const authStore = useAuthStore()
const profileStore = useProfileStore()
const route = useRoute()

onBeforeMount(async () => {
  // Rehydrate profile info on reload if there is an authenticated user
  if (authStore.isAuthenticated) {
    await profileStore.fetchProfile()
  }
})

/** Observe when the token expires, go to login page with `from` (page) query */
const router = useRouter()
watch(
  () => authStore.authExpired,
  async (tokenIsExpired) => {
    if (tokenIsExpired) {
      await router.replace({
        name: 'login',
        query: { from: route.name as string },
      })
    }
  }
)

/** Handle for Rate Limit */
const toast = useToast()
watch(
  () => uiStore.showRateLimitToast,
  () => {
    toast.add({
      severity: 'error',
      summary: 'Too Many Requests',
      detail: 'Please wait for a few moments before trying again.',
      life: 5000,
    })
  }
)

/** Handle Theme */
const { applyTheme } = useThemeConfig()
const settingsStore = useSettingsStore()
const showFullScreenLoader = ref(false)
onBeforeMount(async () => {
  showFullScreenLoader.value = true
  await sleep(0.5)
  await settingsStore.fetchSettings()
  showFullScreenLoader.value = false
})

onMounted(() => {
  applyTheme()
})
</script>

<template>
  <div id="app-container" class="flex min-h-screen bg-surface-0 font-content dark:bg-surface-950">
    <AppFullScreenLoader :is-open="showFullScreenLoader" />
    <!-- Start Sidebar -->
    <AppDesktopSidebar
      v-if="!route.meta.hideNavigation"
      :class="`${
        !uiStore.sidebarMinimized ? 'w-[17%]' : 'w-[0%] -translate-x-96 transform'
      } hidden overflow-hidden transition-all duration-200 lg:flex`"
    ></AppDesktopSidebar>
    <!-- End Sidebar -->
    <div class="flex flex-1 flex-col">
      <AppDesktopToolbar v-if="!route.meta.hideNavigation" class="hidden lg:flex" />
      <AppMobileToolbar v-if="!route.meta.hideNavigation" class="lg:hidden" />
      <!-- Start Main Content -->
      <div :class="`${route.meta.hideNavigation ? '' : 'mx-4 mt-4 lg:mt-0'} flex-1`">
        <Toast position="top-right" />
        <AppConfirmDialog />
        <RouterView v-slot="{ Component }">
          <transition
            enter-active-class="transition duration-500"
            enter-from-class="translate-x-[20%] opacity-0"
            leave-to-class="opacity-0"
          >
            <component :is="Component" />
          </transition>
        </RouterView>
      </div>
      <!-- End Main Content -->
    </div>
  </div>
</template>
