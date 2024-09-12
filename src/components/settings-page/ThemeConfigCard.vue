<script setup lang="ts">
import Card from 'primevue/card'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SelectButton from 'primevue/selectbutton'
import Button from 'primevue/button'
import { onBeforeMount, onUnmounted, ref, watch } from 'vue'
import { useThemeConfig } from '@/composables/theme.ts'
import { useSettingsStore } from '@/stores/settings.store.ts'
import { useToast } from 'primevue/usetoast'

const options = ref([
  { icon: 'fa-solid fa-sun', value: 'light' },
  { icon: 'fa-solid fa-moon', value: 'dark' },
])

// Handle Theme Selection
const { selectedTheme } = useThemeConfig()
const selectedOption = ref<'light' | 'dark'>(selectedTheme.value?.value || 'light')
onBeforeMount(() => {
  selectedOption.value = selectedTheme.value?.value || 'light'
})

const themeConfigIsChanged = ref(false)
watch(
  () => selectedOption.value,
  () => {
    selectedTheme.value = {
      value: selectedOption.value,
      name: (selectedOption.value[0].toUpperCase() + selectedOption.value.slice(1)) as 'Light' | 'Dark',
    }

    themeConfigIsChanged.value = true
  }
)

/** Handle Save Settings */
const themeConfigIsSaved = ref(false)
const formIsLoading = ref(false)
const settingsStore = useSettingsStore()
const toast = useToast()
const saveSettings = async () => {
  formIsLoading.value = true
  const res = await settingsStore.storeSettings({ theme: (selectedTheme.value?.value || 'light') as 'light' | 'dark' })

  if (res.success) {
    themeConfigIsSaved.value = true
  }

  formIsLoading.value = false
  toast.add({
    severity: 'success',
    summary: 'App Settings',
    detail: 'Theme configurations saved',
    life: 4000,
  })
}

// Revert back the theme if it was changed but no saved
onUnmounted(() => {
  if (themeConfigIsChanged.value && !themeConfigIsSaved.value) {
    const { applyTheme } = useThemeConfig()
    applyTheme()
    toast.add({
      severity: 'warn',
      summary: 'App Settings',
      detail: 'Configuration not saved. The theme of the website has reverted.',
      life: 4000,
    })
  }
})
</script>

<template>
  <Card class="max-h-72 min-h-72">
    <template #content>
      <div class="w-full">
        <h1 class="font-menu text-lg font-bold dark:text-surface-200 md:text-xl">Application Theme</h1>
        <p class="md:text-medium mt-1 text-sm text-surface-700 dark:text-surface-400">
          You can select a theme below to change the look and feel of the website for all users.
        </p>
        <div class="justify-left mt-6 flex">
          <SelectButton v-model="selectedOption" :options="options" optionLabel="Label" optionValue="value">
            <template #option="slotProps">
              <div class="flex items-center p-2">
                <FontAwesomeIcon :icon="slotProps.option.icon" class="h-4 w-4 md:h-6 md:w-6" />
                <span class="ml-2 uppercase">{{ slotProps.option.value }}</span>
              </div>
            </template>
          </SelectButton>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <Button label="Save" @click="saveSettings" :loading="formIsLoading" :disabled="formIsLoading">
          <template #icon>
            <i class="pi pi-save mr-1"></i>
          </template>
        </Button>
      </div>
    </template>
  </Card>
</template>
