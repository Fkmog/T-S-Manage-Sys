<template>
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
          @click="backBaseCourseDetail()"
        >
          <Back />
        </el-icon>
      </el-tooltip>
      <div class="title">{{ course.name }}</div>
    </el-row>
  </div>
  <div class="body">
    <div class="card">
      <span style="color: grey; font-size: 14px; margin-top: 20px"
        >课程目标</span
      >
    </div>
  </div>
</template>

<script>
import { Back } from "@element-plus/icons-vue";

export default {
  name: "baseCourseObjectives",
  components: {
    Back,
  },
  data() {
    return {
      course: {
        name: "",
        detailId: Number,
        departmentId: Number,
        schoolId: Number,
      },
    };
  },
  mounted() {
    this.course.name = this.$store.state.course.courseName;
  },
  methods: {
    backBaseCourseDetail() {
      this.$router.push("/baseCourseDetail");
    },
  },
};
</script>

<style>
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
}
.card {
  display: flex;
  flex-direction: column;
  width: 750px;
  background: white;
  padding: 0 0 10px 10px;
  margin-bottom: 20px;
  margin-top: 100px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  padding: 0 0 20px 20px;
}
</style>