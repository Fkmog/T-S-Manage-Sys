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
          @click="backHome()"
        >
          <Back />
        </el-icon>
      </el-tooltip>
      <div class="title">全部课程</div>
      <el-divider class="divider" direction="vertical" />
      <el-tooltip
        class="box-item"
        effect="dark"
        content="学生"
        placement="bottom"
        :hide-after="0"
      >
        <el-icon
          class="icon"
          size="24px"
          color="rgb(137, 137, 137)"
          style="margin-left: 20px"
          @click="toStudents()"
        >
          <Avatar />
        </el-icon>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="成绩"
        placement="bottom"
        :hide-after="0"
      >
        <el-icon
          class="icon"
          size="24px"
          color="rgb(137, 137, 137)"
          style="margin-left: 20px"
          @click="toScore()"
        >
          <TrendCharts />
        </el-icon>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="课程目标"
        placement="bottom"
        :hide-after="0"
      >
        <el-icon
          class="icon"
          size="24px"
          color="rgb(137, 137, 137)"
          style="margin-left: 20px"
          @click="toObjectives()"
        >
          <Checked />
        </el-icon>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="下载报告"
        placement="bottom"
        :hide-after="0"
      >
        <el-icon
          class="icon"
          size="24px"
          color="rgb(137, 137, 137)"
          style="margin-left: 20px"
        >
          <Download />
        </el-icon>
      </el-tooltip>
    </el-row>
  </div>
  <div class="body">
    <div class="card">
      <h3>课程信息</h3>
      <el-col>
        <el-col style="margin-top: 15px">
          <div class="detail-title">课程名</div>
          <div class="detail-info">1</div>
        </el-col>
        <el-row style="margin-top: 15px">
          <el-col :span="12" style="margin-top: 10px">
            <div class="detail-title">课程号</div>
            <div class="detail-info">2</div>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <div class="detail-title">开课号</div>
            <div class="detail-info">2</div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="12" style="margin-top: 10px">
            <div class="detail-title">学年</div>
            <div class="detail-info">3</div>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <div class="detail-title">学期</div>
            <div class="detail-info">3</div>
          </el-col>
        </el-row>
      </el-col>
    </div>
  </div>
</template>

<script>
import {
  Back,
  Avatar,
  TrendCharts,
  Checked,
  Download,
} from "@element-plus/icons-vue";
export default {
  name: "TeacherClass",
  components: {
    Back,
    Avatar,
    TrendCharts,
    Checked,
    Download,
  },
  data() {
    return {
      classInfo: {},
    };
  },
  mounted() {
    this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
    
    console.log("classInfo", this.classInfo);
  },
  methods: {
    //返回教师端首页
    backHome() {
      this.$router.push("/teacherClasses");
    },
    // 跳转学生页面
    toStudents() {
      this.$router.push({
        name: "Students",
      });
    },
    // 跳转成绩页面
    toScore() {
      this.$router.push({
        name: "Score",
      });
    },
    // 跳转课程目标页面
    toObjectives() {
      this.$router.push({
        name: "Objectives",
      });
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
}
.card {
  display: flex;
  flex-direction: column;
  width: 700px;
  background: white;
  margin-top: 75px;
  padding: 0 0 20px 20px;
  margin-bottom: 30px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
.detail-title {
  color: #828eae;
  font-size: 13px;
}
.detail-info {
  margin-top: 5px;
}
</style>