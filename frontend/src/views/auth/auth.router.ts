import { useUserStore } from '@/stores/user-module'
import { storeToRefs } from 'pinia'
import { HomeRoute } from './../home/home.router'

export enum AuthRoute {
  Auth = 'auth.auth',
  Login = 'auth.login',
  Register = 'auth.register'
}

export const setupAuthRouter = () => {
  const userStore = useUserStore()
  const { loggedIn } = storeToRefs(userStore)

  const redirectIfAuthenticated = () => {
    if (loggedIn.value) {
      return {
        name: HomeRoute.Home
      }
    }
  }

  return {
    path: '/auth',
    component: () => import('./AuthView.vue'),
    beforeEnter: [redirectIfAuthenticated],
    children: [
      {
        path: 'login',
        name: AuthRoute.Login,
        component: () => import('./children/LoginView.vue')
      },
      {
        path: 'register',
        name: AuthRoute.Register,
        component: () => import('./children/RegisterView.vue')
      },
      {
        path: '',
        name: AuthRoute.Auth,
        redirect: { name: AuthRoute.Login }
      }
    ]
  }
}
