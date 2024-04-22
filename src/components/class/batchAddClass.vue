<template>
  <div layout="column" flex class="ng-scope layout-column flex">
    <div class="submenu">
      <el-row class="toolbar">
        <el-tooltip content="返回">
          <el-icon
            :size="22"
            style="cursor: pointer"
            class="button-back"
            @click="goBaseCourse"
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
      </el-row>
    </div>
    <div layout="row" flex class="md-padding">
      <div
        class="hot-table-container"
        layout="column"
        flex
        layout-align="start center"
        id="courseHot"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from "vue";
import { HotTable, HotColumn } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import { getDictionary } from "@/api/dictionary";
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

import "element-plus/dist/index.css";
import "handsontable/dist/handsontable.full.css";
import "handsontable/dist/handsontable.full.min.css";

export default {
  name: "batchClassAdd",
  //   inject:['reload'],
  //   provide(){
  //       return{
  //         reload:this.reload
  //       }
  //     },
  data() {
    let self = this;
    return {
      //   isRouterAlive:true,
      dirty: false,
      saving: false,
      departmentId: "",
      schoolId: "",
      courseacademicYear: [], //课程类型
      coursesemestere: [], //课程性质
      academicYear: [],
      semester: ["第一学期", "第二学期"],
      firstActivities: true,

      count: 0,
      localres: {},

      postData: { courses: [] },
      db: { items: [] },

      fromCourseBatchAdd: false,
      hotInstance: undefined,
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
    //getDictionary()
    getDict() {
      let that = this;
      let academicYear = [];
      let semester = [];
      getDictionary().then((res) => {
        console.log(res.academic_year);
        res.academic_year.forEach(function (year) {
          var dict = {
            dictCode: year.dictCode,
            dictLabel: year.dictLabel,
            dictValue: year.dictValue,
          };
          academicYear.push(dict);
          that.courseacademicYear.push(year.dictLabel);
        });
        res.semester.forEach(function (res) {
          var dict = {
            dictCode: res.dictCode,
            dictLabel: res.dictLabel,
            dictValue: res.dictValue,
          };
          semester.push(dict);
          that.coursesemestere.push(res.dictLabel);
        });
        that.academicYear = academicYear;
        that.semester = semester;
        console.log(
          "that.academicYear:",
          that.academicYear,
          " that.semester",
          that.semester
        );
      });
    },
    activate() {
      this.departmentId = this.$store.state.currentInfo.departmentId;
      this.schoolId = this.$store.state.currentInfo.schoolId;
      this.getDict();
      let self = this;
      let that = this;
      // let hotInstance = this.$refs.courseHot;
      // console.log('hotInstance:',hotInstance);
      // let hotRegisterer = new Handsontable();
      // let hotInstance = hotRegisterer.getInstance(courseHot);

      let container = document.querySelector("#courseHot");
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
            data: "className",
            title: "课程名",
            width: 260,
            height: 20,
            validator: /^(.){1,50}$/,
            allowEmpty: false,
          },
          {
            data: "instructor",
            title: "任课教师工号",
            width: 180,
            height: 20,
            validator: /^(.){1,50}$/,
            allowEmpty: false,
          },
          {
            data: "courseCode",
            title: "课程号",
            width: 180,
            height: 20,
            validator: /^(.){1,50}$/,

            allowEmpty: false,
          },
          {
            data: "identifier",
            title: "开课号",
            width: 200,
            height: 20,
            validator: /^(.){1,50}$/,
            allowEmpty: false,
          },
          {
            data: "chosenYear",
            title: "开课学年",
            width: 120,
            height: 20,
            _key: "chosenYear",
            type: "dropdown",
            source: self.courseacademicYear,
            allowEmpty: false,
          },
          {
            data: "chosenSemester",
            title: "选择开课学期",
            width: 120,
            height: 20,
            _key: "chosenYear",
            type: "dropdown",
            source: self.coursesemestere,
            allowEmpty: false,
          },
          {
            data: "remark",
            title: "备注",
            width: 120,
            height: 20,
            allowEmpty: true,
          }, //需要添加validator
        ],
        afterChange(changes, source) {
          if (source === "loadData") {
            console.log("same");
          } else {
            if (self.count == 0) {
              self.dirty = false;
              console.log("console:", self.count);
              console.log("different", self.dirty);
            } else {
              self.dirty = true;
              self.firstActivities = false;
              console.log("console:", self.count);
              console.log("different", self.dirty);
            }
            self.count++;
            console.log("console:", self.count);
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
      console.log("firstActivities", this.firstActivities);
      if (this.firstActivities) {
        return false;
      } else {
        let result = this.toPostData();
        console.log("result", result);
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

      let that = this;

      this.addBaseCourses(this.postData.courses)
        .then(function (res) {
          console.log("res:", res);

          that.firstActivities = true;
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `新建成功`,
              duration: 4000,
            });

            that.goBackandClean();
            that.isNotDirty();
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
          } else if (error.code == "E_CLASS_EXIST") {
            res.data.forEach(function (teacher) {
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 0, {
                validator: /.+fkmog@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 1, {
                validator: /.+fkmog@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 2, {
                validator: /.+fkmog@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 3, {
                validator: /.+fkmog@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 4, {
                validator: /.+fkmog@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 5, {
                validator: /.+fkmog@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 6, {
                validator: /.+fkmog@.+/,
              });
            });
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              0,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              1,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              2,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              3,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              4,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              5,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              6,
              { validator: undefined }
            );
            ElMessage({
              type: "error",
              message: "新建失败，标红教学班已存在",
              duration: 4000,
            });

            that.hotInstance.validateCells((valid) => {
              if (valid) {
              }
            });
          } else if (error.code == "E_TEACHER_NOT_EXIST") {
            error.data.forEach(function (teacher) {
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 0, {
                validator: undefined,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 1, {
                validator: /.+fkmog@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 2, {
                validator: undefined,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 3, {
                validator: undefined,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 4, {
                validator: undefined,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 5, {
                validator: undefined,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 6, {
                validator: undefined,
              });
            });
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              0,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              1,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              2,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              3,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              4,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              5,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              6,
              { validator: undefined }
            );
            ElMessage({
              type: "error",
              message: "新建失败，标红教师不存在",
              duration: 4000,
            });
            that.hotInstance.validateCells((valid) => {
              if (valid) {
              }
            });
          } else if (error.msg == "课程号不存在") {
            error.data.forEach(function (teacher) {
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 0, {
                validator: undefined,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 1, {
                validator: undefined,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 2, {
                validator: /.+fkmog@.+/,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 3, {
                validator: undefined,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 4, {
                validator: undefined,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 5, {
                validator: undefined,
              });
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0], 6, {
                validator: undefined,
              });
            });
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              0,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              1,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              2,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              3,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              4,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              5,
              { validator: undefined }
            );
            that.hotInstance.setCellMetaObject(
              that.postData.courses.length,
              6,
              { validator: undefined }
            );
            ElMessage({
              type: "error",
              message: "新建失败，标红课程号不存在",
              duration: 4000,
            });
            that.hotInstance.validateCells((valid) => {
              if (valid) {
              }
            });
          } else {
            ElMessage({
              type: "error",
              message: `未知错误,请联系相关人员`,
              duration: 4000,
            });
          }
          that.isNotDirty();
        });
    },
    toPostData() {
      this.postData.courses.length = 0; // clean array
      let that = this;

      let res = this.postData.courses;
      let valid = true;
      this.db.items.forEach(function (course) {
        course.courseCode = course.courseCode;
        course.className = course.className;
        course.instructor = course.instructor;
        course.identifier = course.identifier;
        course.chosenYear = course.chosenYear;
        course.chosenSemester = course.chosenSemester;
        course.remark = course.remark;

        if (
          !course.courseCode ||
          !course.className ||
          !course.instructor ||
          !course.identifier ||
          !course.chosenYear ||
          !course.chosenSemester
          // ||!course.remark
        ) {
          if (
            !course.courseCode &&
            !course.className &&
            !course.instructor &&
            !course.identifier &&
            !course.chosenYear &&
            !course.chosenSemester
            // &&!course.remark
          ) {
            return;
          } else {
            // either name OR teacherNo is empty, but not both
            valid = false;
            return;
          }
        } else {
          // both are not empty: post
          let academicYearDictcode = null;
          let semesterDictcode = null;
          that.academicYear.forEach((item) => {
            if (item.dictLabel == course.chosenYear) {
              academicYearDictcode = item.dictValue;
            }
          });

          that.semester.forEach((item) => {
            if (item.dictLabel == course.chosenSemester) {
              semesterDictcode = item.dictValue;
            }
          });

          let distCourse = {
            departmentId: that.departmentId,
            schoolId: that.schoolId,
            // 课程名
            className: course.className,
            // 任课教师
            //   instructor:course.instructor,
            // 开课号
            identifier: course.identifier,
            teacherNumber: course.instructor,
            // 课程号
            courseCode: course.courseCode,

            //   academicYear: course.chosenYear,
            academicYear: academicYearDictcode,

            semester: semesterDictcode,
            //   teacherId: 0,
            //   teacherName: '',
            //   teacherNumber: '',

            //   courseType: that.courseTypeSource
            //     .map((item) => item)
            //     .indexOf(course.courseType),
            remark: course.remark,
          };

          res.push(distCourse);
        }
      });

      return valid;
    },
    goBackandClean() {
      this.db.items = [];
      this.postData.courses = [];

      // console.log("datas has cleaned:", this.db.items, this.postData.course);
      this.hotInstance.updateSettings({
        data: this.db.items,
      });
      this.$router.push({ path: "/class" });
    },

    goBaseCourse() {
      //如果dirty是true 或者saving是false并且dirty是true需要询问
      console.log("gobasecourse:" + this.saving + this.dirty);
      if (this.dirty == true || (this.saving == false && this.dirty == true)) {
        ElMessageBox.confirm("数据还未保存，是否仍然关闭？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push({ path: "/class" });
          })
          .catch(() => {});
      } else {
        this.$router.push({ path: "/class" });
      }
    },
    addBaseCourses(postData) {
      let courseList = [];

      this.postData.courses.forEach(function (course) {
        courseList.push(course);
      });
      console.log("courseList:", courseList);

      return request({
        url: "/classes/addClasses",
        method: "post",
        data: courseList,
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
    // getCourseTypeDict() {
    //   return request({
    //     url: "/dict/data/school/type",
    //     method: "get",
    //     pramas: this.schoolId,
    //   }).then(function (res) {
    //     console.log("dict:", res);
    //     return res;
    //   });
    // },
  },
  mounted() {
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
.button-back {
  margin-left: 50px;
}
.md-padding {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.hot-table-container {
  width: 115 0px;
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
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
.luckysheetborder {
  border: 1px aquamarine;
}

#uploadBtn {
  font-size: 16px;
}
.el-input {
  width: 30%;
}

#tip {
  position: absolute;
  z-index: 100;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
