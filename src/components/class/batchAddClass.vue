<template>
    <div layout="column" flex class="ng-scope layout-column flex">
      <div class="submenu ">
        <el-tooltip content="返回" style="float: left">
          <el-button
            class="md-icon-button button-back"
            md-no-ink
            aria-label="返回"
            @click="goBaseCourse"
            link
          >
            <el-icon :size="24"><Back /></el-icon>
          </el-button>
        </el-tooltip>
        <div class="s-v-bar" style="float: left">&nbsp;</div>
        <el-tooltip content="保存" style="float: left">
          <el-button
            class="md-icon-button"
            aria-label="保存"
            @click="save"
            link
            :disabled="!isValid()"
          >
            <el-icon :size="24"><DocumentChecked /></el-icon>
          </el-button>
        </el-tooltip>
        <div flex></div>
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
      
      <script >
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
    DocumentChecked
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
        academicYear:[],
        semester:['第一学期','第二学期'],
        firstActivities:true,
  
        count: 0,
        localres: {},
  
        postData: { courses: [] },
        db: { items: [] },
  
        fromCourseBatchAdd: false,
        hotInstance: undefined,
  
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
            title: "任课教师",
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
            width: 180,
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
            source: self.academicYear,
            allowEmpty: false,
          },
          {
            data: "chosenSemester",
            title: "选择开课学期",
            width: 120,
            height: 20,
            _key: "chosenYear",
            type: "dropdown",
            source: self.semester,
            allowEmpty: false,
          },
          {
            data: "remark",
            title: "备注",
            width: 40,
            height: 20,
            allowEmpty: true,
          }, //需要添加validator
          //   { data: 'courseYear', title: '学年', width: 120, height: 20, type: 'dropdown', _key: 'courseYears', source:['2021-2022','2022-2023'],allowEmpty: false },
  
          //   { data: 'semester', title: '学期', width: 80, height: 20, _key: 'semesters',type: 'dropdown', source:['上学期','下学期'], allowEmpty: false},
          // { data: 'type', title: '课程类型', width: 100, height: 20, type: 'dropdown', source: vm.types, _key: 'courseTypes', allowEmpty: true},
          // { data: 'selectType', title: '选课类型', width: 100, height: 20, type: 'dropdown', source: vm.selectTypes, _key: 'courseSelectTypes', allowEmpty: true},
          //   { data: 'memo', title: '备注', width: 100, height: 20, validator: /^(.){0,200}$/, allowEmpty: true}
        ],
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
      DocumentChecked
  
    },
    methods: {
        //getDictionary()
getDict(){
    let that = this;
    let academicYear = [];
    let semester = [];
    getDictionary().then((res)=>{
    console.log(res.academic_year);
    res.academic_year.forEach(function(year){
        var dict = {
            dictCode:year.dictCode,
            dictLabel:year.dictLabel,
            dictValue:year.dictValue
        }
        academicYear.push(dict);
        that.courseacademicYear.push(year.dictLabel);
    });
    res.semester.forEach(function(res){
        var dict = {
            dictCode:res.dictCode,
            dictLabel:res.dictLabel,
            dictValue:res.dictValue
        }
        semester.push(dict);
        that.coursesemestere.push(res.dictLabel);
    });
    that.academicYear =academicYear;
    that.semester = semester;
    console.log('that.academicYear:',that.academicYear,' that.semester', that.semester);
});

        },
      activate() {
        this.departmentId = this.$store.state.currentInfo.departmentId;
        this.schoolId = this.$store.state.currentInfo.schoolId;
        this.getDict();
        let self = this;
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
          minSpareRows: 2,
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
            width: 180,
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
            width: 40,
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
        });
        this.hotInstance = hotRegisterer;
      },
      isValid() {
  
        if(this.firstActivities){
          return false;
        }
        else{
          let result = this.toPostData();
            return !(!result);
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
  
        this.addBaseCourses(this.postData.courses).then(function (res) {
          console.log("res:", res);
          that.firstActivities = true;    
          if (res.code == "200") {
            ElMessage({
                  type: "success",
                  message: `添加成功`,
                  duration: 1000,
                });
  
            that.goBackandClean();
            that.isNotDirty();
          } else {
            ElMessage({
                  type: "error",
                  message: "添加失败",
                  duration: 1000,
                });
  
            that.goBackandClean();
            that.isNotDirty();
          }
        });
      },
      toPostData() {
        this.postData.courses.length = 0; // clean array
        let that = this;
  
        let res = this.postData.courses;
        let valid = true;
        this.db.items.forEach(function (course) {
          course.courseCode =course.courseCode;
          course.className = course.className;
          course.instructor = course.instructor;
          course.identifier = course.identifier;
          course.chosenYear = course.chosenYear;
          course.chosenSemester = course.chosenSemester;
          course.remark = course.remark;
  
          if (
            !course.courseCode||
            !course.className||
            !course.instructor||
            !course.identifier||
            !course.chosenYear||
            !course.chosenSemester
            // ||!course.remark
          ) {
            if (
              !course.courseCode &&
              !course.className&&
              !course.instructor&&
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
            let academicYearDictcode=null;
            let semesterDictcode = null;
             that.academicYear.forEach(item =>{
                if(item.dictLabel == course.chosenYear){
                    academicYearDictcode = item.dictValue;
                }
            });

            that.semester.forEach(item =>{
                if(item.dictLabel == course.chosenSemester){
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
              identifier:course.identifier,
              teacherNumber:course.instructor,
              // 课程号
              courseCode: course.courseCode,

            //   academicYear: course.chosenYear,
              academicYear:academicYearDictcode,

              semester:semesterDictcode,
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
  
        console.log("datas has cleaned:", this.db.items, this.postData.course);
        this.hotInstance.updateSettings({
          data: this.db.items,
        });
        
      },
      
      goBaseCourse() {
        //如果dirty是true 或者saving是false并且dirty是true需要询问
        console.log("gobasecourse:" + this.saving + this.dirty);
        if (this.dirty == true || (this.saving == false && this.dirty == true)) {
          ElMessageBox.confirm("数据还未保存，是否仍然关闭？", "注意", {
            confirmButtonText: "确定",
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
        let localres;
        let courseList = [];
  
        this.postData.courses.forEach(function (course) {
          courseList.push(course);
        });
        console.log("courseList:", courseList);
  
        return request({
          url: "/classes/addClasses",
          method: "post",
          data: courseList,
        }).then(function (res) {
          localres = res;
          console.log("localres", localres);
          return localres;
        });
      },
      async handleEvent(event){
      switch (event.keyCode) {
        case 86:
          console.log('ctrl + v');
          this.firstActivities = false;
          break;
      }
    }
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
      window.addEventListener('keydown', this.handleEvent)
    },
    beforeDestroy() {
    window.removeEventListener('keydown', this.handleEvent) // 在页面销毁的时候记得解除
},
  };
  </script>
      
      <style  scoped>
  .md-padding {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
  
  
  .hot-table-container {
   
    width: 1130px;
    box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
  }
  .submenu {
    color: #3f51b5;
    position: relative;
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
    z-index: 1000000;
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
      