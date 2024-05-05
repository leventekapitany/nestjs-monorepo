import { useUserStore } from '@/stores/user-module'
import request from '@shared/request'
import { isAxiosError } from 'axios'
import { storeToRefs } from 'pinia'

let isAxiosInitialized = false
const useSetupAxios = () => {
  if (isAxiosInitialized) throw new Error('Axios already initialized')

  const userStore = useUserStore()
  const { userLogout, requestNewToken } = userStore
  const { accessToken } = storeToRefs(userStore)
  request.interceptors.request.use((config) => {
    // It might be more secure to store token in cookie!
    if (accessToken.value) {
      config.headers.Authorization = 'Bearer ' + accessToken.value
    }
    return config
  })

  request.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.config?.withoutResponseInterceptor) return Promise.reject(error)

      if (isAxiosError(error) && error.response?.status === 401) {
        return requestNewToken()
          .then((access_token) => {
            if (!error.config) throw new Error('No config in error')

            error.config.headers.Authorization = 'Bearer ' + access_token
            error.config.withoutResponseInterceptor = true
            return request.request(error.config)
          })
          .catch(() => {
            userLogout()
            return Promise.reject(error)
          })
      }
      return Promise.reject(error)
    }
  )
  isAxiosInitialized = true
}

export default useSetupAxios
