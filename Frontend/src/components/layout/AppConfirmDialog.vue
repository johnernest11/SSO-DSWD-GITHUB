<script setup lang="ts">
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<template>
  <ConfirmDialog group="global" :draggable="false" modal>
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center rounded-lg bg-surface-0 p-5 dark:bg-surface-800">
        <span class="mb-2 mt-4 text-2xl font-bold text-surface-700 dark:text-surface-100">{{ message?.header }}</span>
        <p class="my-4 dark:text-surface-100">{{ message?.message }}</p>
        <div class="mt-4 flex items-center gap-6">
          <Button label="Cancel" severity="secondary" outlined @click="rejectCallback" class="flex w-[8rem] gap-1">
            <template #icon>
              <i class="pi pi-times"></i>
            </template>
          </Button>
          <Button label="Confirm" @click="acceptCallback" class="flex w-[8rem] gap-1">
            <template #icon>
              <i class="pi pi-check"></i>
            </template>
          </Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>

<style scoped></style>
