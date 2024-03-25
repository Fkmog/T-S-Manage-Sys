<template>
  <div flex>
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
          <el-button
            @click="save"
            link
            v-show="hasExamAnalysis"
            :disabled="!isValid()"
          >
            <el-icon
              size="24px"
              color="rgb(137, 137, 137)"
              style="margin-left: 20px"
            >
              <DocumentChecked />
            </el-icon>
          </el-button>
        </el-tooltip>
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
  </div>

  <div class="card-container" v-show="hasExamAnalysis">
    <div class="hot-table-container" id="courseHot"></div>
  </div>

  <div v-show="!hasExamAnalysis" class="no-class">没有试卷分析表</div>
  <div class="no-major-detail" v-show="!hasExamAnalysis">
    请先添加试卷分析表
  </div>
  <reviewDrawer v-bind:visible="openDrawer" />
</template>

<script>
import { ref, onMounted, reactive } from "vue";
import reviewDrawer from "@/components/teacherClass/reviewDrawer.vue";

import { HotTable, HotColumn } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import {
  ElTooltip,
  ElIcon,
  ElInput,
  ElMessage,
  ElMessageBox,
} from "element-plus";
import { getExamAnalysis, editExamAnalysis } from "@/api/exam";

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
import { HyperFormula } from "hyperformula";
import request from "@/utils/request/request";
import "@/components/teacher/addTeacher.js";

import "element-plus/dist/index.css";
import "handsontable/dist/handsontable.full.css";

import "handsontable/dist/handsontable.full.css";

// 用来判断两个值是否一样
import _ from "lodash";

export default {
  name: "addTeacher",
  data() {
    let self = this;
    return {
      openDrawer: false,
      compareData: [],

      canedit: false,

      hasExamAnalysis: true,

      objectivesName: ["题号", "分值"],
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
      scoreSettingOptions: ["总评", "期末"],
      isRouterAlive: true,
      dirty: false,
      saving: false,
      count: 0,
      localres: {},
      postData: {
        students: [],
        scores: [],
        newStudents: [],
        averageScore: {
          averageScoreOnTitle: [],
          scoreRateOnTitle: [],
          averageScoreOnObject: [],
          scoreRateOnObject: [],
        },
      },
      db: { items: [], objectives: [] },
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
    reviewDrawer,
  },
  methods: {
    openDrawerChange() {
      this.$store.commit("currentInfo/setOpenDrawer", this.openDrawer);
    },
    editableTabsValueChange(pane) {
      let that = this;
      this.currenteditableTabsValue = Number(pane.props.name);
      this.hotInstance.updateSettings({
        columns: that.columnList[that.currenteditableTabsValue - 1],
        data: that.db.items[that.currenteditableTabsValue - 1],
        cells: that.getHotCellsFunction(),
      });
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
      this.openDrawer = this.$store.state.currentInfo.opendrawer;
      if (this.identity == "学院管理员") {
        this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
        console.log("identity:", this.identity);
      } else if (this.identity == "课程负责人") {
        this.classInfo = this.$store.state.currentInfo.respondClassInfo;
      } else {
        this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
        console.log("identity:", this.identity);
      }

      if (this.classInfo.status == "1" || this.classInfo.status == "4") {
        this.canedit = true;
      }
      console.log("this.canedit:", this.canedit);

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
      this.getActivities();
    },
    activateHotcolumn() {
      console.log("Handsontable init");
      let self = this;
      let that = this;
      let container = document.querySelector("#courseHot");
      let hotRegisterer = new Handsontable(container, {
        data: self.db.objectives,
        licenseKey: "non-commercial-and-evaluation",
        colHeaders: false,
        dragToScroll: true,
        rowHeaders: self.objectivesName,
        rowHeaderWidth: 100,
        copyPaste: true,
        allowRemoveColumn: true,
        colWidths: 100,

        contextMenu: false,
        formulas: {
          engine: HyperFormula,
        },

        afterChange(changes, source) {
          if (source === "loadData") {
            // console.log('same');
            return;
          } else {
            self.isValid();
          }
        },
      });
      that.hotInstance = hotRegisterer;
      that.hotInstance.updateSettings({
        data: that.db.objectives,
        cells: that.getHotCellsFunction(),
      });
    },
    getHotCellsFunction() {
      let that = this;
      return function (row, col, prop) {
        // http://docs.handsontable.com/0.16.0/tutorial-cell-types.html
        var cellProperties = {};
        if (!that.canedit) {
          if (col >= 0) {
            cellProperties.readOnly = true;
          }
        } else {
          if (
            (row >= that.objectivesName.length - 2 &&
              col < that.db.objectives["0"].length - 2) ||
            (row < that.objectivesName.length - 2 &&
              col >= that.db.objectives["0"].length - 2)
          ) {
            cellProperties.readOnly = false;
          } else {
            cellProperties.readOnly = true;
          }

          if (
            row === that.objectivesName.length - 1 ||
            col === that.db.objectives["0"].length - 1
          ) {
            cellProperties.readOnly = true;
          }
          if (!that.hotInstance.getDataAtCell(row, 0)) {
            if (col === that.db.objectives["0"].length - 2) {
              cellProperties.readOnly = true;
            }
          }
          if (col === 0 || row === 0) {
            cellProperties.readOnly = true;
          }
          if (col === that.db.objectives["0"].length - 2) {
            cellProperties.readOnly = true;
          }
        }

        return cellProperties;
      };
    },
    getActivities() {
      let that = this;
      getExamAnalysis(this.classInfo.classId)
        .then((res) => {
          console.log("getExamAnalysis", res);
          if (res.data.setting) {
            let setting = res.data.setting;
            let averageScore = res.data.averageScore;
            setting.object.forEach((objectname) => {
              this.objectivesName.push(objectname);
            });

            this.objectivesName.push("平均得分");
            this.objectivesName.push("得分率");
            console.log("objectivesName", this.objectivesName);
            if (setting.sum) {
              // this.objectivesName.concat(setting.object);

              let sum = ["合计"];
              sum = sum.concat(setting.title);
              sum.push("平均得分");
              sum.push("得分率");
              this.db.objectives.push(sum);

              for (let i = 0; i < setting.sum.length; i++) {
                let templist = [];
                templist.push(setting.sum[i]);
                let tempString = "";
                for (let j = 0; j < setting.value[i].length; j++) {
                  templist.push(setting.value[i][j]);
                  if (setting.value[i][j]) {
                    let indexOfAverageScoreOnTitle = setting.sum.length + 2;
                    console.log(setting.value[i][j], j);
                    tempString =
                      tempString +
                      String.fromCharCode(66 + j) +
                      indexOfAverageScoreOnTitle +
                      "+";
                  }
                }
                if (averageScore) {
                  let calculateAverageScoreOnObject =
                    "=" +
                    "SUM(" +
                    tempString.slice(0, tempString.length - 1) +
                    ")";
                  console.log(
                    "calculateAverageScoreOnObject",
                    calculateAverageScoreOnObject
                  );
                  // templist.push(averageScore.averageScoreOnObject[i]);
                  templist.push(calculateAverageScoreOnObject);
                } else {
                  templist.push(null);
                }

                if (averageScore) {
                  templist.push(averageScore.scoreRateOnObject[i] + "%");
                } else {
                  templist.push(null);
                }

                console.log("templist", templist);

                templist[templist.length - 1] =
                  "=" +
                  "TEXT(" +
                  String.fromCharCode(63 + templist.length) +
                  (2 + i) +
                  "/" +
                  String.fromCharCode(65) +
                  (2 + i) +
                  "*100" +
                  ',"0.00%")';

                this.db.objectives.push(templist);
              }

              let templistaverageScoreOnTitle;
              if (averageScore) {
                templistaverageScoreOnTitle = [""];
                averageScore.averageScoreOnTitle.forEach(
                  (averageScoreOnTitle) => {
                    templistaverageScoreOnTitle.push(averageScoreOnTitle);
                  }
                );
              } else {
                templistaverageScoreOnTitle = [];
                for (let i = 0; i < setting.title.length + 1; i++) {
                  templistaverageScoreOnTitle.push(null);
                }
              }

              this.db.objectives.push(templistaverageScoreOnTitle);

              let templistscoreRateOnTitle;
              if (averageScore) {
                templistscoreRateOnTitle = [""];
                averageScore.scoreRateOnTitle.forEach((scoreRateOnTitle) => {
                  if (scoreRateOnTitle) {
                    templistscoreRateOnTitle.push(scoreRateOnTitle + "%");
                  } else {
                    templistscoreRateOnTitle.push(scoreRateOnTitle);
                  }
                });
              } else {
                templistscoreRateOnTitle = [];
                for (let i = 0; i < setting.title.length + 1; i++) {
                  templistscoreRateOnTitle.push(null);
                }
              }

              for (let i = 1; i < templistscoreRateOnTitle.length; i++) {
                let sum = "";
                sum = String.fromCharCode(65 + i) + 2;

                console.log("sum:", sum);

                templistscoreRateOnTitle[i] =
                  "=" +
                  "TEXT(" +
                  String.fromCharCode(65 + i) +
                  (this.objectivesName.length - 1) +
                  "/" +
                  "SUM(" +
                  sum +
                  ")*100" +
                  ',"0.00%")';
              }

              this.db.objectives.push(templistscoreRateOnTitle);
            } else {
              setting.object.forEach(() => {
                this.db.objectives.push([""]);
              });
            }
            console.log("this.db.objectives", this.db.objectives);
            this.compareData = JSON.parse(JSON.stringify(this.db.objectives));
            this.activateHotcolumn();
          } else {
            this.hasExamAnalysis = false;
          }
        })
        .catch((e) => {
          this.hasExamAnalysis = false;
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
        });
    },
    isValid() {
      var result = this.toPostData();
      return result;
    },

    save() {
      this.saving = true;
      this.dirty = false;
      this.postData.averageScore = {
        averageScoreOnTitle: [],
        scoreRateOnTitle: [],
        averageScoreOnObject: [],
        scoreRateOnObject: [],
      };
      var result = this.isValid();
      if (!result) {
        this.saving = false;
        return;
      }

      if (!this.canedit) {
        ElMessage({
          type: "error",
          message: `课程已审核或提交，不可以修改成绩项`,
          duration: 1500,
        });
      } else {
        console.log("this.db.objectives", this.db.objectives);
        let tempaverageScoreOnObject = [];
        let tempscoreRateOnObject = [];
        // this.db.objectives.forEach((row) => {
        //   if (
        //     row[this.db.objectives["0"].length - 2] !== "平均得分" &&
        //     row[0] !== ""
        //   ) {
        //     console.log(
        //       "row",
        //       row[this.db.objectives["0"].length - 2],
        //       typeof row[this.db.objectives["0"].length - 2]
        //     );
        //     if (typeof row[this.db.objectives["0"].length - 2] === "string") {
        //       tempaverageScoreOnObject.push(
        //         parseFloat(row[this.db.objectives["0"].length - 2].trim())
        //       );
        //     } else {
        //       console.log(
        //         "tempaverageScoreOnObject",
        //         row[this.db.objectives["0"].length - 2]
        //       );
        //       if (row[this.db.objectives["0"].length - 2]) {
        //         tempaverageScoreOnObject.push(
        //           parseFloat(row[this.db.objectives["0"].length - 2])
        //         );
        //       } else {
        //         tempaverageScoreOnObject.push(null);
        //       }
        //     }
        //   }
        // });
        for (let i = 0; i < this.objectivesName.length - 3; i++) {
          let tempRate = this.hotInstance.getDataAtCell(
            i + 1,
            this.db.objectives[0].length - 2
          );
          console.log("tempRate", tempRate);
          if (tempRate) {
            tempaverageScoreOnObject.push(parseFloat(tempRate));
          } else {
            tempaverageScoreOnObject.push(null);
          }
        }

        for (let i = 0; i < this.objectivesName.length - 3; i++) {
          let tempRate = this.hotInstance.getDataAtCell(
            i + 1,
            this.db.objectives[0].length - 1
          );
          console.log("tempRate", tempRate);
          if (tempRate) {
            tempscoreRateOnObject.push(parseFloat(tempRate));
          } else {
            tempscoreRateOnObject.push(null);
          }
        }

        this.postData.averageScore.averageScoreOnObject =
          tempaverageScoreOnObject;
        this.postData.averageScore.scoreRateOnObject = tempscoreRateOnObject;

        for (let j = 1; j < this.db.objectives["0"].length - 2; j++) {
          if (
            typeof this.db.objectives[this.objectivesName.length - 2][j] ===
            "string"
          ) {
            this.postData.averageScore.averageScoreOnTitle.push(
              parseFloat(
                this.db.objectives[this.objectivesName.length - 2][j].trim()
              )
            );
          } else {
            if (this.db.objectives[this.objectivesName.length - 2][j]) {
              this.postData.averageScore.averageScoreOnTitle.push(
                parseFloat(
                  this.db.objectives[this.objectivesName.length - 2][j]
                )
              );
            } else {
              this.postData.averageScore.averageScoreOnTitle.push(null);
            }
          }
        }

        for (let i = 0; i < this.db.objectives[0].length - 3; i++) {
          let tempRate = this.hotInstance.getDataAtCell(
            this.objectivesName.length - 1,
            i + 1
          );
          console.log("tempRate", tempRate);
          if (tempRate) {
            this.postData.averageScore.scoreRateOnTitle.push(
              parseFloat(tempRate)
            );
          } else {
            this.postData.averageScore.scoreRateOnTitle.push(null);
          }
        }

        delete this.postData.averageScore["length"];
        console.log("this.postData.averageScore", this.postData.averageScore);

        editExamAnalysis({
          averageScore: this.postData.averageScore,
          classId: this.classInfo.classId,
        })
          .then((res) => {
            console.log("editExamAnalysis:", res);
            if (res.code == "SUCCESS") {
              ElMessage({
                type: "success",
                message: "更新成功",
                duration: 1500,
              });
            }
            this.compareData = JSON.parse(JSON.stringify(this.db.objectives));
          })
          .catch((e) => {
            if (e.status == 500) {
              ElMessage({
                type: "error",
                message: `保存出错，请检查填写的内容`,
                duration: 1500,
              });
            } else {
              ElMessage({
                type: "error",
                message: `未知错误,请联系相关人员`,
                duration: 1500,
              });
            }
          });
      }
    },
    toPostData() {
      this.postData.averageScore.length = 0;
      let valid = true;
      if (this.db.objectives["0"]) {
        for (let i = 0; i < this.db.objectives[0].length; i++) {
          if (!this.db.objectives["0"][i]) {
            valid = false;
            break;
          }
        }
      } else {
        valid = false;
      }
      if (valid && _.isEqual(this.compareData, this.db.objectives)) {
        valid = false;
      }

      return valid;
    },

    goBackandClean() {
      this.postData.scores = [];
    },
    goTeacher() {
      console.log("goteacher:" + this.saving + this.dirty); //只有dirty = flase 或者 saving = true时才可以退出
      console.log(this.compareData, this.db.objectives);
      let isSame = _.isEqual(this.compareData, this.db.objectives);
      if (!isSame || (this.saving == false && !isSame)) {
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
              message: `更新成功`,
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
              message: `更新出错，请检查填写的内容`,
              duration: 1500,
            });
          } else {
            ElMessage({
              type: "error",
              message: `未知错误,请联系相关人员`,
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
.divider {
  margin-left: 20px;
  height: 24px;
}
.no-class {
  margin-top: 120px;
  display: flex;
  justify-content: center;
  font-size: 22px;
}
.no-major-detail {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  font-size: 13px;
  color: #828d96;
}
.card-container {
  display: flex;
  margin: auto;
  margin-left: 100px;
  margin-top: 100px;
  /* width: 80%; */
  /* height: 600px; */
  /* background-color: white; */
  /* box-shadow: 0px 1px 3px rgb(164, 163, 163); */
  /* overflow: auto;  */
  /* 这里用auto而不是hidden，应为hidden会直接把多出的部分删除，而auto则会保留多出来的部分，形成页面滑动scroll */
}
.activity-tab {
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
.hotTable {
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}
.md-padding {
  margin-top: 120px;
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
