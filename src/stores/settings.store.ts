import { defineStore } from 'pinia'
import { useApiCall } from '@/composables/network.js'
import { StorageSerializers, useStorage } from '@vueuse/core'
import { ApiResponseBody } from '@/typings/http-resources.types.ts'
import { useAuthStore } from '@/stores/auth.store.ts'
import { SettingsResponse } from '@/typings/models.types.ts'
import { computed } from 'vue'

/** Typings */
export type SettingsPayload = {
  theme?: 'light' | 'dark'
  mfa?: { enabled?: boolean; steps?: Array<string> }
}

export type MfaConfig = {
  enabled: boolean
  allow_api_management: boolean
  steps: Array<{ name: string; completed: boolean }>
}

export const useSettingsStore = defineStore('settings', () => {
  const authStore = useAuthStore()

  /** States */
  const appSettings = useStorage('app-settings', null, localStorage, {
    serializer: StorageSerializers.object,
    deep: true,
    mergeDefaults: true,
  })

  /** Getters / Computed **/
  const mfaIsEnabled = computed(() => {
    let mfaConfig = null
    for (const config of appSettings.value) {
      if (config['name'] === 'mfa') {
        mfaConfig = JSON.parse(config['value']) as MfaConfig
        break
      }
    }

    return !!mfaConfig?.enabled
  })

  const mfaIsConfigurable = computed(() => {
    let mfaConfig = null
    for (const config of appSettings.value) {
      if (config['name'] === 'mfa') {
        mfaConfig = JSON.parse(config['value']) as MfaConfig
        break
      }
    }

    return !!mfaConfig?.allow_api_management
  })

  /** Actions */
  const fetchSettings = async () => {
    const { data } = await useApiCall('/app-settings').get().json()
    const responseBody: ApiResponseBody = data.value

    if (responseBody.success) {
      appSettings.value = responseBody.data as SettingsResponse
    }

    return responseBody
  }

  const storeSettings = async (payload: SettingsPayload) => {
    const { data } = await useApiCall('/app-settings', authStore.authenticationToken).post(payload).json()
    const responseBody: ApiResponseBody = data.value

    if (responseBody.success) {
      appSettings.value = responseBody.data as SettingsResponse
    }

    return responseBody
  }

  return {
    appSettings,
    fetchSettings,
    storeSettings,
    mfaIsEnabled,
    mfaIsConfigurable,
  }
})
