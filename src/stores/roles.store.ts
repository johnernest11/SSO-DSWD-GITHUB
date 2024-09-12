import { defineStore } from 'pinia'
import { useApiCall } from '@/composables/network'
import { useAuthStore } from '@/stores/auth.store.ts'
import { RoleResponse } from '@/typings/models.types.ts'
import { ApiResponseBody } from '@/typings/http-resources.types.ts'
import { ref } from 'vue'
import { snakeCaseToTitleCase } from '@/utils/helpers.ts'

export const useRolesStore = defineStore('roles', () => {
  const authStore = useAuthStore()

  /** States */
  const roleOptions = ref<Array<{ value: string | number; label: string; name: string }>>([])

  /** Actions */
  const fetchRoles = async () => {
    // Since the roles are not dynamically added, we only fetch them once
    if (roleOptions.value.length > 0) return null

    const { data } = await useApiCall('/roles', authStore.authenticationToken).get().json()
    const responseBody = data.value as ApiResponseBody

    if (responseBody.success) {
      const rolesList = responseBody.data as RoleResponse[]
      roleOptions.value = rolesList.map((r: RoleResponse) => {
        return { value: r.id, label: snakeCaseToTitleCase(r.name), name: r.name }
      })
    }

    return responseBody
  }

  return {
    fetchRoles,
    roleOptions,
  }
})
