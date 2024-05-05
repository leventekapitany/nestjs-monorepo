<script setup lang="ts">
import { useUserStore } from '@/stores/user-module'
import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { PromiseStatus, promiseWithStatus } from '@/utils/promiseWithStatus'
import { isAxiosErrorWithMessage } from '@shared/utility'

const userStore = useUserStore()
const { userLogin } = userStore

const loginForm = ref({
  username: '',
  password: ''
})

const v$ = useVuelidate(
  {
    username: { required },
    password: { required }
  },
  loginForm
)

const showPassword = ref(false)

const loginStatus = ref(PromiseStatus.Initial)
const errorMessage = ref('')
const login = async () => {
  errorMessage.value = ''
  if (!(await v$.value.$validate())) return

  try {
    return await promiseWithStatus(userLogin(loginForm.value), loginStatus)
  } catch (error) {
    if (isAxiosErrorWithMessage(error)) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An unknown error occurred'
    }
  }
}

const toForgotPassword = () => {
  // TODO: implement
  throw new Error('Not implemented')
}
</script>
<template>
  <div class="login__layout">
    <VForm class="login__card px-4 py-6 rounded" @submit.prevent="login">
      <VContainer>
        <VAlert class="mb-6" color="error" v-if="errorMessage">
          {{ errorMessage }}
        </VAlert>

        <VTextField
          class="mb-6"
          label="Username"
          variant="outlined"
          v-model="v$.username.$model"
          :errorMessages="v$.username.$errors.map((e) => e.$message as string)"
          placeholder="Username"
          persistentPlaceholder
        >
          <template #prepend-inner>
            <VIcon>mdi-email-outline</VIcon>
          </template></VTextField
        >
        <VTextField
          label="Password"
          variant="outlined"
          v-model="v$.password.$model"
          :errorMessages="v$.password.$errors.map((e) => e.$message as string)"
          placeholder="Password"
          persistentPlaceholder
          :appendInnerIcon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="() => (showPassword = !showPassword)"
          :type="showPassword ? 'text' : 'password'"
          ><template #prepend-inner>
            <VIcon>mdi-form-textbox-password</VIcon>
          </template></VTextField
        >
      </VContainer>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn variant="outlined" @click="toForgotPassword" disabled>Forgot password</VBtn>
        <VBtn
          type="submit"
          variant="flat"
          class="white--text"
          color="primary"
          :disabled="loginStatus === PromiseStatus.Pending"
          :loading="loginStatus === PromiseStatus.Pending"
          >Login</VBtn
        >
      </VCardActions>
    </VForm>
  </div>
</template>
<style lang="scss" scoped>
.login__layout {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/login_background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.login__card {
  max-width: 800px;
  flex: 1;
  background-color: rgb(var(--v-theme-surface));
}
</style>
