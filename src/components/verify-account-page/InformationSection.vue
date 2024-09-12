<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.ts'

// Emits
const emit = defineEmits<{
  (e: 'emailVerified', value: boolean): void
}>()

// We verify the email in this step
const showErrorAlert = ref(false)
const isLoading = ref(false)
const route = useRoute()
const authStore = useAuthStore()
const handleEmailVerification = async () => {
  isLoading.value = true

  const res = await authStore.verifyEmail({
    id: route.params.id as string,
    hash: route.params.hash as string,
    signature: route.query.signature as string,
    expires: route.query.expires as string,
  })

  if (!res.success) {
    isLoading.value = false
    return (showErrorAlert.value = true)
  }

  emit('emailVerified', true)
}
</script>

<template>
  <div class="flex w-full flex-col text-surface-600 dark:text-surface-300">
    <!-- Start Alert Message -->
    <transition enter-active-class="transition duration-200" enter-from-class="scale-50 opacity-0" leave-to-class="opacity-0">
      <Message v-if="showErrorAlert" :closable="false" severity="error" class="mx-4 my-2 md:mx-0">
        <span>
          The verification link you've clicked is no longer valid. Please contact the web administrator for a new link.
        </span>
      </Message>
    </transition>
    <!-- End Alert Message -->

    <p class="text-sm leading-relaxed md:mt-2">
      In order to proceed further and secure your account, you will need to set-up your profile information and change your
      password.
    </p>
    <!-- Start Action Buttons -->
    <div class="mt-6 flex flex-col justify-end md:flex-row lg:mt-8">
      <div class="mt-4 flex w-full justify-end md:mt-0">
        <Button label="Next" @click="handleEmailVerification" :disabled="isLoading" :loading="isLoading">
          <template #icon>
            <i class="pi pi-arrow-right mr-2" />
          </template>
        </Button>
      </div>
    </div>
    <!-- End Action Buttons -->
  </div>
</template>

<style scoped></style>
