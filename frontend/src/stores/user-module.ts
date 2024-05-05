import type { IDecoded } from '@/interfaces/IJwtDecoded'
import { AuthRoute } from '@/views/auth/auth.router'
import { HomeRoute } from '@/views/home/home.router'
import { getProfile as _getProfile, refresh, signIn } from '@shared/auth/auth.api'
import type { SignInDto } from '@shared/auth/dto/signInDto'
import { jwtDecode } from 'jwt-decode'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import type { Router } from 'vue-router'
import { Theme } from '../utils/config'

const usePrivateState = defineStore('user.private', () => {
  const _accessToken = ref(window.localStorage.getItem('accessToken') ?? '')
  const _theme = ref(window.localStorage.getItem('theme') === Theme.Dark ? Theme.Dark : Theme.Light)

  return {
    _accessToken,
    _theme
  }
})

export const useUserStore = defineStore('user', () => {
  const { _accessToken, _theme } = storeToRefs(usePrivateState())

  const accessToken = computed({
    get: () => _accessToken.value,
    set: (val: string) => {
      if (val)
        window.localStorage.setItem('accessToken', val) // TODO: move to cookie
      else window.localStorage.removeItem('accessToken')
      _accessToken.value = val
    }
  })
  const tokenPayload = ref<IDecoded | undefined>(undefined)
  /**
   * Since this store module is referenced in the router setup, router cannot be automatically injected.
   * This ref will be set, after the router is created.
   * Other stores, which are not used in router/index.ts, can use useRouter normally.
   */
  const router = ref<Router>()

  const theme = computed({
    get: () => _theme.value,
    set: (val: Theme) => {
      window.localStorage.setItem('theme', val)
      _theme.value = val
    }
  })

  const loggedIn = computed(() => !!accessToken.value)

  const defaultUserData = () => ({
    firstName: '',
    lastName: '',
    id: ''
  })
  const userData = ref(defaultUserData())

  const getProfile = async () => {
    const { data: profile } = await _getProfile()
    userData.value = profile
  }

  const userLogin = async (signInDto: SignInDto) => {
    const { data } = await signIn(signInDto)
    const { access_token } = data
    updateToken(access_token)
    await getProfile()
    if (router.value) router.value.replace({ name: HomeRoute.Home })
    return access_token
  }

  const userLogout = () => {
    console.warn('TODO: implement logout api')
    userData.value = defaultUserData()
    accessToken.value = ''
    if (router.value) router.value.replace({ name: AuthRoute.Login })
  }

  const updateToken = (access: string | null) => {
    if (access) {
      accessToken.value = access
      try {
        tokenPayload.value = access ? jwtDecode<IDecoded>(access) : undefined
      } catch (err) {
        console.error('Error during accessToken parse: ', err)
        tokenPayload.value = undefined
      }
    }
  }
  updateToken(accessToken.value)

  const requestNewToken = async () => {
    const { data } = await refresh()
    const { access_token } = data
    updateToken(access_token)
    return access_token
  }

  const destroyToken = () => {
    accessToken.value = ''
  }

  return {
    router,
    accessToken,
    tokenPayload,
    loggedIn,
    theme,
    userData,
    getProfile,
    userLogin,
    userLogout,
    updateToken,
    requestNewToken,
    destroyToken
  }
})
