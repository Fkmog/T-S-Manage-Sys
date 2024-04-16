<template>
  <div v-if="$store.state.currentInfo.identity == '学院管理员'">
    <div v-if="!$route.meta.isMajor" class="pageNav">
      <ul v-for="(info, index) in infos1" :key="index" class="Navs">
        <li>
          <router-link
            :to="`${info.path}`"
            @click.capture="show1(index)"
            :class="activeDisplay1 == index ? 'active1' : ''"
            >{{ info.value }}</router-link
          >
        </li>
      </ul>
    </div>
    <div v-if="$route.meta.isMajor" class="pageNav">
      <ul v-for="(info, index) in infos2" :key="index">
        <li>
          <router-link
            :to="`${info.path}`"
            @click.capture="show2(index)"
            :class="activeDisplay2 == index ? 'active1' : ''"
            >{{ info.value }}</router-link
          >
        </li>
      </ul>
    </div>
  </div>
  <div v-if="$store.state.currentInfo.identity == '课程负责人'">
    <div class="pageNav">
      <ul v-for="(info, index) in infos3" :key="index" class="Navs">
        <li>
          <router-link
            :to="`${info.path}`"
            @click.capture="show3(index)"
            :class="activeDisplay3 == index ? 'active1' : ''"
            >{{ info.value }}</router-link
          >
        </li>
      </ul>
    </div>
  </div>
  <div v-if="$store.state.currentInfo.identity == 'web管理员'">
    <div class="pageNav">
      <ul v-for="(info, index) in infos4" :key="index" class="Navs">
        <li>
          <router-link
            :to="`${info.path}`"
            @click.capture="show4(index)"
            :class="activeDisplay4 == index ? 'active1' : ''"
            >{{ info.value }}</router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderNav",
  data() {
    return {
      activeDisplay1: 0,
      activeDisplay2: 0,
      activeDisplay3: 0,
      activeDisplay4: 0,
      infos1: [
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
        {
          value: "设 置",
          path: "./departmentSetting",
        },
      ],
      infos2: [
        {
          value: "培养目标",
          path: "./goal",
        },
        {
          value: "课程体系",
          path: "./courses",
        },
        {
          value: "达成度",
          path: "./achieve",
        },
        {
          value: "学 生",
          path: "./student",
        },
        {
          value: "设 置",
          path: "./setting",
        },
      ],
      infos3: [
        {
          value: "课程库",
          path: "./baseCourse",
        },
        {
          value: "教学班",
          path: "./class",
        },
      ],
      infos4: [
        {
          value: "学校",
          path: "./schools",
        },
      ],
    };
  },
  computed: {
    currentChange() {
      return this.$store.state.currentInfo;
    },
    identityChange() {
      return this.$store.state.currentInfo.identity;
    },
  },
  watch: {
    $route: {
      handler(val, oldval) {
        // console.log("#@##", val, oldval);
        if (
          val.meta.isMajor !== oldval.meta.isMajor &&
          oldval.name !== "Courses"&& val.name !== "Courses"
        ) {
          this.activeDisplay1 = 0;
          this.activeDisplay2 = 0;
        }
      },
      deep: true,
    },
    // 监视currentInfo
    currentChange: {
      deep: true,
      handler(value) {
        // console.log("看我", this.$store.state.currentInfo.identity);
      },
    },
    // 身份切换时，保证Nav高亮正确
    identityChange: {
      deep: true,
      handler(value) {
        this.$store.commit("navInfo/setActiveDisplay1", 0);
        this.$store.commit("navInfo/setActiveDisplay2", 0);
        this.$store.commit("navInfo/setActiveDisplay3", 0);
        this.$store.commit("navInfo/setActiveDisplay4", 0);
      },
    },
  },
  mounted() {
    // console.log("看我", this.$store.state.currentInfo.identity);
    this.activeDisplay1 = this.$store.state.navInfo.activeDisplay1;
    this.activeDisplay2 = this.$store.state.navInfo.activeDisplay2;
    this.activeDisplay3 = this.$store.state.navInfo.activeDisplay3;
    this.activeDisplay4 = this.$store.state.navInfo.activeDisplay4;
  },
  methods: {
    show1(index) {
      this.activeDisplay1 = index;
      this.$store.commit("navInfo/setActiveDisplay1", index);
    },
    show2(index) {
      this.activeDisplay2 = index;
      this.$store.commit("navInfo/setActiveDisplay2", index);
    },
    show3(index) {
      this.activeDisplay3 = index;
      this.$store.commit("navInfo/setActiveDisplay3", index);
    },
    show4(index) {
      this.activeDisplay4 = index;
      this.$store.commit("navInfo/setActiveDisplay4", index);
    },
  },
};
</script>

<style scoped>
.pageNav {
  display: flex;
  flex-direction: row;
  height: 60px;
}
/* 取消列表的点 */
ul {
  list-style-type: none;
}
.pageNav a {
  display: block;
  position: relative;
  padding-left: 2px;
  padding-right: 2px;
  color: #fff;
  font-size: 16px;
  line-height: 30px;
  font-size: 18px;
  text-decoration: none;
}
.pageNav > ul {
  display: flex;
  padding-inline-start: 0px;
  margin-right: 30px;
}
.pageNav a::after {
  content: "";
  height: 2px;
  overflow: hidden;
  display: block;
  left: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  background: white;
  transform: scaleX(0);
  transition: all 0.25s;
}
.pageNav a:hover::after {
  transform: scaleX(1);
}
.active1 {
  border-bottom: 1px solid white;
}
</style>
