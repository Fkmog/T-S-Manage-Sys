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
       <div v-show="!hasObjectives">
        <el-row class="card-head" style="margin-top: 20px">
          <span style="color: grey; font-size: 14px">课程目标</span>
        </el-row>
        <div class="noObjectives" >未添加课程目标
        <!-- <el-button style="color: #6573c0" text @click="goEdit()"
          >新增
        </el-button> -->
        </div>
      </div>
      <div v-show="hasObjectives">
        <el-row class="card-head" style="margin-top: 20px">
          <span class="head-text" style="color: grey; font-size: 14px"
            >课程目标</span
          >
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
import { getObjectives } from "@/api/basecourse";
import editBtn from "@/components/general/editBtn.vue";
import { Back, EditPen } from "@element-plus/icons-vue";
export default {
  name: "Objectives",
  components: {
    editBtn,
    EditPen,
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
      list: [],
      classInfo: [],
      hasObjectives:false,
    };
  },
  mounted() {
    this.course.name = this.$store.state.course.courseName;
    this.course.detailId = this.$store.state.course.detailId;
    this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
    this.checkObjectives();
  },
  methods: {
    backClass() {
      this.$router.push("/teacherClass");
    },
    //获取课程目标
    checkObjectives() {
      getObjectives(this.course.detailId).then((res) => {
        this.list = res.data;
        if (this.list.activities === null) {
          this.hasActivities = false;
        } else {
          this.hasActivities = true;
        }
        //处理数据-serialNum
        if (this.list.objectives===null) {
          this.hasObjectives = false;
         
        } else {
           this.hasObjectives = true;
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

.no-activities {
  margin-top: 150px;
  text-align: center;
  font-size: 20px;
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
.noObjectives {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 64px;
  text-align: center;
  border-radius: 6px;
  /* border: 1px dashed #bdbdbd; */
  margin: 16px auto;
}
</style>
