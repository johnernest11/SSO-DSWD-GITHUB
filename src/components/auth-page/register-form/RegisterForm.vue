<script setup lang="ts">
import Steps from 'primevue/steps'
import { ref } from 'vue'
import CredentialsSection from '@/components/auth-page/register-form/CredentialsSection.vue'
import PersonalSection from '@/components/auth-page/register-form/PersonalSection.vue'
import AddressSection from '@/components/auth-page/register-form/AddressSection.vue'
import AppLogo from '@/components/layout/AppLogo.vue'

/** Component States */
const activeStep = ref(0)
const registrationSteps = ref([
  {
    label: 'Credentials',
  },
  {
    label: 'Basic Information',
  },
  {
    label: 'Address',
  },
])

/** UI Handlers */
const handleNextButtonClicked = () => {
  activeStep.value++
}
const handlePreviousButtonClicked = () => {
  activeStep.value--
}
</script>

<template>
  <section class="flex w-full flex-col">
    <div class="text-center">
      <div class="mb-2 mt-6 flex justify-center lg:hidden">
        <AppLogo color="light"></AppLogo>
      </div>
      <h2 class="font-menu text-2xl font-bold text-surface-0 md:text-3xl lg:mt-6 lg:text-surface-800 dark:lg:text-surface-0">
        Account Registration
      </h2>
      <p class="mb-4 mt-2 text-sm text-surface-0 lg:text-surface-500 dark:lg:text-surface-200">
        Complete the form to create your account
      </p>
    </div>
    <Steps v-model:active-step="activeStep" :model="registrationSteps" />
    <form class="mt-8 flex w-full flex-col space-y-6" @submit.prevent>
      <transition
        enter-active-class="transition duration-200"
        enter-from-class="translate-x-[20%] opacity-0"
        leave-active-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <CredentialsSection v-if="activeStep === 0" @next-button-clicked="handleNextButtonClicked" class="mt-4" />
        <PersonalSection
          v-else-if="activeStep === 1"
          @next-button-clicked="handleNextButtonClicked"
          @previous-button-clicked="handlePreviousButtonClicked"
          class="mt-4"
        />
        <AddressSection v-else-if="activeStep === 2" @previous-button-clicked="handlePreviousButtonClicked" class="mt-4" />
      </transition>
    </form>
  </section>
</template>
