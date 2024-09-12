<script setup lang="ts">
import Card from 'primevue/card'
import SelectButton from 'primevue/selectbutton'
import Button from 'primevue/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { onBeforeMount, onUnmounted, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings.store.ts'
import { useToast } from 'primevue/usetoast'
import { useSortable } from '@vueuse/integrations/useSortable'
import { MfaAllStepsResponseData, useAuthStore } from '@/stores/auth.store.ts'
import { snakeCaseToTitleCase } from '@/utils/helpers.ts'

/** Handle MFA Enabled/Disabled Options */
const mfaEnabledOptions = ref([
  { icon: 'fa-solid fa-check', label: 'On', value: true },
  { icon: 'fa-solid fa-xmark', label: 'Off', value: false },
])
const settingsStore = useSettingsStore()
const mfaEnabled = ref<boolean>(settingsStore.mfaIsEnabled)

/** Handle MFA Steps Sorting */
const stepsContainer = ref<HTMLElement | null>(null)
const authStore = useAuthStore()
const enabledStepsList = ref<MfaAllStepsResponseData>([])
const disabledStepsList = ref<MfaAllStepsResponseData>([])
const mfaStepsListAreLoading = ref(false)
let origEnabledSteps: MfaAllStepsResponseData = []
let origDisabledSteps: MfaAllStepsResponseData = []

onBeforeMount(async () => {
  mfaStepsListAreLoading.value = true
  enabledStepsList.value = (await authStore.fetchAllAvailableMfaMethods()).filter((s) => s.enabled)
  disabledStepsList.value = (await authStore.fetchAllAvailableMfaMethods()).filter((s) => !s.enabled)
  mfaStepsListAreLoading.value = false

  // Saved the orig value, so we can check later if steps are not saved
  origEnabledSteps = [...enabledStepsList.value]
  origDisabledSteps = [...disabledStepsList.value]
})

useSortable(stepsContainer, enabledStepsList, {
  animation: 200,
})

const handleToggleActivationStatus = (stepName: string, status: boolean) => {
  // Send to the disabled list
  if (status) {
    const step = disabledStepsList.value.find((s) => s.name === stepName)
    disabledStepsList.value = disabledStepsList.value.filter((s) => s.name !== stepName)
    if (step) return enabledStepsList.value.push(step)
  }

  // Send to enabled list
  const step = enabledStepsList.value.find((s) => s.name === stepName)
  enabledStepsList.value = enabledStepsList.value.filter((s) => s.name !== stepName)
  if (step) {
    return disabledStepsList.value.push(step)
  }
}

const handleMoveStepUp = (index: number) => {
  if (index < 1) return

  const step = enabledStepsList.value[index]
  enabledStepsList.value = enabledStepsList.value.filter((s) => s.name !== step.name)
  enabledStepsList.value.splice(index - 1, 0, step)
}

/** Handle Save Settings */
const toast = useToast()
const formIsLoading = ref(false)
const mfaConfigIsSaved = ref(false)
const handleSaveSettings = async () => {
  formIsLoading.value = true
  const res = await settingsStore.storeSettings({
    mfa: {
      enabled: mfaEnabled.value,
      steps: enabledStepsList.value.map((s) => s.name),
    },
  })

  if (res.success) {
    mfaConfigIsSaved.value = true
  }

  formIsLoading.value = false
  toast.add({
    severity: 'success',
    summary: 'App Settings',
    detail: 'MFA configurations saved',
    life: 4000,
  })
}

// Show a toast notification if settings were changed but were not changed
onUnmounted(() => {
  // Check if the enabled value is changed
  if (mfaEnabled.value !== settingsStore.mfaIsEnabled && !mfaConfigIsSaved.value) {
    return toast.add({
      severity: 'warn',
      summary: 'App Settings',
      detail: 'MFA configuration changes were not saved',
      life: 4000,
    })
  }

  // Check if steps have changed
  const enabledHasChanged = JSON.stringify(origEnabledSteps) !== JSON.stringify(enabledStepsList.value)
  const disabledHasChanged = JSON.stringify(origDisabledSteps) !== JSON.stringify(disabledStepsList.value)
  if ((enabledHasChanged || disabledHasChanged) && !mfaConfigIsSaved.value) {
    toast.add({
      severity: 'warn',
      summary: 'App Settings',
      detail: 'MFA configuration changes were not saved',
      life: 4000,
    })
  }
})
</script>

<template>
  <Card class="min-h-72">
    <template #content>
      <div class="w-full">
        <h1 class="font-menu text-lg font-bold dark:text-surface-200 md:text-xl">Multi-Factor Authentication</h1>
        <p class="md:text-medium mt-1 text-sm text-surface-700 dark:text-surface-400">
          You can enable or disable MFA for all users. You may also select multiple MFA factors and order them.
        </p>
        <div class="justify-left mt-6 flex">
          <SelectButton v-model="mfaEnabled" :options="mfaEnabledOptions" optionLabel="label" optionValue="value" class="mb-1">
            <template #option="slotProps">
              <div class="flex items-center p-2">
                <FontAwesomeIcon :icon="slotProps.option.icon" class="h-4 w-4 md:h-6 md:w-6" />
                <span class="ml-2 uppercase">{{ slotProps.option.label }}</span>
              </div>
            </template>
          </SelectButton>
        </div>
        <!-- Start List -->
        <div v-show="mfaEnabled && !mfaStepsListAreLoading" class="w-full">
          <hr class="border-surface-250 my-4 dark:border-surface-700" />
          <p v-if="enabledStepsList.length > 0" class="md:text-medium text-sm text-surface-700 dark:text-surface-400">
            Listed here are all the enabled and disabled MFA steps. You may <b>drag & drop</b> the individual verification methods
            to change their order. At least one item should be in this list if MFA is enabled.
          </p>
          <!-- Start Enabled List -->
          <div ref="stepsContainer" :class="`mt-5 w-full ${enabledStepsList.length > 0 ? 'mb-8' : ''}`">
            <div
              v-for="(step, index) in enabledStepsList"
              :key="step.name"
              class="mb-1 flex items-center justify-between rounded-md bg-surface-200 px-4 py-2 hover:cursor-pointer dark:bg-surface-700"
            >
              <div class="flex items-center">
                <button @click="handleMoveStepUp(index)">
                  <i v-if="index > 0" class="pi pi-arrow-up mr-3 text-xs sm:text-sm"></i>
                  <i v-else class="pi pi-minus mr-3 text-xs sm:text-sm"></i>
                </button>
                <span class="text-xs font-bold sm:text-sm">{{ snakeCaseToTitleCase(step.name) }}</span>
              </div>
              <Button
                @click="handleToggleActivationStatus(step.name, false)"
                :disabled="enabledStepsList.length < 2"
                size="small"
                label="Disable"
                severity="danger"
                outlined
                class="px-3 text-xs"
              />
            </div>
            <!-- End Enabled List -->
          </div>
          <!-- Start Disabled List -->
          <div v-if="disabledStepsList.length > 0" class="w-full">
            <p class="mb-5 text-sm">You may add an MFA step from this list by clicking the <b>Enable</b> button.</p>
            <div
              v-for="step in disabledStepsList"
              :key="step.name"
              class="mb-1 flex items-center justify-between rounded-md bg-surface-200 px-4 py-2 dark:bg-surface-700"
            >
              <div class="flex items-center">
                <i class="pi pi-ban mr-3 text-xs sm:text-sm"></i>
                <span class="text-xs font-bold sm:text-sm">{{ snakeCaseToTitleCase(step.name) }}</span>
              </div>
              <Button
                @click="handleToggleActivationStatus(step.name, true)"
                size="small"
                label="Enable"
                outlined
                class="px-3 text-xs"
              />
            </div>
          </div>
          <!-- End Disabled List -->
        </div>
        <!-- End List -->
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <Button
          label="Save"
          @click="handleSaveSettings"
          :loading="formIsLoading"
          :disabled="formIsLoading || enabledStepsList.length === 0"
        >
          <template #icon>
            <i class="pi pi-save mr-1"></i>
          </template>
        </Button>
      </div>
    </template>
  </Card>
</template>
