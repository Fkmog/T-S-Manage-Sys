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
          <div class="title">{{ classInfo.className }}</div>
          <el-divider class="divider" direction="vertical" />
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
              <el-icon
                class="edit-pen"
                style="margin-top: -13px"
                @click="goEdit()"
                ><EditPen
              /></el-icon>
            </el-tooltip>
          </div>
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
      <div v-show="!hasDetailId" class="card">
        <div class="no-info">暂未设置课程大纲版本</div>
      </div>
      <div v-show="hasDetailId && !hasObjective" class="card">
        <el-row class="no-info">
          <el-col style="margin:10px 0 10px">暂未设置课程目标</el-col>
          <el-col class="go-edit" @click="goEdit()" v-show="isRespondent">去设置</el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { Back, EditPen } from "@element-plus/icons-vue";
import { getObjectives } from "@/api/basecourse";

export default {
  name: "Objectives",
  components: {
    Back,
    EditPen,
  },
  data() {
    return {
      hasDetailId: true,
      hasObjective: true,
      isRespondent: false,
      classInfo: [],
      list: [],
    };
  },
  mounted() {
    this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
    if (this.classInfo.isRespondent == 2) {
      this.isRespondent = true;
    } else {
      this.isRespondent = false;
    }
    // console.log("classInfo", this.classInfo);
    if (this.classInfo.detailId === null) {
      this.hasDetailId = false;
    } else {
      this.hasDetailId = true;
      this.checkObjectives();
    }
  },
  methods: {
    goEdit() {
      this.$router.push("/objectivesEdit");
    },
    backClass() {
      this.$router.push("/teacherClass");
    },
    //获取课程目标
    checkObjectives() {
      getObjectives(this.classInfo.detailId).then((res) => {
        this.list = res.data;
        //处理数据-serialNum
        if (this.list.objectives) {
          if (this.list.objectives.length > 0) {
            this.hasObjective = true;
          } else {
            this.hasObjective = false;
          }
          this.list.objectives.forEach((value) => {
            if (value.id.charAt(0) == "0") {
              value.serialNum = value.id.charAt(1);
            } else {
              value.serialNum = value.id;
            }
          });
        }
        // console.log("getObjectives:", this.list);
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
.no-info {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70px;
  text-align: center;
  border-radius: 6px;
  border: 1px dashed #bdbdbd;
  margin: 16px auto;
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
.go-edit{
  cursor: pointer;
}
.go-edit:hover  {
  color:#5c6bc0 ;

}
</style>
