
<template>
  
    <div v-show="!closeShow">
      <HeaderSearch msg="搜索教师名称" @SearchValue='getSearchValue'></HeaderSearch>
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
        <div class="numSelectedTeacher">已选中 {{ numSelected }} 个教师</div>
      </el-col>
      <el-col :span="4">
       <el-dropdown class="dropdownstyle">

          <el-icon class="dropdownIcon"><MoreFilled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="deleteTeacher" >
                删除教师
                
             
                
              </el-dropdown-item>
              <!-- <el-dropdown-item>Action 3</el-dropdown-item>
              <el-dropdown-item disabled>Action 4</el-dropdown-item>
              <el-dropdown-item divided>Action 5</el-dropdown-item> -->
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
    </div>

    <div v-show="hasNoBaseCourse" class="no-class">
      没有教师
    </div>
     <div class="no-major-detail" v-show="hasNoBaseCourse&&!hasBaseCourse">
    请先点击右上角圆形按钮添加教师
  </div>
      <addBtn @click="goAddTeacher"></addBtn>
      <div v-show="hasBaseCourse" >
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          style="width:895px"
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
          <el-table-column type="selection" width="55" :reserve-selection="true"/>
          <el-table-column property="teacherNumber" label="工号" width="120" />
          <el-table-column property="teacherName" label="姓名" width="120" />
          <el-table-column
            property="email"
            label="邮箱"
            width="600"
          />
        </el-table></div>
       
      
    

    <div  class="pagination-container" flex>
      <el-row type="flex" justify="center" align="middle" class="loadmorestyle">
        <el-button :disabled="loadmoreDisabled" link plain v-show="showLoadmore&&hasBaseCourse" @click="loadmoreCourse()">加载更多</el-button>
      </el-row>
      
    </div>
  
</template>

<script >
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
  ElDropdown
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
  MoreFilled
} from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import request from "@/utils/request/request";
import "handsontable/dist/handsontable.full.css"; //解决样式没有的问题
registerAllModules();
export default {
  data() {
    return {
      loadmoreDisabled:false,
      hasBaseCourse:false,
      hasNoBaseCourse:false,
      showLoadmore:true,
      departmentId: "",
      schoolId: "",
      keyword:'',
      pageNum:1,
      pageSize:20,
      tableData:[],
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
    ElDropdown
  },
  methods: {
    getSearchValue(data){
      this.keyword = data;
      this.getTeacherList();
      },
    rowKey(row) {
      return row.teacherId;
    },
    loadmoreCourse(){
    if(this.result.total-this.pageSize>=20){
      this.pageSize +=20;
      this.getTeacherList();
    }
    else{
      this.pageSize +=(this.result.total-this.pageSize);
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
        let res = teacher.teacherId;
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
      this.$router.push({ path: "/addTeacher" }); //没有this
    },
    searchTeacher() {
      alert("search");
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
          console.log('teacherID:',teacherId,'typeof this.teacherID',this.teacherId);
          return request({
            url: "/teacher",
            method: 'delete',
            data:teacherId
          }).then(function (res) {
            let localres = res;
            console.log("localres", localres);
            if (res === 204) {
              ElMessage({
                    type: "success",
                    message: `删除成功`,
                    duration:1500,
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
                    duration:1500,
                  });
            }
            return localres;
          });
        })
        .catch(e => {
          console.log(e);
          return e;
        });
    },
    getTeacherList() {
      let that = this;
      this.loadmoreDisabled = true;
      return request({
        url: "/teacher/list",
        method: "get",
        params: {
          'schoolId': this.schoolId,
          'departmentId': this.departmentId,
          'pageNum':this.pageNum,
          'pageSize':this.pageSize,
          'selectKeyWord':this.keyword
        },
      }).then(function (res) {
        that.loadmoreDisabled = false;
        console.log(res);
        if(res.total == 0){
          that.hasBaseCourse = false;
          that.hasNoBaseCourse = true;
        }
        else{
          that.hasBaseCourse = true;
          that.hasNoBaseCourse = false;
          that.tableData = res.rows;
          that.result = res;
          if(that.pageSize>=res.total){
              that.showLoadmore = false;
            }
        }

        
      });
    },
    activate() {
      this.departmentId = this.$store.state.currentInfo.departmentId;
      this.schoolId = this.$store.state.currentInfo.schoolId;
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
:deep().searchBlock .el-icon {
  height: 24px;
  width: 24px;
}
:deep().searchBlock .el-icon svg {
  height: 24px;
  width: 24px;
}
 .dropdownstyle{
   float: right;
   margin-right: 70px;
  }
.loadmorestyle{
  padding-top:24px;
  padding-bottom: 24px;
}
.dropdownIcon{
  margin-top: 9px;
  cursor:pointer;
}
 .el-table-container{
  margin: 0 auto;
  margin-top: 85px;
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
  }
  .pagination-container{
    width: 100%;
  }
  .no-class {
  margin-top: 120px;
  display: flex;
  justify-content: center;
  font-size: 22px;
}
.rowStyle{
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
.clearSelected{
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
  background-color:#f2f2f2;
  transition: box-shadow .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1);
  }
  .clearSelected:hover{
    background-color:#c4c4c4;
  }.addIcon {
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
  float:right;
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
/* .el-button {
    
        display: inline-block;
        position: relative;
        cursor: pointer;
        min-height: 36px;
        min-width: 88px;
        line-height: 36px;
        vertical-align: middle;
        align-items: center;
        text-align: center;
        border-radius: 2px;
        box-sizing: border-box;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        outline: none;
        border: 0;
        padding: 0 6px;
        margin: 6px 8px;
        background: transparent;
        color: currentColor;
        white-space: nowrap;
        text-transform: uppercase;
        font-weight: 500;
        font-size: 14px;
        font-style: inherit;
        font-variant: inherit;

        text-decoration: none;
        overflow: hidden;
        transition: box-shadow .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1);
    
} */
</style>
