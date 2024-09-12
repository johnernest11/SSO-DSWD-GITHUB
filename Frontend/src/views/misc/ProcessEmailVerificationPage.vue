<script setup lang="ts">
import AnimatedFloaters from '@/components/misc/AnimatedFloaters.vue'
import AppLogo from '@/components/layout/AppLogo.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { onUnmounted, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import { useRoute } from 'vue-router'
import { sleep } from '@/utils/helpers.ts'
import { useBroadcastChannel } from '@vueuse/core'
import { BroadcastChannelName } from '@/typings/broadcasts.types.ts'

const isLoading = ref(false)
const verificationSuccess = ref<boolean | undefined>(undefined)

// Verification process
const timer = ref(10)
let timerId: NodeJS.Timeout | undefined = undefined
const authStore = useAuthStore()
const route = useRoute()
const broadcaster = useBroadcastChannel({ name: BroadcastChannelName.EMAIL_VERIFIED_CHANNEL })
onMounted(async () => {
  isLoading.value = true

  const res = await authStore.verifyEmail({
    id: route.params.id as string,
    hash: route.params.hash as string,
    signature: route.query.signature as string,
    expires: route.query.expires as string,
  })

  await sleep(3)
  isLoading.value = false

  // Handle General Errors
  if (!res.success) {
    return (verificationSuccess.value = false)
  }

  // We broadcast an event to other tabs if successful
  if (broadcaster.isSupported) {
    broadcaster.post(true)
  }

  // We set the time before closing the tab
  verificationSuccess.value = true
  timerId = setInterval(async () => {
    timer.value -= 1
    if (timer.value <= 0) {
      clearInterval(timerId)
      window.close()
    }
  }, 1000)
})

onUnmounted(() => clearInterval(timerId))
</script>

<template>
  <div
    :class="`flex h-full justify-center bg-gradient-to-b lg:mx-0
     ${
       !isLoading && !verificationSuccess
         ? '!from-error-500 !to-error-900 dark:!from-error-800'
         : 'from-primary-500 to-primary-900 dark:from-primary-800 dark:to-primary-950'
     }`"
  >
    <div class="z-10 mx-4 mt-12 flex h-fit w-full flex-col text-surface-0 md:mx-0 md:mt-16 md:w-fit lg:mt-28">
      <AppLogo color="light" class="mb-1.5 self-center" />
      <div class="mx-2 flex justify-center lg:mx-0">
        <h1 class="font-menu text-xl text-surface-0 lg:text-3xl">
          <span v-if="isLoading">Verifying Your Email</span>
          <span v-if="!isLoading && verificationSuccess">Verification Successful</span>
          <span v-if="!isLoading && !verificationSuccess">Verification Failed</span>
        </h1>
      </div>
      <FontAwesomeIcon
        v-if="isLoading && verificationSuccess === undefined"
        icon="fa-solid fa-spinner"
        class="mt-4 animate-spin text-xl md:text-3xl"
      >
      </FontAwesomeIcon>
      <!-- Start Error Message -->
      <div v-if="!isLoading && !verificationSuccess" class="mt-3">
        <p class="text-center">
          <FontAwesomeIcon icon="fa-solid fa-xmark" class="mr-2"></FontAwesomeIcon>
          Sorry, the validation link is no longer valid.
          <br />
          Please check the <span class="text-theme-primary underline underline-offset-4">most recent</span>
          verification mail in your inbox.
        </p>
      </div>
      <!-- End Error Message -->
      <!-- Start Success Message -->
      <div v-if="!isLoading && verificationSuccess" class="mt-3">
        <p class="text-center">
          <FontAwesomeIcon icon="fa-solid fa-check" class="mr-2"></FontAwesomeIcon>
          This tab will automatically close in <span class="font-bold">{{ timer }}</span> seconds.
        </p>
      </div>
      <!-- End Success Message -->
    </div>
    <AnimatedFloaters />
  </div>
</template>
