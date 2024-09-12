<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'

type DonutChartPayload = {
  series: number[]
  labels: string[]
  colors: string[]
  darkMode: boolean
}

const props = defineProps<DonutChartPayload>()

const options = {
  theme: {
    mode: props.darkMode ? 'dark' : 'light',
  },
  chart: {
    background: 'transparent',
  },
  labels: props.labels,
  colors: props.colors,
  fill: {
    type: 'solid',
    opacity: 0.85,
  },
  responsive: [
    {
      breakpoint: 900,
      options: {
        chart: {
          width: 300,
          height: 300,
          offsetX: 20,
        },
        legend: {
          position: 'bottom',
          fontSize: '11px',
        },
      },
    },
  ],
}
</script>

<template>
  <div class="flex h-full w-full items-center justify-center rounded-lg bg-surface-0 py-4 shadow-md dark:bg-surface-700 lg:py-0">
    <VueApexCharts class="w-full" type="donut" :series="props.series" :options="options" />
  </div>
</template>

<style scoped></style>
