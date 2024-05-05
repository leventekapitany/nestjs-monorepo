<script setup lang="ts">
import { useUserStore } from '@/stores/user-module'
import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'
import useSetupAxios from '@/composables/useSetupAxios'

useSetupAxios()

const userStore = useUserStore()

const { theme } = storeToRefs(userStore)
</script>

<template>
  <VApp :theme="theme">
    <RouterView />
  </VApp>
</template>

<style scoped></style>
