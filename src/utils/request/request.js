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
  baseURL: "http://47.113.206.164/prod-api/",
  // baseURL: "https://jxjk.hdu.edu.cn/prod-api/",
  timeout: 20 * 1000, //超时请求时间：20s
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    const hasToken = getToken() === undefined ? false : true;
    // console.log("^^^",Cookies.get("first-Login"));
    const firstLogin =
      Cookies.get("first-Login") === undefined ||
      Cookies.get("first-Login") === false
        ? true
        : false;
    // 非首次登陆时，login请求不携带header
    if (config.url === "/login" && !firstLogin) {
      return config;
    }
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
    
    // 未设置状态码则默认成功状态
    // const code = res.data.code || 200;
    if (res.headers["content-type"] === "application/octet-stream") {
      return res.data;
    }
    const code = res.status || 200;
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
      if (!isRelogin.show) {
        isRelogin.show = true;
        ElMessageBox.confirm(
          "登录状态已过期，您可以继续留在该页面，或者重新登录",
          "",
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
    } else if (code === 404) {
      return Promise.reject(new Error(msg));
    } else {
      return res.data;
    }
  },
  (error) => {
    console.log("error", error);
    //认证错误
    if (error.response.status === 401) {
      if (error.response.data.msg == "用户不存在/密码错误") {
        ElMessage({
          type: "error",
          message: "密码错误",
          duration: 1500,
        });
        return Promise.reject(error.response.data);
      } else if (error.response.data.code == "UNAUTHORIZED") {
        if (!isRelogin.show) {
          isRelogin.show = true;
          ElMessageBox.confirm(
            "登录状态已过期，您可以继续留在该页面，或者重新登录",
            "",
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
        // return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
        else {
          return Promise.reject(error.response.data);
        }
      } else {
        ElMessage({
          type: "error",
          message: error.response.data.msg,
          duration: 1500,
        });
      }
    } else if (error.response.status === 404 || error.response.status === 422) {
      return Promise.reject(error.response.data);
    } else if (error.response.status === 400) {
      if (error.response.data.msg == "用户不存在/密码错误") {
        ElMessage({
          type: "error",
          message: "密码错误",
          duration: 1500,
        });
        return Promise.reject(error.response.data);
      } else {
        ElMessage({
          type: "error",
          message: error.response.data.msg,
          duration: 1500,
        });
        return Promise.reject(error);
      }
    }
    else if (error.response.status === 409) {
      return error.response.data;
    }
    else{
      return Promise.reject(error.response);
    }
  }
);

export default service;
