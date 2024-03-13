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
      <el-tabs
        class="major-tab"
        v-model="chosenMajor"
        @tab-change="tabChange()"
      >
        <el-tab-pane
          v-model="chosenMajor"
          v-for="(major, index1) in majorList"
          :key="major.majorId"
          :label="major.programVersion"
        >
          <div class="card">
            <el-row style="margin-top: 30px">
              <el-col :span="22">
                <span style="color: grey; font-size: 14px; margin-top: 20px"
                  >毕业要求指标点</span
                >
              </el-col>
              <el-col :span="2">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="从其他大纲复制"
                  placement="bottom"
                  :hide-after="0"
                >
                  <el-icon
                    class="icon"
                    size="22px"
                    color="rgb(137, 137, 137)"
                    @click="openDrawer()"
                  >
                    <CopyDocument />
                  </el-icon>
                </el-tooltip>
              </el-col>
            </el-row>

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
                    <el-row class="method-detail">
                      <el-col :span="4" class="method-weight">
                        (&nbsp;{{ method.weight }}%&nbsp;)
                      </el-col>
                      <el-col :span="18" class="method-desc">
                        {{ method.description }}
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
              <el-row
                class="noSupport"
                v-if="indicator.supportMethodVos.length === 0"
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
    <!-- 弹出设置支撑方式对话框 -->
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
              <el-col :span="12">{{ support.weight }}% </el-col>
              <el-col :span="12">
                <el-icon @click="editWeight(support)"><Edit /></el-icon>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" v-show="support.isEditWeight" class="editWeight">
            <el-row>
              <el-col :span="12">
                <el-input
                  v-model="support.weight"
                  @keyup.enter="saveWeight(support)"
                ></el-input>
              </el-col>
              <el-col :span="12">
                <el-icon @click="saveWeight(support)"
                  ><DocumentChecked
                /></el-icon>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="18">
            <el-select
              v-model="support.description"
              style="width: 450px"
              placeholder="课程目标"
            >
              <el-option
                v-for="object in objectives"
                :key="object.id"
                :label="object.complete"
                :value="object.description"
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
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 弹出复制指标点drawer -->
    <el-drawer v-model="drawer">
      <el-row>
        <el-col :span="14">
          <DrawerSearch msg="搜索专业名称" @SearchValue="getSearchValue" />
        </el-col>
        <el-col :span="10">
          <el-select
            v-model="year"
            placeholder="选择培养方案版本"
            clearable
            @change="getCopyProgram()"
          >
            <el-option
              v-for="year in enroll_year"
              :key="year.dictValue"
              :label="year.dictLabel"
              :value="year.dictLabel"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 40px">
        <el-table :data="programList" style="width: 100%">
          <el-table-column type="expand">
            <template #default="props">
              <el-table
                :data="props.row.baseCourseAndDetailVoList"
                @row-click="copyCourse"
              >
                <el-table-column label="课程名" prop="courseName" />
                <el-table-column label="课程号" prop="courseCode" />
                <el-table-column label="版本" prop="bcDetails[0].versionName" />
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            prop="majorName"
            label="专业名称"
            min-width="180px"
          />
          <el-table-column prop="enrollyear" label="版本" min-width="180px" />
        </el-table>
      </el-row>
    </el-drawer>
    <!-- 复制弹窗 -->
    <el-dialog v-model="dialogVisible" title="从其他大纲复制" width="400px">
      <el-row style="margin-bottom: 20px; font-size: 15px"
        >从《{{ currentRow.courseName }}》{{
          currentRow.bcDetails[0].versionName
        }}大纲复制毕业要求指标点</el-row
      >
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="copyInfo()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getDictionary } from "@/api/dictionary";
import DrawerSearch from "@/components/general/drawerSearch.vue";
import {
  getIndicators,
  getMajorsProgram,
  getPullIndicator,
  getObjectives,
  saveIndicators,
  getProgramCourseList,
  copyIndicator,
} from "@/api/basecourse";
import { searchProgram } from "@/api/program";
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
  CopyDocument,
} from "@element-plus/icons-vue";
export default {
  name: "baseCourseIndicatorsEdit",
  components: {
    DrawerSearch,
    Back,
    DocumentChecked,
    Plus,
    Delete,
    Close,
    EditPen,
    Edit,
    CopyDocument,
  },
  data() {
    return {
      currentRow: [],
      dialogVisible: false,
      programCourse: [],
      programList: [],
      year: "",
      keyword: "",
      enroll_year: [],
      drawer: false,
      searchValue: "",
      allIndicators: [],
      newIndicator: false,
      chosenMajor: "0",
      course: {
        name: "",
        detailId: Number,
        departmentId: Number,
        schoolId: Number,
      },
      majorList: [],
      currentProgramId: "",
      programIdList: [],
      majorListCopy: [],
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
  computed: {
    currentProgramIdChange() {
      return this.currentProgramId;
    },
  },
  watch: {
    currentProgramIdChange: {
      deep: true,
      handler(value) {
        this.checkPullIndicators();
      },
    },
  },
  mounted() {
    this.course.name = this.$store.state.course.courseName;
    this.course.detailId = this.$store.state.course.detailId;
    this.course.departmentId = this.$store.state.currentInfo.departmentId;
    this.course.schoolId = this.$store.state.currentInfo.schoolId;
    // this.programId = this.$store.state.major.programId;
    this.chosenMajor = this.$store.state.baseCourseDetailProgram.majorNum;
    this.checkMajors();
    this.checkObjectives();
    this.getDictionary();
  },
  methods: {
    back() {
      console.log(
        this.majorListCopy,
        this.majorList,
        JSON.stringify(this.majorListCopy) === JSON.stringify(this.majorList)
      );
      if (
        !(JSON.stringify(this.majorListCopy) === JSON.stringify(this.majorList))
      ) {
        ElMessageBox.confirm("数据还未保存，是否仍然关闭？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push("/baseCourseIndicators");
          })
          .catch(() => {});
      } else {
        this.$router.push("/baseCourseIndicators");
      }
    },
    //判断有无未编辑支撑方式的指标点，有则不能保存
    judgeBeforeSave() {
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
    // 保存
    save() {
      this.successNum = 0;
      this.majorList.forEach((major) => {
        major.indicators.forEach((item) => {
          item.supportMethods = item.supportMethodVos;
        });
        console.log("保存内容", major);
        major.courseIndicators = major.indicators;
        saveIndicators(major)
          .then((res) => {
            console.log("save", res);
            if (res.code === "SUCCESS") {
              this.successNum = this.successNum + 1;
              ElMessage({
                type: "success",
                message: `更新成功`,
                duration: 1500,
              });
              //更新副本
              this.majorListCopy = JSON.parse(JSON.stringify(this.majorList));
              this.back();
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
      });
    },
    //获取数据字典
    getDictionary() {
      getDictionary().then((res) => {
        console.log("getDictionary", res);
        this.enroll_year = res.enroll_year;
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
            this.majorList[i].programVersion =
              this.majorList[i].majorName + "-" + this.majorList[i].enrollyear;
            this.programIdList[i] = this.majorList[i].programId;
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
              console.log("展示的item", item);
            });
          });
          this.currentProgramId = this.programIdList[this.chosenMajor];
          // 定义一个基本的majorList副本，用作判断有无修改
          this.majorListCopy = JSON.parse(JSON.stringify(this.majorList));
        });
      }
    },
    //获取课程目标
    checkObjectives() {
      getObjectives(this.course.detailId).then((res) => {
        //list存放初始数据
        this.objectives = res.data.objectives;
        //处理数据-serialNum
        console.log("this.objectives", this.objectives);
        if (this.objectives) {
          this.objectives.forEach((value) => {
            if (value.id.charAt(0) == "0") {
              value.serialNum = value.id.charAt(1);
            } else {
              value.serialNum = value.id;
            }
            value.complete =
              "课程目标" + value.serialNum + "：" + value.description;
            // console.log("1232134234",value.complete,value.name);
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
        "是否确认删除指标点" + indicator.serialNum + "?",
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
        // console.log("!info", info, info.length);
        //有简称的时候 info：[毕业要求1，简称,1.1，描述]
        if (info.length == 4) {
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
          newIndicator.name = info[1];
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
          this.majorList[index1].indicators.push(newIndicator);
          this.newIndicator = false;
          this.searchValue = "";
          console.log("newIndicator", newIndicator);
        }
        //没有简称的时候  info：[毕业要求1，1.1，描述]
        if (info.length == 3) {
          this.majorList[index1].indicators.forEach((item) => {
            if (item.serialNum == info[1]) {
              ElMessage.error("指标点" + info[1] + "已存在");
              this.searchValue = "";
              throw "true";
            }
          });
          let newIndicator = {};
          newIndicator.supportMethodVos = [];
          newIndicator.achievement = Number;
          newIndicator.name = "";
          newIndicator.description = info[2];
          newIndicator.serialNum = info[1];
          let i = info[1].split(".");
          if (Number(i[0]) > 9) {
            newIndicator.id = i[0];
          } else {
            newIndicator.id = "0" + i[0];
          }
          if (Number(i[1]) > 9) {
            newIndicator.id = newIndicator.id + i[1];
          } else {
            chosenMajor;
            newIndicator.id = newIndicator.id + "0" + i[1];
          }
          this.majorList[index1].indicators.push(newIndicator);
          this.newIndicator = false;
          this.searchValue = "";
          console.log("newIndicator", newIndicator);
        }
      } catch (stat) {
        if (stat == "true") {
          return;
        }
      }
    },
    //查询新增指标点列表
    checkPullIndicators() {
      getPullIndicator(this.currentProgramId).then((res) => {
        console.log("getPullIndicator", res);
        this.allIndicators[this.chosenMajor] = res.data;
      });
    },
    //远程查询实现
    querySearch(queryString, cb) {
      var allIndicators = this.allIndicators;
      var results = queryString
        ? allIndicators.filter(this.createStateFilter(queryString))
        : allIndicators;
      console.log("result", results);
      results.forEach((result) => {
        result.map((item) => {
          if (item.requirementName === null) {
            console.log("sange", item);

            return (item.value =
              "毕业要求" +
              item.requirementSerialNum +
              " " +
              item.indicatorSerialNum +
              " " +
              item.indicatorDescription);
          } else {
            console.log("四个", item);
            return (item.value =
              "毕业要求" +
              item.requirementSerialNum +
              " " +
              item.requirementName +
              " " +
              item.indicatorSerialNum +
              " " +
              item.indicatorDescription);
          }
        });
      });
      results = results[0];
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
          // console.log("item便利",item);
          if (item.description == support.description) {
            support.id = item.id;
            support.serialNum = item.serialNum;
            console.log("赋id,serialNum后的item", support);
          }
        });
        //逻辑校验处理
        sum = sum + Number(support.weight);
        if (support.description == "") {
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
        console.log(
          "~",
          this.majorList[this.index1].indicators[this.index2].supportMethodVos
        );
        this.dialogFormVisible = false;
      }
    },
    //切换tab
    tabChange() {
      this.currentProgramId = this.programIdList[this.chosenMajor];
      console.log(this.programIdList);
      console.log(
        "tab",
        "currentProgramId",
        this.currentProgramId,
        "chosen",
        this.chosenMajor
      );
    },
    //唤起抽屉
    openDrawer() {
      this.drawer = true;
    },
    // 查询对应的专业
    getCopyProgram() {
      searchProgram(
        this.course.schoolId,
        this.course.departmentId,
        this.keyword,
        this.year
      ).then((res) => {
        this.programList = res.rows;
        console.log("查询对应的专业 ", this.programList);
      });
    },
    //搜索栏搜索
    getSearchValue(data) {
      this.keyword = data;
      this.getCopyProgram();
    },
    // 展开行
    // expandChange(row) {
    //   let programId = row.programId;
    //   getProgramCourseList(programId).then((res) => {
    //     console.log("@", res);
    //     this.programCourse = res.rows;
    //   });
    // },
    //选中被复制对象
    copyCourse(row) {
      console.log("copyCourse", row);
      this.currentRow = row;
      // 唤起弹窗
      this.dialogVisible = true;
    },
    //复制
    copyInfo() {
      let obj = {};
      obj.sourcebcdmId =
        this.currentRow.bcDetails[0].bcDetailProgramVoList[0].bcdmId;
      obj.targetbcdmId = this.majorList[this.chosenMajor].bcdmId;
      copyIndicator(obj).then((res) => {
        console.log("copyIndicator", res);
        this.dialogVisible = false;
        if (res.code == "SUCCESS") {
          ElMessage({
            type: "success",
            message: `复制成功`,
            duration: 1500,
          });
          this.drawer = false;
        }
      });
    },
  },
};
</script>

<style scoped>
/* .content {
  height: 100vh;
  background-color: #f2f2f2;
} */
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
  font-size: 16px;
  margin-top: 5px;
}
.editWeight .el-icon {
  font-size: 16px;
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
