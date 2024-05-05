<script setup lang="ts">
import MangaQueryModal from '@/book-api/MangaQueryModal.vue'

const emit = defineEmits<{
  (e: 'toggleOpen'): void
}>()
</script>

<template>
  <VAppBar flat>
    <template #prepend>
      <VAppBarNavIcon @click.stop="emit('toggleOpen')" />
      <VToolbarTitle>Manga Database</VToolbarTitle>
    </template>
    <template #append>
      <MangaQueryModal />
    </template>
  </VAppBar>
</template>

<style lang="scss" scoped>
.v-app-bar {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
