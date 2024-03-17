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
            @click="backObjectives()"
          >
            <Back />
          </el-icon>
        </el-tooltip>
        <el-divider class="divider" direction="vertical" />

        <el-tooltip
          class="box-item"
          effect="dark"
          content="保存"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="24px"
            color="rgb(137, 137, 137)"
            @click="judgeBeforeSave()"
            style="margin-left: 10px"
          >
            <DocumentChecked />
          </el-icon>
        </el-tooltip>
      </el-row>
    </div>
    <div class="edit-body">
      <div class="card">
        <div v-for="(info, index) in this.info" :key="index">
          <el-alert
            :title="info"
            type="error"
            :closable="false"
            show-icon
            style="width: 300px; margin-top: 5px; margin-left: 30px"
          />
        </div>
        <el-form :model="objectives" ref="objectives" label-position="top">
          <el-col v-for="(objective, idx) in objectives" :key="objective.id">
            <el-row style="margin-top: 20px">
              <el-col :span="3" class="two-digits" style="padding-left: 16px">
                <section class="num-title">
                  <section class="num-wrap">
                    <span class="title-text">{{ objective.serialNum }}</span>
                  </section>
                  <section class="rotate-bar"></section>
                </section>
              </el-col>
              <el-col :span="20">
                <div
                  v-show="
                    this.$store.state.currentInfo.identity === '学院管理员' ||
                    this.$store.state.currentInfo.identity === '课程负责人'
                  "
                >
                  <el-form-item label="课程目标" class="title">
                    <el-input v-model="objective.name" placeholder="课程目标" />
                  </el-form-item>
                  <el-form-item
                    label="达成途径"
                    class="title"
                    style="margin-top: 50px"
                  >
                    <el-input
                      v-model="objective.description"
                      :rows="3"
                      type="textarea"
                      maxlength="1000"
                      placeholder="达成途径"
                    />
                  </el-form-item>
                </div>
                <div v-show="this.$store.state.currentInfo.identity === '教师'">
                  <div class="objective-name">
                    {{ objective.name }}
                  </div>
                  <div class="objective-description">
                    {{ objective.description }}
                  </div>
                </div>
                <el-row style="margin-top: 50px">
                  <el-col :span="22">
                    <span style="color: grey; font-size: 14px">考核方式</span>
                  </el-col>
                  <el-col :span="2" class="penIcon">
                    <el-icon
                      class="pen-icon"
                      @click="editAssessments(objective, idx)"
                      ><EditPen
                    /></el-icon>
                  </el-col>
                </el-row>

                <el-row v-if="objective.assessmentMethods.length !== 0">
                  <el-col
                    :span="23"
                    v-for="(assessment, index) in objective.assessmentMethods"
                    :key="index"
                    class="assessments"
                  >
                    <el-row class="assessment">
                      <el-col :span="5">
                        {{ assessment.name }}
                      </el-col>
                      <el-col :span="5">( {{ assessment.weight }}% )</el-col>
                      <el-col :span="12">
                        <el-row>
                          <el-col
                            :span="6"
                            v-for="(activity, index) in assessment.activities
                              .item"
                            :key="index"
                          >
                            {{ activity }}
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row
                  class="noAssessment"
                  v-if="objective.assessmentMethods.length == 0"
                >
                  <div>
                    <el-button
                      style="color: #6573c0"
                      text
                      @click="newAssessmentPart(objective, idx)"
                      >添加达成度评价方式
                    </el-button>
                  </div>
                </el-row>
              </el-col>
            </el-row>
            <div style="height: 50px"></div>
          </el-col>
          <el-row
            class="attribute-Btn"
            v-show="
              this.$store.state.currentInfo.identity === '学院管理员' ||
              this.$store.state.currentInfo.identity === '课程负责人'
            "
          >
            <el-button style="color: #6573c0" text @click="addObject()">
              <el-icon :size="18" color="#6573c0"><Plus /></el-icon>
              新增课程目标
            </el-button>
            <el-button
              v-show="canDelete"
              type="danger"
              text
              @click="deleteObject()"
            >
              <el-icon :size="18" color="#ff0000"><Delete /></el-icon>
              删除课程目标{{ deleteSerialNum }}
            </el-button>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- 弹出对话框 -->
    <div>
      <el-dialog
        v-model="dialogFormVisible"
        title="设置考核方式"
        width="680px"
        :show-close="false"
        :align-center="true"
      >
        <el-row style="margin-bottom: 10px">
          <el-col :span="3" class="object-name"
            >课程目标{{ dialogObject.serialNum }}：
          </el-col>
          <el-col :span="20" class="object-name">{{
            dialogObject.name
          }}</el-col>
          <!-- <el-col :span="18" class="object-desc">{{
            dialogObject.description
          }}</el-col> -->
        </el-row>

        <el-row
          class="assessment"
          v-for="(assessment, index1) in dialogObject.assessmentMethods"
          :key="index1"
        >
          <el-col :span="1"></el-col>
          <!-- 编辑权重 -->
          <el-col
            :span="4"
            v-show="!assessment.isEditWeight"
            class="showWeight"
          >
            <el-row>
              <el-col :span="10">{{ assessment.weight }}% </el-col>
              <el-col :span="12">
                <el-icon @click="editWeight(assessment)"><Edit /></el-icon>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" v-show="assessment.isEditWeight" class="editWeight">
            <el-row>
              <el-col :span="12">
                <el-input
                  v-model="assessment.weight"
                  @keyup.enter="saveWeight(assessment)"
                ></el-input>
              </el-col>
              <el-col :span="12">
                <el-icon @click="saveWeight(assessment)"
                  ><DocumentChecked
                /></el-icon>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4">
            <el-input
              placeholder="达成度评价方式"
              v-model="assessment.name"
              width="50px"
            >
            </el-input>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="13">
            <el-select
              multiple
              placeholder="成绩项"
              v-model="assessment.activities.item"
              style="width: 330px"
            >
              <el-option
                v-for="(item, index2) in allActivities.itemObject"
                :key="index2"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1">
            <div class="closeIcon">
              <el-icon class="close-icon" @click="deleteAssessment(assessment)"
                ><Close
              /></el-icon>
            </div>
          </el-col>
        </el-row>

        <el-button
          class="add-assessment-button"
          style="color: #6573c0; margin-top: 10px"
          text
          @click="addAssessment()"
        >
          <el-icon :size="18" color="#586dbe"><Plus /></el-icon>
          新增考核方式
        </el-button>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="confirmAddAssessment(dialogObject)"
            >
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  Back,
  DocumentChecked,
  EditPen,
  Plus,
  Delete,
  Close,
  Edit,
} from "@element-plus/icons-vue";
import {
  getObjectives,
  saveObjectives,
  saveObjectivesForClass,
} from "@/api/basecourse";
import { ElMessageBox, ElMessage } from "element-plus";

export default {
  name: "baseCourseObjectivesEdit",
  components: {
    Back,
    DocumentChecked,
    EditPen,
    Plus,
    Delete,
    Close,
    Edit,
  },
  data() {
    return {
      info: [],
      course: {
        name: "",
        detailId: Number,
        departmentId: Number,
        schoolId: Number,
      },
      list: [],
      listCopy: [],
      objectives: [],
      assessmentMethods: [],
      dialogFormVisible: false,
      chosenActivityItems: [[]],
      dialogObject: {},
      index: Number, //dialog中指明操作的object
      deleteSerialNum: "",
      activities: {},
      allActivities: {},
      isEditWeight: false,
      isChange: false, //页面有无修改
      canDelete: false,
    };
  },
  watch: {
    list: {
      deep: true,
      handler: function () {
        this.isChange = true;
      },
    },
  },
  mounted() {
    this.course.name = this.$store.state.course.courseName;
    this.course.detailId = this.$store.state.course.detailId;
    this.checkObjectives();
    console.log("123", this.$store.state.currentInfo.identity);
  },
  methods: {
    backObjectives() {
      if (!(JSON.stringify(this.listCopy) === JSON.stringify(this.list))) {
        ElMessageBox.confirm("数据还未保存，是否仍然关闭？", "注意", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            if (
              this.$store.state.currentInfo.identity == "学院管理员" ||
              this.$store.state.currentInfo.identity == "课程负责人"
            ) {
              this.$router.push("/baseCourseObjectives");
            } else {
              this.$router.push({
                name: "Objectives",
              });
            }
          })
          .catch(() => {});
      } else {
        if (
          this.$store.state.currentInfo.identity == "学院管理员" ||
          this.$store.state.currentInfo.identity == "课程负责人"
        ) {
          console.log(this.$store.state.currentInfo.identity);
          this.$router.push("/baseCourseObjectives");
        } else {
          this.$router.push({
            name: "Objectives",
          });
        }
      }
    },
    judgeBeforeSave() {
      try {
        this.list.schoolId = this.$store.state.currentInfo.schoolId;
        this.list.departmentId = this.$store.state.currentInfo.departmentId;
        this.list.majorId = this.$store.state.major.majorId;
        // console.log("保存的list:", this.list);
        //有无课程目标
        if (this.list.objectives.length == 0) {
          ElMessage.error("请添加课程目标");
          throw "true";
        }
        this.list.objectives.forEach((object) => {
          if (object.description == "") {
            ElMessage.error("描述内容不能为空");
            throw "true";
          } else if (object.assessmentMethods.length == 0) {
            ElMessage.error("请为课程目标添加达成度评价方式");
            throw "true";
          }
        });
        this.save();
      } catch (stat) {
        if (stat == "true") {
          return;
        }
      }
    },
    save() {
      // bug：上来会直接保存两次 但又测不出来，先留着
      console.log(this.$store.state.currentInfo.identity);
      if (this.$store.state.currentInfo.identity === "教师") {
        this.list.classId =
          this.$store.state.currentInfo.teacherSideClassInfo.classId;
        saveObjectivesForClass(this.list)
          .then((res) => {
            console.log("保存的内容", this.list);
            console.log("save", res);
            if (res.code === "SUCCESS") {
              ElMessage({
                type: "success",
                message: `更新成功`,
                duration: 1500,
              });
              // 更新副本
              this.listCopy = JSON.parse(JSON.stringify(this.list));
              this.backObjectives();
            } else {
              ElMessage({
                type: "error",
                message: `更新失败`,
                duration: 1500,
              });
            }
          })
          .catch((e) => {
            if (e.status == 500) {
              ElMessage({
                type: "error",
                message: `保存出错，请检查填写的内容`,
                duration: 1500,
              });
            }
          });
      } else {
        saveObjectives(this.list)
          .then((res) => {
            console.log("保存的内容", this.list);
            console.log("save", res);
            if (res.code === "SUCCESS") {
              ElMessage({
                type: "success",
                message: `更新成功`,
                duration: 1500,
              });
              // 更新副本
              this.listCopy = JSON.parse(JSON.stringify(this.list));
              this.backObjectives();
            } else {
              ElMessage({
                type: "error",
                message: `更新失败`,
                duration: 1500,
              });
            }
          })
          .catch((e) => {
            if (e.status == 500) {
              ElMessage({
                type: "error",
                message: `保存出错，请检查填写的内容`,
                duration: 1500,
              });
            }
          });
      }
    },
    //获取课程目标
    checkObjectives() {
      getObjectives(this.course.detailId).then((res) => {
        //list存放初始数据
        this.list = res.data;
        if (res.hasOwnProperty("info")) {
          this.info = res.info;
        }
        console.log("getObjectives", res);
        this.allActivities = this.list.activities;
        // console.log("初始list", this.list);
        console.log("初始allActivities", this.list.activities);
        if (this.allActivities.length > 0) {
          this.allActivities.itemObject = this.allActivities[0].item.map(
            (item) => ({
              value: item,
            })
          );
        }

        // console.log("格式化后的list", this.list);
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
        this.objectives = this.list.objectives;
        this.objectives.forEach((object) => {
          object.assessmentMethods.forEach((assessment) => {
            //处理select选择器所需要的数据结构
            assessment.activities.itemObject = assessment.activities.item.map(
              (item) => ({ value: item })
            );
            // 处理assessmentMethods 拼接控制展示/编辑字段
            assessment.isEditWeight = false;
          });
        });
        console.log("objectives:", this.objectives);
        //保存成绩项
        if (this.objectives.length > 0) {
          if (this.objectives[0].assessmentMethods.length > 0) {
            this.activities =
              this.objectives[0].assessmentMethods[0].activities;
          }
        }
        this.getDeleteSerialNum();
      });
    },
    //编辑考核方式
    editAssessments(objective, index) {
      this.index = index;
      // 深克隆
      this.dialogObject = JSON.parse(JSON.stringify(objective));
      console.log("objective", this.dialogObject);
      this.dialogFormVisible = true;
    },
    //新增考核方式
    addAssessment() {
      let assess = {};
      assess.name = "";
      assess.weight = 0;
      assess.activities = {};
      // assess.activities = this.activities;
      console.log("新增达成度评价方式", assess);
      // console.log("addAssessment:", assess, this.dialogObject);
      this.dialogObject.assessmentMethods.push(assess);
    },
    //新创建的课程目标下 新建考核方式部分
    newAssessmentPart(objective, index) {
      this.index = index;
      // 深克隆
      this.dialogObject = JSON.parse(JSON.stringify(objective));
      this.dialogFormVisible = true;
      console.log("新创建的课程目标下 新建达成度评价方式", this.dialogObject);
    },
    //删除达成度评价方式
    deleteAssessment(assessment) {
      this.dialogObject.assessmentMethods.pop(assessment);
    },
    //确定编辑达成度评价方式
    confirmAddAssessment(dialogObject) {
      let sum = 0;
      // let isMethodsNameNull = false;
      let isItemNull = false;
      let haveZero = false;
      dialogObject.assessmentMethods.forEach((assessment) => {
        sum = sum + Number(assessment.weight);
        // if (assessment.name == "") {
        //   isMethodsNameNull = true;
        // }
        if (assessment.activities.item.length == 0) {
          isItemNull = true;
        }
        if (assessment.weight == "0") {
          haveZero = true;
        }
      });
      if (haveZero == true) {
        ElMessage.error("权重范围在1%-100%");
      }
      if (sum !== 100) {
        ElMessage.error("权重之和必须为100%");
      }
      // if (isMethodsNameNull == true) {
      //   ElMessage.error("考核方式不能为空");
      // }
      if (isItemNull == true) {
        ElMessage.error("请为达成度评价方式选择成绩项");
      }
      if (
        sum == 100 &&
        // isMethodsNameNull == false &&
        isItemNull == false &&
        haveZero == false
      ) {
        // 处理activities
        // console.log("dialogObject",dialogObject);
        this.dialogObject.assessmentMethods.forEach((assessmentMethod) => {
          console.log("assessmentMethod", assessmentMethod);
          if (!assessmentMethod.hasOwnProperty("itemObject")) {
            assessmentMethod.activities.itemObject =
              assessmentMethod.activities.item.map((item) => ({ value: item }));
          }
          // 先将value与remark全部置空，以免后面重复添加
          assessmentMethod.activities.remark = [];
          assessmentMethod.activities.value = [];
          // console.log("制空后的assessmentMethod", assessmentMethod);
          let array = assessmentMethod.activities.itemObject;
          console.log("array", array, array[0]);
          if (array.length === 1) {
            console.log(
              "this.allActivities",
              this.allActivities,
              this.allActivities.item
            );
            let index = this.allActivities.itemObject.findIndex(
              (itemObject) => itemObject.value === array[0].value
            );
            console.log("index", index);
            if (index > -1) {
              console.log(!assessmentMethod.activities.hasOwnProperty("value"));
              if (!(assessmentMethod.activities.item.length == array.length)) {
                assessmentMethod.activities.item.push(
                  this.allActivities[0].item[index]
                );
              }
              if (
                assessmentMethod.activities.value === null ||
                !assessmentMethod.activities.hasOwnProperty("value")
              ) {
                assessmentMethod.activities.value = [];
              }
              assessmentMethod.activities.value.push(
                this.allActivities[0].value[index]
              );
              if (
                assessmentMethod.activities.remark === null ||
                !assessmentMethod.activities.hasOwnProperty("remark")
              ) {
                assessmentMethod.activities.remark = [];
              }
              assessmentMethod.activities.remark.push(
                this.allActivities[0].remark[index]
              );
            }
          }
          if (array.length > 1) {
            array.forEach((singleActivity) => {
              let index = this.allActivities.itemObject.findIndex(
                (itemObject) => itemObject.value === singleActivity.value
              );
              // console.log("多于1项的时候，",singleActivity,"index",index);
              if (index > -1) {
                // console.log("zheli执行了几次", array);
                if (
                  !(assessmentMethod.activities.item.length == array.length)
                ) {
                  assessmentMethod.activities.item.push(
                    this.allActivities[0].item[index]
                  );
                }
                if (
                  assessmentMethod.activities.value === null ||
                  !assessmentMethod.activities.hasOwnProperty("value")
                ) {
                  assessmentMethod.activities.value = [];
                }
                assessmentMethod.activities.value.push(
                  this.allActivities[0].value[index]
                );
                if (
                  assessmentMethod.activities.remark === null ||
                  !assessmentMethod.activities.hasOwnProperty("remark")
                ) {
                  assessmentMethod.activities.remark = [];
                }
                assessmentMethod.activities.remark.push(
                  this.allActivities[0].remark[index]
                );
              }
            });
          }

          console.log("all", this.allActivities);
        });
        this.objectives[this.index].assessmentMethods =
          this.dialogObject.assessmentMethods;
        this.dialogFormVisible = false;
        console.log(
          "确定编辑考核方式assessmentMethods",
          this.dialogObject.assessmentMethods
        );
      }
    },
    //新增课程目标
    addObject() {
      let newObject = {};
      newObject.description = "";
      newObject.name = "";
      newObject.achievement = Number;
      newObject.numStudents = Number;
      newObject.serialNum = Number(this.deleteSerialNum) + 1;
      if (newObject.serialNum >= 10) {
        newObject.id = newObject.serialNum + "";
      } else {
        newObject.id = "0" + newObject.serialNum;
      }
      newObject.serialNum = newObject.serialNum + "";
      // 待定 可能有问题！
      newObject.assessmentMethods = [];
      this.objectives.push(newObject);
      console.log("!!", this.objectives);
      this.getDeleteSerialNum();
      this.canDelete = true;
    },
    // 删除课程目标
    deleteObject() {
      ElMessageBox.confirm(
        "是否确认删除课程目标" + this.deleteSerialNum + "?",
        "",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        // bug! 当删除到最后一项时会出错
        this.objectives.pop();
        if (this.objectives.length == 0) {
          this.canDelete = false;
        }
        this.getDeleteSerialNum();
      });
    },
    // 获取删除课程目标的serialNum
    getDeleteSerialNum() {
      if (this.objectives.length > 0) {
        this.deleteSerialNum =
          this.objectives[this.objectives.length - 1].serialNum;
        this.canDelete = true;
      } else {
        this.deleteSerialNum = 0;
        this.canDelete = false;
      }
      this.listCopy = JSON.parse(JSON.stringify(this.list));
    },
    // 编辑权重
    editWeight(assessment) {
      assessment.isEditWeight = true;
    },
    // 保存权重
    saveWeight(assessment) {
      if (Number(assessment.weight) > 100 || Number(assessment.weight) <= 0) {
        ElMessage.error("权重范围在1%-100%");
      } else {
        assessment.isEditWeight = false;
      }
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
.divider {
  margin-left: 20px;
  height: 24px;
}
.edit-body {
  display: flex;
  justify-content: center;
  background-color: #f2f2f2;
}
.card {
  width: 800px;
  background: white;
  padding: 20px;
  margin-top: 80px;
  margin-bottom: 30px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
/* 数字标题 */
.num-title {
  margin-top: 10px;
  margin-left: 10px;
  max-width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  display: table;
  width: 40px;
  color: #5c6bc0;
  border-color: rgb(72, 192, 163);
  word-wrap: break-word !important;
}
.num-wrap {
  max-width: 100%;
  box-sizing: border-box;
  display: table-cell;
  vertical-align: middle;
  color: rgb(255, 255, 255);
  border-color: rgb(72, 192, 163);
  word-wrap: break-word !important;
}
.title-text {
  max-width: 100%;
  font-size: 50px;
  font-weight: bold;
  color: #5c6bc0;
  box-sizing: border-box !important;
  word-wrap: break-word !important;
}
.rotate-bar {
  margin-top: 5px;
  margin-left: -4px;
  max-width: 100%;
  box-sizing: border-box;
  width: 18px;
  height: 70px;
  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: rgb(198, 198, 199);
  transform: rotate(35deg);
  word-wrap: break-word !important;
  background-color: rgb(254, 254, 254);
}
.title {
  margin-top: 20px;
}
.assessment {
  color: #464646;
  margin-top: 30px;
}
.assessments:hover .penIcon {
  opacity: 1;
}
.penIcon {
  opacity: 1;
  margin-top: 5px;
}
.pen-icon {
  cursor: pointer;
  width: 24px;
  height: 24px;
  color: #757575;
}
/* 对话框样式 */
:deep().el-dialog__title {
  color: #808080;
  display: flex;
  justify-content: center;
  font-size: 20px;
}

.assessment {
  margin: 30px 0 30px 0;
}
.closeIcon {
  margin-top: 7px;
}
.el-icon {
  cursor: pointer;
  width: 18px;
  height: 18px;
}
.noAssessment {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 64px;
  text-align: center;
  border-radius: 6px;
  border: 1px dashed #bdbdbd;
  margin: 16px auto;
}
.showWeight {
  margin-top: 5px;
}
.editWeight .el-icon {
  margin-top: 5px;
  margin-left: 10px;
}
:deep().block .el-icon {
  width: 24px;
  height: 24px;
}
:deep().block .el-icon svg {
  width: 24px;
  height: 24px;
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
:deep().penIcon .el-icon {
  width: 18px;
  height: 18px;
}
:deep().penIcon .el-icon svg {
  width: 18px;
  height: 18px;
}
</style>
