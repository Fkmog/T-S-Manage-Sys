import axios from "axios";
import Cookies from "js-cookie";
import { getToken } from "@/utils/request/auth";
import router from "@/router";
import errorCode from "@/utils/request/errorCode";
import { ElNotification, ElMessageBox, ElMessage, Loading } from "element-plus";

export let isRelogin = { show: false };

export function tansParams(params) {
  let result = "";
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof value !== "undefined") {
      if (typeof value === "object") {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== "" &&
            typeof value[key] !== "undefined"
          ) {
            let params = propName + "[" + key + "]";
            var subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result;
}

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  baseURL: "http://81.68.103.96:8080/",

  timeout: 20 * 1000, //超时请求时间：20s
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    if (getToken() && !isToken) {
      config.headers["Authorization"] = "Bearer " + getToken(); // 设置token
    }
    // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = config.url + "?" + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    if (
      !isRepeatSubmit &&
      (config.method === "post" || config.method === "put")
    ) {
      const requestObj = {
        url: config.url,
        data:
          typeof config.data === "object"
            ? JSON.stringify(config.data)
            : config.data,
        time: new Date().getTime(),
      };
      // const sessionObj = cache.session.getJSON('sessionObj')
      // if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      //   cache.session.setJSON('sessionObj', requestObj)
      // } else {
      //   const s_url = sessionObj.url;                  // 请求地址
      //   const s_data = sessionObj.data;                // 请求数据
      //   const s_time = sessionObj.time;                // 请求时间
      //   const interval = 1000;                         // 间隔时间(ms)，小于此时间视为重复提交
      //   if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
      //     const message = '数据正在处理，请勿重复提交';
      //     console.warn(`[${s_url}]: ` + message)
      //     return Promise.reject(new Error(message))
      //   } else {
      //     cache.session.setJSON('sessionObj', requestObj)
      //   }
      // }
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // console.log("http res",res);
    // 未设置状态码则默认成功状态
    // const code = res.data.code || 200;
    // console.log("res", res);
    if (
      res.headers["content-type"] === "application/octet-stream"
    ) {
      // console.log("res.data", res.data);
      return res.data;
    }
    const code = res.status || 200;
    // console.log("code",code);
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    // 二进制数据则直接返回
    if (
      res.request.responseType === "blob" ||
      res.request.responseType === "arraybuffer"
    ) {
      return res.data;
    }
    if (code === 401) {
      console.log("401啦！");
      if (!isRelogin.show) {
        isRelogin.show = true;
        ElMessageBox.confirm(
          "登录状态已过期，您可以继续留在该页面，或者重新登录",
          "系统提示",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            isRelogin.show = false;
            Cookies.remove("Admin-Token");
            router.replace({ path: "/login" });
          })
          .catch(() => {
            isRelogin.show = false;
          });
      }
      return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
    } else if (code === 500) {
      return Promise.reject(new Error(msg));
    } else if (code === 204) {
      return res.status;
    } else {
      return res.data;
    }
  },
  (error) => {
    console.log("error", error);
    //认证错误
    if (error.response.status === 401) {
      console.log("401啦！");
      if (!isRelogin.show) {
        isRelogin.show = true;
        ElMessageBox.confirm(
          "登录状态已过期，您可以继续留在该页面，或者重新登录",
          "系统提示",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            isRelogin.show = false;
            Cookies.remove("Admin-Token");
            router.replace({ path: "/login" });
          })
          .catch(() => {
            isRelogin.show = false;
          });
      }
      return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
    } else {
      return Promise.reject(error.response.data);
    }
    // let { message } = error;
    // if (message == "Network Error") {
    //   message = "后端接口连接异常";
    // } else if (message.includes("timeout")) {
    //   message = "系统接口请求超时";
    // } else if (message.includes("Request failed with status code")) {
    //   message = "系统接口" + message.substr(message.length - 3) + "异常";
    // }
  }
);

export default service;
