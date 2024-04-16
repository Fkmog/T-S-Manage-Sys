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
        <div class="title" v-show="from === 'Score'">成绩项</div>

        <div class="title" v-show="from !== 'Score'">课程信息</div>
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
            class="saveBtn"
            :style="!isValid() ? saveStyle : null"
            :disabled="!isValid()"
          >
            <el-icon size="22px" color="rgb(137, 137, 137)">
              <!-- :disabled="!isValid()" -->
              <DocumentChecked />
            </el-icon>
          </el-button>
        </el-tooltip>
      </el-row>
    </div>

    <!-- @tab-add="this.handleTabsEdit('','add')"   -->
    <el-tabs
      v-show="showActivities"
      v-model="editableTabsValue"
      type="card"
      class="activity-tab"
      :editable="canedit"
      @tab-click="editableTabsValueChange"
      @edit="handleTabsEdit"
      id="drag-tab"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <template v-slot="label">
          <span
            v-if="!item.inputFlag"
            style="
              display: inline-block;
              width: 200px;
              text-align: center;
              padding: 10px;
            "
          >
            <el-icon
              size="22px"
              color="rgb(137, 137, 137)"
              style="float: left; top: 4px; cursor: pointer"
              v-show="canedit"
              @click="tabsContent(item, item.name)"
            >
              <EditPen />
            </el-icon>
            {{ item.title }}
          </span>
          <el-input
            v-else-if="!!item.inputFlag"
            :ref="`myInput${item.name}`"
            v-model="newActivityTitle"
            type="text"
            style="width: 250px; margin-left: 10px"
            placeholder="标题"
            clearable
            @clear="
              item.inputFlag = false;
              item.title = originActivityTitle;
            "
          >
            <template #append>
              <el-icon
                size="22px"
                style="cursor: pointer"
                @click="
                  item.inputFlag = false;
                  item.title = newActivityTitle;
                  item.description = newActivitydescription;
                  unsave = false;
                  dirty = true;
                "
              >
                <Checked />
              </el-icon>
            </template>
          </el-input>

          <div
            v-show="
              (!(
                this.identity === '教师' && this.currenteditableTabsValue == 1
              ) &&
                this.canedit) ||
              this.isRespondent
            "
            style="width: 100px; display: inline-block"
          >
            <el-tooltip
              class="box-item"
              effect="dark"
              content="添加成绩项"
              placement="bottom"
              :hide-after="0"
            >
              <el-button
                @click="addActivities"
                link
                :disabled="!over21"
                style="padding: 10px"
              >
                <el-icon size="22px" color="rgb(137, 137, 137)">
                  <CirclePlus />
                </el-icon>
              </el-button>
            </el-tooltip>
          </div>

          <div class="descriptionCard" v-if="!item.inputFlag">
            <div style="margin-left: 10px; margin-right: 10px">
              <span
                style="
                  font-size: 14px;
                  display: -webkit-box;
                  -webkit-line-clamp: 3;
                  color: gray;
                  overflow: hidden;
                  white-space: pre-wrap;
                "
              >
                {{ item.description }}
              </span>
            </div>
          </div>
          <div
            v-else-if="!!item.inputFlag"
            style="width: 95%; height: 100px; padding: 1px 11px"
          >
            <el-input
              :ref="`myInput${item.name}`"
              v-model="newActivitydescription"
              type="textarea"
              clearable
              placeholder="评分标准"
              :rows="2"
              :autosize="{ minRows: 2, maxRows: 3 }"
              @clear="
                item.inputFlag = false;
                item.description = originActivitydescription;
              "
            >
            </el-input>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>

    <div class="card-container">
      <el-tooltip
        v-if="!showActivities"
        class="box-item"
        style="display: flex"
        effect="dark"
        content="添加成绩项"
        placement="bottom"
        :hide-after="0"
      >
        <el-button
          @click="addActivities"
          link
          :disabled="!over21"
          style="padding: 10px"
        >
          <el-icon size="22px" color="rgb(137, 137, 137)">
            <CirclePlus />
          </el-icon>
        </el-button>
      </el-tooltip>
      <div class="hot-table-container" id="courseHot"></div>
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
import _ from "lodash";

export default {
  name: "activities",
  data() {
    let that = this;
    return {
      compareData: [],

      saveStyle: {
        cursor: "not-allowed",
      },
      canedit: false,

      unsave: false,

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
      over21: Boolean,
      activityList: [],
      departmentId: "",
      schoolId: "",
      courseId: "",
      detailId: "",
      currentNumberofActivities: 0,

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

      this.isValid();
      this.unsave = true;
      if (index == "1" && this.identity == "教师" && !this.isRespondent) {
        val.inputFlag = false;
        ElMessage({
          type: "error",
          message: "该成绩项为课程组统一，不可修改",
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
            if (!that.canedit) {
              if (row >= 0) {
                cellProperties.readOnly = true;
              }
            } else {
              if (row === 2) {
                cellProperties.type = "dropdown";
                cellProperties.source = [" ", "非数值", "总评", "期末"];
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
            }

            return cellProperties;
          },
        });
        if (!this.canedit) {
          this.hotInstance.updateSettings({
            contextMenu: false,
          });
        }
      } else {
        if (this.isRespondent && Number(pane.props.name) == 1) {
          console.log("the teacher can not edit the first tab content");

          this.hotInstance.updateSettings({
            data: that.db.items[that.currenteditableTabsValue - 1],
            contextMenu: false,
            cells(row, col) {
              var cellProperties = {};
              if (!that.canedit) {
                if (row >= 0) {
                  cellProperties.readOnly = true;
                }
              } else {
                if (row === 2) {
                  cellProperties.type = "dropdown";
                  cellProperties.source = [" ", "非数值", "总评", "期末"];
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
              }

              return cellProperties;
            },
          });
          if (!this.canedit) {
            this.hotInstance.updateSettings({
              contextMenu: false,
            });
          }
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
              if (!that.canedit) {
                if (row >= 0) {
                  cellProperties.readOnly = false;
                }
              } else {
                if (row === 2) {
                  cellProperties.type = "dropdown";
                  cellProperties.source = [" ", "非数值", "总评", "期末"];
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
              }
              return cellProperties;
            },
          });

          if (!this.canedit) {
            this.hotInstance.updateSettings({
              contextMenu: false,
            });
          }
        }
      }

      return console.log("currenteditableTabsValue:", Number(pane.props.name));
    },
    handleTabsEdit(targetName, action, activityName, activityDescription) {
      let that = this;
      console.log("action", action, targetName);
      if (action === "add" && targetName == undefined) {
        this.dirty = true;
        let item = [null];
        let value = [null];
        let remark = [null];
        let weight = [null];
        let tempdata = [];

        tempdata.push(item);
        tempdata.push(value);
        tempdata.push(remark);
        tempdata.push(weight);
        this.db.items.push(tempdata);
        console.log("this.db.items", this.db.items);
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
          cells(row, col) {
            var cellProperties = {};
            if (!that.canedit) {
              if (row >= 0) {
                cellProperties.readOnly = false;
              }
            } else {
              if (row === 3) {
                cellProperties.allowEmpty = false;
              }
              if (row < 4 && col >= 0) {
                cellProperties.readOnly = false;
              }
            }

            return cellProperties;
          },
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
        this.dirty = true;
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
          })
            .then()
            .catch((e) => {
              console.log(e);
            });
        }
      }
    },
    addActivities() {
      console.log("currenteditableTabsValue", this.currenteditableTabsValue);
      if (
        this.currenteditableTabsValue == 1 &&
        this.identity === "教师" &&
        !this.isRespondent
      ) {
        ElMessage({
          type: "error",
          message: "该成绩项为课程组统一，不可修改",
          duration: 1500,
        });
      } else {
        if (this.currenteditableTabsValue == 0) {
          this.colNum = this.db.items[this.currenteditableTabsValue][0].length;
        } else {
          this.colNum =
            this.db.items[this.currenteditableTabsValue - 1][0].length;
        }

        console.log("this.colNum", this.colNum);

        // console.log('colNum:',this.colNum);
        if (this.colNum < 21) {
          if (!this.currenteditableTabsValue) {
            this.db.items[this.currenteditableTabsValue][0].push("");
            this.db.items[this.currenteditableTabsValue][1].push(null);
            this.db.items[this.currenteditableTabsValue][2].push("");
            this.db.items[this.currenteditableTabsValue][3].push("");
            this.hotInstance.updateSettings({
              data: this.db.items[this.currenteditableTabsValue],
            });
          } else {
            this.db.items[this.currenteditableTabsValue - 1][0].push("");
            this.db.items[this.currenteditableTabsValue - 1][1].push(null);
            this.db.items[this.currenteditableTabsValue - 1][2].push("");
            this.db.items[this.currenteditableTabsValue - 1][3].push("");
            this.hotInstance.updateSettings({
              data: this.db.items[this.currenteditableTabsValue - 1],
            });
          }

          // this.colNum = this.colNum+1;
          // this.dictTolist(this.db.items);
        }
      }
    },
    activateHotcolumn() {
      let self = this;
      let that = this;

      console.log("getting getActivities");

      let container = document.querySelector("#courseHot");
      // let container = this.$refs.courseHot;

      let hotRegisterer = new Handsontable(container, {
        data: self.db.items[0],
        licenseKey: "non-commercial-and-evaluation",
        colHeaders: false,
        dragToScroll: true,
        rowHeaders: ["考核项", "分值", "设置", "权重"],
        copyPaste: true,
        colWidths: 70,
        allowRemoveColumn: true,

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
        beforeCreateCol(index, amount, source) {
          console.log(
            "beforeCreateCol",
            self.currenteditableTabsValue,
            index,
            amount,
            source
          );
          if (
            (self.currenteditableTabsValue === 1 ||
              self.currenteditableTabsValue === 0) &&
            self.identity == "教师" &&
            self.isRespondent
          ) {
            // console.log('same');
            console.log("return false;");
            return false;
          } else {
            console.log("return;", self.db.items);
            return;
          }
        },
        beforeRemoveCol(index, amount, physicalRows, source) {
          console.log("beforeRemoveCol", self.currenteditableTabsValue);
          if (
            (self.currenteditableTabsValue === 1 ||
              self.currenteditableTabsValue === 0) &&
            self.identity == "教师" &&
            self.isRespondent
          ) {
            // console.log('same');
            return false;
          } else {
            return;
          }
        },
        afterChange(changes, source) {
          console.log("changes", changes, "source", source);
          if (source === "loadData") {
            // console.log("same");
            return;
          } else {
            self.isValid();
          }
        },
        afterRemoveCol(changes, source) {},
      });

      this.hotInstance = hotRegisterer;
      if ((this.identity == "教师" && this.isRespondent) || !this.canedit) {
        this.hotInstance.updateSettings({
          contextMenu: false,
        });
      }

      this.hotInstance.updateSettings({
        data: this.db.items[0],
        cells: this.getHotCellsFunction(),
      });
    },
    getHotCellsFunction() {
      let that = this;

      return function (row, col, prop) {
        // http://docs.handsontable.com/0.16.0/tutorial-cell-types.html
        var cellProperties = {};
        if (!that.canedit) {
          if (row >= 0) {
            cellProperties.readOnly = true;
          }
        } else {
          if (row === 2) {
            cellProperties.type = "dropdown";
            cellProperties.source = [" ", "非数值", "总评", "期末"];
            cellProperties.allowEmpty = true;
            cellProperties.className = "ht-s-size";
            //   cellProperties.validator = that.validScoreSetting();
          }
          if (row === 3) {
            cellProperties.allowEmpty = false;
          }
          if (row < 4 && col >= 0) {
            if (that.identity != "教师") {
              cellProperties.readOnly = false;
            } else {
              if (that.isRespondent) {
                cellProperties.readOnly = false;
              } else {
                cellProperties.readOnly = true;
              }
            }
          }
        }

        return cellProperties;
      };
    },
    getActivities() {
      let that = this;
      this.db.items = [];
      if (this.from == "Score") {
        console.log("this is the activity from class");
        return request({
          url: "/classes/" + that.classInfo.classId,
          method: "get",
        }).then(function (res) {
          console.log("class Info", res);
          that.isRespondent = res.data.isRespondent == "2" ? true : false;
          console.log("isRespondent", that.isRespondent);
          let course = res.data;

          if (course.activities) {
            course.activities.forEach((activity) => {
              that.handleTabsEdit(
                1,
                "add",
                activity.name,
                activity.description
              );
              let tempdata = [];
              tempdata.push(activity.item);
              tempdata.push(activity.value);
              tempdata.push(activity.remark);
              if (!activity.weight) {
                let templist = [];
                for (let i = 0; i < activity.item.length; i++) {
                  templist.push("");
                }
                tempdata.push(templist);
              } else {
                tempdata.push(activity.weight);
              }
              that.db.items.push(tempdata);
            });
            that.editableTabsValue = "1";
            that.currenteditableTabsValue = 1;
            console.log("res has activities:", that.db.items);
            that.compareData = JSON.parse(JSON.stringify(that.db.items));
            that.dragTab();
          } else {
            console.log("res has no activities");
            that.handleTabsEdit(1, "add");
            let item = [""];
            let value = [""];
            let remark = [""];
            let weight = [""];
            let tempdata = [];
            tempdata.push(item);
            tempdata.push(value);
            tempdata.push(remark);
            tempdata.push(weight);
            that.db.items.push(tempdata);
            that.compareData = JSON.parse(JSON.stringify(that.db.items));
          }

          that.activateHotcolumn();
        });
      } else {
        console.log("this is the activity from detail", this.detailId);
        return request({
          url: "/detail/" + this.detailId,
          method: "get",
        })
          .then(function (res) {
            console.log("activities", res);

            let course = res.data;
            if (course.activities.length) {
              // that.tabIndex = course.activities.length;

              course.activities.forEach((activity) => {
                that.handleTabsEdit(
                  1,
                  "add",
                  activity.name,
                  activity.description
                );
                let tempdata = [];
                tempdata.push(activity.item);
                tempdata.push(activity.value);
                tempdata.push(activity.remark);
                if (!activity.weight) {
                  let templist = [];
                  for (let i = 0; i < activity.item.length; i++) {
                    templist.push("");
                  }
                  tempdata.push(templist);
                } else {
                  tempdata.push(activity.weight);
                }
                that.db.items.push(tempdata);
              });

              // that.db.items.push(course.activities.item);
              // that.db.items.push(course.activities.value);
              // that.db.items.push(course.activities.remark);
              that.editableTabsValue = "1";
              that.currenteditableTabsValue = 1;
              console.log("res has activities:", that.db.items);
              that.compareData = JSON.parse(JSON.stringify(that.db.items));
              that.dragTab();
            } else {
              console.log("res has no activities");
              that.handleTabsEdit(1, "add");
              let item = [""];
              let value = [""];
              let remark = [""];
              let weight = [""];
              let tempdata = [];
              tempdata.push(item);
              tempdata.push(value);
              tempdata.push(remark);
              tempdata.push(weight);
              that.db.items.push(tempdata);
              that.compareData = JSON.parse(JSON.stringify(that.db.items));
            }
            that.activateHotcolumn();
          })
          .catch((e) => {
            console.log("get activity error", e);
          });
      }
    },
    isValid() {
      var result = this.toPostData();
      console.log("result", result);
      return result;
    },

    save() {
      let that = this;
      this.saving = true;

      this.itemOrValueisEmpty = false;
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

      if (!this.canedit) {
        ElMessage({
          type: "error",
          message: `课程已审核或提交，不可以修改成绩项`,
          duration: 1500,
        });
      } else {
        let keyNum = [];
        let keyName = [];
        let keydescription = [];
        for (let i = 0; i < Object.keys(this.editableTabs).length; i++) {
          keyNum.push(Number(this.editableTabs[i]["name"]) - 1);
          keyName.push(this.editableTabs[i]["title"]);
          keydescription.push(this.editableTabs[i]["description"]);
        }

        let activities = [];

        for (let i = 0; i < keyNum.length; i++) {
          // if(typeof(this.db.items[1][i]) == 'string'){
          //   this.db.items[1][i] = parseInt(this.db.items[1][i]);
          // }
          let tempitem = [];
          let tempvalue = [];
          let tempremark = [];
          let tempweight = [];
          let tempdescription = keydescription[i];
          let tempname = keyName[i];
          console.log("keyNum[i]:", keyNum[i]);
          console.log(this.db.items);
          for (let j = 0; j < this.db.items[keyNum[i]][0].length; j++) {
            if (!this.db.items[keyNum[i]][0][j]) {
              this.itemOrValueisEmpty = true;
            }
            if (!this.db.items[keyNum[i]][1][j]) {
              this.itemOrValueisEmpty = true;
            }
            tempitem.push(
              this.db.items[keyNum[i]][0][j].replace(/[\n\s]/g, "")
            );
            tempvalue.push(this.db.items[keyNum[i]][1][j]);
            tempremark.push(this.db.items[keyNum[i]][2][j]);
            tempweight.push(this.db.items[keyNum[i]][3][j]);
          }
          let dict = {
            item: tempitem,
            value: tempvalue,
            remark: tempremark,
            weight: tempweight,
            name: tempname,
            description: tempdescription,
          };
          activities.push(dict);
        }

        console.log("activities data :", activities);
        if (this.itemOrValueisEmpty) {
          ElMessage({
            type: "error",
            message: `成绩项或者分值为空`,
            duration: 1500,
          });
        } else {
          if (this.from == "Score") {
            return request({
              url: "/classes/editActivities",
              method: "post",
              data: {
                classId: this.classInfo.classId,
                activities: activities,
                schoolId: this.schoolId,
                departmentId: this.departmentId,
              },
            })
              .then(function (res) {
                console.log("res:", res);
                // that.getActivities();
                if (res.code == "SUCCESS") {
                  ElMessage({
                    type: "success",
                    message: `保存成功`,
                    duration: 1500,
                  });
                }
                that.compareData = JSON.parse(JSON.stringify(that.db.items));
                that.dirty = false;
              })
              .catch((e) => {
                let error = e.data;
                console.log("e:", e);
                if (e.status == 500) {
                  ElMessage({
                    type: "error",
                    message: `保存出错，请检查填写的内容`,
                    duration: 1500,
                  });
                } else if (
                  error.code == "UNPROCESSABLE_ENTITY" &&
                  error.msg == "OVERALL_NOT_SET"
                ) {
                  ElMessage({
                    type: "error",
                    message: `更新失败，总评未设置`,
                    duration: 1500,
                  });
                } else if (
                  error.code == "UNPROCESSABLE_ENTITY" &&
                  error.msg == "有权重为空"
                ) {
                  ElMessage({
                    type: "error",
                    message: `更新失败，有权重为空`,
                    duration: 1500,
                  });
                } else if (
                  error.code == "UNPROCESSABLE_ENTITY" &&
                  error.msg == "权重和不对"
                ) {
                  ElMessage({
                    type: "error",
                    message: `更新失败，权重之和必须为100%`,
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
          } else {
            return request({
              url: "/detail",
              method: "put",
              data: {
                schoolId: this.schoolId,
                departmentId: this.departmentId,
                courseId: this.courseId,
                detailId: this.detailId,
                activities: activities,
              },
            })
              .then(function (res) {
                console.log("res:", res);
                // that.getActivities();
                if (res.code == "SUCCESS") {
                  ElMessage({
                    type: "success",
                    message: `保存成功`,
                    duration: 1000,
                  });
                }
                that.compareData = JSON.parse(JSON.stringify(that.db.items));
                that.dirty = false;
              })
              .catch((e) => {
                let error = e.data;
                console.log("e:", e);
                if (e.status == 500) {
                  ElMessage({
                    type: "error",
                    message: `保存出错，请检查填写的内容`,
                    duration: 1500,
                  });
                } else if (
                  error.code == "UNPROCESSABLE_ENTITY" &&
                  error.msg == "OVERALL_NOT_SET"
                ) {
                  ElMessage({
                    type: "error",
                    message: `新建失败，总评未设置`,
                    duration: 1500,
                  });
                } else if (
                  error.code == "UNPROCESSABLE_ENTITY" &&
                  error.msg == "有权重为空"
                ) {
                  ElMessage({
                    type: "error",
                    message: `新建失败，有权重为空`,
                    duration: 1500,
                  });
                } else if (
                  error.code == "UNPROCESSABLE_ENTITY" &&
                  error.msg == "权重和不对"
                ) {
                  ElMessage({
                    type: "error",
                    message: `新建失败，权重和不对`,
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
        }
      }
    },
    toPostData() {
      this.postData.activities.length = 0; // clean array
      let valid = true;
      console.log(_.isEqual(this.compareData, this.db.items), this.dirty);
      if (!_.isEqual(this.compareData, this.db.items) || this.dirty) {
        valid = true;
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
      console.log(_.isEqual(this.compareData, this.db.items));
      let isSame = _.isEqual(this.compareData, this.db.items);
      if (!isSame || (this.saving == false && !isSame)) {
        ElMessageBox.confirm("数据还未保存，是否仍然关闭？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            console.log("from", this.from);
            if (this.from == "Score") {
              console.log("go score");
              this.$router.push({ name: "Score" });
            } else {
              this.$router.push({ path: "/baseCourseDetail" });
            }
          })
          .catch(() => {});
      } else {
        console.log("from", this.from);
        if (this.from == "Score") {
          console.log("go score");
          this.$router.push({ name: "Score" });
        } else {
          this.$router.push({ path: "/baseCourseDetail" });
        }
      }
    },
  },
  mounted: function () {
    this.departmentId = this.$store.state.currentInfo.departmentId;
    this.schoolId = this.$store.state.currentInfo.schoolId;
    this.courseId = this.$store.state.course.baseCourseCourseId;
    this.identity = this.$store.state.currentInfo.identity;
    this.detailId = this.$store.state.course.detailId;

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
    console.log("this.classInfo:", this.classInfo);

    // this.classInfo &&
    (this.classInfo.status == "1" || this.classInfo.status == "4") &&
      this.identity == "教师";

    console.log("db items:", this.db.items);
    console.log("router", this.$route.query["parentName"]);
    if (this.$route.query["parentName"] == "Score") {
      this.from = this.$route.query["parentName"];
    } else {
      this.from = "";
    }
    console.log("from", this.from);
    this.getActivities();

    if (
      this.classInfo &&
      (this.identity == "课程负责人" ||
        this.identity == "学院管理员" ||
        ((this.classInfo.status == "1" || this.classInfo.status == "4") &&
          this.identity == "教师"))
    ) {
      this.canedit = true;
    } else {
      this.canedit = false;
    }

    console.log("this.canedit:", this.canedit);
  },
  watch: {
    dirty: {
      handler() {
        console.log("dirty changes!", this.dirty);
      },
    },
  },
};
</script>

<style scoped>
.saveBtn {
  padding-left: 20px;
}
.descriptionCard {
  /* margin-left: 10px;
  padding-right: 10px; */
  width: 100%;
  height: 90px;
  overflow: auto;
}
:deep().el-tabs__new-tab {
  margin: 10px;
}
.card-container {
  z-index: 100;
  margin-left: 10%;
  width: 80%;
  height: 200px;
  background-color: white;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  overflow: auto;
}
.activity-tab {
  height: 200px;
  margin-top: 68px;
  background: white;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  width: 80%;
  margin-left: 10%;
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
.hot-table-container {
  /* float: left; */
  display: flex;
  /* height: 160px; */
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
