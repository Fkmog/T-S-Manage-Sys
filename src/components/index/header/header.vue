<template>
  <!-- 教师端页面 -->
  <div v-show="$store.state.currentInfo.identity == '教师'" class="headerBgd">
    <HeaderIdentity></HeaderIdentity>
  </div>
  <!-- 学院管理员页面 -->
  <div
    v-show="$store.state.currentInfo.identity == '学院管理员'"
    class="headerBgd"
  >
    <div class="content">
      <div v-if="$route.meta.isMajor" class="headIcon" @click="backIndex()">
        <el-icon :size="24"><HomeFilled /></el-icon>
      </div>
      <!-- 左侧icon的占位 -->
      <div v-if="!$route.meta.isMajor" class="headPlaceholder"></div>
      <div>
        <div style="display: flex; flex-direction: row">
          <div class="major" v-if="!$route.meta.isMajor">
            {{ $store.state.currentInfo.departmentName }}
          </div>
          <div class="major" v-if="$route.meta.isMajor">
            {{ $store.state.major.majorName }}
          </div>
          <!-- 学年选择 -->
          <div v-if="$route.meta.isMajor" class="year">
            <el-select
              v-model="year"
              class="m-2"
              placeholder="年份"
              @change="changeYear()"
            >
              <el-option
                v-for="item in yearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
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
  <!-- 课程负责人页面 -->
  <div
    v-show="$store.state.currentInfo.identity == '课程负责人'"
    class="headerBgd"
  >
    <div class="content">
      <!-- 左侧icon的占位 -->
      <div class="headPlaceholder"></div>
      <div>
        <div style="display: flex; flex-direction: row">
          <div class="placeholder" style="height: 30px"></div>
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
  <!-- web管理员页面 -->
  <div
    v-show="$store.state.currentInfo.identity == 'web管理员'"
    class="headerBgd"
  >
    <div class="content">
      <!-- 左侧icon的占位 -->
      <div class="headPlaceholder"></div>
      <div>
        <div style="display: flex; flex-direction: row">
          <div class="placeholder" style="height: 30px"></div>
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
// import PrincipalNav from "./principalNav";

export default {
  name: "MainHeader",
  components: {
    HeaderNav,
    HeaderIdentity,
    HomeFilled,
    // PrincipalNav,
  },
  data() {
    return {
      //现在直接给默认值，之后浏览器session拿 !todo
      year: "2021",
      yearOptions: [
        {
          value: "2021",
          label: "2021级",
        },
        {
          value: "2022",
          label: "2022级",
        },
      ],
    };
  },
  mounted() {
    this.$store.commit("currentInfo/setYear", this.year);
  },

  methods: {
    backIndex() {
      this.$router.replace({ path: "/major" });
    },
    changeYear() {
      console.log("changeYear", this.year);
      this.$store.commit("currentInfo/setYear", this.year);
    },
  },
};
</script>

<style scoped>
/* 设置所有字体为微软雅黑 */
/* * {
  font-family: Microsoft Yahei;
} */
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
  width: 60px;
  padding-left: 18px;
  margin-top: 28px;
}
.headPlaceholder {
  margin-right: 10px;
  margin-top: 5px;
  width: 60px;
}
.m-2 {
  background-color: #5c6bc0;
  width: 100px;
  margin-left: 40px;
}
</style>
