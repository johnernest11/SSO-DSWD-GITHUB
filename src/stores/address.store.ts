import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiCall } from '@/composables/network.ts'
import { ApiResponseBody } from '@/typings/http-resources.types.ts'
import { WbAutoCompleteOption } from '@/components/webkit/WbAutoComplete.vue'
import { ProvinceResponse, RegionResponse, BarangayResponse, CityResponse } from '@/typings/models.types.ts'

export const useAddressStore = defineStore('address', () => {
  /** States */
  const regionOptions = ref<WbAutoCompleteOption[]>([])
  const regionOptionsIsLoading = ref(false)
  const provinceOptions = ref<WbAutoCompleteOption[]>([])
  const provinceOptionsIsLoading = ref(false)
  const barangayOptions = ref<WbAutoCompleteOption[]>([])
  const barangayOptionsIsLoading = ref(false)
  const cityOptions = ref<WbAutoCompleteOption[]>([])
  const cityOptionsIsLoading = ref(false)

  /** Actions */
  const fetchRegions = async () => {
    if (regionOptions.value.length > 0) return null

    regionOptionsIsLoading.value = true
    const { data } = await useApiCall('/address/regions').get().json()
    const res: ApiResponseBody = data.value

    if (res.success) {
      regionOptions.value = []
      const regionsListResponse = res.data as RegionResponse[]
      regionsListResponse.forEach((region: RegionResponse) => {
        regionOptions.value.push({ value: region.id, label: region.name })
      })
    }

    regionOptionsIsLoading.value = false

    return res
  }

  const fetchProvinces = async () => {
    if (provinceOptions.value.length > 0) return null

    provinceOptionsIsLoading.value = true
    const { data } = await useApiCall('/address/provinces').get().json()
    const res: ApiResponseBody = data.value

    if (res.success) {
      provinceOptions.value = []
      const provinceListResponse = res.data as ProvinceResponse[]
      provinceListResponse.forEach((province: ProvinceResponse) => {
        provinceOptions.value.push({ value: province.id, label: province.name, parent_value: province.region_id })
      })
    }

    provinceOptionsIsLoading.value = false

    return res
  }

  const fetchCities = async () => {
    if (cityOptions.value.length > 0) return

    cityOptionsIsLoading.value = true
    const { data } = await useApiCall('/address/cities').get().json()
    const res: ApiResponseBody = data.value

    if (res.success) {
      cityOptions.value = []
      const citiesListResponse = res.data as CityResponse[]
      citiesListResponse.forEach((city: CityResponse) => {
        cityOptions.value.push({ value: city.id, label: city.name, parent_value: city.province_id })
      })
    }

    cityOptionsIsLoading.value = false
    return res
  }

  const fetchBarangays = async () => {
    if (barangayOptions.value.length > 0) return

    barangayOptionsIsLoading.value = true

    const { data } = await useApiCall('/address/barangays').get().json()
    const res: ApiResponseBody = data.value

    if (res.success) {
      barangayOptions.value = []
      const barangaysListResponse = res.data as BarangayResponse[]
      barangaysListResponse.forEach((barangay: BarangayResponse) => {
        barangayOptions.value.push({ value: barangay.id, label: barangay.name, parent_value: barangay.city_id })
      })
    }

    barangayOptionsIsLoading.value = false
    return res
  }

  return {
    regionOptions,
    fetchRegions,
    regionOptionsIsLoading,
    provinceOptions,
    fetchProvinces,
    provinceOptionsIsLoading,
    cityOptions,
    fetchCities,
    cityOptionsIsLoading,
    barangayOptions,
    fetchBarangays,
    barangayOptionsIsLoading,
  }
})
