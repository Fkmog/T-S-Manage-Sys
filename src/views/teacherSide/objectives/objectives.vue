<template>
  <div class="content">
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
          <div class="title">课程目标</div>
          <el-divider class="divider" direction="vertical" />
          <el-tooltip
            class="box-item"
            effect="dark"
            content="审核意见"
            placement="bottom"
            :hide-after="0"
          >
            <el-switch
              v-model="openDrawer"
              class="switchstyle"
              @change="openDrawerChange"
            />
          </el-tooltip>
        </el-row>
      </div>
      <div v-show="hasDetailId && hasObjective" class="card">
        <el-row class="card-head">
          <span class="head-text" style="color: grey; font-size: 14px"
            >课程目标</span
          >
          <div v-show="isRespondent">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="编辑"
              placement="bottom"
              :hide-after="0"
            >
              <el-icon class="edit-pen" @click="goEdit()"><EditPen /></el-icon>
            </el-tooltip>
          </div>
        </el-row>
        <div v-for="objective in objectives" :key="objective.id">
          <el-row>
            <el-col :span="1" class="objective-num">{{
              objective.serialNum
            }}</el-col>
            <el-col
              :span="4"
              class="objective-achieve"
              v-show="objective.hasAchieve"
            >
              {{ objective.achievementTwo }}%
            </el-col>
            <el-col
              :span="2"
              class="objective-achieve"
              v-show="!objective.hasAchieve"
            >
            </el-col>
            <el-col :span="16">
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
                  <el-col :span="12">
                    <el-row>
                      <el-col
                        v-for="(activity, index) in assessment.activities.item"
                        :key="index"
                      >
                        {{ activity }}
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <div style="height: 30px"></div>
        </div>
      </div>
      <div v-show="!hasDetailId">
        <div>
          <div>
            <div
              style="
                display: flex;
                justify-content: center;
                margin-top: 100px;
                font-size: 22px;
              "
            >
              暂未关联课程大纲
            </div>
            <div
              style="
                display: flex;
                justify-content: center;
                color: grey;
                font-size: 13px;
                margin-top: 30px;
              "
            >
              请联系课程负责人进行设置
            </div>
          </div>
        </div>
      </div>
      <div v-show="hasDetailId && !hasObjective">
        <el-row class="no-info">
          <el-col style="margin: 10px 0 10px">暂未设置课程目标</el-col>
          <el-col class="go-edit" @click="goEdit()" v-show="isRespondent"
            >去设置</el-col
          >
        </el-row>
      </div>
    </div>
  </div>

  <reviewDrawer v-bind:visible="openDrawer" />
</template>

<script>
import { Back, EditPen } from "@element-plus/icons-vue";
import { getObjectives } from "@/api/basecourse";
import { ElMessageBox, ElSwitch } from "element-plus";
import reviewDrawer from "@/components/teacherClass/reviewDrawer.vue";
import { getClassInfo } from "@/api/class";

export default {
  name: "Objectives",
  components: {
    Back,
    EditPen,
    reviewDrawer,
    ElSwitch,
  },
  data() {
    return {
      openDrawer: false,
      hasDetailId: true,
      hasObjective: true,
      isRespondent: false,
      classInfo: [],
      list: [],
      objectives: [],
    };
  },
  mounted() {
    this.identity = this.$store.state.currentInfo.identity;
    this.openDrawer = this.$store.state.currentInfo.opendrawer;
    if (this.identity == "学院管理员") {
      this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
      console.log("identity:", this.identity);
    } else {
      this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
      console.log("identity:", this.identity);
    }
    console.log("this.classinfo", this.classInfo);
    this.$store.commit("course/setDetailId", this.classInfo.detailId);

    if (this.classInfo.isRespondent == 2) {
      this.isRespondent = true;
    } else {
      this.isRespondent = false;
    }
    // console.log("classInfo", this.classInfo);
    if (this.classInfo.detailId === null) {
      this.hasDetailId = false;
      console.log("this.hasDetailId", this.hasDetailId);
    } else {
      this.hasDetailId = true;
      console.log("this.hasDetailId", this.hasDetailId);

      // this.checkObjectives();
      this.checkClassInfo();
    }
  },
  methods: {
    openDrawerChange() {
      this.$store.commit("currentInfo/setOpenDrawer", this.openDrawer);
    },
    goEdit() {
      this.$router.push("/baseCourseObjectivesEdit");
    },
    backClass() {
      this.$router.push("/teacherClass");
    },
    //获取教学班信息
    checkClassInfo() {
      getClassInfo(this.classInfo.classId).then((res) => {
        // console.log("getClassInfo", res.data);
        this.objectives = res.data.objectives;
        if (this.objectives) {
          if (this.objectives.length > 0) {
            this.hasObjective = true;
            this.objectives.forEach((object) => {
              if (object.id.charAt(0) == "0") {
                object.serialNum = object.id.charAt(1);
              } else {
                object.serialNum = object.id;
              }
              if (object.hasOwnProperty("achievement")) {
                object.achievementTwo = object.achievement.toFixed();
                object.hasAchieve = true;
              } else {
                object.hasAchieve = false;
              }
            });
          } else {
            this.hasObjective = false;
          }
        }
        console.log("getClassInfo", this.objectives);
      });
    },
  },
};
</script>

<style scoped>
.switchstyle {
  bottom: 4px;
}
/* .content {
  height: 100vh;
  background-color: #f2f2f2;
} */
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
  /* background-color: #f2f2f2; */
}
.card {
  width: 800px;
  background: white;
  margin-top: 80px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
.no-info {
  padding-top: 120px;

  display: flex;
  justify-content: center;
  font-size: 22px;
  background-color: #f2f2f2;
}
.objective-num {
  font-size: 1.6em;
  color: #5c6bc0;
  font-weight: bold;
  margin-top: 30px;
  padding-left: 16px;
}
.objective-achieve {
  font-size: 1.6em;
  color: #ff5722;
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
.go-edit {
  cursor: pointer;
}
.go-edit:hover {
  color: #5c6bc0;
}
</style>
