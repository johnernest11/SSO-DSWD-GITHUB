import { Ref } from 'vue'

/**
 * @description Assign the true value from the WBAutoComplete component to a Ref
 */
export const useWbAutoCompleteHandleTrueValue = <T>(value: T, reference: Ref<T>) => {
  reference.value = value
}
