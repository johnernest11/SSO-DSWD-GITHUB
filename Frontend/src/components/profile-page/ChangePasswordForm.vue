<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { ChangePasswordPayload, useProfileStore } from '@/stores/profile.store.ts'
import { helpers, required, minLength, sameAs, maxLength } from '@vuelidate/validators'
import { passwordRule } from '@/utils/custom-validations.ts'
import useVuelidate from '@vuelidate/core'
import { useToast } from 'primevue/usetoast'
import { parseApiResponseError } from '@/utils/error-handle.ts'
import { sleep } from '@/utils/helpers.ts'
import WbPassword from '@/components/webkit/WbPassword.vue'
import Divider from 'primevue/divider'
import Button from 'primevue/button'
import Message from 'primevue/message'

/** Payload */
const payload = reactive<ChangePasswordPayload>({
  old_password: '',
  password: '',
  password_confirmation: '',
})

/** Handle Validation **/
const formRules = {
  $lazy: true,
  old_password: {
    required: helpers.withMessage('Please enter your old password', required),
  },
  password: {
    required: helpers.withMessage('Please enter new your password', required),
    minLength: helpers.withMessage('Must be at least 8 characters long', minLength(8)),
    maxLength: helpers.withMessage('Must be a maximum of 50 characters', maxLength(50)),
    password: helpers.withMessage('Must include at least one number, and one uppercase and lowercase letter', passwordRule()),
  },
  password_confirmation: {
    required: helpers.withMessage('Please confirm your password', required),
    sameAsPassword: helpers.withMessage('Must match the password field', sameAs(computed(() => payload.password))),
  },
}

const validator = useVuelidate<ChangePasswordPayload>(formRules, payload)

/** Handle Form Submission */
const profileStore = useProfileStore()
const toast = useToast()
const formIsSubmitting = ref(false)
const showErrorAlert = ref(false)
const errorMessage = ref<string | null>(null)
const errorDetails = ref<string[]>([])
const handleFormSubmission = async () => {
  const valid = validator.value.$validate()
  if (!valid) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.add({
      severity: 'error',
      summary: 'Update profile',
      detail: 'Please see the validation messages',
      life: 5000,
    })
    return
  }

  formIsSubmitting.value = true
  const response = await profileStore.changePassword(payload)
  // Handle the API error
  if (!response.success) {
    const result = parseApiResponseError(response)
    if (!result) return (formIsSubmitting.value = false)

    showErrorAlert.value = true
    errorMessage.value = result.message
    errorDetails.value = result.errors
    await sleep(0.2)
    formIsSubmitting.value = false
    return window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  formIsSubmitting.value = false
  clearForm()
  toast.add({
    severity: 'success',
    summary: 'Update profile',
    detail: "You've successfully updated your password",
    life: 5000,
  })
  return window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearForm = () => {
  payload.old_password = ''
  payload.password = ''
  payload.password_confirmation = ''
  validator.value.$reset()
  showErrorAlert.value = false
}
</script>

<template>
  <form @submit.prevent autocomplete="off">
    <!-- Start Alert Message -->
    <transition enter-active-class="transition duration-200" enter-from-class="scale-50 opacity-0" leave-to-class="opacity-0">
      <Message v-if="showErrorAlert" :closable="false" severity="error" class="mb-6">
        <span>{{ errorMessage }}</span>
      </Message>
    </transition>
    <!-- End Alert Message -->
    <!-- Start Old Password -->
    <div class="mb-4 flex w-full flex-col md:w-[49%] md:flex-row">
      <WbPassword
        v-model="payload.old_password"
        label="Old Password *"
        :feedback="false"
        toggleMask
        :invalid="validator.old_password.$invalid"
        :invalid-text="validator.old_password.$errors[0]?.$message"
        @blur="validator.old_password.$touch"
      >
        <template #prepend-icon>
          <i class="pi pi-lock" />
        </template>
      </WbPassword>
    </div>
    <!-- End Old Password -->
    <!-- Start Password and Password Confirmation -->
    <div class="flex flex-col gap-4 md:flex-row">
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
        @blur="validator.password_confirmation.$touch"
      >
        <template #prepend-icon>
          <i class="pi pi-lock" />
        </template>
      </WbPassword>
    </div>
    <!-- End Password and Password Confirmation -->
    <!-- Start Submit Button -->
    <div class="mt-6 flex justify-end">
      <Button @click="handleFormSubmission" label="Save" :loading="formIsSubmitting" :disabled="formIsSubmitting">
        <template #icon>
          <i class="pi pi-save mr-2"></i>
        </template>
      </Button>
    </div>
    <!-- End Submit Button -->
  </form>
</template>
