import { createPinia } from 'pinia'
import { createApp } from 'vue'

import vuetify from '@/plugins/vuetify'
import App from './App.vue'
import createRouter from './router'

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(createRouter())

app.mount('#app')
