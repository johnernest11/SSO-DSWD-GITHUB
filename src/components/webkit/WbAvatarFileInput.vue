<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'
import { useAuthStore } from '@/stores/auth.store.ts'
import { ref, watch } from 'vue'
import { useImage } from '@vueuse/core'
import { mimeTypeRule, maxFileSizeRule } from '@/utils/custom-validations.ts'
import { useToast } from 'primevue/usetoast'
import { useProfileStore } from '@/stores/profile.store.ts'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const authStore = useAuthStore()
const imageSource = ref<string | undefined | null>(authStore.authenticatedUser?.user_profile?.profile_picture_url)
const { isLoading } = useImage({ src: imageSource.value || '' })

watch(
  () => authStore.authenticatedUser?.user_profile?.profile_picture_url,
  (url) => {
    imageSource.value = url
  }
)

/** Image Selection */
const file = ref<HTMLInputElement | null>(null)
const handleBrowseImages = () => {
  file.value?.click()
}

/** Handle Image Change and Validation */
const imageIsUploading = ref(false)
const imageFile = ref<File | null>(null)
const toast = useToast()
const handleOnChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target?.files?.[0]
  imageFile.value = file || null

  if (!file) return

  // Check if the file is an image
  if (!mimeTypeRule(['image/jpeg', 'image/jpg', 'image/svg', 'image/png', 'image/bmp'])(file)) {
    imageFile.value = null
    toast.add({ severity: 'error', summary: 'Profile Picture', detail: 'Please select a valid image file', life: 8000 })
    return
  }

  // Image must not exceed 5Mb
  if (!maxFileSizeRule(5)(file)) {
    imageFile.value = null
    toast.add({ severity: 'error', summary: 'Profile Picture', detail: 'The image must not exceed 5MB', life: 8000 })
    return
  }

  // read the file to display it

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => (imageSource.value = e.target?.result?.toString())
}

// We show the upload action button when the image is changed
const showActionButton = ref(false)
watch(
  () => imageFile.value,
  () => {
    if (imageFile.value) showActionButton.value = true
  }
)

/** Handle Image Uploading */
const profileStore = useProfileStore()
const handleImageUpload = async () => {
  if (!imageFile.value) return

  imageIsUploading.value = true
  const formData = new FormData()
  formData.append('photo', imageFile.value)
  const res = await profileStore.uploadProfilePicture(formData)

  imageIsUploading.value = false
  showActionButton.value = false

  if (res.success) {
    return toast.add({
      severity: 'success',
      summary: 'Profile Picture',
      detail: "You've successfully changed your profile photo",
      life: 8000,
    })
  }

  toast.add({
    severity: 'error',
    summary: 'Profile Picture',
    detail: res.errors?.[0].messages[0],
    life: 8000,
  })
}
</script>

<template>
  <div class="relative flex flex-col">
    <div class="group rounded-md drop-shadow-sm transition-all hover:scale-105">
      <input ref="file" type="file" accept="image/*" class="hidden" @change="handleOnChange" />
      <!-- Start Avatar Input -->
      <div v-if="!isLoading" class="relative h-24 w-24 lg:h-28 lg:w-28">
        <img
          v-if="imageSource"
          :src="imageSource"
          alt="Profile Picture"
          class="h-full w-full rounded-lg bg-primary-500 object-cover shadow-md"
        />
        <div
          v-if="!imageSource"
          class="flex h-full w-full items-center justify-center rounded-lg bg-primary-500 text-3xl text-surface-0"
        >
          {{ authStore.avatarDisplayNamePlaceholder }}
        </div>
        <button
          @click="handleBrowseImages"
          class="absolute inset-0 hidden h-full w-full items-center justify-center rounded-lg bg-surface-900 opacity-80 group-hover:flex group-hover:cursor-pointer"
        >
          <i class="pi pi-camera text-xl text-surface-0"></i>
        </button>
      </div>
      <!-- End Avatar Input -->
      <!-- Start Avatar Loader -->
      <div v-if="isLoading" class="h-24 w-24 lg:h-28 lg:w-28">
        <Skeleton height="100%" width="100%" />
      </div>
      <!-- End Avatar Loader -->
    </div>
    <!-- Start action button -->
    <div v-if="showActionButton" class="absolute -bottom-8">
      <Button
        @click="handleImageUpload"
        :label="imageIsUploading ? 'Loading...' : 'Upload'"
        :disabled="imageIsUploading"
        outlined
        size="small"
        class="w-24 text-xs lg:w-28"
      >
        <template #icon>
          <FontAwesomeIcon
            :icon="`${imageIsUploading ? 'fa-solid fa-spinner' : 'fa-solid fa-file-upload'}`"
            :class="`${imageIsUploading ? 'animate-spin' : ''}`"
          />
        </template>
      </Button>
    </div>
    <!-- End action button -->
  </div>
</template>
