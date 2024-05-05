<script setup lang="ts">
import { useUserStore } from '@/stores/user-module'
import { Theme } from '@/utils/config'
import { HomeRoute } from '@/views/home/home.router'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps({
  open: { type: Boolean, required: true }
})

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

const Open = computed({
  get: () => (smAndDown.value ? props.open : true),
  set: (value: boolean) => emit('update:open', value)
})

const userStore = useUserStore()
const { userLogout } = userStore
const { userData, theme } = storeToRefs(userStore)

const { smAndDown } = useDisplay()

const onThemeChange = () => {
  theme.value = theme.value === Theme.Light ? Theme.Dark : Theme.Light
}
</script>

<template>
  <VNavigationDrawer
    v-model="Open"
    :rail="!smAndDown ? open : null"
    :permanent="!smAndDown"
    :temporary="smAndDown"
    :railWidth="66"
  >
    <div class="profile">
      <VAvatar class="avatar" color="primary" size="50">
        <span class="text-h6"
          >{{ userData.firstName.charAt(0).toUpperCase() }}{{ userData.firstName.charAt(1)
          }}{{ userData.lastName.charAt(0).toUpperCase() }}{{ userData.lastName.charAt(1) }}</span
        >
      </VAvatar>
      <VListItem
        :title="`${userData.firstName} ${userData.lastName}`"
        :subtitle="'user'"
        nav
        height="64"
      />
    </div>
    <VDivider />
    <VList density="compact" nav>
      <VListItem
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        :to="{ name: HomeRoute.Dashboard }"
      />
      <VListItem prepend-icon="mdi-bookshelf" title="My Books" :to="{ name: HomeRoute.MyBooks }" />
      <VListItem
        prepend-icon="mdi-information-variant"
        title="About"
        :to="{ name: HomeRoute.About }"
      />
    </VList>
    <template #append>
      <VList density="compact" nav>
        <VListItem
          :prepend-icon="userStore.theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          title="Toggle Theme"
          @click="onThemeChange"
        />
        <VListItem prepend-icon="mdi-logout" title="Logout" @click="userLogout" />
      </VList>
    </template>
  </VNavigationDrawer>
</template>

<style lang="scss" scoped>
.profile {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 7px;

  .avatar {
    margin-right: 15px;
  }
}
</style>
