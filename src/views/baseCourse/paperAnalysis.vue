<template>
  <div class="block" v-show="!closeShow">
    <el-row class="block-row">
      <!-- 返回 -->
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
          @click="backBaseCourse()"
        >
          <Back />
        </el-icon>
      </el-tooltip>
      <div class="title">课程分析表</div>

      <el-divider class="divider" direction="vertical" />
    </el-row>
  </div>

  <div v-show="closeShow" class="submenu">
    <el-row class="rowStyle">
      <el-col :span="2">
        <el-button
          @click="this.toggleSelection()"
          style="float: right"
          class="clearSelected"
          >取消选择</el-button
        >
      </el-col>
      <el-col :span="16">
        <div class="numSelectedTeacher">
          已选中 {{ numSelected }} 份考试分析表
        </div>
      </el-col>
      <el-col :span="4">
        <el-dropdown class="dropdownstyle">
          <el-icon class="dropdownIcon"><MoreFilled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="deleteTeacher">
                删除考试分析表
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>

  <div v-show="hasNoBaseCourse" class="no-class">没有分析表</div>

  <div class="no-major-detail" v-show="hasNoBaseCourse">
    请先点击右上角圆形按钮添加分析表
  </div>

  <addBtn @click="goAddTeacher"></addBtn>
  <div v-show="hasBaseCourse">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      @row-click="goPaperAnalysisDetail"
      style="width: 835px"
      class="el-table-container"
      :header-cell-style="{
        'padding-left': '20px',
        'font-size': '14.4px',
        height: '48px',
        'font-weight': 'bold',
        color: 'black',
      }"
      :cell-style="{
        'padding-left': '20px',
        'font-size': '16px',
        height: '60px',
      }"
      :row-key="rowKey"
    >
      <el-table-column
        type="selection"
        column-key="select"
        width="55"
        :reserve-selection="true"
      />
      <!-- <el-table-column property="id" label="分析表" width="120" /> -->
      <el-table-column property="name" label="名称" width="230" />
      <el-table-column property="description" label="描述" width="350" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-row>
            <el-col :span="6">
              <el-tooltip content="删除" :hide-after="0">
                <el-button
                  link
                  style="color: #3f51b5"
                  @click.stop="deleteAnalysys(scope.row)"
                  ><el-icon><Delete /></el-icon
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="6">
              <el-tooltip content="修改" :hide-after="0">
                <el-button
                  link
                  style="color: #3f51b5"
                  @click.stop="editAnalysys(scope.row)"
                  ><el-icon><Edit /></el-icon
                ></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="pagination-container" flex>
    <el-row type="flex" justify="center" align="middle" class="loadmorestyle">
      <el-button
        :disabled="loadmoreDisabled"
        link
        plain
        v-show="showLoadmore && hasBaseCourse"
        @click="loadmoreCourse()"
        >加载更多</el-button
      >
    </el-row>
  </div>

  <el-dialog
    v-model="dialogFormVisible"
    title="添加分析表"
    width="380px"
    :show-close="false"
    :align-center="true"
  >
    <el-form :model="analysisForm" ref="ruleForm">
      <el-form-item label="名称" prop="courseName">
        <el-input v-model="analysisForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="描述" prop="courseCode">
        <el-input
          type="textarea"
          v-model="analysisForm.description"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <!-- <el-button @click="goAddBaseCourses">新增分析表</el-button> -->
        <el-button
          @click="
            dialogFormVisible = false;
            analysisForm.name = '';
            analysisForm.description = '';
          "
          >取消</el-button
        >

        <el-button
          type="primary"
          @click="submitAnalysis(analysisForm.name, analysisForm.description)"
        >
          确认
        </el-button>
        <!-- <el-button @click="resetForm('ruleForm')"> 重置 </el-button> -->
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="editDialog"
    title="修改分析表"
    width="380px"
    :show-close="false"
    :align-center="true"
  >
    <el-form
      v-model="examEdit"
      :rules="rules"
      ref="examEditForm"
      label-position="top"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="examEdit.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          type="textarea"
          v-model="examEdit.description"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmEditDialog()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ref, reactive } from "vue";
import { HotTable, HotColumn } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import {
  ElTooltip,
  ElIcon,
  ElInput,
  ElForm,
  ElButton,
  ElTable,
  ElMessage,
  ElMessageBox,
  ElDropdown,
} from "element-plus";
import Action from "element-plus";
import {
  Back,
  FolderChecked,
  InfoFilled,
  Loading,
  Search,
  Close,
  Plus,
  Delete,
  Edit,
  MoreFilled,
} from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import request from "@/utils/request/request";
import { deleteExam, editExam } from "@/api/exam";

import {
  getPaperAnalysisList,
  submitPaperAnalysis,
  deletePaperAnalysis,
} from "@/api/basecourse";
import "handsontable/dist/handsontable.full.css"; //解决样式没有的问题
registerAllModules();
export default {
  data() {
    return {
      examEdit: {},
      editDialog: false,
      analysisForm: {
        name: "",
        description: "",
      },
      formLabelWidth: "100px",
      dialogFormVisible: false,
      detailId: "",
      courseId: "",
      identity: "",
      loadmoreDisabled: false,
      hasBaseCourse: false,
      hasNoBaseCourse: false,
      showLoadmore: true,
      departmentId: "",
      schoolId: "",
      keyword: "",
      pageNum: 1,
      pageSize: 20,
      tableData: [],
      multipleSelection: [],
      numSelected: 0,
      teacherId: [],
      closeShow: false,
      clickState: 0,
      form: reactive({
        queryString: "",
      }),
    };
  },
  components: {
    HotTable,
    HotColumn,
    ElTooltip,
    ElIcon,
    ElInput,
    ElForm,
    ElButton,
    ElTable,
    ref,
    reactive,
    Back,
    FolderChecked,
    InfoFilled,
    Loading,
    Search,
    Close,
    Plus,
    Delete,
    MoreFilled,
    request,
    ElMessage,
    ElMessageBox,
    Action,
    HeaderSearch,
    addBtn,
    ElDropdown,
    Edit,
  },
  methods: {
    submitAnalysis(name, description) {
      submitPaperAnalysis({
        name: name,
        description: description,
        detailId: this.detailId,
      }).then((res) => {
        console.log("create analysis", res);
        if (res.code == "SUCCESS") {
          ElMessage({
            type: "success",
            message: `添加成功`,
            duration: 1500,
          });
        }
        this.dialogFormVisible = false;
        this.getTeacherList();
      });
    },
    goPaperAnalysisDetail(row, column) {
      if (column.columnKey === undefined) {
        this.$router.push({
          path: "/baseCourseActivities",
          query: { parentName: "paperAnalysis" },
        });
        this.$store.commit("course/setbasecoursePaperAnalysisId", row.id);
      }
    },
    backBaseCourse() {
      this.$router.push({ path: "/baseCourseDetail" });
    },
    getSearchValue(data) {
      this.keyword = data;
      this.getTeacherList();
    },
    rowKey(row) {
      return row.teacherId;
    },
    loadmoreCourse() {
      if (this.result.total - this.pageSize >= 20) {
        this.pageSize += 20;
        this.getTeacherList();
      } else {
        this.pageSize += this.result.total - this.pageSize;
        this.getTeacherList();
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
        if (this.clickState == 1) {
          this.clickState = 0;
          this.closeShow = !this.closeShow;
        }
      }
    },
    getCurrentRows() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
      var teacherId = [];
      val.forEach(function (teacher) {
        let res = teacher.id;
        teacherId.push(res);
      });
      console.log("选中的信息：", val);
      this.numSelected = this.multipleSelection.length;
      if (this.clickState != 1) {
        this.closeShow = !this.closeShow;
        this.clickState = 1;
      }
      if (this.clickState == 1 && this.numSelected == 0) {
        this.clickState = 0;
        this.closeShow = !this.closeShow;
      }
      this.teacherId = teacherId;
      console.log("teacherId:", this.teacherId);
    },
    onSubmit() {
      alert(this.form.queryString);
    },
    clearqueryString() {
      this.form.queryString = "";
      if (this.form.queryString != "") {
        this.closeShow = true;
      } else {
        this.closeShow = false;
      }
    },
    goAddTeacher() {
      this.dialogFormVisible = true;
      // this.$router.push({ path: "/addTeacher" }); //没有this
    },

    deleteTeacher() {
      let that = this;
      let teacherId = this.teacherId;
      ElMessageBox.confirm("是否确认删除教师", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(
            "teacherID:",
            teacherId,
            "typeof this.teacherID",
            this.teacherId
          );
          deletePaperAnalysis(teacherId).then(function (res) {
            let localres = res;
            console.log("localres", localres);
            if (res === 204) {
              ElMessage({
                type: "success",
                message: `删除成功`,
                duration: 1500,
              });
              that.getTeacherList();
              that.$refs.multipleTable.clearSelection();
              if (that.clickState == 1) {
                that.clickState = 0;
                that.closeShow = !that.closeShow;
              }
            } else {
              ElMessage({
                type: "error",
                message: `删除失败`,
                duration: 1500,
              });
            }
            return localres;
          });
        })
        .catch((e) => {
          console.log(e);
          return e;
        });
    },
    getTeacherList() {
      let that = this;
      this.loadmoreDisabled = true;
      getPaperAnalysisList(this.detailId).then(function (res) {
        that.loadmoreDisabled = false;
        console.log("paperAnalysis 信息", res);
        if (res.total == 0) {
          that.hasBaseCourse = false;
          that.hasNoBaseCourse = true;
        } else {
          that.hasBaseCourse = true;
          that.hasNoBaseCourse = false;
          that.tableData = res.rows;
          that.result = res;
          if (that.pageSize >= res.total) {
            that.showLoadmore = false;
          }
        }
      });
    },
    activate() {
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
    },
    deleteAnalysys(row) {
      let a = [row.id];
      ElMessageBox.confirm("是否确认删除？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteExam(a).then((res) => {
          if (res === 204) {
            ElMessage({
              type: "success",
              message: `删除成功`,
              duration: 1500,
            });
            this.getTeacherList();
          }
        });
      });
    },
    editAnalysys(row) {
      this.editDialog = true;
      this.examEdit = row;
      console.log(row);
    },
    confirmEditDialog() {
      editExam(this.examEdit).then((res) => {
        console.log(res);
        if (res.code === "SUCCESS") {
          this.examEdit = {};
          this.editDialog = false;
          this.getTeacherList();
        }
      });
    },
  },
  mounted: function () {
    let that = this;
    this.activate();
    this.getTeacherList();
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
.dropdownstyle {
  float: right;
  margin-right: 70px;
}
.loadmorestyle {
  padding-top: 24px;
  padding-bottom: 24px;
}
.dropdownIcon {
  margin-top: 9px;
  cursor: pointer;
}
.el-table-container {
  margin: 0 auto;
  cursor: pointer;
  margin-top: 85px;
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}
.pagination-container {
  width: 100%;
}
.no-class {
  margin-top: 120px;
  display: flex;
  justify-content: center;
  font-size: 22px;
}
.rowStyle {
  top: 10px;
}
.headerSearch {
  border: 0;
  float: left;
}
.searchBar {
  display: inline-block;
  width: 100%;
  border: 1px solid rgb(189, 189, 189);
}
.clearSelected {
  color: black;
  margin-top: 2px;
  line-height: 55px;
  float: right;
  align-items: center;
  text-align: center;
  border-radius: 2px;
  outline: none;
  border: 0;
  padding: 0 6px;
  background-color: #f2f2f2;
  transition: box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.clearSelected:hover {
  background-color: #c4c4c4;
}
.addIcon {
  color: white;
  width: 24px;
  height: 24px;
  top: 3px;
}
.addCourseButton {
  background-color: rgb(33, 150, 243);
  min-height: 56px;
  min-width: 56px;
  float: right;
  top: -34px;
  right: 40px;
}

.md-padding {
  margin-top: 120px;
  /* display: flex;
  justify-content: center; */
}

[layout="row"] {
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
}
.el-input-group__append {
  padding: 0;
}

.numSelectedTeacher {
  min-height: 36px;
  color: #3f51b5;
  display: inline-block;
  position: relative;

  min-height: 36px;
  min-width: 88px;
  line-height: 36px;
  vertical-align: middle;
  align-items: center;
  text-align: center;
  border-radius: 2px;
  box-sizing: border-box;

  user-select: none;

  border: 0;
  padding: 0 6px;
  margin: 0;

  font-weight: 500;
  font-size: 14px;

  transition: box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.deleteButton {
  float: right;
  margin-top: 6px;
}
.el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
  height: 10px;
}
.el-checkbox__inner::after {
  height: 10px;
  border: 3px solid white;
  border-left: 0;
  border-top: 0;
  left: 5px;
  top: 1px;
  width: 4px;
}
.el-checkbox {
  --el-checkbox-font-size: 20px;
  --el-checkbox-input-height: 20px;
  --el-checkbox-input-width: 20px;
}
.searchicon {
  margin: 0 6px;
  height: 40px;
  line-height: 24px;
  padding: 8px;
  width: 40px;
}
.closeicon {
  margin: 0 6px;
  height: 40px;
  line-height: 24px;
  padding: 8px;
  width: 40px;
}
.el-icon {
  height: 20px;
  width: 20px;
}
.el-icon svg {
  height: 20px;
  width: 20px;
}
.elinput {
  width: 20%;
}

.elinput:hover {
  border-color: #5c6bc0 !important;
  color: #5c6bc0;
  width: 20%;
}
.searchform {
  width: 100%;
}
.submenu {
  color: #3f51b5;
  font-size: 14px;
  font-weight: 500;
  height: 55px;
  position: absolute;
  top: 110px;
  left: 0px;
  width: 100%;
  border-bottom: 1px solid #d0d0d0;
  background-color: #f2f2f2;
}
.no-major-detail {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  font-size: 13px;
  color: #828d96;
}
.title {
  margin-left: 15px;
  font-size: 16px;
}
</style>
