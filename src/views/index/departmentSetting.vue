<template>
  <div class="content">
    <!-- 顶部导航栏 -->
    <div class="block">
      <el-row class="block-row">
        <div class="title">{{ NavMsg }}</div>
        <el-divider class="divider" direction="vertical" />
        <el-tooltip
          class="box-item"
          effect="dark"
          content="课程大纲版本"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="22px"
            color="rgb(137, 137, 137)"
            style="margin-left: 10px"
            @click="toVersion()"
          >
            <List />
          </el-icon>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="工作手册模板"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="22px"
            color="rgb(137, 137, 137)"
            style="margin-left: 30px"
            @click="toTemplate()"
          >
            <Management />
          </el-icon>
        </el-tooltip>
      </el-row>
    </div>
    <router-view />
  </div>
</template>

<script>
import { List, Management } from "@element-plus/icons-vue";
export default {
  name: "DepartmentSetting",
  components: {
    List,
    Management,
  },
  data() {
    return {
      NavMsg: "课程大纲版本",
    };
  },
  computed: {},
  watch: {},
  mounted() {
    console.log(this.$route);
    if (this.$route.fullPath === "/version") {
      this.NavMsg = "课程大纲版本";
    }
    if (this.$route.fullPath === "/templateList") {
      this.NavMsg = "工作手册模板";
    }
  },
  methods: {
    toVersion() {
      this.NavMsg = "课程大纲版本";
      this.$router.push({ name: "Version" });
    },
    //跳转到模板编辑页面
    toTemplate() {
      this.NavMsg = "工作手册模板";
      this.$router.push({ name: "TemplateList" });
    },
  },
};
</script>

<style scoped>
.title {
  margin-left: 40px;
  font-size: 16px;
}
/* .content {
  height: 100vh;
  background-color: #f2f2f2;
} */
/* 顶部导航栏 */
.block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
.icon {
  cursor: pointer;
}
.block-row {
  margin-top: 18px;
}
.block_title {
  margin-left: 60px;
  font-size: 16px;
}
.divider {
  margin-left: 20px;
  height: 24px;
}
</style>
