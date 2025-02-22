<script setup lang="ts">
import Card from 'primevue/card'
import { useAuthStore } from '@/stores/auth.store.ts'
import { onBeforeMount, ref } from 'vue'
import WbAvatarFileInput from '@/components/webkit/WbAvatarFileInput.vue'
import UpdateProfileForm from '@/components/profile-page/UpdateProfileForm.vue'
import { useProfileStore } from '@/stores/profile.store.ts'
import ChangePasswordForm from '@/components/profile-page/ChangePasswordForm.vue'

const authStore = useAuthStore()

/** Tab Menu Items */
const profileInfoShown = ref(true)
const profileStore = useProfileStore()

onBeforeMount(async () => {
  await profileStore.fetchProfile()
})
</script>

<template>
  <div class="mx-auto flex h-[100%] w-full flex-col">
    <Card>
      <template #header>
        <div class="h-2 w-full rounded-t-lg bg-primary-500"></div>
      </template>
      <template #content>
        <div class="flex flex-col px-4">
          <div class="flex flex-col items-center md:flex-row">
            <template v-if="authStore.isAuthenticated">
              <WbAvatarFileInput />
            </template>
            <div class="mt-8 flex flex-col text-center text-lg md:ml-8 md:mt-0 md:text-left lg:text-2xl">
              <span class="font-bold">{{ authStore.authFullName }}</span>
              <span class="text-xs sm:text-sm">{{ authStore.authFullAddress }}</span>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <!-- Start Tab Buttons -->
        <div class="flex justify-center gap-x-1 text-sm md:justify-end">
          <button
            :class="`rounded-lg px-2 py-1 transition hover:scale-105 hover:bg-surface-200 dark:hover:bg-primary-500 dark:hover:text-surface-950 md:mr-6 ${
              profileInfoShown ? 'bg-surface-200 dark:bg-primary-500 dark:text-surface-950' : ''
            }`"
            @click="profileInfoShown = true"
          >
            Profile Details
          </button>
          <button
            :class="`rounded-lg px-2 py-1 transition hover:scale-105 hover:bg-surface-200 dark:hover:bg-primary-500 dark:hover:text-surface-950 md:mr-6 ${
              !profileInfoShown ? 'bg-surface-200 dark:bg-primary-500 dark:text-surface-950' : ''
            }`"
            @click="profileInfoShown = false"
          >
            Change Password
          </button>
        </div>
        <!-- End Tab Buttons -->
      </template>
    </Card>
    <Card class="mt-4">
      <template #content>
        <transition
          enter-active-class="transition duration-500"
          enter-from-class="translate-y-[20%] opacity-0"
          leave-to-class="opacity-0"
        >
          <UpdateProfileForm v-if="profileInfoShown" />
          <ChangePasswordForm v-else />
        </transition>
      </template>
    </Card>
  </div>
</template>
