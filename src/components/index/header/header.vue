<template>
<div class="headerBgd">
<div class="content">
    <div>
        <!-- major应该动态获取 -->
        <div class="major">计算机科学与技术</div>
        <!--  navigatorList 内容要根据权限给-->
        <div class="navigatorList">
            <HeaderNav class="navigator" v-for="info in infos" :key="info.index" :msg="info"></HeaderNav>
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

export default {
  name: "MainHeader",
  components: {
    HeaderNav,
    HeaderIdentity,
  },
  data() {
    return {
      infos: [
        {
          value: "专 业",
          path: "./major",
        },
        {
          value: "课程库",
          path: "./baseCourse",
        },
        {
          value: "教学班",
          path: "./class",
        },
        {
          value: "教 师",
          path: "./teacher",
        },
      ],
    };
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
  color: white;
  font-size: 25px;
  font-weight: bold;
}
.content {
  margin-left: 40px;
  margin-top: 20px;
  display: flex;
  flex-direction: row;
}
.navigatorList {
  display: flex;
  flex-direction: row;
}
</style>

