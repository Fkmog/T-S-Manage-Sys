import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import router from "./router";
import store from "./store";
import formCreate from "@form-create/element-ui";
import FcDesigner from "@form-create/designer";
import 'element-plus/dist/index.css'
import Codemirror from 'codemirror-editor-vue3'

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(formCreate)
  .use(FcDesigner)
  .use(Codemirror)
  .mount("#app");
//解决el-table  ResizeObserver loop limit exceeded问题
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
};

// 判断配置文件是否开启日志调试 是否输出日志 True 输出 False 不输出
// var logDebug = true;
// console.log = (function (oriLogFunc) {
//   return function () {
//     if (logDebug) {
//       oriLogFunc.apply(this, arguments);
//     }
//   }
// })(console.log);
