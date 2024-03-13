<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  name: "App",
  data() {
    return {
      gap_time: 0,
      beforeUnload_time: 0,
    };
  },
  methods: {
    //关闭浏览器窗口时清除cookie
    beforeunloadHandler() {
      this.beforeUnload_time = new Date().getTime();
    },
    unloadHandler() {
      this.gap_time = new Date().getTime() - this.beforeUnload_time;
      //判断是窗口关闭还是刷新
      if (this.gap_time <= 5) {
       Cookies.remove("Admin-Token")

      } else {
      }
    },
  },
  unmounted() {
    // 移除监听
    window.removeEventListener("beforeunload", () => this.beforeunloadHandler());
    window.removeEventListener("unload", () => this.unloadHandler());
  },
  mounted() {
    // 监听浏览器关闭
    window.addEventListener("beforeunload", () => this.beforeunloadHandler());
    window.addEventListener("unload", () => this.unloadHandler());
  },
  created() {
    //实现vuex信息持久化存储
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
      // console.log("this.$store.state", this.$store.state);
    }
    //在页面刷新时保存vuex信息
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  },
};
</script>

<style>
 html,body,#app{
  height: 100%;
 }
 body {
    font-family: Helvetica Neue,Hiragino Sans GB,Microsoft Yahei,WenQuanYi Micro Hei,sans-serif;
    background-color: #f2f2f2
}
</style>
