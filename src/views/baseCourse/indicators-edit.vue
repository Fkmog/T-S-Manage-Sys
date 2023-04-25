<template>
  <div class="content">
    <!-- 顶部导航栏 -->
    <div class="head-block">
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
            style="margin-left: 50px"
            color="rgb(137, 137, 137)"
            @click="back()"
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
            color="rgb(137, 137, 137)"
            size="24px"
            style="margin-left: 10px"
            @click="judgeBeforeSave()"
          >
            <DocumentChecked />
          </el-icon>
        </el-tooltip>
      </el-row>
    </div>
    <div class="body">
      <el-tabs class="major-tab">
        <el-tab-pane
          v-model="chosenMajor"
          v-for="(major, index1) in majorList"
          :key="major.majorId"
          :label="major.majorName"
        >
          <div class="card">
            <span style="color: grey; font-size: 14px; margin-top: 20px"
              >毕业要求指标点</span
            >

            <div
              class="attribute"
              v-for="(indicator, index2) in major.indicators"
              :key="indicator.id"
            >
              <div class="attribute-detail">
                <div class="detail-num">
                  {{ indicator.serialNum }}
                </div>
                <div class="detail-content">
                  <div class="name">{{ indicator.name }}</div>
                  <div class="desc">{{ indicator.description }}</div>
                </div>
                <div class="closeIcon">
                  <el-icon
                    class="close-icon"
                    @click="deleteIndicator(indicator, index1)"
                    ><Close
                  /></el-icon>
                </div>
              </div>

              <!-- 支撑方式 -->
              <div
                v-if="indicator.supportMethodVos.length !== 0"
                style="margin-left: 90px"
              >
                <div class="support-head">
                  <span style="color: grey; font-size: 14px">支撑方式</span>
                  <div class="penIcon">
                    <el-icon
                      class="pen-icon"
                      @click="editSupportMethods(indicator, index1, index2)"
                      ><EditPen
                    /></el-icon>
                  </div>
                </div>
                <div class="methods">
                  <div
                    v-for="method in indicator.supportMethodVos"
                    :key="method.id"
                  >
                    <div class="method-detail">
                      <div class="method-weight">
                        (&nbsp;{{ method.weight }}%&nbsp;)
                      </div>
                      <div class="method-desc" style="margin-left: 80px">
                        {{ method.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <el-row
                class="noSupport"
                v-if="indicator.supportMethodVos.length == 0"
              >
                <div>
                  <el-button
                    style="color: #6573c0"
                    text
                    @click="newSupportPart(indicator, index1, index2)"
                    >添加支撑方式
                  </el-button>
                </div>
              </el-row>
            </div>

            <el-button
              v-show="!newIndicator"
              class="add-indicator-button"
              style="color: #6573c0"
              text
              @click="this.newIndicator = true"
            >
              <el-icon :size="18" color="#586dbe"><Plus /></el-icon>
              新增支持指标点
            </el-button>
            <div
              style="display: flex; flex-direction: row"
              v-show="newIndicator"
            >
              <el-autocomplete
                popper-class="el-autocomplete-suggestion"
                :popper-append-to-body="false"
                v-model="searchValue"
                :fetch-suggestions="querySearch"
                placeholder="选择指标点（筛选可输入文字或指标点编号，如：1.2）"
                style="width: 680px; margin-left: 20px; margin-top: 30px"
                :fit-input-width="true"
                @select="addIndicator(searchValue, index1)"
              ></el-autocomplete>
              <div style="margin-top: 35px">
                <el-icon
                  class="autocomplete-icon"
                  @click="this.newIndicator = false"
                  ><Close
                /></el-icon>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 弹出对话框 -->
    <div>
      <el-dialog
        v-model="dialogFormVisible"
        title="设置支撑方式"
        width="680px"
        :show-close="false"
        :align-center="true"
      >
        <el-row style="margin-bottom: 10px">
          <el-col :span="1"></el-col>
          <el-col :span="4" class="indicator-name"
            >指标点{{ dialogIndicator.serialNum }}</el-col
          >
          <el-col :span="19" class="indicator-desc">{{
            dialogIndicator.description
          }}</el-col>
        </el-row>
        <div style="margin-top: 50px"></div>
        <el-row
          class="assessment"
          v-for="(support, index1) in dialogIndicator.supportMethodVos"
          :key="index1"
          style="margin-top: 30px"
        >
          <el-col :span="1"></el-col>
          <!-- 编辑权重 -->
          <el-col :span="4" v-show="!support.isEditWeight" class="showWeight">
            <el-row>
              <el-col :span="10">{{ support.weight }}% </el-col>
              <el-col :span="12">
                <el-icon @click="editWeight(support)"><Edit /></el-icon>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" v-show="support.isEditWeight" class="editWeight">
            <el-row>
              <el-col :span="12">
                <el-input v-model="support.weight"></el-input>
              </el-col>
              <el-col :span="12">
                <el-icon @click="saveWeight(support)"
                  ><DocumentChecked
                /></el-icon>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="16">
            <el-select
              v-model="support.name"
              style="width: 400px"
              placeholder="课程目标"
            >
              <el-option
                v-for="object in objectives"
                :key="object.id"
                :label="object.name"
                :value="object.name"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1">
            <div style="margin-top: 7px">
              <el-icon @click="deleteSupport(support)"><Close /></el-icon>
            </div>
          </el-col>
        </el-row>

        <el-button
          class="add-support-button"
          style="color: #6573c0; margin-top: 30px"
          text
          @click="addSupport()"
        >
          <el-icon :size="18" color="#586dbe"><Plus /></el-icon>
          新增课程目标
        </el-button>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="confirmAddSupport(dialogIndicator)"
            >
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getIndicators,
  getMajorsProgram,
  getPullIndicator,
  getObjectives,
  saveIndicators,
} from "@/api/basecourse";
import { ElMessageBox, ElMessage } from "element-plus";
import { getMajorInfo } from "@/api/major";
import {
  Back,
  DocumentChecked,
  Plus,
  Delete,
  Close,
  EditPen,
  Edit,
} from "@element-plus/icons-vue";
export default {
  name: "baseCourseIndicatorsEdit",
  components: {
    Back,
    DocumentChecked,
    Plus,
    Delete,
    Close,
    EditPen,
    Edit,
  },
  data() {
    return {
      searchValue: "",
      allIndicators: [],
      newIndicator: false,
      chosenMajor: '',
      course: {
        name: "",
        detailId: Number,
        departmentId: Number,
        schoolId: Number,
      },
      majorList: [],
      programId: Number,
      index1: Number, //确定哪一专业
      index2: Number, //确定哪一指标点
      dialogFormVisible: false,
      dialogIndicator: {},
      objectives: [],
      successNum: 0,
      canSave: true,
      wrongNum: 0,
    };
  },
  mounted() {
    this.course.name = this.$store.state.course.courseName;
    this.course.detailId = this.$store.state.course.detailId;
    this.course.departmentId = this.$store.state.currentInfo.departmentId;
    this.course.schoolId = this.$store.state.currentInfo.schoolId;
    this.programId = this.$store.state.major.programId;
    this.chosenMajor = this.$store.state.baseCourseDetailProgram.majorNum;
    this.checkMajors();
    this.checkPullIndicators();
    this.checkObjectives();
  },
  methods: {
    back() {
      this.$router.push("/baseCourseIndicators");
    },
    judgeBeforeSave() {
      //判断有无未编辑支撑方式的指标点，有则不能保存
      this.wrongNum = 0;
      this.majorList.forEach((major) => {
        major.indicators.forEach((item) => {
          item.supportMethods = item.supportMethodVos;
          if (item.supportMethods.length == 0) {
            this.wrongNum = this.wrongNum + 1;
          }
        });
      });
      if (this.wrongNum > 0) {
        this.canSave = false;
        ElMessage.error("请为指标点添加支撑方式");
      } else {
        this.canSave = true;
      }
      if (this.canSave) {
        this.save();
      }
    },
    save() {
      this.successNum = 0;
      this.majorList.forEach((major) => {
        major.indicators.forEach((item) => {
          item.supportMethods = item.supportMethodVos;
        });
        console.log("保存内容", major);
        major.courseIndicators = major.indicators;
        saveIndicators(major).then((res) => {
          console.log("save", res);
          if (res.code === 'SUCCESS') {
            this.successNum = this.successNum + 1;
            ElMessage({
              type: "success",
              message: `保存成功`,
              duration: 1500,
            });
            this.back();
          } else {
            ElMessage({
              type: "error",
              message: `保存失败`,
              duration: 1500,
            });
          }
        });
      });
    },
    //查询对应的专业以及bcdmId
    checkMajors() {
      getMajorsProgram(
        this.course.detailId,
        this.course.departmentId,
        this.course.schoolId
      ).then((res) => {
        this.majorList = res.data;
        console.log("this.majorList:", this.majorList);
        for (let i = 0; i < this.majorList.length; i++) {
          getMajorInfo(this.majorList[i].majorId).then((res) => {
            this.majorList[i].majorName = res.data.majorName;
          });
        }
        this.checkIndicators();
      });
    },
    //查询各专业对应的Indicators指标点
    checkIndicators() {
      for (let i = 0; i < this.majorList.length; i++) {
        getIndicators(
          this.majorList[i].bcdmId,
          this.course.departmentId,
          this.course.schoolId,
          this.majorList[i].programId
        ).then((res) => {
          console.log("getIndicators:", i, res);
          this.majorList[i].indicators = res.data;
          this.majorList[i].schoolId = this.course.schoolId;
          this.majorList[i].departmentId = this.course.departmentId;

          //处理id->serialNum
          for (let j = 0; j < this.majorList[i].indicators.length; j++) {
            let serialNum = [];
            if (this.majorList[i].indicators[j].id.charAt(0) == 0) {
              serialNum[0] = this.majorList[i].indicators[j].id.charAt(1);
            } else {
              serialNum[0] = this.majorList[i].indicators[j].id.substring(0, 2);
            }
            if (this.majorList[i].indicators[j].id.charAt(2) == 0) {
              serialNum[1] = this.majorList[i].indicators[j].id.charAt(3);
            } else {
              serialNum[1] = this.majorList[i].indicators[j].id.substring(2, 4);
            }
            this.majorList[i].indicators[j].serialNum = serialNum.join(".");
          }
          // 处理supportMethodVos 拼接控制展示/编辑字段
          this.majorList[i].indicators.forEach((support) => {
            support.supportMethodVos.forEach((item) => {
              item.isEditWeight = false;
            });
          });
        });
      }
    },
    //获取课程目标
    checkObjectives() {
      getObjectives(this.course.detailId).then((res) => {
        //list存放初始数据
        this.objectives = res.data.objectives;
        //处理数据-serialNum
        if (this.objectives) {
          this.objectives.forEach((value) => {
            if (value.id.charAt(0) == "0") {
              value.serialNum = value.id.charAt(1);
            } else {
              value.serialNum = value.id;
            }
          });
        }
        // this.objectives.forEach((object) => {
        //   object.assessmentMethods.forEach((assessment) => {
        //     //处理select选择器所需要的数据结构
        //     assessment.activities.itemObject = assessment.activities.item.map(
        //       (item) => ({ value: item })
        //     );
        //   });
        // });
        console.log("objectives:", this.objectives);
      });
    },
    //删除指标点
    deleteIndicator(indicator, index1) {
      this.index1 = index1;
      ElMessageBox.confirm(
        "是否确定删除指标点" + indicator.serialNum + "?",
        "",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.majorList[index1].indicators.pop(indicator);
      });
      // console.log("deleteIndicator", indicator);
    },
    //编辑支撑方式
    editSupportMethods(indicator, index1, index2) {
      console.log("editSupportMethods", indicator, index2);
      this.index1 = index1;
      this.index2 = index2;
      // 深克隆
      this.dialogIndicator = JSON.parse(JSON.stringify(indicator));
      console.log("indicator", this.dialogIndicator);
      this.dialogFormVisible = true;
    },
    //删除课程目标
    deleteSupport(support) {
      this.dialogIndicator.supportMethodVos.pop(support);
    },
    //新增课程目标
    addSupport() {
      let support = {};
      support.name = "";
      support.weight = 0;
      support.isEditWeight = false;
      support.description = "";
      support.id = "";
      this.dialogIndicator.supportMethodVos.push(support);
      // console.log("@", this.dialogIndicator.supportMethodVos);
    },
    //新创建的指标点下 新建支撑方式部分
    newSupportPart(indicator, index1, index2) {
      this.index1 = index1;
      this.index2 = index2;
      this.dialogIndicator = JSON.parse(JSON.stringify(indicator));
      // console.log("!!!", indicator);
      this.dialogFormVisible = true;
    },
    //新增支持指标点
    addIndicator(searchValue, index1) {
      try {
        let info = searchValue.split(" ");
        // 判断选中的指标点是否已存在
        console.log("!", this.majorList[index1].indicators, info);
        this.majorList[index1].indicators.forEach((item) => {
          if (item.serialNum == info[2]) {
            ElMessage.error("指标点" + info[2] + "已存在");
            this.searchValue = "";
            throw "true";
          }
        });
        let newIndicator = {};
        newIndicator.supportMethodVos = [];
        newIndicator.achievement = Number;
        newIndicator.name = "";
        newIndicator.description = info[3];
        newIndicator.serialNum = info[2];
        let i = info[2].split(".");
        if (Number(i[0]) > 9) {
          newIndicator.id = i[0];
        } else {
          newIndicator.id = "0" + i[0];
        }
        if (Number(i[1]) > 9) {
          newIndicator.id = newIndicator.id + i[1];
        } else {
          newIndicator.id = newIndicator.id + "0" + i[1];
        }
        console.log("#",newIndicator);
        this.majorList[index1].indicators.push(newIndicator);
        console.log("##",this.majorList[index1]);

        this.newIndicator = false;
        this.searchValue = "";
      } catch (stat) {
        if (stat == "true") {
          return;
        }
      }
    },
    //查询新增指标点列表
    checkPullIndicators() {
      getPullIndicator(this.programId).then((res) => {
        console.log("getPullIndicator", res);
        this.allIndicators = res.data;
      });
    },
    //远程查询实现
    querySearch(queryString, cb) {
      var allIndicators = this.allIndicators;
      var results = queryString
        ? allIndicators.filter(this.createStateFilter(queryString))
        : allIndicators;

      results.map((item) => {
        return (item.value =
          "毕业要求" +
          item.requirementSerialNum +
          " " +
          item.requirementName +
          " " +
          item.indicatorSerialNum +
          " " +
          item.indicatorDescription);
      });
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
    //编辑权重
    editWeight(support) {
      // console.log("1", support);
      support.isEditWeight = true;
    },
    //保存权重
    saveWeight(support) {
      if (Number(support.weight) > 100 || Number(support.weight) <= 0) {
        ElMessage.error("权重范围在1%-100%");
      } else {
        support.isEditWeight = false;
      }
    },
    //确定编辑支撑方式
    confirmAddSupport(dialogIndicator) {
      let sum = 0;
      let isItemNull = false;
      let haveZero = false;
      dialogIndicator.supportMethodVos.forEach((support) => {
        //处理supportMethodVos下的id赋值
        this.objectives.forEach((item) => {
          if (item.name == support.name) {
            support.id = item.id;
          }
        });
        //逻辑校验处理
        sum = sum + Number(support.weight);
        if (support.name == "") {
          isItemNull = true;
        }
        if (support.weight == "0") {
          haveZero = true;
        }
      });
      if (haveZero == true) {
        ElMessage.error("权重范围在1%-100%");
      }
      if (sum !== 100) {
        ElMessage.error("权重之和必须为100%");
      }
      if (isItemNull == true) {
        ElMessage.error("请为支持方式选择课程目标");
      }
      if (sum == 100 && isItemNull == false && haveZero == false) {
        this.majorList[this.index1].indicators[this.index2].supportMethodVos =
          this.dialogIndicator.supportMethodVos;
        // console.log("~",this.majorList[this.index1].indicators[this.index2].supportMethodVos);
        this.dialogFormVisible = false;
      }
    },
  },
};
</script>

<style scoped>
.content {
  height: 100vh;
  background-color: #f2f2f2;
}
.head-block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
.block-row {
  margin-top: 18px;
}
.icon {
  cursor: pointer;
}
.body {
  display: flex;
  justify-content: center;
}
.divider {
  margin-left: 20px;
  height: 24px;
}
.major-tab {
  margin-top: 100px;
}
.card {
  display: flex;
  flex-direction: column;
  width: 750px;
  background: white;
  margin-bottom: 20px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  padding: 0 0 50px 20px;
}
:deep().el-tabs__content {
  overflow: visible;
}
.detail-content {
  width: 600px;
}
.detail-num {
  color: #5c6bc0;
  font-weight: bold;
  margin-left: 25px;
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
  margin-top: 25px;
}
.attribute:hover .closeIcon {
  opacity: 1;
}
.closeIcon {
  opacity: 0;
  margin-top: 50px;
  margin-left: 30px;
}
:deep().close-icon {
  cursor: pointer;
  width: 24px;
  height: 24px;
  color: #757575;
}

.support-head {
  display: flex;
  flex-direction: row;
}
.attribute:hover .penIcon {
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
.attribute-detail {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}
.methods {
  margin-top: 20px;
}
.method-detail {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}
.add-indicator-button {
  width: 150px;
  margin-top: 30px;
}
.autocomplete-icon {
  cursor: pointer;
  color: #757575;
  margin-left: 15px;
  width: 24px;
  height: 24px;
}
.indicator-name {
  font-weight: 700;
}
:deep().el-dialog__title {
  color: #808080;
  display: flex;
  justify-content: center;
  font-size: 20px;
}
.el-icon {
  cursor: pointer;
  width: 18px;
  height: 18px;
}
.indicator-name {
  font-size: 16px;
}
.noSupport {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
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
:deep().head-block .el-icon {
  width: 24px;
  height: 24px;
}
:deep().head-block .el-icon svg {
  width: 24px;
  height: 24px;
}
</style>
