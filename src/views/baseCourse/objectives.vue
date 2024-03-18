<template>
  <!-- 课程库进来的课程目标页面 -->
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
        <div class="title">课程目标</div>
      </el-row>
    </div>
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
            <el-icon class="edit-pen" @click="goEdit()"><EditPen /></el-icon>
          </el-tooltip>
        </el-row>
        <div v-for="(info, index) in this.info" :key="index">
          <el-alert
            :title="info"
            type="error"
            :closable="false"
            show-icon
            style="width: 500px; margin-top: 5px"
          />
        </div>

        <div v-for="objective in list.objectives" :key="objective.id">
          <el-row style="width: 800px">
            <el-col :span="1" class="objective-num">{{
              objective.serialNum
            }}</el-col>
            <el-col
              :span="3"
              class="objective-achieve"
              v-show="objective.hasAchieve"
            >
              {{ objective.achievementTwo }}
            </el-col>
            <el-col
              :span="1"
              class="objective-achieve"
              v-show="!objective.hasAchieve"
            >
            </el-col>
            <el-col :span="20">
              <el-row v-show="objective.name" class="objective-name">
                {{ objective.name }}
              </el-row>
              <div class="objective-description">
                {{ objective.description }}
              </div>
              <div style="margin-top: 20px">
                <span style="color: grey; font-size: 14px">达成度评价方式</span>
              </div>
              <div
                v-for="(assessment, index) in objective.assessmentMethods"
                :key="index"
              >
                <el-row class="assessments">
                  <el-col :span="5">
                    {{ assessment.name }}
                  </el-col>
                  <el-col :span="4">( {{ assessment.weight }}% )</el-col>
                  <el-col :span="12">
                    <el-row>
                      <el-col
                        v-show="activity"
                        :span="8"
                        v-for="(activity, index2) in assessment.activities.item"
                        :key="index2"
                      >
                        <el-tooltip
                          :hide-after="0"
                          :content="assessment.activities.table[index2] || ''"
                          effect="dark"
                          placement="top"
                        >
                          {{ activity }}
                        </el-tooltip>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="3" class="assess-achieve">
                    {{ assessment.achievementTwo }}
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
      <div v-show="hasDetailId && !hasObjective">
        <el-row>
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
          <el-col class="go-edit" @click="goEdit()" v-show="isRespondent"
            >去设置</el-col
          >
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { Back, EditPen } from "@element-plus/icons-vue";
import editBtn from "@/components/general/editBtn.vue";
import { getObjectives } from "@/api/basecourse";

export default {
  name: "baseCourseObjectives",
  components: {
    Back,
    editBtn,
    EditPen,
  },
  data() {
    return {
      info: [],
      hasDetailId: true,
      hasObjective: true,
      classInfo: [],
      list: [],
      objectives: [],
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
    this.course.detailId = this.$store.state.course.detailId;
    if (this.course.detailId === null) {
      this.hasDetailId = false;
    } else {
      this.hasDetailId = true;
    }
    this.checkObjectives();
  },
  methods: {
    back() {
      this.$router.push("/baseCourseDetail");
    },
    goEdit() {
      this.$router.push("/baseCourseObjectivesEdit");
    },
    checkActivityInfo() {
      let allTable = new Set();
      let allAc = new Set();
      let activities = this.list.activities;
      for (let i = 0; i < activities.length; i++) {
        let ac = activities[i];
        allTable.add(ac.name);
        if (ac.item) {
          let temp = Array.from(ac.item);
          temp.forEach((t) => allAc.add(t));
        }
      }
      let tables = new Set();
      let Ac = new Set();
      let objects = this.list.objectives;
      for (let i = 0; i < objects.length; i++) {
        let assessments = objects[i].assessmentMethods;
        assessments.forEach((assess) => {
          let table = assess.activities.table;
          let item = assess.activities.item;
          Ac.add(...item);
          tables.add(...table);
        });
      }
      let Nosheet = [];
      let NoAc = [];
      for (let item of tables) {
        if (!allTable.has(item)) {
          Nosheet.push(item);
        }
      }
      for (let item of Ac) {
        if (!allAc.has(item)) {
          NoAc.push(item);
        }
      }
      let Actemp = NoAc.join("、");
      let temp = Nosheet.join("、");
      this.info.push(
        "以下成绩项表标题已变更：" + temp + "，请重新设置课程目标的考核方式"
      );
      this.info.push(
        "以下考核项名称已变更：" + Actemp + "，请重新设置课程目标的考核方式"
      );
      console.log("tables", tables, allTable);
    },
    //获取课程目标
    checkObjectives() {
      getObjectives(this.course.detailId).then((res) => {
        this.list = res.data;
        //处理数据-serialNum
        if (this.list.objectives) {
          this.hasObjective = true;
          this.list.objectives.forEach((value) => {
            if (value.id.charAt(0) == "0") {
              value.serialNum = value.id.charAt(1);
            } else {
              value.serialNum = value.id;
            }
            if (
              value.hasOwnProperty("achievement") &&
              value.achievement !== null
            ) {
              value.achievementTwo = value.achievement.toFixed(3);
              value.hasAchieve = true;
            } else {
              value.hasAchieve = false;
            }
            value.assessmentMethods.forEach((assess) => {
              if (assess.achievement === null) {
                assess.achievementTwo = "";
              } else {
                assess.achievementTwo = assess.achievement.toFixed(3);
              }
            });
          });
        }
        console.log("getObjectives:", this.list);
        this.checkActivityInfo();
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
  width: 800px;
  background: white;
  margin-bottom: 30px;
  margin-top: 80px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  padding: 20px;
}
.objective-num {
  font-size: 1.6em;
  color: #5c6bc0;
  font-weight: bold;
  margin-top: 20px;
  padding-left: 16px;
}
.objective-name {
  font-size: 1.2em;
  font-weight: bold;
  word-wrap: break-all;
  /* white-space: normal; */
  margin-top: 20px;
}
.objective-achieve {
  font-size: 1.6em;
  color: #ff5722;
  font-weight: bold;
  margin-top: 20px;
  padding-left: 16px;
}
.objective-description {
  margin-top: 20px;
}
.assessments {
  margin-top: 30px;
}
.edit-pen {
  cursor: pointer;
  color: grey;
  margin-left: 710px;
  margin-top: -10px;
}
.no-info {
  padding-top: 120px;
  display: flex;
  justify-content: center;
  font-size: 22px;
  background-color: #f2f2f2;
}
.assess-achieve {
  font-size: 1em;
  color: #ff5722;
  font-weight: bold;
}

:deep().edit-pen .el-icon {
  width: 20px;
  height: 20px;
}
:deep().edit-pen .el-icon svg {
  width: 20px;
  height: 20px;
}
</style>
