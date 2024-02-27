<template>
  <div layout="column" flex class="ng-scope layout-column flex">
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
            @click="gobaseCourseDetail()"
          >
            <Back />
          </el-icon>
        </el-tooltip>

        <div class="title">试卷分析表</div>

        <el-divider class="divider" direction="vertical" />

        <el-tooltip
          class="box-item"
          effect="dark"
          content="保存成绩项"
          placement="bottom"
          :hide-after="0"
          :disabled="!isValid()"
        >
          <el-button
            @click="save"
            link
            style="padding-left: 20px"
            :disabled="!isValid()"
          >
            <el-icon size="22px" color="rgb(137, 137, 137)" style="top: -1px">
              <!-- :disabled="!isValid()" -->
              <DocumentChecked />
            </el-icon>
          </el-button>
        </el-tooltip>
      </el-row>
    </div>

    <!-- @tab-add="this.handleTabsEdit('','add')"   -->

    <div class="card-container" v-show="hasObjectives">
      <el-tooltip
        class="box-item"
        style="display: flex"
        effect="dark"
        content="添加成绩项"
        placement="bottom"
        :hide-after="0"
      >
        <el-button @click="addActivities" link style="padding: 10px">
          <el-icon size="22px" color="rgb(137, 137, 137)">
            <CirclePlus />
          </el-icon>
        </el-button>
      </el-tooltip>
      <div style="height: 200px">
        <div class="hot-table-container" id="courseHot"></div>
      </div>
    </div>

    <div v-show="!hasObjectives" class="no-class">尚未设置课程目标</div>
    <div class="no-major-detail" v-show="!hasObjectives">请先设置课程目标</div>
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
import Sortable from "sortablejs";

import Action from "element-plus";

import {
  Back,
  CloseBold,
  Checked,
  EditPen,
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
import {
  getObjectives,
  submitPaperAnalysis,
  getDetailedPaperAnalysis,
  editPaperAnalysis,
} from "@/api/basecourse";

import "element-plus/dist/index.css";
import "handsontable/dist/handsontable.full.css";

import "handsontable/dist/handsontable.full.css";

export default {
  name: "activities",
  data() {
    let that = this;
    return {
      columnChange: 0,
      unsave: false,

      paperAnalysisId: "",

      columnSummaryList: [],

      showActivities: true,

      hasObjectives: false,
      objectivesName: ["题号", "分值"],

      activityTitleConfirm: true,
      originActivityTitle: "",
      newActivityTitle: "",
      newActivitydescription: "",
      originActivitydescription: "",
      from: "", //路由来自哪里
      classInfo: [], //当前课程数据

      //角色信息
      identity: "",

      itemOrValueisEmpty: false,

      sortable: "",
      tempEditabel: "",
      oldtempEditabel: "",

      editableTabsValue: "0",
      currenteditableTabsValue: 0,
      maxeditableTabsValue: 0,
      editableTabs: [],
      tabIndex: 0,

      colNum: 1,

      activityList: [],
      departmentId: "",
      schoolId: "",
      courseId: "",
      detailId: "",
      currentNumberofActivities: 0,

      firstActivities: true,

      dirty: false,
      saving: false,
      count: 0,
      localres: {},
      postData: {
        activities: {
          item: [],
          value: [],
          remark: [],
        },
        objectives: {
          object: [],
          title: [],
          sum: [],
          value: [],
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
    Sortable,
    EditPen,
    Checked,
    CloseBold,
  },
  watch: {
    columnChange: {
      deep: true,
      handler(value) {
        for (let i = 1; i < this.db.objectives.length; i++) {
          let tempLine = "";
          for (let k = 0; k < this.db.objectives[i].length - 1; k++) {
            tempLine = String.fromCharCode(66 + k) + (i + 1) + "+" + tempLine;
          }
          // console.log("tempLine", tempLine.slice(0, -1));

          let tempString = "=" + "SUM(" + tempLine.slice(0, -1) + ")";
          this.db.objectives[i][0] = tempString;

          // console.log(this.db.objectives[i][0]);
        }
        // this.db.objectives.forEach((array) => {
        //   if (array[0] != "合计") {
        //     let tempLine = "";
        //     for (let k = 0; k < array.length - 1; k++) {
        //       tempLine =
        //         String.fromCharCode(66 + k) + (count + 2) + "+" + tempLine;
        //     }
        //     console.log("tempLine", tempLine.slice(0, -1));

        //     let tempString = "=" + "SUM(" + tempLine.slice(0, -1) + ")";
        //     array[0] = tempString;
        //   }
        //   console.log(array[0]);

        //   count++;
        // });
        // console.log(this.db.objectives);
        this.hotInstance.updateSettings({
          data: this.db.objectives,
        });
      },
    },
  },

  methods: {
    confirmSave(newval, oldVal) {
      this.activityTitleConfirm = true;
      ElMessageBox.confirm("是否保存更改后的成绩项名称？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("确认");
          return false;
        })
        .catch(() => {
          console.log("取消");
        });
    },
    dragTab() {
      let that = this;
      var tab = document.querySelector("#drag-tab .el-tabs__nav"); //获取需要拖拽的tab
      console.log("type of tab", typeof tab, tab);
      // this.tempEditabel = JSON.parse(JSON.stringify(this.editableTabs));

      this.sortable = Sortable.create(tab, {
        //oldIIndex拖放前的位置， newIndex拖放后的位置 , editableTabs为遍历的tab签
        animation: 150,
        sort: true,
        onChoose({ oldIndex }) {
          let templist = JSON.parse(JSON.stringify(that.tempEditabel));
          that.oldtempEditabel = JSON.parse(JSON.stringify(that.tempEditabel));
          let currTab = templist[oldIndex];
          console.log("OnChoose currTab:", currTab);

          if (currTab["name"] == "1") {
            that.sortable.option("sort", false);
          } else {
            that.sortable.option("sort", true);
          }
        },
        onMove: function (evt) {
          console.log("evt.related.className", evt.related.id);
          if (evt.related.id == "tab-1") {
            return false;
          }
        },
        onEnd({ newIndex, oldIndex }) {
          let currTab = that.tempEditabel.splice(oldIndex, 1)[0]; //鼠标拖拽当前的el-tabs-pane

          that.tempEditabel.splice(newIndex, 0, currTab);
          that.editableTabs = that.tempEditabel;
          console.log("editableTabs:", that.editableTabs);

          that.currenteditableTabsValue = Number(that.editableTabsValue);

          that.hotInstance.updateSettings({
            data: that.db.items[that.currenteditableTabsValue - 1],
          });
        },
      });
    },
    //tabs的双击可编辑   //双击表格可编辑存在input框问题(2023-04-19)
    tabsContent(val, index) {
      console.log(val, index, "双击编辑tabs");
      this.unsave = true;
      if (index == "1" && this.identity == "教师") {
        val.inputFlag = false;
        ElMessage({
          type: "error",
          message: "更新失败，没有权限",
          duration: 1500,
        });
      } else {
        this.originActivityTitle = val.title;
        this.newActivityTitle = val.title;
        this.originActivitydescription = val.description;
        this.newActivitydescription = val.description;
        val.inputFlag = true;
      }
    },
    editableTabsValueChange(pane) {
      let that = this;
      this.currenteditableTabsValue = Number(pane.props.name);

      if (this.identity == "学院管理员" || this.identity == "课程负责人") {
        console.log("the teacher can edit the first tab content");

        this.hotInstance.updateSettings({
          data: that.db.items[that.currenteditableTabsValue - 1],
          cells(row, col) {
            var cellProperties = {};

            if (row === 2) {
              cellProperties.type = "dropdown";
              cellProperties.source = [" ", "总评", "期末"];
              cellProperties.allowEmpty = true;
              cellProperties.className = "ht-s-size";
              //   cellProperties.validator = that.validScoreSetting();
            }
            if (row === 3) {
              cellProperties.allowEmpty = false;
            }
            if (row < 4 && col >= 0) {
              cellProperties.readOnly = false;
            }

            return cellProperties;
          },
        });
      } else {
        if (this.isRespondent != "2" && Number(pane.props.name) == 1) {
          console.log("the teacher can not edit the first tab content");

          this.hotInstance.updateSettings({
            data: that.db.items[that.currenteditableTabsValue - 1],
            contextMenu: false,
            cells(row, col) {
              var cellProperties = {};

              if (row === 2) {
                cellProperties.type = "dropdown";
                cellProperties.source = [" ", "总评", "期末"];
                cellProperties.allowEmpty = true;
                cellProperties.className = "ht-s-size";
                //   cellProperties.validator = that.validScoreSetting();
              }
              if (row === 3) {
                cellProperties.allowEmpty = false;
              }
              if (col >= 0) {
                cellProperties.readOnly = true;
              }

              return cellProperties;
            },
          });
        } else {
          console.log("the teacher can edit the first tab content");

          this.hotInstance.updateSettings({
            data: that.db.items[that.currenteditableTabsValue - 1],
            contextMenu: {
              items: {
                col_left: {
                  name: "在左侧插入列",
                },
                col_right: {
                  name: "在右侧插入列",
                },
                remove_col: {
                  name: "删除列",
                },
              },
            },
            cells(row, col) {
              var cellProperties = {};

              if (row === 2) {
                cellProperties.type = "dropdown";
                cellProperties.source = [" ", "总评", "期末"];
                cellProperties.allowEmpty = true;
                cellProperties.className = "ht-s-size";
                //   cellProperties.validator = that.validScoreSetting();
              }
              if (row === 3) {
                cellProperties.allowEmpty = false;
              }
              if (row < 4 && col >= 0) {
                cellProperties.readOnly = false;
              }

              return cellProperties;
            },
          });
        }
      }

      return console.log("currenteditableTabsValue:", Number(pane.props.name));
    },
    handleTabsEdit(targetName, action, activityName, activityDescription) {
      let that = this;
      console.log("action", action, targetName);
      if (action === "add" && targetName == undefined) {
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
          inputFlag: false,
          input: "成绩项" + " " + newTabName,
          description: "",
        });
        this.editableTabsValue = newTabName.toString();
        console.log("editableTabs after add ", this.editableTabs);
        console.log("@@@@@@@@@@@@@@@@", this.hotInstance);
        this.hotInstance.updateSettings({
          data: that.db.items[that.currenteditableTabsValue - 1],
        });
        this.tempEditabel = JSON.parse(JSON.stringify(this.editableTabs));
        console.log(
          "currenteditableTabsValue:",
          this.currenteditableTabsValue,
          "maxTabsValue:",
          this.maxeditableTabsValue
        );
      }
      if (action === "add" && targetName != undefined) {
        this.currenteditableTabsValue = this.tabIndex;
        this.maxeditableTabsValue = this.tabIndex;
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: activityName ? activityName : "成绩项" + " " + newTabName,
          name: newTabName.toString(),
          value: newTabName,
          inputFlag: false,
          input: activityName ? activityName : "成绩项" + " " + newTabName,
          description: activityDescription,
        });
        console.log("editableTabs after add ", this.editableTabs);
        this.editableTabsValue = newTabName.toString();
        this.tempEditabel = JSON.parse(JSON.stringify(this.editableTabs));
        console.log("currenteditableTabsValue:", this.currenteditableTabsValue);
      }
      if (action === "remove") {
        console.log("removing targetName:", targetName);
        if (targetName != "1") {
          ElMessageBox.confirm("是否确认删除当前成绩项？", "", {
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
              });
              let pane = { props: { name: Number(activeName) } };
              this.editableTabsValueChange(pane);

              this.editableTabsValue = activeName;
              this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
              this.tempEditabel = JSON.parse(JSON.stringify(this.editableTabs));
              console.log("editableTabs:", this.editableTabs);
            })
            .catch((e) => {
              console.log("e", e);
            });
        } else {
          ElMessageBox.confirm("此成绩项为不可删除的", "注意", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          });
        }
      }
    },
    addActivities() {
      console.log("this.db.objectives[0].length", this.db.objectives[0].length);
      if (this.db.objectives[0].length < 20) {
        this.db.objectives.forEach((objective) => {
          objective.push(null);
        });
        this.columnChange++;
        this.hotInstance.updateSettings({
          data: this.db.objectives,
        });
      }
    },
    activateHotcolumn() {
      let self = this;
      let that = this;

      console.log("getting getActivities");

      let container = document.querySelector("#courseHot");
      // let container = this.$refs.courseHot;

      console.log("Handsontable init");
      let hotRegisterer = new Handsontable(container, {
        data: self.db.objectives,
        licenseKey: "non-commercial-and-evaluation",
        colHeaders: false,
        dragToScroll: true,
        rowHeaders: self.objectivesName,
        rowHeaderWidth: 70,
        copyPaste: true,
        allowRemoveColumn: true,
        colWidths: 70,
        formulas: {
          engine: HyperFormula,
        },

        contextMenu: {
          callback(key, selection, clickEvent) {
            // Common callback for all options
            self.columnChange++;
            // console.log(key, selection, clickEvent);
          },
          items: {
            col_left: {
              name: "在左侧插入列",
            },
            col_right: {
              name: "在右侧插入列",
            },
            remove_col: {
              name: "删除列",
            },
          },
        },
        beforeRemoveCol(index, amount, physicalColumns) {
          console.log(index, amount, physicalColumns);
          if (index == 0) {
            return false;
          } else {
            return;
          }
        },
        afterChange(changes, source) {
          // console.log("afterChange", changes);

          if (source === "loadData") {
            // console.log("same");
            return;
          } else {
            self.isValid();

            if (self.count == 0) {
              self.dirty = false;
              // console.log(
              //   "console:",
              //   self.count,
              //   "dirty",
              //   self.dirty,
              //   "items:",
              //   self.db.objectives
              // );
            } else {
              self.dirty = true;
              self.firstActivities = false;
              // console.log(
              //   "console:",
              //   self.count,
              //   "dirty",
              //   self.dirty,
              //   "items:",
              //   self.db.objectives,
              //   "firstActivities",
              //   self.firstActivities
              // );
            }
            self.count++;
            // console.log("console:", self.count);
          }
        },
        afterRemoveCol(changes, source) {
          self.firstActivities = false;
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

        if (row == 0) {
          cellProperties.allowEmpty = false;
        }
        if (col == 0) {
          cellProperties.readOnly = true;
        }

        return cellProperties;
      };
    },
    getActivities() {
      let that = this;

      getDetailedPaperAnalysis(this.paperAnalysisId).then((res) => {
        console.log("getDetailedPaperAnalysis", res);
        if (res) {
          this.hasObjectives = true;
          let setting = res.data.setting;
          setting.object.forEach((objectname) => {
            this.objectivesName.push(objectname);
          });

          if (setting.sum) {
            // this.objectivesName.concat(setting.object);

            let sum = ["合计"];
            this.db.objectives.push(sum.concat(setting.title));
            for (let i = 0; i < setting.sum.length; i++) {
              let templist = [];
              let tempLine = "";
              for (let k = 0; k < setting.value[i].length; k++) {
                tempLine =
                  String.fromCharCode(66 + k) + (i + 2) + "+" + tempLine;
              }
              console.log("tempLine", tempLine.slice(0, -1));

              let tempString = "=" + "SUM(" + tempLine.slice(0, -1) + ")";

              templist.push(tempString);

              for (let j = 0; j < setting.value[i].length; j++) {
                templist.push(setting.value[i][j]);
              }

              this.db.objectives.push(templist);
            }
            for (
              let i = setting.sum.length + 1;
              i < this.objectivesName.length;
              i++
            ) {
              this.db.objectives.push([""]);
            }
            console.log("this.db.objectives", this.db.objectives);
          } else {
            this.db.objectives.push(["合计", ""]);
            this.db.objectives.push(["", ""]);
            setting.object.forEach(() => {
              this.db.objectives.push(["", ""]);
            });
          }

          this.activateHotcolumn();
          this.columnChange++;
        } else {
          this.hasObjectives = false;
        }
      });
    },
    isValid() {
      if (this.firstActivities) {
        console.log("isValid:this.firstActivities:", this.firstActivities);
        return false;
      } else {
        var result = this.toPostData();
        // console.log('result',result);
        return !!result;
      }
    },
    isNotDirty() {
      this.dirty = false;
    },
    save() {
      let that = this;
      this.saving = true;
      this.dirty = false;
      this.postData.objectives = {
        object: [],
        title: [],
        sum: [],
        value: [],
      };
      var result = this.isValid();
      if (!result) {
        this.saving = false;
        return;
      }

      console.log("this.db.objectives:", this.db.objectives);
      this.db.objectives[0]
        .slice(1, this.db.objectives[0].length)
        .forEach((title) => {
          if (typeof title === "string") {
            this.postData.objectives.title.push(title.trim());
          } else {
            this.postData.objectives.title.push(title);
          }
        });
      this.postData.objectives.object = this.objectivesName.slice(
        2,
        this.objectivesName.length
      );

      for (let i = 1; i < this.db.objectives.length; i++) {
        // console.log('this.db.objectives[i][0]',typeof(this.db.objectives[i][0]))
        let tempdata = this.hotInstance.getDataAtCell(i, 0);
        // console.log(
        //   "this.hotInstance.getDataAtCell(i,0)",
        //   this.hotInstance.getDataAtCell(i, 0)
        // );
        if (typeof tempdata === "string") {
          this.postData.objectives.sum.push(parseFloat(tempdata.trim()));
        } else {
          this.postData.objectives.sum.push(parseFloat(tempdata));
        }

        let templist = [];
        let valueLength = this.db.objectives[0].length;
        for (let j = 1; j < valueLength; j++) {
          if (typeof this.db.objectives[i][j] === "string") {
            templist.push(Number(this.db.objectives[i][j].trim()));
          } else {
            templist.push(Number(this.db.objectives[i][j]));
          }
          // console.log('this.db.objectives[i][j]',typeof(this.db.objectives[i][j]))
          //  templist.push(this.db.objectives[i][j].replace(/(\r\n)|(\n)/g,''))
        }
        this.postData.objectives.value.push(templist);
      }
      for (let j = 0; j < this.postData.objectives.value.length; j++) {
        for (let i = 0; i < this.postData.objectives.value[j].length; i++) {
          // console.log(' this.postData.objectives[j][i]', this.postData.objectives.value[j][i])
          if (!this.postData.objectives.value[j][i]) {
            this.postData.objectives.value[j][i] = null;
          }
        }
      }

      delete this.postData.objectives["length"];

      console.log("paperAnalysis postdata:", this.postData.objectives);

      editPaperAnalysis({
        setting: this.postData.objectives,
        detailId: this.detailId,
        id: this.paperAnalysisId,
      })
        .then((res) => {
          console.log("paperAnalysis submit res", res);
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: "更新成功",
              duration: 1500,
            });
          }
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: e.msg,
            duration: 1500,
          });
        });
    },
    toPostData() {
      this.postData.objectives.length = 0;
      let valid = true;
      if (this.db.objectives[0]) {
        for (let i = 0; i < this.db.objectives[0].length; i++) {
          if (!this.db.objectives[0][i]) {
            valid = false;
            break;
          }
        }
      } else {
        valid = false;
      }

      return valid;
    },
    goBackandClean() {
      this.db.items = [];
      this.postData.activities = [];
      console.log("datas:", this.db.items, this.postData.activities);
      this.reload();
    },
    gobaseCourseDetail() {
      console.log("gobaseCourseDetail:" + this.saving + this.dirty);
      if (this.dirty == true || (this.saving == false && this.dirty == true)) {
        ElMessageBox.confirm("数据还未保存，是否仍然关闭？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push({ path: "/paperAnalysis" });
          })
          .catch(() => {});
      } else {
        this.$router.push({ path: "/paperAnalysis" });
      }
    },
  },
  mounted: function () {
    this.departmentId = this.$store.state.currentInfo.departmentId;
    this.schoolId = this.$store.state.currentInfo.schoolId;
    this.courseId = this.$store.state.course.baseCourseCourseId;
    this.identity = this.$store.state.currentInfo.identity;
    this.detailId = this.$store.state.course.detailId;
    this.paperAnalysisId = this.$store.state.course.basecoursePaperAnalysisId;
    if (this.identity == "学院管理员") {
      this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
      console.log("identity:", this.identity);
    } else if (this.identity == "课程负责人") {
      this.classInfo = this.$store.state.currentInfo.respondClassInfo;
      console.log("identity:", this.identity);
    } else {
      this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
      console.log("identity:", this.identity);
    }

    // if (this.classInfo.status == "1" || this.classInfo.status == "4") {
    //   this.canedit = true;
    // }
    // console.log("this.canedit:", this.canedit);

    console.log("db items:", this.db.items);
    console.log("router", this.$route.query["parentName"]);

    this.showActivities = false;
    this.showPaperAnalysis = true;

    this.getActivities();
  },
};
</script>

<style scoped>
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
.descriptionCard {
  width: 400px;
  height: 50px;
}
:deep().el-tabs__new-tab {
  margin: 10px;
}
.card-container {
  margin-top: 100px;
  margin-left: 10%;
  width: 80%;
  height: 250px;
  background-color: white;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  overflow: auto;
}

.hot-table-container {
  /* float: left; */
  display: flex;
  /* height: 200px; */
  /* margin-top: 10px; */
  margin-left: 10px;
}
.divider {
  margin-left: 20px;
  height: 24px;
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
  margin-top: 10%;
  height: 80%;
}
.ng-scope layout-column flex {
  display: flex;
  flex-direction: column;
}
</style>
