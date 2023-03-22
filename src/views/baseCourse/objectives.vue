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
          @click="backBaseCourseDetail()"
        >
          <Back />
        </el-icon>
      </el-tooltip>
      <div class="title">{{ course.name }}</div>
    </el-row>
  </div>
  <!-- <editBtn @click="goEdit()"></editBtn> -->
  <div class="body">
    <div class="card">
      <el-row class="card-head" style="margin-top: 30px">
        <span style="color: grey; font-size: 14px">课程目标</span>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="编辑"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon class="edit-pen" style="margin-top: -10px" @click="goEdit()"
            ><EditPen
          /></el-icon>
        </el-tooltip>
      </el-row>
      <div v-for="objective in list.objectives" :key="objective.id">
        <el-row>
          <el-col :span="2" class="objective-num">{{
            objective.serialNum
          }}</el-col>
          <el-col :span="20">
            <div class="objective-name">
              {{ objective.name }}
            </div>
            <div class="objective-description">
              {{ objective.description }}
            </div>
            <div style="margin-top: 30px">
              <span style="color: grey; font-size: 14px">考核方式</span>
            </div>
            <div
              v-for="(assessment, index) in objective.assessmentMethods"
              :key="index"
            >
              <el-row class="assessments">
                <el-col :span="5">
                  {{ assessment.name }}
                </el-col>
                <el-col :span="5">( {{ assessment.weight }}% )</el-col>
                <el-col
                  :span="2"
                  v-for="(activity, index) in assessment.activities.item"
                  :key="index"
                >
                  {{ activity }}
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <div style="height: 30px"></div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { Back,EditPen } from "@element-plus/icons-vue";
import editBtn from "@/components/general/editBtn.vue";
import { getObjectives } from "@/api/basecourse";

export default {
  name: "baseCourseObjectives",
  components: {
    Back,
    editBtn,
    EditPen
  },
  data() {
    return {
      course: {
        name: "",
        detailId: Number,
        departmentId: Number,
        schoolId: Number,
      },
      list: [],
    };
  },
  mounted() {
    this.course.name = this.$store.state.course.courseName;
    this.course.detailId = this.$store.state.course.detailId;
    this.checkObjectives();
  },
  methods: {
    backBaseCourseDetail() {
      this.$router.push("/baseCourseDetail");
    },
    goEdit() {
      this.$router.push("/baseCourseObjectivesEdit");
    },
    //获取课程目标
    checkObjectives() {
      getObjectives(this.course.detailId).then((res) => {
        this.list = res.data;
        console.log(res);
        //处理数据-serialNum
        if (this.list.objectives) {
          this.list.objectives.forEach((value) => {
            if (value.id.charAt(0) == "0") {
              value.serialNum = value.id.charAt(1);
            } else {
              value.serialNum = value.id;
            }
          });
        }
        console.log("getObjectives:", this.list);
      });
    },
  },
};
</script>

<style scoped>
.content {
  height: 100vh;
  background-color: #f2f2f2;
}
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
.objective-num {
  font-size: 1.6em;
  color: #5c6bc0;
  font-weight: bold;
  margin-top: 30px;
  padding-left: 16px;
}
.objective-name {
  font-size: 1.2em;
  font-weight: bold;
  white-space: nowrap;
  margin-top: 33px;
}
.objective-description {
  margin-top: 30px;
}
.assessments {
  margin-top: 30px;
}
.edit-pen {
  cursor: pointer;
  color: grey;
  margin-left: 710px;
}
</style>
