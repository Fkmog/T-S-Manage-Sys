<template>
  <div>
    <router-view/>
  </div>
</template>

<script>


export default {
  name: 'App',
 
}
</script>

<style>

  /* <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/HT01">HT01</router-link> |
    <router-link to="/HT02">HT02</router-link>
  </div>
  <!-- router-view 这个标签是一个占位符，理解为一个窗口，可以放某一个组件
      那么到底是哪一个组件？  看浏览器地址上的路径 和 router文件夹下的index.js中的routes数组
  -->
  <router-view/>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
} */
</style>
