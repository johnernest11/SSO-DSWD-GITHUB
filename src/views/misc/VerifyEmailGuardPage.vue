<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useAuthStore } from '@/stores/auth.store.ts'
import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useRouter } from 'vue-router'
import AnimatedFloaters from '@/components/misc/AnimatedFloaters.vue'
import AppLogo from '@/components/layout/AppLogo.vue'
import { useBroadcastChannel } from '@vueuse/core'
import { BroadcastChannelName } from '@/typings/broadcasts.types.ts'
import { useProfileStore } from '@/stores/profile.store.ts'

const authStore = useAuthStore()
const authEmail = authStore.authenticatedUser.email

// Prevent the user from submitting too many emails
const resendEmailButtonIsLocked = ref(false)
const resendEmailButtonTimer = ref(60)
let resendEmailButtonTimerId: NodeJS.Timeout | undefined = undefined

const resetResendEmailButtonLock = () => {
  clearInterval(resendEmailButtonTimerId)
  resendEmailButtonIsLocked.value = false
  resendEmailButtonTimer.value = 60
}

// Handle Form Submission
const formIsLoading = ref(false)
const toast = useToast()
const handleResendEmailVerification = async () => {
  if (resendEmailButtonIsLocked.value) return

  formIsLoading.value = true
  const response = await authStore.resendEmailVerification()
  formIsLoading.value = false

  // If it's a validation error, then the email is incorrect (or someone is trying to guess an email)
  if (!response.success) {
    return toast.add({
      severity: 'error',
      summary: 'Email Verification',
      detail: 'Unable to resend the email verification',
      life: 5000,
    })
  }

  toast.add({
    severity: 'success',
    summary: 'Email Verification',
    detail: "We've sent you another email verification",
    life: 5000,
  })

  // Lock the send email button for 60 seconds
  resendEmailButtonIsLocked.value = true
  resendEmailButtonTimerId = setInterval(async () => {
    resendEmailButtonTimer.value -= 1
    if (resendEmailButtonTimer.value <= 0) {
      resetResendEmailButtonLock()
    }
  }, 1000)
}

// Handle Logout
const router = useRouter()
const isLoggingOut = ref(false)
const handleLogout = async () => {
  isLoggingOut.value = true
  await authStore.logout()
  isLoggingOut.value = false
  await router.replace({ name: 'login' })
}

// Handle Broadcast even from the Process Email Verification Page
const broadcaster = useBroadcastChannel({ name: BroadcastChannelName.EMAIL_VERIFIED_CHANNEL })
const profileStore = useProfileStore()
watch(
  () => broadcaster.data.value,
  async (value) => {
    if (value) {
      await profileStore.fetchProfile()
      await router.replace({ name: 'dashboard' })
    }
  }
)
</script>

<template>
  <div
    class="flex h-full w-full justify-center bg-gradient-to-b from-warn-500 to-warn-900 dark:from-warn-900 dark:to-warn-950 lg:mx-0"
  >
    <div class="relative z-10 w-[96%] md:w-[65%] lg:w-[50%]">
      <!-- Start Header Icon -->
      <div
        class="absolute left-1/2 top-6 hidden h-28 w-28 -translate-x-1/2 transform items-center justify-center rounded-full bg-primary-500 lg:flex"
      >
        <FontAwesomeIcon icon="fa-solid fa-envelope-open-text" class="h-16 text-surface-0"></FontAwesomeIcon>
      </div>
      <!-- End Header Icon -->
      <Card class="mt-4 ring-2 ring-primary-500 md:mx-4 md:mt-8 lg:mt-16">
        <template #content>
          <div class="mx-2 flex flex-col items-center">
            <div class="mb-8 flex w-full items-center justify-between">
              <AppLogo />
              <Button
                label="Logout"
                text
                size="small"
                @click="handleLogout"
                :loading="formIsLoading || isLoggingOut"
                :disabled="formIsLoading || isLoggingOut"
                class="text-xs"
              >
                <template #icon><i class="pi pi-arrow-left mr-2 hidden md:block" /></template>
              </Button>
            </div>
            <h1 class="self-start font-menu text-xl text-surface-800 dark:text-surface-100">Verify Your Email</h1>
            <div class="flex w-full flex-col text-surface-600">
              <p class="mt-2 text-sm leading-relaxed dark:text-surface-100">
                We've sent a verification link to
                <span class="mx-1 font-medium text-warn-400 underline underline-offset-4">{{ authEmail }}</span>
                to verify your email address and activate your account.
              </p>
              <p class="mt-3 text-sm leading-relaxed dark:text-surface-100 md:mt-2">
                The link in the email will expire in 1 hour. You may need to check your spam folder if you can't find the email in
                your inbox.
              </p>
              <!-- Start Action Buttons -->
              <div class="mt-6 flex flex-col justify-end md:flex-row lg:mt-8">
                <div class="mt-4 flex flex-col md:mt-0">
                  <Button
                    :disabled="resendEmailButtonIsLocked"
                    :loading="formIsLoading"
                    @click="handleResendEmailVerification"
                    severity="warning"
                    label="Resend Email"
                  >
                    <template #icon>
                      <FontAwesomeIcon icon="fa-solid fa-paper-plane" class="mr-2" />
                    </template>
                  </Button>
                  <p v-if="resendEmailButtonIsLocked" class="mt-3 text-center text-xs italic text-surface-600 lg:text-sm">
                    You can send again after <span class="font-bold">{{ resendEmailButtonTimer }}</span> seconds
                  </p>
                </div>
              </div>
              <!-- End Action Buttons -->
            </div>
          </div>
        </template>
      </Card>
    </div>
    <AnimatedFloaters class="opacity-75" />
  </div>
</template>
