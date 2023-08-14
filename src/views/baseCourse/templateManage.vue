<template>
  <div class="content">
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
            @click="back()"
          >
            <Back />
          </el-icon>
        </el-tooltip>
        <div class="head_title">工作手册</div>
      </el-row>
    </div>
    <div class="body" v-show="hasWorkbook">
      <div class="card">
        <el-row class="all_block">
          <el-col class="body_block">
            <el-col class="title">工作手册名称</el-col>
            <el-col class="detail">{{ workbookInfo.name }}</el-col>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="no-workbook" v-show="!hasWorkbook">暂未分配工作手册</div>
  </div>
</template>

<script>
import { Back } from "@element-plus/icons-vue";
import { WorkbookByCourseId } from "@/api/workbook";
export default {
  name: "templateManage",
  components: {
    Back,
  },
  data() {
    return {
      courseId: "",
      hasWorkbook: Boolean,
      workbookInfo: [],
    };
  },
  mounted() {
    this.courseId = this.$store.state.course.courseId;
    this.getWorkbook();
  },
  methods: {
    back() {
      this.$router.push("/baseCourseDetail");
    },
    // 通过courseId查询workbook
    getWorkbook() {
      WorkbookByCourseId(this.courseId)
        .then((res) => {
          if ((res.code = "SUCCESS")) {
            this.hasWorkbook = true;
            this.workbookInfo = res.data;
            console.log("workbookInfo", this.workbookInfo);
          }
        })
        .catch((e) => {
          console.log("e", e);
          if (e.code == "NOT_FIND") {
            this.hasWorkbook = false;
          }
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
.head_title {
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
  margin-bottom: 20px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  padding: 0 0 50px 20px;
  margin-top: 100px;
}
.all_block {
  margin-left: 30px;
}
.body_block {
  margin-top: 40px;
}
.title {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.2em;
  color: #757575;
  height: 50px;
}
.detail {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.2em;
}
</style>
