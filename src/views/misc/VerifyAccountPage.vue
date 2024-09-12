<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import AppLogo from '@/components/layout/AppLogo.vue'
import AnimatedFloaters from '@/components/misc/AnimatedFloaters.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.ts'
import Tag from 'primevue/tag'
import { ref, onMounted } from 'vue'
import VerifyProfileSection from '@/components/verify-account-page/VerifyProfileSection.vue'
import InformationSection from '@/components/verify-account-page/InformationSection.vue'
import ChangePasswordSection from '@/components/verify-account-page/ChangePasswordSection.vue'
import { useToast } from 'primevue/usetoast'

/** Component States */
const activeStep = ref(0)

// We redirect to log-in first
const route = useRoute()
onMounted(async () => {
  if (authStore.isAuthenticated) return
  await router.push({
    name: 'login',
    query: {
      from: 'verify-account',
      id: route.params.id,
      hash: route.params.hash,
      signature: route.query.signature,
      expires: route.query.expires,
      email: route.query.email,
    },
  })
})

// Handle Logout
const router = useRouter()
const authStore = useAuthStore()
const isLoggingOut = ref(false)
const handleLogout = async () => {
  isLoggingOut.value = true
  await authStore.logout()
  isLoggingOut.value = false
  await router.replace({ name: 'login' })
}

const toast = useToast()
const handleCompleteVerification = async () => {
  toast.add({
    severity: 'success',
    summary: 'Account Verification',
    detail: "You've completed the verification process!",
    life: 5000,
  })

  await router.replace({ name: 'dashboard' })
}
</script>

<template>
  <div
    class="flex h-full justify-center bg-gradient-to-b from-primary-500 to-primary-900 ring-2 ring-red-100 dark:from-primary-900 dark:to-primary-950 lg:mx-0"
  >
    <div class="relative z-10 flex h-fit w-full justify-center pb-4">
      <!-- Start Header Icon -->
      <div
        class="absolute left-1/2 top-6 hidden h-28 w-28 -translate-x-1/2 transform items-center justify-center rounded-full bg-surface-0 ring-2 ring-primary-500 lg:flex"
      >
        <FontAwesomeIcon icon="fa-solid fa-user-astronaut" class="h-16 text-primary-500"></FontAwesomeIcon>
      </div>
      <!-- End Header Icon -->
      <Card class="mx-4 mt-4 w-[100%] ring-2 ring-primary-500 md:mx-4 md:mt-8 md:w-[80%] lg:mt-16 lg:w-[60%]">
        <template #content>
          <div class="mx-2 flex flex-col items-center transition-transform">
            <div class="mb-8 flex w-full items-center justify-between">
              <AppLogo />
              <Button
                label="Logout"
                text
                size="small"
                @click="handleLogout"
                :disabled="isLoggingOut"
                :loading="isLoggingOut"
                class="text-xs"
              >
                <template #icon><i class="pi pi-arrow-left mr-2 hidden md:block" /></template>
              </Button>
            </div>
            <div class="flex items-center self-start font-menu text-xl text-surface-800 dark:text-surface-200">
              Verify Your Account
              <Tag class="ml-3 h-fit">{{ activeStep + 1 + '/3' }}</Tag>
            </div>
            <InformationSection class="mt-2" v-if="activeStep === 0" @email-verified="activeStep++" />
            <VerifyProfileSection
              class="mt-4"
              v-if="activeStep === 1"
              @previous-button-clicked="activeStep--"
              @profile-verified="activeStep++"
            />
            <ChangePasswordSection
              class="mt-4"
              v-if="activeStep === 2"
              @previous-button-clicked="activeStep--"
              @password-changed="handleCompleteVerification"
            />
          </div>
        </template>
      </Card>
    </div>
    <AnimatedFloaters class="opacity-75" />
  </div>
</template>

<style scoped></style>
