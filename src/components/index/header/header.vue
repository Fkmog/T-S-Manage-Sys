<template>
  <div class="headerBgd">
    <div class="content">
      <div v-if="$route.meta.isMajor" class="headIcon" @click="backIndex()">
        <el-icon :size="60"><HomeFilled /></el-icon>
      </div>
      <div v-if="!$route.meta.isMajor" class="headPlaceholder"></div>
      <div>
        <div class="major" v-if="!$route.meta.isMajor">计算机学院</div>
        <div class="major" v-if="$route.meta.isMajor">
          {{ $store.state.major.majorName }}
        </div>
        <div class="navigatorList">
          <HeaderNav></HeaderNav>
        </div>
      </div>
      <div>
        <HeaderIdentity></HeaderIdentity>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNav from "./headerNav.vue";
import HeaderIdentity from "./headerIdentity.vue";
import { HomeFilled } from "@element-plus/icons-vue";

export default {
  name: "MainHeader",
  components: {
    HeaderNav,
    HeaderIdentity,
    HomeFilled,
  },
  data() {
    return {
    };
  },
  methods: {
    backIndex() {
      this.$router.replace({ path: "/major" });
    },
  },
};
</script>

<style  scoped>
/* 设置所有字体为微软雅黑 */
* {
  font-family: Microsoft Yahei;
}
.headerBgd {
  display: flex;
  background-color: #5c6bc0;
  width: 100%;
  height: 110px;
  box-shadow: 0.7px 0.5px 1.3px rgba(0, 0, 0, 0.073),
    2.5px 1.8px 4.2px rgba(0, 0, 0, 0.107), 11px 8px 19px rgba(0, 0, 0, 0.18);
}
.major {
  pointer-events: auto;
  color: white;
  font-size: 25px;
  font-weight: bold;
  cursor: Default;
}
.content {
  pointer-events: auto;
  margin-left: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: row;
}
.navigatorList {
  display: flex;
  flex-direction: row;
}
.headIcon {
  color: white;
  cursor: pointer;
  margin-right: 10px;
  margin-top: 5px;
}
.headPlaceholder {
  margin-right: 10px;
  margin-top: 5px;
  width: 60px;
}
</style>

