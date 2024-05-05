import { useUserStore } from '@/stores/user-module'
import { setupAuthRouter } from '@/views/auth/auth.router'
import { setupHomeRouter } from '@/views/home/home.router'
import { storeToRefs } from 'pinia'
import { createRouter as _createRouter, createWebHistory } from 'vue-router'

const createRouter = () => {
  const userStore = useUserStore()
  const { router: userStoreRouter } = storeToRefs(userStore)

  const router = _createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [setupHomeRouter(), setupAuthRouter()]
  })
  // @ts-ignore Just a ts-bug
  userStoreRouter.value = router

  return router
}
export default createRouter
