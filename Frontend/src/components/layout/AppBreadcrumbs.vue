<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const items = ref<Array<{ label?: string }>>()

/** Populate Breadcrumbs based on route metadata */
const route = useRoute()
const populateCrumbs = () => {
  items.value = [{ label: route.meta.group }, { label: route.meta.label }]
}
onMounted(() => {
  populateCrumbs()
})

watch(
  () => route.name,
  () => {
    populateCrumbs()
  }
)
</script>
<template>
  <Breadcrumb :model="items">
    <template #separator><i class="pi pi-angle-right"></i></template>
  </Breadcrumb>
</template>
