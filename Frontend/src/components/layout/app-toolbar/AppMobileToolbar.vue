<script setup lang="ts">
import Toolbar from 'primevue/toolbar'
import AppMobileSidebar from '@/components/layout/app-sidebar/AppMobileSidebar.vue'
import AppLogo from '@/components/layout/AppLogo.vue'
import WbBreadcrumbs from '@/components/layout/AppBreadcrumbs.vue'
</script>

<template>
  <nav class="flex w-full flex-col">
    <!-- Start Mobile Toolbar -->
    <Toolbar class="!rounded-0 !bg-primary-500 px-4 shadow-none !ring-0 lg:hidden">
      <template #start>
        <AppLogo color="light" />
      </template>
      <template #end>
        <AppMobileSidebar />
      </template>
    </Toolbar>
    <!-- End Mobile Toolbar -->
    <WbBreadcrumbs class="mt-4 px-6 !font-medium" />
  </nav>
</template>

<style scoped></style>
