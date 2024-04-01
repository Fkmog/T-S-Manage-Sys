<template>
  <div class="content">
    <!-- 头部栏 -->
    <div v-show="hasProgram" class="body-check">
      <div class="noAttribute" v-if="!hasAttribute">
        <div
          style="
            display: flex;
            justify-content: center;
            margin-top: 100px;
            font-size: 22px;
          "
        >
          未创建毕业要求
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
          请先创建毕业要求
        </div>
      </div>
      <div class="card" v-if="hasAttribute">
        <div
          class="graduate-attribute"
          v-for="(attribute, index1) in requirements"
          :key="attribute.id"
        >
          <div class="attribute">
            <div class="two-digits">
              <section class="num-title">
                <section class="num-wrap">
                  <span class="title-text">{{ attribute.serialNum }}</span>
                </section>
                <section class="rotate-bar"></section>
              </section>
            </div>
            <div class="attribute-content">
              <div class="name">
                {{ attribute.name }}
              </div>
              <div class="desc">
                {{ attribute.description }}
              </div>
            </div>
          </div>
          <div
            v-for="(detail, index2) in attribute.programIndicators"
            :key="detail.id"
          >
            <div class="attribute-detail">
              <div class="detail-num">
                {{ detail.serialNum }}
              </div>
              <div class="detail-content">
                <div class="name">{{ detail.name }}</div>
                <div class="desc">{{ detail.description }}</div>
              </div>
            </div>
            <div class="support-course" style="margin: 30px 0 30px 120px">
              <div class="support-head">
                <span style="color: grey; font-size: 14px">支撑课程</span>
                <div class="penIcon">
                  <el-tooltip
                    effect="dark"
                    content="编辑"
                    placement="bottom"
                    :hide-after="0"
                  >
                    <el-icon
                      class="pen-icon"
                      @click="
                        editSupportCourse(attribute, detail, index1, index2)
                      "
                      ><EditPen
                    /></el-icon>
                  </el-tooltip>
                </div>
              </div>
              <div class="methods" style="margin: 20px 0 20px 100px">
                <el-row
                  v-for="coreBaseCourse in detail.coreBaseCourses"
                  :key="coreBaseCourse.id"
                  style="margin-top:20px"
                >
                    <el-col :span="8" class="method-weight"
                      >{{ coreBaseCourse.courseName }}
                    </el-col>
                    <el-tooltip
                      effect="dark"
                      content="权重"
                      placement="bottom"
                      :hide-after="0"
                    >
                      <el-col
                        :span="8"
                        class="method-desc"
                        style="margin-left: 80px"
                        >（ {{ coreBaseCourse.weight }}% ）</el-col
                      >
                    </el-tooltip>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="noProgram" class="no-program">
      <div
        style="
          display: flex;
          justify-content: center;
          margin-top: 100px;
          font-size: 22px;
        "
      >
        未创建培养方案
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
        请先创建培养方案
      </div>
    </div>
    <!-- 弹出对话框-->
    <div>
      <el-dialog
        v-model="dialogFormVisible"
        title="设置支撑课程"
        width="640px"
        :show-close="false"
        :align-center="true"
      >
        <el-row style="margin-bottom: 10px">
          <el-col :span="7" style="font-weight: bold; font-size: 16px">
            毕业要求{{ dialogDetail.serialNum }}：{{ dialogDetail.name }}
          </el-col>
          <el-col :span="17" style="font-size: 16px">
            {{ dialogDetail.description }}
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="6" style="font-weight: bold; font-size: 16px"
            >指标点{{ dialogDetail.programIndicators[index2].serialNum }}：{{
              dialogDetail.programIndicators[index2].name
            }}</el-col
          >
          <el-col :span="17">{{
            dialogDetail.programIndicators.description
          }}</el-col>
        </el-row>
        <el-col
          v-for="programIndicator in dialogDetail.programIndicators"
          :key="programIndicator.id"
        >
          <el-row>
            <el-col
              class="coreBaseCourse"
              v-for="(
                coreBaseCourse, index
              ) in programIndicator.coreBaseCourses"
              :key="coreBaseCourse.id"
              style="margin-top: 20px"
            >
              <el-row>
                <el-col :span="1"></el-col>
                <el-col
                  :span="4"
                  v-show="!coreBaseCourse.isEditWeight"
                  class="showWeight"
                >
                  <el-row>
                    <el-col :span="12">{{ coreBaseCourse.weight }}% </el-col>
                    <el-col :span="12">
                      <el-icon
                        class="edit-icon"
                        @click="editWeight(coreBaseCourse)"
                        ><Edit
                      /></el-icon>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col
                  :span="4"
                  v-show="coreBaseCourse.isEditWeight"
                  class="editWeight"
                >
                  <el-row>
                    <el-col :span="12">
                      <el-input v-model="coreBaseCourse.weight"></el-input>
                    </el-col>
                    <el-col :span="12">
                      <el-icon
                        class="edit-icon"
                        @click="saveWeight(coreBaseCourse)"
                        ><DocumentChecked
                      /></el-icon>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="16" style="font-size: 16px">{{
                  coreBaseCourse.courseName
                }}</el-col>
                <el-col :span="3">
                  <el-icon
                    class="close-icon"
                    @click="deleteCourse(programIndicator, index)"
                    ><Close
                  /></el-icon>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>

        <el-button
          v-show="!newCoreCourse"
          class="add-support-button"
          style="color: #6573c0; margin-top: 30px"
          text
          @click="this.newCoreCourse = true"
        >
          <el-icon :size="18" color="#586dbe"><Plus /></el-icon>
          新增支撑课程
        </el-button>
        <div style="display: flex; flex-direction: row" v-show="newCoreCourse">
          <el-autocomplete
            popper-class="el-autocomplete-suggestion"
            :popper-append-to-body="false"
            v-model="searchValue"
            :fetch-suggestions="querySearch"
            placeholder="选择课程（筛选可输入文字）"
            style="width: 680px; margin-left: 20px; margin-top: 30px"
            :fit-input-width="true"
            @select="addCoreBaseCourse(searchValue, index1, index2)"
          ></el-autocomplete>
          <div style="margin-top: 35px">
            <el-icon
              class="autocomplete-icon"
              @click="this.newCoreCourse = false"
              ><Close
            /></el-icon>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancelAddCoreBaseCourse(dialogDetail)"
              >取消</el-button
            >
            <el-button
              type="primary"
              @click="confirmAddCoreBaseCourse(dialogDetail)"
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
  EditPen,
  DocumentChecked,
  Plus,
  Delete,
  Close,
  Edit,
} from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";

import {
  checkProgram,
  checkCoreBaseCourseList,
  editProgram,
} from "@/api/program";
import addBtn from "@/components/general/addBtn.vue";
export default {
  name: "Achieve",
  components: {
    EditPen,
    addBtn,
    DocumentChecked,
    Plus,
    Delete,
    Close,
    Edit,
  },
  data() {
    return {
      hasProgram: false,
      noProgram: false,
      hasAttribute: Boolean,
      currentMajorId: "",
      currentMajorName: "",
      currentSchoolId: "",
      currentYear: "",
      currentDepartmentId: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      addProgramForm: {
        major: "",
        enrollyear: "",
      },
      totalInfo: [],
      requirements: null,
      programId: "",
      dialogDetail: [],
      index1: Number,
      index2: Number,
      newCoreCourse: false,
      searchValue: "",
      allCoreBaseCourse: [],
      programIndicatorId: "",
      temp: [],
    };
  },
  mounted() {
    this.currentMajorId = this.$store.state.major.majorId;
    this.currentMajorName = this.$store.state.major.majorName;
    this.currentSchoolId = this.$store.state.currentInfo.schoolId;
    this.currentDepartmentId = this.$store.state.currentInfo.departmentId;
    this.currentYear = this.$store.state.currentInfo.year;
    //新增培养计划的表单 数据初始化
    this.addProgramForm.major = this.currentMajorName;
    this.addProgramForm.enrollyear = this.$store.state.currentInfo.year;

    this.checkProgram();
  },
  computed: {
    yearChange() {
      return this.$store.state.currentInfo.year;
    },
  },
  watch: {
    yearChange: {
      deep: true,
      handler(value) {
        this.checkProgram();
      },
    },
  },
  methods: {
    //跳转至编辑毕业要求页面
    goEdit() {
      this.$router.push({
        path: "/edit",
        query: { programId: this.programId },
      });
    },
    //编辑支撑课程
    editSupportCourse(attribute, detail, index1, index2) {
      this.dialogFormVisible = true;
      this.index1 = index1;
      this.index2 = index2;
      console.log("index1", this.index1);
      console.log("index2", this.index2);
      console.log("attribute", attribute);
      this.dialogDetail = JSON.parse(JSON.stringify(attribute));
      let a = JSON.parse(JSON.stringify(attribute.programIndicators));
      this.dialogDetail.programIndicators = a;
      // let a = JSON.parse(JSON.stringify(detail));
      console.log("a", a);

      console.log("1dialogDetail", this.dialogDetail);

      let temporary = JSON.parse(JSON.stringify(detail));
      // this.dialogDetail.programIndicators = [];
      // this.dialogDetail.programIndicators.push(temporary);
      this.programIndicatorId = this.dialogDetail.programIndicators[index2].id;
      if (
        this.dialogDetail.programIndicators[index2].coreBaseCourses === null
      ) {
        this.dialogDetail.programIndicators[index2].coreBaseCourses = [];
      }
      this.getCoreBaseCourseList();
      console.log("dialogDetail", this.dialogDetail);
      this.temp = JSON.parse(JSON.stringify(temporary));
      console.log("temp", this.temp);
    },
    //查询有无培养计划
    checkProgram() {
      checkProgram(this.currentMajorId, this.$store.state.currentInfo.year)
        .then((res) => {
          console.log("checkProgram", res);
          if (res.msg == "未查到" && res.code == "SUCCESS") {
            this.hasProgram = false;
            this.noProgram = true;
            this.$store.commit("major/setProgramId", "");
          }
          if (res.msg == "操作成功" && res.code == "SUCCESS") {
            this.noProgram = false;
            this.hasProgram = true;
            this.programId = res.data.programId;
            this.$store.commit("major/setProgramId", this.programId);
            if (res.data.graduateAttributes === null) {
              this.hasAttribute = false;
              console.log(this.hasAttribute);
            } else {
              this.requirements = res.data.graduateAttributes;
              // 将为null的coreBaseCourses处理为空数组
              this.requirements.forEach((requirement) => {
                requirement.programIndicators.forEach((programIndicator) => {
                  if (programIndicator.coreBaseCourses === null) {
                    programIndicator.coreBaseCourses = [];
                  }
                });
              });
            }
            this.totalInfo = res.data;

            console.log("requirements", this.requirements);
            if (this.requirements !== null && this.requirements.length == 0) {
              this.hasAttribute = false;
            }
            if (this.requirements !== null) {
              this.hasAttribute = true;
            }
          }
          console.log(this.hasAttribute);
        })
        .catch((e) => {
          console.log(e)
          if (e.data.msg == "资源不存在" && e.data.code == "PROGRAM_NOT_FIND") {
            this.hasProgram = false;
            this.noProgram = true;
            this.$store.commit("major/setProgramId", "");
          }
        });
    },
    //查询可支撑某个毕业要求二级指标点的支撑课程列表
    getCoreBaseCourseList() {
      let that = this;
      checkCoreBaseCourseList(
        this.currentDepartmentId,
        this.programId,
        this.programIndicatorId,
        this.currentSchoolId
      ).then((res) => {
        // console.log("checkCoreBaseCourseList", res);
        if (res.code == "SUCCESS") {
          that.allCoreBaseCourse = res.data;
          console.log("allCoreBaseCourse", that.allCoreBaseCourse);
        }
      });
    },
    //远程查询实现
    querySearch(queryString, cb) {
      var allCoreBaseCourse = this.allCoreBaseCourse;
      var results = queryString
        ? allCoreBaseCourse.filter(this.createStateFilter(queryString))
        : allCoreBaseCourse;
      results.forEach((result) => {
        result.value = result.courseName;
      });
      console.log("result后", results);
      cb(results);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    //实现模糊搜索
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    //新增支持课程
    addCoreBaseCourse(searchValue, index1, index2) {
      try {
        console.log(searchValue, index1, index2);
        // console.log(
        //   "一开始的requirements[index1].programIndicators",
        //   this.requirements[index1].programIndicators
        // );
        //处理一下要存进去的coreBasecourse对象，searchValue中只有courseName
        let newCoreBaseCourse = {};
        newCoreBaseCourse.courseName = searchValue;

        // 需要根据courseName去对比allCoreBaseCourse，拿到对应的courseId，bcdmId
        let index = this.allCoreBaseCourse.findIndex(
          (itemObject) => itemObject.courseName === newCoreBaseCourse.courseName
        );
        newCoreBaseCourse.courseId = this.allCoreBaseCourse[index].courseId;
        newCoreBaseCourse.bcdmId = this.allCoreBaseCourse[index].bcdmId;
        // console.log("@!",index);
        newCoreBaseCourse.id = Number;
        this.allCoreBaseCourse.forEach((item) => {
          if ((item.value = searchValue)) {
            newCoreBaseCourse.id = item.courseId;
          }
        });
        // 权重,达成度初始化
        newCoreBaseCourse.weight = 0;
        newCoreBaseCourse.achievement = Number;
        newCoreBaseCourse.isEditWeight = false;

        // console.log("!", this.requirements[index1].programIndicators[index2]);
        //判断选中的课程是否已存在
        this.requirements[index1].programIndicators[
          index2
        ].coreBaseCourses.forEach((item) => {
          console.log("item", item, item.courseName == searchValue);
          if (item.courseName == searchValue) {
            ElMessage.error(searchValue + "已存在");
            this.newCoreCourse = false;
            this.searchValue = "";
            throw "true";
          }
        });
        //若该课程不存在，则加入coreBasecourses
        // this.requirements[index1].programIndicators[
        //   index2
        // ].coreBaseCourses.push(newCoreBaseCourse);
        this.dialogDetail.programIndicators[index2].coreBaseCourses.push(
          newCoreBaseCourse
        );
        //不存在coreBasecourse属性，则直接创建
        this.newCoreCourse = false;
        this.searchValue = "";

        console.log(
          "requirements.programIndicators",
          this.requirements[index1].programIndicators[index2],
          "dialogDetail",
          this.dialogDetail,
          "newCoreBaseCourse",
          newCoreBaseCourse
        );
      } catch (stat) {
        if (stat == "true") {
          return;
        }
      }
    },
    // 确认添加支撑课程
    confirmAddCoreBaseCourse(dialogDetail) {
      console.log("@", dialogDetail, this.index2);
      // index2表示某毕业要求的第几个指标点,temp临时保存对应的指标点信息
      let temp = dialogDetail.programIndicators[this.index2];
      console.log("temp", temp);
      this.requirements[this.index1].programIndicators[this.index2] = temp;
      let sum = 0;
      let isItemNull = false;
      let haveZero = false;
      if (temp.coreBaseCourses.length == 0) {
        isItemNull = true;
        haveZero = false;
        sum = 100;
      }
      if (!temp.coreBaseCourses.length == 0) {
        isItemNull = false;
        temp.coreBaseCourses.forEach((coreBaseCourse) => {
          //逻辑校验处理
          sum = sum + Number(coreBaseCourse.weight);
          if (coreBaseCourse.weight == "0") {
            haveZero = true;
          }
        });
      }
      if (isItemNull == true) {
        ElMessage.error("请为指标点选择支撑课程");
      }
      if (haveZero == true) {
        ElMessage.error("权重范围在1%-100%");
      }
      if (sum !== 100) {
        ElMessage.error("权重之和必须为100%");
      }

      if (sum == 100 && isItemNull == false && haveZero == false) {
        editProgram(this.totalInfo).then((res) => {
          console.log("confirmAddCoreBaseCourse", res);
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `新建成功`,
              duration: 1500,
            });
            this.dialogFormVisible = false;
          }
        });
      }
    },
    //取消添加支撑课程
    cancelAddCoreBaseCourse(dialogDetail) {
      console.log("dialogDetail", dialogDetail);
      this.requirements[this.index1].programIndicators[this.index2] = this.temp;
      this.dialogFormVisible = false;
    },
    //编辑权重
    editWeight(coreBaseCourse) {
      coreBaseCourse.isEditWeight = true;
    },
    //保存权重
    saveWeight(coreBaseCourse) {
      if (
        Number(coreBaseCourse.weight) > 100 ||
        Number(coreBaseCourse.weight) <= 0
      ) {
        ElMessage.error("权重范围在1%-100%");
      } else {
        coreBaseCourse.isEditWeight = false;
      }
    },
    //删除支撑课程
    deleteCourse(programIndicator, index) {
      //这个是编辑对话框中的数组，但不能影响到整体的requirement，因为是深克隆的
      //对于整体的requirement处理，放在了cancelAddCoreBaseCourse()，temp保存起始内容
      this.temp = JSON.parse(JSON.stringify(programIndicator));
      programIndicator.coreBaseCourses.splice(index, 1);
      this.requirements[this.index1].programIndicators[this.index2] =
        programIndicator;
    },
  },
};
</script>

<style scoped>
.Block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
/* .content {
  height: 100vh;
  background-color: #f2f2f2;
} */
.body-check {
  display: flex;
  justify-content: center;
  /* background-color: #f2f2f2; */
}
.no-program {
  display: flex;
  flex-direction: column;
}
.card {
  width: 800px;
  background: white;
  margin-top: 55px;
  padding: 20px;
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
.edit-pen {
  cursor: pointer;
  color: grey;
  margin-left: 710px;
}
/* 毕业要求 */
.graduate-attribute {
  display: flex;
  flex-direction: column;
}
.attribute {
  display: flex;
  flex-direction: row;
}
.attribute-detail {
  display: flex;
  flex-direction: row;
}
.detail-num {
  color: #5c6bc0;
  font-weight: bold;
  margin-left: 40px;
  margin-top: 20px;
  font-size: 24px;
}
.name {
  font-size: 22px;
  font-weight: bold;
  margin: 20px;
  white-space: nowrap;
  margin-left: 30px;
}
.desc {
  margin: 20px;
  margin-left: 30px;
}
.support-head {
  display: flex;
  flex-direction: row;
}
.support-course:hover .penIcon {
  opacity: 1;
}
.penIcon {
  opacity: 0;
}
:deep().pen-icon {
  cursor: pointer;
  margin-left: 545px;
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
.autocomplete-icon {
  cursor: pointer;
  color: #757575;
  margin-left: 15px;
  width: 24px;
  height: 24px;
}
.showWeight {
  font-size: 16px;
}
.editWeight .el-icon {
  font-size: 16px;
  margin-left: 10px;
}
:deep().edit-icon {
  margin-top: 2px;
  cursor: pointer;
  width: 18px;
  height: 18px;
  color: #757575;
}
.el-icon {
  cursor: pointer;
  width: 18px;
  height: 18px;
}
</style>
