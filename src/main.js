<<<<<<< HEAD
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import store from './store'

createApp(App)
    .use(store)
    .use(router)
    .use(ElementPlus)
    .mount('#app')


=======
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
>>>>>>> yy
