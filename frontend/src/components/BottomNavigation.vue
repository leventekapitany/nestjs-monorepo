<script setup lang="ts">
import { HomeRoute } from '@/views/home/home.router'
</script>

<template>
  <VBottomNavigation grow>
    <VBtn value="recent" :to="{ name: HomeRoute.Dashboard }">
      <VIcon>mdi-view-dashboard</VIcon>

      <span>Dashboard</span>
    </VBtn>

    <VBtn value="favorites" :to="{ name: HomeRoute.MyBooks }">
      <VIcon>mdi-bookshelf</VIcon>

      <span>My Books</span>
    </VBtn>

    <VBtn value="nearby" :to="{ name: HomeRoute.About }">
      <VIcon>mdi-information-variant</VIcon>

      <span>About</span>
    </VBtn>
  </VBottomNavigation>
</template>
