<template>
  <div v-if="!$route.meta.isMajor" class="pageNav">
    <ul v-for="(info, index) in infos1" :key="index" class="Navs">
      <li>
        <router-link
          :to="`${info.path}`"
          @click.capture="show(index)"
          :class="activeDisplay == index ? 'active1' : ''"
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
          @click.capture="show(index)"
          :class="activeDisplay == index ? 'active1' : ''"
          >{{ info.value }}</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HeaderNav",
  data() {
    return {
      activeDisplay: 0,
      isMajor: Boolean,
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
          value: "管 理",
          path: "./manage",
        },
        {
          value: "设 置",
          path: "./setting",
        },
      ],
    };
  },
  methods: {
    show(index) {
      this.activeDisplay = index;
    },
  },
};
</script>

<style scoped>
.pageNav {
  display: flex;
  flex-direction: row;
}
/* 设置所有字体为微软雅黑 */
* {
  font-family: Microsoft Yahei;
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
.active1  {
	border-bottom: 1px solid white;
}

</style>