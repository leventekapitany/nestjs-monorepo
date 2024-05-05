import { useUserStore } from '@/stores/user-module'
import { AuthRoute } from '@/views/auth/auth.router'

export enum HomeRoute {
  Home = 'home.home',
  Dashboard = 'home.dashboard',
  About = 'home.about',
  MyBooks = 'home.my-books'
}

export const setupHomeRouter = () => {
  const userStore = useUserStore()
  const { getProfile, userLogout } = userStore

  const setupUserSession = async () => {
    try {
      await getProfile()
    } catch (err) {
      userLogout() // TODO: need better error handling
      return {
        name: AuthRoute.Auth
      }
    }
  }

  return {
    path: '/',
    component: () => import('./HomeView.vue'),
    beforeEnter: [setupUserSession],
    children: [
      {
        path: 'dashboard',
        name: HomeRoute.Dashboard,
        component: () => import('./children/DashboardView.vue')
      },
      {
        path: 'about',
        name: HomeRoute.About,
        component: () => import('./children/AboutView.vue')
      },
      {
        path: 'my-books',
        name: HomeRoute.MyBooks,
        component: () => import('./children/MyBooksView.vue')
      },
      {
        name: HomeRoute.Home,
        path: '',
        redirect: { name: HomeRoute.Dashboard }
      }
    ]
  }
}
