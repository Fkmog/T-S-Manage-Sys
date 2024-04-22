<template>
  <div layout="column" flex class="ng-scope layout-column flex">
    <div class="submenu">
      <el-row class="toolbar">
        <el-tooltip content="返回">
          <el-icon
            :size="22"
            style="cursor: pointer"
            class="button-back"
            @click="goTeacher"
            ><Back
          /></el-icon>
        </el-tooltip>
        <el-divider class="divider" direction="vertical" />
        <el-tooltip content="保存" :disabled="!isValid()">
          <el-button
            aria-label="保存"
            @click="save"
            link
            :disabled="!isValid()"
          >
            <el-icon :size="22"><DocumentChecked /></el-icon>
          </el-button>
        </el-tooltip>
        <!--  -->

        <el-icon :size="22" class="button-back"><InfoFilled /></el-icon>

        <div class="displayCenter">
          可直接从excel拷贝；可拖动列的顺序；学院最多可添加500个教师
        </div>
      </el-row>
    </div>

    <div layout="row" flex class="md-padding">
      <div
        class="hot-table-container"
        layout="column"
        flex
        layout-align="start center"
        id="courseHot"
      >
        <!-- <hot-table :settings="hotSettings" v-model:data="db.items" width="650" style="line-height: 100px;text-align: center;margin:auto" class="hotTable">
            <hot-column  data="teacherNumber" title="工号" width="200" height="20" ></hot-column>
            <hot-column  data="teacherName" title="姓名" width="200" height="20" ></hot-column>
            <hot-column  data="email" title="邮箱" width="200" height="20" validator="emailcheck" ></hot-column>
          </hot-table> -->
      </div>
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
import {
  Back,
  FolderChecked,
  InfoFilled,
  Loading,
  Download,
  UploadFilled,
  DocumentAdd,
  DocumentChecked,
} from "@element-plus/icons-vue";
import Handsontable from "handsontable";
import request from "@/utils/request/request";
import "@/components/teacher/addTeacher.js";
import "element-plus/dist/index.css";
import "handsontable/dist/handsontable.full.css";

export default {
  name: "addTeacher",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    let self = this;
    return {
      departmentId: "",
      schoolId: "",

      firstActivities: true,
      hotInstance: undefined,

      dirty: false,
      saving: false,
      count: 0,
      localres: {},
      postData: { teachers: [] },
      db: { items: [] },

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
    DocumentChecked,
  },
  methods: {
    activate() {
      this.departmentId = this.$store.state.currentInfo.departmentId;
      this.schoolId = this.$store.state.currentInfo.schoolId;
      this.hottableInit();
    },
    hottableInit() {
      let container = document.querySelector("#courseHot");
      let that = this;
      let hotRegisterer = new Handsontable(container, {
        data: this.db.items,
        licenseKey: "non-commercial-and-evaluation",
        colHeaders: true,
        rowHeaders: true,
        minSpareRows: 1,
        preventOverflow: "horizontal",
        manualColumnMove: true,
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
        columns: [
          {
            data: "teacherNumber",
            title: "工号",
            width: 200,
            height: 20,
            allowEmpty: false,
          },
          {
            data: "teacherName",
            title: "姓名",
            width: 200,
            height: 20,
            allowEmpty: false,
          },
          {
            data: "email",
            title: "邮箱",
            width: 200,
            height: 20,
            validator: /.+@.+/,
            allowEmpty: false,
          },
        ],
        afterChange(changes, source) {
          if (source === "loadData") {
            console.log("same");
          } else {
            if (that.count == 0) {
              that.dirty = false;
              console.log("console:", that.count);
              console.log("different", that.dirty);
            } else {
              that.dirty = true;
              that.firstActivities = false;
              console.log("console:", that.count, "different", that.dirty);
              console.log("different", that.dirty);
            }
            that.count++;
            console.log("console:", that.count);
          }
        },
        afterRemoveRow(index, amount, physicalRows, source) {
          that.dirty = true;
          that.firstActivities = false;
        },
      });
      this.hotInstance = hotRegisterer;
    },
    isValid() {
      if (this.firstActivities) {
        return false;
      } else {
        let result = this.toPostData();
        return !!result;
      }
    },
    isNotDirty() {
      this.dirty = false;
    },
    save() {
      this.saving = true;
      let result = this.isValid();
      if (!result) {
        this.saving = false;
        return;
      }
      let teacherList = [];
      this.postData.teachers.forEach(function (teacher) {
        teacherList.push(teacher);
      });
      console.log("teacherList:", teacherList);
      let that = this;

      this.addTeacher(teacherList)
        .then(function (res) {
          console.log("res:", res);
          that.firstActivities = true;
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `新建成功`,
              duration: 4000,
            });
            that.isNotDirty();
            that.goBackandClean();
          }
        })
        .catch((e) => {
          let error = e.data;
          if (e.status == 500) {
            ElMessage({
              type: "error",
              message: `保存出错，请检查填写的内容`,
              duration: 4000,
            });
          } else if (error.code == "E_TEACHER_EXIST") {
            error.data.forEach(function (teacher) {
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 0, {
                validator: /.+@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 1, {
                validator: /.+@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 2, {
                validator: /.+gmail@.+/,
              });
            });
            that.hotInstance.setCellMetaObject(
              that.postData.teachers.length,
              0,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.teachers.length,
              1,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.teachers.length,
              2,
              { validator: undefined }
            );

            that.hotInstance.validateCells((valid) => {
              if (valid) {
              }
            });

            ElMessage({
              type: "error",
              message: `新建失败,标红教师已存在`,
              duration: 4000,
            });
          } else if (error.code == "E_TEACHER_DUPLICATE") {
            error.data.forEach(function (teacher) {
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 0, {
                validator: /.+@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 1, {
                validator: /.+@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 2, {
                validator: /.+gmail@.+/,
              });
            });
            that.hotInstance.setCellMetaObject(
              that.postData.teachers.length,
              0,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.teachers.length,
              1,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.teachers.length,
              2,
              { validator: undefined }
            );

            that.hotInstance.validateCells((valid) => {
              if (valid) {
              }
            });

            ElMessage({
              type: "error",
              message: `新建失败,标红教师重复`,
              duration: 4000,
            });
          } else if (error.code == "DATA_DUPLICATED") {
            error.data.forEach(function (teacher) {
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 0, {
                validator: /.+@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 1, {
                validator: /.+@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 2, {
                validator: /.+gmail@.+/,
              });
            });
            that.hotInstance.setCellMetaObject(
              that.postData.teachers.length,
              0,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.teachers.length,
              1,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.teachers.length,
              2,
              { validator: undefined }
            );

            that.hotInstance.validateCells((valid) => {
              if (valid) {
              }
            });

            ElMessage({
              type: "error",
              message: `新建失败,标红数据重复`,
              duration: 4000,
            });
          } else {
            ElMessage({
              type: "error",
              message: `未知错误,请联系相关人员`,
              duration: 4000,
            });
          }
          that.count = 0;
        });
    },
    toPostData() {
      let that = this;
      this.postData.teachers.length = 0; // clean array
      let res = this.postData.teachers;
      let valid = true;

      this.db.items.forEach(function (teacher) {
        teacher.teacherNumber = teacher.teacherNumber;
        teacher.teacherName = teacher.teacherName;
        teacher.email = teacher.email;

        if (!teacher.teacherNumber || !teacher.teacherName || !teacher.email) {
          if (
            !teacher.teacherNumber &&
            !teacher.teacherName &&
            !teacher.email
          ) {
            return;
          } else {
            // either name OR teacherNo is empty, but not both
            valid = false;
            return;
          }
        } else {
          // both are not empty: post
          let distTeacher = {
            teacherNumber: teacher.teacherNumber,
            email: teacher.email,
            teacherName: teacher.teacherName,
            departmentId: that.departmentId,
            schoolId: that.schoolId,
          };
          res.push(distTeacher);
        }
      });

      return valid;
    },
    getHotCellsFunction(existTeacher) {
      console.log("updating hotcolumn");
      return function (row, col, prop) {
        console.log("return function...");
        var cellProperties = {};
        let that = this;
        if (row > 1 && col > 1) {
          cellProperties.className = "cell-disallow";
        }
        // existTeacher.forEach(function(teacherRow){
        //   if(row==teacherRow+1 && col>0){
        //     cellProperties.className = 'cell-exist';
        //   }
        // })
        return cellProperties;
      };
    },
    goBackandClean() {
      this.db.items = [];
      this.postData.teachers = [];
      this.count = 0;
      this.hotInstance.updateSettings({
        data: this.db.items,
      });
      this.$router.push({ path: "/teacher" });
      // console.log('datas:', this.db.items,this.postData.teachers);
    },
    goTeacher() {
      console.log("goteacher:" + this.saving + this.dirty);

      if (this.dirty == true || (this.saving == false && this.dirty == true)) {
        ElMessageBox.confirm("数据还未保存，是否仍然关闭？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push({ path: "/teacher" });
          })
          .catch(() => {});
      } else {
        this.$router.push({ path: "/teacher" });
      }
    },
    addTeacher(postData) {
      let localres;
      console.log("postData:", postData);
      return request({
        url: "/teacher/addTeachers",
        method: "post",
        data: postData,
      })
        .then(function (res) {
          localres = res;
          console.log("localres", localres);
          return localres;
        })
        .catch((e) => {
          return e.response.data;
        });
    },
    async handleEvent(event) {
      switch (event.keyCode) {
        case 86:
          console.log("ctrl + v");
          this.firstActivities = false;
          break;
      }
    },
  },
  mounted: function () {
    this.activate();
    window.addEventListener("keydown", this.handleEvent);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleEvent); // 在页面销毁的时候记得解除
  },
};
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
}
.divider {
  margin-left: 20px;
  height: 24px;
  display: flex;
  justify-content: center;
}
.displayCenter {
  color: #3f51b5;
  margin-left: 5px;
  font-size: 14px;
  display: inline-flex;
  justify-content: center;
}
.cell-exist {
  background-color: red;
}
.hot-table-container {
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}
.hotTable {
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}
.md-padding {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.submenu {
  height: 56px;
  position: relative;
  display: flex;
  border-bottom: 1px solid #d0d0d0;
  background-color: transparent;
}
.md-icon-button {
  padding: 20px;
}
.button-back {
  margin-left: 50px;
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
