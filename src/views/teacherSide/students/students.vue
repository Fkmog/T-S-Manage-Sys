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
          @click="backClass()"
        >
          <Back />
        </el-icon>
      </el-tooltip>
      <div class="title">{{ classInfo.className }}</div>
      <el-divider class="divider" direction="vertical" />
    </el-row>
  </div>
  <!-- 学生信息列表 -->
  <el-table
    class="studentsTable"
    :data="studentsTable"
    style="width: 40%"
    :header-cell-style="{  'padding-left':'40px','font-size': '14.4px','height':'48px','font-weight': 'bold','color':'black'}"
    :cell-style="{ 'padding-left':'40px','font-size': '16px','height':'60px' }"
    highlight-current-row
  >
    <el-table-column prop="studentId" label="学号"  width="200px"/>
    <el-table-column prop="studentName" label="姓名" />
  </el-table>
</template>

<script>
import { Back } from "@element-plus/icons-vue";
export default {
  name: "Students",
  components: {
    Back,
  },
  data() {
    return {
      classInfo: [],
      // 临时
      studentsTable:[{
        studentId:222050200,
        studentName:'张三',
      },
      {
        studentId:222050211,
        studentName:'李四',
      }]
    };
  },
  mounted() {
    this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
    console.log("classInfo", this.classInfo);
  },
  methods: {
    backClass(){
      this.$router.push("/teacherClass");
    }
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
.studentsTable{
  margin: 0 auto;
  margin-top: 85px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
</style>