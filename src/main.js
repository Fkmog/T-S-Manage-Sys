import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import router from './router'
import store from './store'
// import 'default-passive-events'

createApp(App)
    .use(store)
    .use(router)
    .use(ElementPlus, {
        locale: zhCn,
      })
    .mount('#app')


