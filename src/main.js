import { createApp, VueElement } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/style.css'


import {ElButton} from 'element-plus'
// import {
//     components,
//     plugins
// } from './utils/elementPlus.js'

const app = createApp(App)



app.component('ElButton',ElButton)

app.use(store).use(router).mount('#app')
