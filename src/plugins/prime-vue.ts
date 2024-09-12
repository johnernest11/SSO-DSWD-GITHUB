/** @see https://primevue.org/vite/ */

import { vueApp } from '@/app.ts'
import PrimeVue, { PrimeVueConfiguration } from 'primevue/config'
import WindPreset from '@/assets/css/presets/wind'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import Ripple from 'primevue/ripple'
import StyleClass from 'primevue/styleclass'
import ConfirmationService from 'primevue/confirmationservice'

const config: PrimeVueConfiguration = { unstyled: true, pt: WindPreset, ripple: true }
vueApp.use(PrimeVue, config)
vueApp.use(ToastService)
vueApp.use(ConfirmationService)

vueApp.directive('tooltip', Tooltip)
vueApp.directive('ripple', Ripple)
vueApp.directive('styleclass', StyleClass)
