<template>
  <div class="content">
    <!-- 顶部导航栏 -->
    <div class="block">
      <el-row class="block-row">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="版本"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="22px"
            color="rgb(137, 137, 137)"
            style="margin-left: 50px"
            @click="toVersion()"
          >
            <List />
          </el-icon>
        </el-tooltip>
        <el-divider class="divider" direction="vertical" />
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
            style="margin-left: 15px"
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
    return {};
  },
  computed: {},
  watch: {},
  mounted() {
    // 点击"设置"后，默认进入版本页面，后期可能会出现bug
    if (this.$route.matched.length == 2) {
      this.toVersion();
    }
  },
  methods: {
    toVersion() {
      console.log(this.$route);
      this.$router.push({ name: "Version" });
    },
    //跳转到模板编辑页面
    toTemplate() {
      this.$router.push({ name: "TemplateList" });
    },
  },
};
</script>

<style scoped>
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
