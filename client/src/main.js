import 'vite/modulepreload-polyfill'
import { createApp } from 'vue'
import antdv from './plugins/antdv'
import axios from './plugins/tool-axios'
import App from './App.vue'
import router from './router'
import '@/assets/css/base.less'
import { createPinia } from 'pinia'
createApp(App).use(antdv).use(router).use(axios).use(createPinia()).mount('#app')
