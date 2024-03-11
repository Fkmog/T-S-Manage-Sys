<template>
  <div
    layout="column"
    flex
    class="ng-scope layout-column flex"
    v-if="isRouterAlive"
  >
    <div class="block">
      <el-row class="block-row">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="返回"
          placement="bottom"
          :hide-after="0"
        >
          <el-button link @click="goTeacher()">
            <el-icon
              class="icon"
              size="24px"
              color="rgb(137, 137, 137)"
              style="margin-left: 50px"
            >
              <Back />
            </el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="保存成绩"
          placement="bottom"
          :hide-after="0"
          :disabled="!isValid()"
        >
          <el-button @click="save" link :disabled="!isValid()">
            <el-icon
              size="24px"
              color="rgb(137, 137, 137)"
              style="margin-left: 20px"
            >
              <DocumentChecked />
            </el-icon>
          </el-button>
        </el-tooltip>
      </el-row>
    </div>

    <!-- editable @edit="handleTabsEdit"-->
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      class="activity-tab"
      @tab-click="editableTabsValueChange"
      v-show="hasActivities && hasObjectives"
    >
      <el-tab-pane
        v-for="(item, index) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <div class="card-container" v-show="hasActivities && hasObjectives">
      <div class="hot-table-container" id="courseHot"></div>
    </div>

    <div
      v-show="hasNoActivities"
      style="
        padding-top: 120px;
        display: flex;
        justify-content: center;
        font-size: 22px;
        background-color: #f2f2f2;
      "
    >
      未创建成绩项
    </div>

    <div
      v-show="hasNoObjectives"
      style="
        padding-top: 120px;
        display: flex;
        justify-content: center;
        font-size: 22px;
        background-color: #f2f2f2;
      "
    >
      未创建课程目标
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from "vue";

import { HotTable, HotColumn } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import {
  ElTooltip,
  ElIcon,
  ElInput,
  ElMessage,
  ElMessageBox,
} from "element-plus";

import Action from "element-plus";

import {
  Back,
  FolderChecked,
  InfoFilled,
  Loading,
  Download,
  UploadFilled,
  DocumentAdd,
  CirclePlus,
  DocumentChecked,
} from "@element-plus/icons-vue";
import Handsontable from "handsontable";
import request from "@/utils/request/request";
import "@/components/teacher/addTeacher.js";

import "element-plus/dist/index.css";
import "handsontable/dist/handsontable.full.css";

import "handsontable/dist/handsontable.full.css";

export default {
  name: "addTeacher",
  data() {
    let self = this;
    return {
      errorInTable: false,

      editableTabsValue: "0",
      currenteditableTabsValue: 0,
      maxeditableTabsValue: 0,
      editableTabs: [],
      tabIndex: 0,

      originData: [],

      hasActivities: false,
      hasNoActivities: false,
      hasScores: false,
      hasNoScores: false,
      hasObjectives: false,
      hasNoObjectives: false,
      departmentId: "",
      schoolId: "",
      programId: "",
      classInfo: "",

      //一开始有多少行和列
      NUM_AUX_ROW: 3,
      NUM_AUX_COL: 2,
      ROW_INDEX_ACTIVITY: 0,
      ROW_INDEX_TOTALSCORE: 1,
      ROW_INDEX_SCORESETTING: 2,

      currentNumberofActivities: 0,

      firstActivities: true,

      //添加学生
      addNewStudentList: [],
      hotInstance: undefined,
      columnList: [],
      scoreSettingOptions: [" ", "缺考", "缓考", "不及格", "取消考试资格"],
      isRouterAlive: true,
      dirty: false,
      saving: false,
      count: 0,
      localres: {},
      postData: { students: [], scores: [], newStudents: [] },
      db: { items: [] },
      departmentId: 0,
      fromCourseBatchAdd: false,
    };
  },
  components: {
    ref,
    onMounted,
    reactive,
    HotTable,
    HotColumn,
    registerAllModules,
    ElTooltip,
    ElIcon,
    ElInput,
    Handsontable,
    Back,
    FolderChecked,
    InfoFilled,
    Loading,
    Download,
    UploadFilled,
    DocumentAdd,
    ElMessage,
    ElMessageBox,
    Action,
    CirclePlus,
    DocumentChecked,
  },
  methods: {
    editableTabsValueChange(pane) {
      let that = this;
      this.currenteditableTabsValue = Number(pane.props.name);
      let tempDB = this.originData;
      let currentPage = this.currenteditableTabsValue - 1;

      for (let j = 3; j < this.db.items[0].length; j++) {
        if (!this.db.items[currentPage][j]) {
          // console.log(i, j);
          this.db.items[currentPage][j] = {};
          for (
            let temp = 0;
            temp < Object.keys(this.db.items[currentPage][1]).length;
            temp++
          ) {
            this.db.items[currentPage][j][temp] = null;
          }
        }
        // console.log(Object.keys(this.db.items[i][j]).length);
        if (this.db.items[0].length < this.db.items[currentPage].length) {
          while (this.db.items[0].length != this.db.items[currentPage].length) {
            this.db.items[currentPage].pop();
          }
        }

        for (let k = 0; k < 2; k++) {
          // console.log(this.db.items[i][j][k] + ":" + this.db.items[0][j][k]);

          if (!this.db.items[0][j][k]) {
            this.db.items[currentPage][j][k] = null;
          } else {
            this.db.items[currentPage][j][k] = this.db.items[0][j][k];
          }
        }
      }

      for (let j = 3; j < this.db.items[currentPage].length; j++) {
        let ID = this.db.items[currentPage][j][0];
        let Name = this.db.items[currentPage][j][1];
        console.log("ID:", ID);
        if (!ID || !Name) {
          console.log("this Id is null", this.db.items[currentPage][j]);

          for (
            let i = 0;
            i < Object.keys(this.db.items[currentPage][j]).length;
            i++
          ) {
            this.db.items[currentPage][j][i] = null;
          }
        } else {
          for (let l = 3; l < tempDB[currentPage].length; l++) {
            let keys = Object.keys(tempDB[currentPage][l]);
            let index = keys.find((key) => tempDB[currentPage][l][key] === ID);
            let Nameindex = keys.find(
              (key) => tempDB[currentPage][l][key] === Name
            );
            // console.log(index);

            if (index == 0) {
              // console.log(tempDB[currentPage][l]);
              // console.log(
              //   "student:",
              //   this.db.items[currentPage][j],
              //   "origin score:",
              //   tempDB[currentPage][l]
              // );
              for (
                let i = 0;
                i < Object.keys(tempDB[currentPage][l]).length;
                i++
              ) {
                if (i != 1) {
                  this.db.items[currentPage][j][i] = tempDB[currentPage][l][i];
                }
              }
            }
          }
        }
      }

      if (this.currenteditableTabsValue !== 1) {
        this.hotInstance.updateSettings({
          columns: that.db.items[that.currenteditableTabsValue - 1][0],
          data: that.db.items[that.currenteditableTabsValue - 1],
          contextMenu: false,
        });
      } else {
        this.hotInstance.updateSettings({
          columns: that.db.items[that.currenteditableTabsValue - 1][0],
          data: that.db.items[that.currenteditableTabsValue - 1],
          contextMenu: {
            items: {
              row_above: {
                name: "在上方插入行",
              },
              row_below: {
                name: "在下方插入行",
              },
              remove_row: {
                name: "删除行",
              },
            },
          },
          cells: that.getHotCellsFunction(),
        });
      }

      return console.log("currenteditableTabsValue:", Number(pane.props.name));
    },
    handleTabsEdit(targetName, action, activityName) {
      let that = this;
      console.log(
        "action",
        action,
        "targetName",
        targetName,
        "activityName",
        activityName
      );
      if (action === "add" && !targetName) {
        console.log("handleTabsEdit add processing");
        let item = [""];
        let value = [""];
        let remark = [""];
        let weight = [""];
        let tempdata = [];
        tempdata.push(item);
        tempdata.push(value);
        tempdata.push(remark);
        tempdata.push(weight);
        this.db.items.push(tempdata);

        let newTabName = ++this.tabIndex + "";
        this.currenteditableTabsValue = this.tabIndex;
        this.maxeditableTabsValue = this.tabIndex;
        this.editableTabs.push({
          title: "成绩项" + " " + newTabName,
          name: newTabName.toString(),
          value: newTabName,
        });
        this.editableTabsValue = newTabName.toString();
        this.hotInstance.updateSettings({
          data: that.db.items[that.currenteditableTabsValue - 1],
          cells: that.getHotCellsFunction(),
        });
        console.log(
          "currenteditableTabsValue:",
          this.currenteditableTabsValue,
          "maxTabsValue:",
          this.maxeditableTabsValue
        );
      }
      if (action === "add" && targetName && activityName) {
        console.log("handleTabsEdit 初始化 processing");
        this.currenteditableTabsValue = ++this.tabIndex;
        this.maxeditableTabsValue = this.tabIndex;
        let newTabName = this.tabIndex + "";
        this.editableTabs.push({
          title: activityName ? activityName : "成绩项" + " " + newTabName,
          name: newTabName.toString(),
          value: newTabName,
        });
        this.editableTabsValue = this.editableTabs[0].name;
        this.currenteditableTabsValue = 1;
        // this.hotInstance.updateSettings({
        //       data:that.db.items[that.currenteditableTabsValue-1],
        //     });
        console.log("currenteditableTabsValue:", this.currenteditableTabsValue);
      }
      if (action === "remove") {
        ElMessageBox.confirm("是否确认删除成绩项", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let tabs = this.editableTabs;
            // this.currenteditableTabsValue = --this.tabIndex;
            console.log("targetName:", targetName);
            let activeName = this.editableTabsValue;
            if (activeName === targetName) {
              tabs.forEach((tab, index) => {
                if (tab.name === targetName) {
                  let nextTab = tabs[index + 1] || tabs[index - 1];
                  if (nextTab) {
                    activeName = nextTab.name;
                  }
                }
              });
            }
            this.hotInstance.updateSettings({
              data: that.db.items[Number(activeName - 1)],
              cells: that.getHotCellsFunction(),
            });

            this.editableTabsValue = activeName;
            this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
            console.log("editableTabs:", this.editableTabs);
          })
          .catch((e) => {
            console.log("e", e);
          });
      }
    },

    activate() {
      this.identity = this.$store.state.currentInfo.identity;
      this.departmentId = this.$store.state.currentInfo.departmentId;
      this.schoolId = this.$store.state.currentInfo.schoolId;
      this.programId = this.$store.state.major.programId;
      if (this.identity == "学院管理员") {
        this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
        console.log("identity:", this.identity);
      } else if (this.identity == "课程负责人") {
        this.classInfo = this.$store.state.currentInfo.respondClassInfo;
      } else {
        this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
        console.log("identity:", this.identity);
      }

      console.log(
        "this.departmentId",
        this.departmentId,
        "this.schoolId",
        this.schoolId,
        "this.programId",
        this.programId,
        "this.classInfo",
        this.classInfo
      );
      this.activateHotcolumn();
    },
    activateHotcolumn() {
      let self = this;
      let that = this;
      this.getActivities().then(function () {
        console.log("Handsontable init..........");
        let container = document.querySelector("#courseHot");
        let hotRegisterer = new Handsontable(container, {
          data: self.db.items[0],
          licenseKey: "non-commercial-and-evaluation",
          colHeaders: function (index) {
            // false
            // return index === 0 ? '学号' : '成绩项';
            if (index === 0) {
              return "学号";
            } else if (index === 1) {
              return "姓名";
            } else if (index === 2) {
              return "考试情况";
            } else {
              return "成绩项";
            }
          },
          rowHeaders: function (index) {
            // true
            if (index === 0) {
              return "名称";
            } else if (index === 1) {
              return "分值";
              // } else if (index === 2) {
              //   return '平均分';
              // } else if (index === 2) {
              //   return '指标点';
            } else if (index === 2) {
              return "设置";
            } else {
              return index - self.NUM_AUX_ROW + 1;
            }
            // return index === 0 ? '成绩项' : index;
          },

          fixedRowsTop: 3,
          fixedColumnsLeft: 2,
          minSpareRows: 0,
          minSpareCols: 0,
          preventOverflow: "horizontal",
          manualColumnMove: false,
          copyPaste: true,
          colWidths: 70,

          contextMenu: {
            items: {
              row_above: {
                name: "在上方插入行",
              },
              row_below: {
                name: "在下方插入行",
              },
              remove_row: {
                name: "删除行",
              },
            },
          },
          beforeCreateRow(index, amount, source) {
            if (source === "loadData") {
              // console.log('same');
              return;
            } else {
              console.log("add extare row", index, amount, source);

              console.log(self.db.items);
              if (index <= 2) {
                // console.log('this row should not created!')
                return false;
              }
            }
          },
          afterCreateRow(index, amount, source) {
            console.log(self.db.items);
            // for (let i = 1; i < self.db.items.length; i++) {
            //   for (let j = 3; j < self.db.items[0].length; j++) {
            //     if (!self.db.items[i][j]) {
            //       console.log(i, j);
            //       self.db.items[i][j] = {};
            //     }
            //     console.log(Object.keys(self.db.items[i][j]).length);
            //     for (let k = 0; k < 2; k++) {
            //       console.log(
            //         self.db.items[i][j][k] + ":" + self.db.items[0][j][k]
            //       );
            //       if (!self.db.items[0][j][k]) {
            //         self.db.items[i][j][k] = null;
            //       } else {
            //         self.db.items[i][j][k] = self.db.items[0][j][k];
            //       }
            //     }
            //   }
            // }
          },
          beforeRemoveRow(index, amount, physicalRows, source) {
            if (source === "loadData") {
              // console.log('same');
              return;
            } else {
              if (index <= 2) {
                // console.log('this row should not created!')
                return false;
              }
            }
          },
          afterRemoveRow() {
            console.log(self.db.items);
          },

          afterChange(changes, source) {
            if (source === "loadData") {
              // console.log('same');
              return;
            } else {
              self.isValid();
              if (self.count == 0) {
                self.dirty = false;
                console.log(
                  "console:",
                  self.count,
                  "dirty",
                  self.dirty,
                  "items:",
                  self.db.items
                );
              } else {
                self.dirty = true;
                self.firstActivities = false;
                console.log(
                  "console:",
                  self.count,
                  "dirty",
                  self.dirty,
                  "items:",
                  self.db.items,
                  "firstActivities:",
                  self.firstActivities
                );
              }
              self.count++;
              console.log("console:", self.count);
            }
          },
        });
        that.hotInstance = hotRegisterer;
        that.hotInstance.updateSettings({
          columns: that.db.items[0][0],
          data: that.db.items[0],
          cells: that.getHotCellsFunction(),
        });
      });
    },
    getHotCellsFunction() {
      let that = this;
      return function (row, col, prop) {
        // http://docs.handsontable.com/0.16.0/tutorial-cell-types.html
        var cellProperties = {};

        if (col === 0) {
          // studentNo column

          cellProperties.readOnly = true;
          cellProperties.className = "cell-disallow";
        }
        if (row < 3 && col < 3 && col != 0) {
          // left-top zone
          cellProperties.readOnly = false;
          // cellProperties.type = 'string';
          cellProperties.className = "cell-disallow";
        }
        if (row != 0 && row != 2 && col >= 3) {
          // for 2nd row(分值), also validScore
          cellProperties.type = "numeric"; // by default: 'string'
          // cellProperties.validator = validScore();
          cellProperties.format = "0.00"; // http://numeraljs.com/
          cellProperties.validator =
            /^(100(\.00?)?|0(\.\d{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;
          // cellProperties.validator = that.validateNumberWithin100;
        } else {
          //   cellProperties.validator =  that.validString();
        }

        // if(col === 1 ){

        //   cellProperties.type = 'numeric';
        // }
        // if(col === 2 ){
        //   cellProperties.type = 'text';
        // }

        if (col === 0) {
          cellProperties.width = 100;
          if (row > 2) {
            cellProperties.readOnly = false;
          }
        }
        if (col >= 0 && col <= 2) {
          if (row >= 0 && row <= 2) {
            cellProperties.readOnly = true;
          }
        }

        if (col === 2 && row > 2) {
          console.log(
            "updating cell rules current currenteditableTabsValue:",
            that.currenteditableTabsValue
          );
          if (
            that.currenteditableTabsValue - 1 == 0 ||
            that.currenteditableTabsValue == 0
          ) {
            cellProperties.type = "dropdown";
            cellProperties.source = [
              " ",
              "缺考",
              "缓考",
              "不及格",
              "取消考试资格",
            ];
            cellProperties.allowEmpty = true;

            // cellProperties.validator = that.validScoreSetting();
          } else {
            cellProperties.readOnly = true;
          }
        }
        if (row <= 2) {
          cellProperties.readOnly = true;
        }

        if (col < 2 && row > 2) {
          if (
            that.currenteditableTabsValue - 1 == 0 ||
            that.currenteditableTabsValue == 0
          ) {
            cellProperties.readOnly = false;
          } else {
            cellProperties.readOnly = true;
          }
        }

        return cellProperties;
      };
    },
    validStudentNumber(value) {
      console.log("validStudentNumber", value);
      if (/^\d+$/.test(value)) {
        // 测试是否为纯数字
        return true;
      } else {
        return false;
      }
    },
    validStudentName(value) {
      console.log("validStudentName", value);
      if (/^[\u4e00-\u9fa5]+$/.test(value)) {
        // 测试是否为纯中文
        return true;
      } else {
        return false;
      }
    },
    validString(value, callback) {
      if (value && value.length > 0) {
        callback(true);
      } else {
        callback(false);
      }
    },
    validScoreSetting(value) {
      console.log(value, this.scoreSettingOptions.indexOf(value));
      if (!value) {
        this.errorInTable = false;
      } else {
        if (this.scoreSettingOptions.indexOf(value) >= 0) {
          this.errorInTable = false;
        } else {
          this.errorInTable = true;
        }
      }
    },
    validateNumberWithin100(value) {
      console.log(value, /^\d{1,2}(\.\d{1,2})?$/.test(value));
      if (!value) {
        this.errorInTable = false;
      } else {
        if (
          !isNaN(value) &&
          value >= 0 &&
          value <= 200 &&
          /^\d+(\.\d{1,2})?$/.test(value)
        ) {
          this.errorInTable = false;
        } else {
          this.errorInTable = true;
        }
      }
    },

    async getActivities() {
      let that = this;
      return request({
        url: "/classes/" + this.classInfo.classId,
        method: "get",
      }).then(function (res) {
        console.log("class Info", res);

        let course = res.data;
        if (course.objectives) {
          that.hasObjectives = true;
          that.hasNoObjectives = false;
        } else {
          that.hasObjectives = false;
          that.hasNoObjectives = true;
        }
        if (course.scores) {
          that.hasScores = true;
          that.hasNoScores = false;
          let count = 0;
          if (course.activities && that.hasObjectives) {
            that.hasActivities = true;
            that.hasNoActivities = false;
            let currentactivitCount = 0;
            course.activities.forEach((activity) => {
              console.log('activity["name"]', activity["name"]);
              that.handleTabsEdit(1, "add", activity["name"]);
              let activityNumber = activity["item"].length;
              console.log("activityNumber:", activityNumber);
              let studentNum = course.scores.length;
              that.currentNumberofActivities = activityNumber;

              let tempList = [];
              for (let i = 0; i < studentNum + 3; i++) {
                // that.db.items[i]={};
                tempList[i] = {};
              }
              tempList[0] = {
                0: "",
                1: "",
                2: "",
              };
              for (let i = 0; i < activityNumber; i++) {
                // let columnDist = {};

                tempList[0][i + 3] = activity["item"][i];

                tempList[1][i + 3] = activity["value"][i];

                tempList[2][i + 3] = activity["remark"][i];
                // columnDist={
                //   data:activity['item'][i],
                // }
                // tempcolumnList.push(columnDist);
              }

              console.log("tempList", tempList);

              //  console.log('tempcolumnList:',tempcolumnList);
              for (let i = 0; i < studentNum; i++) {
                if (typeof course.scores[i]["info"][0] == "string") {
                  tempList[3 + i][0] = course.scores[i]["info"][0].trim();
                } else {
                  tempList[3 + i][0] = course.scores[i]["info"][0];
                }
                if (typeof course.scores[i]["info"][1] == "string") {
                  tempList[3 + i][1] = course.scores[i]["info"][1].trim();
                } else {
                  tempList[3 + i][1] = course.scores[i]["info"][1];
                }
                tempList[3 + i][2] =
                  course.scores[i]["status"][currentactivitCount];

                if (count + 1 > course.scores[i]["grade"].length) {
                  // console.log('该成绩项下，并未添加学生成绩')

                  for (let j = 0; j < activityNumber; j++) {
                    tempList[3 + i][j + 3] = null;
                    tempList[3 + i][j + 3] = null;
                  }
                } else {
                  for (let j = 0; j < activityNumber; j++) {
                    if (!course.scores[i]["grade"][count][j]) {
                      if (course.scores[i]["grade"][count][j] == 0) {
                        tempList[3 + i][j + 3] = 0;
                      } else {
                        tempList[3 + i][j + 3] = null;
                      }
                    } else {
                      tempList[3 + i][j + 3] =
                        course.scores[i]["grade"][count][j];
                    }
                  }
                }
              }
              // that.columnList.push(tempcolumnList);
              that.db.items.push(tempList);
              count++;
              currentactivitCount++;
            });
            that.editableTabsValue = "1";
            that.currenteditableTabsValue = 1;
            that.originData = JSON.parse(JSON.stringify(that.db.items));
            console.log(
              "db.items",
              that.db.items,
              "columnList:",
              that.columnList
            );
          } else {
            console.log("res has no activities");
            that.handleTabsEdit(1, "add");
            that.hasActivities = false;
            that.hasNoActivities = false;
          }
        } else {
          console.log("res has no scores");
          // that.handleTabsEdit(1,'add');
          that.hasScores = false;
          that.hasNoScores = true;
          if (course.activities && that.hasObjectives) {
            that.hasActivities = true;
            that.hasNoActivities = false;
            course.activities.forEach((activity) => {
              that.handleTabsEdit(1, "add", activity["name"]);
              let activityNumber = activity["item"].length;
              let studentNum = course.scores ? course.scores.length : 1;
              that.currentNumberofActivities = activityNumber;

              let tempList = [];
              for (let i = 0; i < studentNum + 3; i++) {
                // that.db.items[i]={};
                tempList[i] = {};
              }
              tempList[0] = {
                0: "",
                1: "",
                2: "",
              };
              for (let i = 0; i < activityNumber; i++) {
                //   itemDict[i.toString()] = course.activities.item[i];
                var columnDist = {};
                // that.db.items[0][course.activities[0]['item'][i]]= course.activities[0]['item'][i];
                tempList[0][i + 3] = activity["item"][i];
                // that.db.items[1][course.activities[0]['item'][i]]= course.activities[0]['value'][i];
                tempList[1][i + 3] = activity["value"][i];
                // that.db.items[2][course.activities[0]['item'][i]]= course.activities[0]['remark'][i];
                tempList[2][i + 3] = activity["remark"][i];
                // columnDist={
                //   data:activity['item'][i],
                // }
                // tempcolumnList.push(columnDist);

                //   valueDict[i.toString()] = course.activities.value[i];
              }
              // that.columnList.push(tempcolumnList);
              that.db.items.push(tempList);
            });
            that.originData = JSON.parse(JSON.stringify(that.db.items));
            console.log(
              "db.items",
              that.db.items,
              "columnList:",
              that.columnList
            );
          }
        }
      });
    },
    isValid() {
      if (this.firstActivities) {
        return false;
      } else {
        var result = !this.compareArrays(this.originData, this.db.items);
        console.log("result:", result);
        return result;
      }
    },
    compareArrays(arr1, arr2) {
      // console.log('arr1',arr1,'arr2',arr2);
      // 检查数组长度是否相等
      // console.log('length:',arr1.length,arr2.length);
      if (arr1.length !== arr2.length) {
        return false;
      }

      // 深度比较每个对象
      for (let i = 0; i < arr1.length; i++) {
        // 检查对象属性数量是否相等
        console.log(
          "Object.keys:",
          Object.keys(arr1[i]).length,
          Object.keys(arr2[i]).length
        );
        if (Object.keys(arr1[i]).length !== Object.keys(arr2[i]).length) {
          return false;
        }

        // 检查对象属性值是否相等
        for (let key in arr1[i]) {
          console.log("keys:", arr1[i][key], arr2[i][key]);
          if (arr1[i][key] !== arr2[i][key]) {
            return false;
          }
        }
      }

      return true;
    },
    isNotDirty() {
      this.dirty = false;
    },
    save() {
      this.saving = true;
      this.dirty = false;
      this.postData.scores = [];
      var result = this.isValid();
      if (!result) {
        this.saving = false;
        return;
      }
      let that = this;

      let allStudentsNumber = [];
      let studentList = JSON.parse(JSON.stringify(that.db.items[0]));

      for (let m = 0; m < 3; m++) {
        studentList.shift();
      }
      for (let i = 0; i < studentList.length; i++) {
        // console.log('studentInfo:',studentList[i]);
        if (studentList[i][0] != undefined) {
          allStudentsNumber.push(studentList[i][0]);
        }
      }
      let count = 0;
      // console.log('allStudentsNumber:',allStudentsNumber,'studentList.length',studentList.length);
      allStudentsNumber.forEach((studentNumber) => {
        let infoList = [];
        let finalGrade = [];
        let finalPass = [];
        that.db.items.forEach((activity) => {
          let gradList = [];
          let passList = "";
          let student = JSON.parse(JSON.stringify(activity));
          for (let m = 0; m < 3; m++) {
            student.shift();
          }

          for (let i = 0; i < studentList.length; i++) {
            // console.log("student[i]",student[i]);
            if (student[i]) {
              // console.log("student[i]['studentNumber']",student[i][0],);
              if (student[i][0] == studentNumber) {
                // console.log('socres:',student[i])
                let tempDict = {
                  studentNumber: "",
                  studentName: "",
                };
                for (var key in student[i]) {
                  // console.log('key',key,'student[key]',student[i][key])
                  if (key == 0) {
                    tempDict["studentNumber"] = student[i][key];
                  } else if (key == 1) {
                    tempDict["studentName"] = student[i][key];
                  } else if (key == 2) {
                    if (this.errorInTable === false) {
                      this.validScoreSetting(student[i][key]);
                      console.log(
                        "validScoreSetting",
                        student[i][key],
                        "errorInTable",
                        this.errorInTable
                      );
                    }

                    passList = student[i][key];
                  } else {
                    // console.log("score", student[i][key]);
                    if (this.errorInTable === false) {
                      this.validateNumberWithin100(student[i][key]);
                      console.log(
                        "validateNumberWithin100",
                        student[i][key],
                        "errorInTable",
                        this.errorInTable
                      );
                    }

                    gradList.push(student[i][key]);
                  }
                  infoList.push(tempDict);
                }
              }
            } else {
              // console.log('this activity do not add scores');
            }
          }
          finalGrade.push(gradList);
          finalPass.push(passList);
        });
        // console.log('info:',infoList,'grade:',finalGrade);
        var scoreDist = {
          info: [infoList[0]["studentNumber"], infoList[0]["studentName"]],
          status: finalPass,
          grade: finalGrade,
        };

        // console.log('scoreDist',scoreDist,count++);
        that.postData.scores.push(scoreDist);
      });
      console.log("this.errorInTable", this.errorInTable);
      if (this.errorInTable) {
        ElMessage({
          type: "error",
          message: "保存出错，请检查分数",
          duration: 1500,
        });
        this.errorInTable = false;
      } else {
        that.addScores(that.postData.scores);
      }
    },
    toPostData() {
      let that = this;
      this.postData.students.length = 0; // clean array
      var res = this.postData.students;
      // var newstudent = this.postData.newStudents;
      // var scoreRes = this.postData.scores;

      var valid = true;
      var OrFlag = Boolean;
      var AndFlag = Boolean;
      var trueFlagNum = 0; //为空的个数
      var falseFlagNum = 0; //不为空的个数

      this.db.items.forEach((students) => {
        var studentList = JSON.parse(JSON.stringify(students));

        for (let m = 0; m < 3; m++) {
          studentList.shift();
        }
        for (let i = 0; i < studentList.length; i++) {
          if (studentList[i]["studentNumber"]) {
            // console.log('socres:',student.values())
            for (var key in studentList[i]) {
              // console.log('key',key,'studentList[key]',studentList[i][key])
              if (key != "pass" && !studentList[i][key]) {
                trueFlagNum++;
              } else {
                falseFlagNum++;
              }
            }
          } else {
            // console.log("studentList[i]['studentNumber']:",studentList[i]['studentNumber'])
          }
        }
      });
      let activityNumber = 0;
      let columns = [];
      for (let i = 0; i < this.db.item.length; i++) {
        columns.push(this.db.item[i][0]);
      }

      columns.forEach((column) => {
        activityNumber = activityNumber + column.length - 3;
      });
      console.log("trueFlagNum:", trueFlagNum);
      if (trueFlagNum > 0) {
        OrFlag = true;
        if (trueFlagNum == activityNumber) {
          AndFlag = true;
        } else {
          AndFlag = false;
        }
      } else {
        OrFlag = false;
        AndFlag = false;
      }
      console.log("OrFlag:", OrFlag, "AndFlag:", AndFlag);
      if (OrFlag) {
        if (AndFlag) {
          // console.log('scoreRes:',scoreRes,'res: ',res);
          console.log("----------全都为空------------");
          return;
        } else {
          // either name OR teacherNo is empty, but not both
          valid = false;
          // console.log('scoreRes:',scoreRes,'res: ',res);
          console.log("-----------部分为空-----------");
          return;
        }
      } else {
      }

      return valid;
    },

    goBackandClean() {
      let that = this;

      this.postData.scores = [];
    },
    goTeacher() {
      console.log("goteacher:" + this.saving + this.dirty); //只有dirty = flase 或者 saving = true时才可以退出

      if (this.dirty == true || (this.saving == false && this.dirty == true)) {
        ElMessageBox.confirm("数据还未保存，是否仍然关闭？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push({ path: "/score" });
          })
          .catch(() => {});
      } else {
        this.$router.push({ path: "/score" });
      }
    },
    addScores(postData) {
      let that = this;
      console.log("score postData:", postData);
      return request({
        url: "/classes/editScores",
        method: "post",
        data: {
          classId: this.classInfo.classId,
          scores: postData,
        },
      })
        .then(function (res) {
          that.postData.scores = [];
          console.log("saving scores res:", res);
          that.firstActivities = true;
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `保存成功`,
              duration: 1500,
            });
            that.goBackandClean();
          }
          console.log("postData.scores", that.postData.scores);
        })
        .catch((e) => {
          console.log("e:", e);
          if (e.status == 500) {
            ElMessage({
              type: "error",
              message: `保存出错，请检查填写的内容`,
              duration: 1500,
            });
          } else if (e.status == 409) {
            ElMessage({
              type: "error",
              message: "成绩项分值为空",
              duration: 1500,
            });
          } else {
            ElMessage({
              type: "error",
              message: "未知错误,请联系相关人员",
              duration: 1500,
            });
          }

          // console.log('postData.scores', that.postData.scores);
        });
    },
  },
  mounted: function () {
    this.activate();
  },
};
</script>

<style scoped>
.card-container {
  margin-left: 10%;
  margin-bottom: 50px;
  width: 80%;
  height: 600px;
  background-color: white;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  overflow: auto;
  /* 这里用auto而不是hidden，应为hidden会直接把多出的部分删除，而auto则会保留多出来的部分，形成页面滑动scroll */
}
.activity-tab {
  height: 100px;
  margin-top: 68px;
  background: white;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  width: 80%;
  margin-left: 10%;
}
.no-program {
  display: flex;
  flex-direction: column;
}
.icon {
  cursor: pointer;
}
.block-row {
  margin-top: 15px;
}
.block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
.hot-table-container {
  height: 100px;
}
.hotTable {
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}
.md-padding {
  margin-top: 120px;
}
.ng-scope layout-column flex {
  display: flex;
  flex-direction: column;
}

#luckysheet {
  margin: 0px;
  padding: 0px;
  border: 1px aquamarine;
  /* position: absolute; */
  width: 100%;
  height: 750px;
  /* left: 0px; */
  margin-top: 20px;
  /* top: 30px; */
  bottom: 0px;
}

#uploadBtn {
  font-size: 16px;
}
</style>
