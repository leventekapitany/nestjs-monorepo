<script setup lang="ts">
import { ref } from 'vue'
import AppBar from '@/components/AppBar.vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { useDisplay } from 'vuetify'
/**
 * Authenticated view
 */
const open = ref(false)
const { smAndDown } = useDisplay()
</script>

<template>
  <div>
    <BottomNavigation v-if="smAndDown" />
    <NavigationDrawer v-model:open="open" />
    <AppBar @toggleOpen="open = !open" />
    <VMain>
      <VContainer fluid>
        <RouterView />
      </VContainer>
    </VMain>
  </div>
</template>
