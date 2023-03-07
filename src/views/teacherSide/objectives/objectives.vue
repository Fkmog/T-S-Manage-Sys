<template>
  <div class="body">
    <!-- 顶部导航栏 -->
    <div class="block">
      <el-row class="block-row">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="返回"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="24px"
            color="rgb(137, 137, 137)"
            style="margin-left: 50px"
            @click="backClass()"
          >
            <Back />
          </el-icon>
        </el-tooltip>
        <div class="title">{{ classInfo.className }}</div>
        <el-divider class="divider" direction="vertical" />
      </el-row>
    </div>
    <div class="card">
      <div class="card-head">
        <span class="head-text" style="color: grey; font-size: 14px"
          >课程目标</span
        >
      </div> 
      
    </div>
  </div>
</template>

<script>
import { Back } from "@element-plus/icons-vue";
export default {
  name: "Objectives",
  components: {
    Back,
  },
  data() {
    return {
      classInfo: [],
    };
  },
  mounted() {
    this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
  },
  methods: {
    backClass() {
      this.$router.push("/teacherClass");
    },
  },
};
</script>

<style scoped>
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
.title {
  margin-left: 20px;
  font-size: 16px;
}
.divider {
  margin-left: 20px;
  height: 24px;
}
.body {
  display: flex;
  justify-content: center;
  background-color: #f2f2f2;
}
.card {
  width: 800px;
  background: white;
  margin-top: 80px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
</style>