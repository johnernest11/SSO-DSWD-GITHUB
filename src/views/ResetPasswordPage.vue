<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import AppLogo from '@/components/layout/AppLogo.vue'
import WbInputText from '@/components/webkit/WbInputText.vue'
import { computed, reactive, ref } from 'vue'
import { email, required, helpers, minLength, maxLength, sameAs } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { ResetPasswordPayload, useAuthStore } from '@/stores/auth.store.ts'
import { useToast } from 'primevue/usetoast'
import Message from 'primevue/message'
import AnimatedFloaters from '@/components/misc/AnimatedFloaters.vue'
import { passwordRule } from '@/utils/custom-validations.ts'
import { useRoute, useRouter } from 'vue-router'
import WbPassword from '@/components/webkit/WbPassword.vue'
import Divider from 'primevue/divider'

const router = useRouter()
const payload = reactive<ResetPasswordPayload>({
  email: router.currentRoute.value.query.email as string,
  password: '',
  password_confirmation: '',
  token: '',
})

/** Handle Validation */
const formRules = {
  $lazy: true,
  email: {
    required: helpers.withMessage('Please enter your email address', required),
    email: helpers.withMessage('Please enter a valid email address', email),
  },
  password: {
    required: helpers.withMessage('Please enter your password', required),
    minLength: helpers.withMessage('Must be at least 8 characters long', minLength(8)),
    maxLength: helpers.withMessage('Must be a maximum of 50 characters', maxLength(50)),
    password: helpers.withMessage('Must include at least one number, and one uppercase and lowercase letter', passwordRule()),
  },
  password_confirmation: {
    required: helpers.withMessage('Please confirm your password', required),
    sameAsPassword: helpers.withMessage('Must match the password field', sameAs(computed(() => payload.password))),
  },
}

const validator = useVuelidate<{ email: string }>(formRules, payload)

// Handle Form Submission
const authStore = useAuthStore()
const formIsLoading = ref(false)
const showErrorAlert = ref(false)
const toast = useToast()
const route = useRoute()
const handleSubmitForm = async () => {
  const valid = await validator.value.$validate()
  if (!valid) return

  formIsLoading.value = true
  payload.token = route.query.token?.toString() || ''
  const response = await authStore.resetPassword(payload)
  formIsLoading.value = false

  // If it's a validation error, then the email is incorrect (or someone is trying to guess an email)
  if (!response.success) {
    return (showErrorAlert.value = true)
  }

  toast.add({
    severity: 'success',
    summary: 'Reset Password',
    detail: "You've successfully reset your password",
    life: 5000,
  })

  showErrorAlert.value = false

  await router.replace({ name: 'login' })
}
</script>

<template>
  <div
    :class="`flex h-full w-full flex-col items-center bg-gradient-to-b pt-2 transition-colors md:pt-6 ${
      showErrorAlert
        ? 'from-error-500 to-error-900 dark:from-error-800'
        : 'from-primary-500 to-primary-900 dark:from-primary-800 dark:to-primary-950'
    }`"
  >
    <!-- Start Alert Message -->
    <transition enter-active-class="transition duration-200" enter-from-class="scale-50 opacity-0" leave-to-class="opacity-0">
      <Message v-if="showErrorAlert" :closable="false" severity="error" class="mx-4 mb-6 md:mx-0">
        <span> The link has either expired, so please double check your inbox, or you've entered an incorrect email. </span>
      </Message>
    </transition>
    <!-- End Alert Message -->
    <Card :class="`z-10 mx-2 max-w-3xl px-0.5 md:mx-0 md:px-2 ${showErrorAlert ? 'lg:mt-0' : 'lg:mt-8'}`">
      <template #content>
        <div class="flex flex-col">
          <form autocomplete="off" @submit.prevent>
            <div class="item-center mb-8 flex justify-between">
              <AppLogo />
              <Button label="Back to Login" text size="small" @click="$router.push({ name: 'login' })" class="text-xs">
                <template #icon><i class="pi pi-arrow-left mr-2 hidden md:block" /></template>
              </Button>
            </div>
            <div class="mb-8">
              <h1 class="mb-1 font-menu text-lg text-surface-800 dark:text-surface-100 sm:text-xl">Reset Your Password?</h1>
              <p class="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
                Enter the email you've used to request this link and input your new password.
              </p>
            </div>
            <div class="flex flex-col gap-4">
              <WbInputText
                v-model="payload.email"
                label="Email Address *"
                :invalid="validator.email.$invalid"
                :invalid-text="validator.email.$errors[0]?.$message"
                :disabled="true"
              >
              </WbInputText>
              <WbPassword
                v-model="payload.password"
                label="Password *"
                toggleMask
                :invalid="validator.password.$invalid"
                :invalid-text="validator.password.$errors[0]?.$message"
                @blur="validator.password.$touch"
                @focusin="validator.password.$dirty = false"
              >
                <template #prepend-icon>
                  <i class="pi pi-lock" />
                </template>
                <template #footer-panel>
                  <Divider />
                  <p class="mb-2 font-bold">Requirements</p>
                  <ul class="ml-2 pl-2 font-normal">
                    <li class="mb-1">At least one lowercase</li>
                    <li class="mb-1">At least one uppercase</li>
                    <li class="mb-1">At least one numeric</li>
                    <li class="mb-1">Minimum 8 characters</li>
                  </ul>
                </template>
              </WbPassword>
              <WbPassword
                v-model="payload.password_confirmation"
                label="Confirm Password *"
                :feedback="false"
                toggleMask
                :invalid="validator.password_confirmation.$invalid"
                :invalid-text="validator.password_confirmation.$errors[0]?.$message"
              >
                <template #prepend-icon>
                  <i class="pi pi-lock" />
                </template>
              </WbPassword>
            </div>

            <div class="mt-6 flex w-full flex-col items-end">
              <Button
                label="Submit"
                :loading="formIsLoading"
                :disabled="formIsLoading"
                @click="handleSubmitForm"
                class="w-full md:w-auto"
              >
                <template #icon>
                  <i class="pi pi-send mr-2"></i>
                </template>
              </Button>
            </div>
          </form>
        </div>
      </template>
    </Card>
    <AnimatedFloaters class="opacity-75" />
  </div>
</template>

<style scoped></style>
