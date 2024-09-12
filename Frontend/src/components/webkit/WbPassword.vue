<script setup lang="ts">
/**
 * @see https://tailwind.primevue.org/guides/building-ui-library/
 * @see https://primevue.org/password/#api
 */
import Password from 'primevue/password'

defineOptions({
  inheritAttrs: false,
})

/** Props */
type WbPasswordProps = {
  label: string
  invalid?: boolean
  invalidText?: string
  success?: boolean
  successText?: string
  wrapperClass?: string
  labelClass?: string
  validationErrorMessageClass?: string
  validationSuccessMessageClass?: string
}

const props = withDefaults(defineProps<WbPasswordProps>(), {
  invalid: false,
  invalidText: '',
  success: false,
  successText: '',
  wrapperClass: '',
  labelClass: '',
  validationErrorMessageClass: '',
  validationSuccessMessageClass: '',
})
</script>

<template>
  <div :class="`flex w-full flex-col gap-2 ${wrapperClass}`">
    <label :for="$.uid.toString()" :class="`${props.labelClass || 'text-xs text-surface-800 dark:text-surface-200'}`">{{
      props.label
    }}</label>

    <!-- Start Password field-->
    <div :class="`relative ${$attrs.disabled ? 'hover:cursor-not-allowed' : ''}`">
      <!-- Start Prepend Icon -->
      <div :class="`absolute left-3 top-2/4 z-10 -mt-3 ${$attrs.disabled ? 'text-surface-300' : 'text-surface-500'}`">
        <slot name="prepend-icon"></slot>
      </div>
      <!-- End Prepend Icon -->
      <Password
        v-bind="$attrs"
        :aria-describedby="`${$.uid.toString()}-help`"
        :class="`h-12 w-full ${$attrs.class}`"
        :input-class="`h-12 w-full ${$slots['prepend-icon'] ? 'pl-10' : ''} ${
          props.invalid ? '!ring-error-500 dark:!ring-error-300' : ''
        } ${$attrs.inputClass}`"
        panel-class="text-xs font-bold md:mt-4"
      >
        <template #footer>
          <slot name="footer-panel"></slot>
        </template>
      </Password>
    </div>
    <!-- End Password Field -->
    <!-- Start validation messages -->
    <small
      v-if="props.invalid && props.invalidText"
      :class="`ml-0.5 ${props.validationErrorMessageClass || 'text-xs text-error-500 dark:text-error-300'}`"
    >
      <i class="pi pi-exclamation-triangle mr-0.5"></i>
      {{ props.invalidText }}
    </small>
    <small
      v-if="props.success && props.successText"
      :class="`ml-0.5 ${props.validationSuccessMessageClass || 'text-xs text-success-500 dark:text-success-300'}`"
    >
      <i class="pi pi-check-circle mr-0.5"></i>
      {{ props.successText }}
    </small>
    <!-- End validation messages -->
  </div>
</template>
