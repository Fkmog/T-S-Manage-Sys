<template>
  <div layout="column" flex class="ng-scope layout-column flex">
    <div
      class="submenu"
    >
    <el-row>
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
    
    <script >
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
  DocumentChecked
} from "@element-plus/icons-vue";
import Handsontable from "handsontable";
import request from "@/utils/request/request";
import { getDictionary } from "@/api/dictionary";

import "element-plus/dist/index.css";
import "handsontable/dist/handsontable.full.css";
import "handsontable/dist/handsontable.full.min.css";

export default {
  name: "multiAddBaseCourse",
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
      courseTypeSource: [], //课程类型
      courseNatureSource: [], //课程性质

      firstActivities:true,

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
    DocumentChecked

  },
  methods: {
    activate() {
      this.departmentId = this.$store.state.currentInfo.departmentId;
      this.schoolId = this.$store.state.currentInfo.schoolId;
      let that = this;
      let self = this;
      this.getDict();
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
            data: "courseName",
            title: "课程名",
            width: 260,
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
            data: "courseType",
            title: "课程类型",
            width: 180,
            height: 20,
            // validator: /^(.){1,50}$/,
            type: "dropdown",
            source: this.courseTypeSource,
            allowEmpty: true,
          },
          { 
            data: "courseNature",
            title: "课程性质",
            width: 120,
            height: 20,
            // validator: /^(.){1,50}$/,
            type: "dropdown",
            source: this.courseNatureSource,
            allowEmpty: true,
          },
          {
            data: "credit",
            title: "学分",
            width: 120,
            height: 20,
            allowEmpty: true,
          }, //需要添加validator
        ],
        afterChange(changes, source) {
          if (source === "loadData") {
            console.log("same");
            console.log('db.items',self.db.items);
          } else {
            if (self.count == 0) {
              self.dirty = false;
              console.log('db.items',self.db.items);
              console.log("console:", self.count);
              console.log("different", self.dirty);
            } else {
              self.dirty = true;
              console.log('db.items',self.db.items);
              self.firstActivities = false;
              console.log("console:", self.count);
              console.log("different", self.dirty);
            }
            self.count++;
            console.log("console:", self.count);
          }
        },
        afterRemoveRow(index, amount, physicalRows, source){
          that.dirty=true;
          that.firstActivities = false;
          
        },
      });
      this.hotInstance = hotRegisterer;
    },
    getDict(){
      let that = this;
      getDictionary().then((res)=>{
        console.log(res);
        res.course_nature.forEach((nature)=>{
          that.courseNatureSource.push(nature.dictLabel);
        })
        res.course_type.forEach((type)=>{
          that.courseTypeSource.push(type.dictLabel);
        })
        // that.courseTypeSource = res.
      })
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

      this.postData.courses.forEach(function(course){
        course.courseType = that.courseTypeSource.indexOf(course.courseType);
        course.courseNature = that.courseNatureSource.indexOf(course.courseNature);
      });

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
          if(res.msg == '课程已存在'){
            res.data.forEach(function(teacher){
              
              
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0],0,{validator:/.+@.+/});
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0],1,{validator:/.+@.+/});
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0],2,{validator:/.+gmail@.+/});
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0],3,{validator:/.+@.+/});
              that.hotInstance.setCellMetaObject(Object.keys(teacher)[0],4,{validator:/.+@.+/});
            });
            that.hotInstance.setCellMetaObject(that.postData.courses.length,0,{validator:undefined});
            that.hotInstance.setCellMetaObject(that.postData.courses.length,1,{validator:undefined});
            that.hotInstance.setCellMetaObject(that.postData.courses.length,2,{validator:undefined});
            that.hotInstance.setCellMetaObject(that.postData.courses.length,3,{validator:undefined});
            that.hotInstance.setCellMetaObject(that.postData.courses.length,4,{validator:undefined});
            that.hotInstance.validateCells((valid) =>{
              if(valid){
                
              }
            });
            ElMessage({
                type: 'error',
                message: `添加失败,标红课程已存在`,
                duration:1500,
              })

          }
          else{
            ElMessage({
                type: "error",
                message: `添加失败`,
                duration: 1000,
              });
          }

          
          
          // that.goBackandClean();
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
        course.courseName = course.courseName;
        course.courseType = course.courseType; //that.courseTypeSource.map(item => item).indexOf(course.courseType)
        course.courseNature = course.courseNature;
        if(course.credit){
          course.credit = parseInt(course.credit);
        }
        

        if (
          !course.courseCode||
          !course.courseName||
          // !course.courseType||
          // !course.courseNature||
          !course.credit
        ) {
          if (
            !course.courseCode &&
            !course.courseName&&
            // !course.courseType&&
            // !course.courseNature&&
            !course.credit
          ) {
            return;
          } else {
            // either name OR teacherNo is empty, but not both
            valid = false;
            return;
          }
        } else {
          // both are not empty: post
          // if(course.courseType){
          //   console.log('has course.courseType:',course.courseType);
          //   course.courseType = that.courseTypeSource.indexOf(course.courseType);
          //   };
          // if(course.courseNature){
          //   console.log('has course.courseNature:',course.courseNature);
          //   course.courseNature = that.courseNatureSource.indexOf(course.courseNature);
          // };
          let distCourse = {
            departmentId: that.departmentId,
            schoolId: that.schoolId,
            courseName: course.courseName,
            courseCode: course.courseCode,
            courseType: course.courseType,
            courseNature: course.courseNature,
            // courseType: that.courseTypeSource
            //   .map((item) => item)
            //   .indexOf(course.courseType),
            // courseNature: that.courseNatureSource
            //   .map((item) => item)
            //   .indexOf(course.courseNature),
            credit: course.credit,
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
            this.$router.push({ path: "/baseCourse" });
          })
          .catch(() => {});
      } else {
        this.$router.push({ path: "/baseCourse" });
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
        url: "/baseCourse/addCourses",
        method: "post",
        data: courseList,
      }).then(function (res) {
        localres = res;
        console.log("localres", localres);
        return localres;
      }).catch(e =>{
        return e;
      })
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
 
  width: 910px;
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
    