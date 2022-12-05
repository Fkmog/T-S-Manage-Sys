<template>
  <div layout="column" flex class="ng-scope layout-column flex">
    <div class="searchBar" v-show="!closeShow">
  <HeaderSearch class="headerSearch" ></HeaderSearch>
</div>

    <!-- <div class="submenu no-select ng-scope layout-align-center-center layout-row" layout="row" layout-align="center center" style="justify-content: left" v-show="!closeShow">
       <el-input
        v-model="form.queryString"
        class="elinput"
        placeholder="搜索姓名、工号"
        v-on:keyup.enter="onSubmit"
      >
        <template #append>
          <el-button icon="Search" plain type="primary" @click="getTeacherList"/>
        </template>
      </el-input>
        <el-icon class="closeicon" @click="clearqueryString" ><Close /></el-icon> -->
        <!-- v-show="checkqueryString" -->

        <!-- <el-tooltip content="添加教师">
          <el-button class="md-icon-button button-back"   @click="goAddTeacher" link >
            <el-icon  class="closeicon"><Plus /></el-icon>
          </el-button>
        </el-tooltip> -->
    <!-- </div>  
    <el-icon class="searchicon"><Search /></el-icon> -->
     
    <div v-show="closeShow" class="submenu" style="height: 45px;min-height: 45px;">
      <el-button @click="this.toggleSelection()" style="float:left;" class="clearSelected" link>取消选择</el-button>
      <div class="numSelectedTeacher">已选中 {{numSelected}} 个教师</div>
      <el-button @click="deleteTeacher" style="float:right;" class="deleteButton" link><el-icon><Delete /></el-icon></el-button>
    </div>

    <div layout="row" flex class="md-padding" >
      
      <addBtn @click="goAddTeacher"></addBtn>
      <div class="hot-table-container" layout="column" flex layout-align="start center" >
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          class="elTable"
        >
          <el-table-column  type="selection" width="55" />
          <el-table-column property="teacherId" label="工号" width="120"/>
          <el-table-column property="teacherName" label="姓名" width="120" />
          <el-table-column property="email" label="邮箱" show-overflow-tooltip />
        </el-table>
        
      </div>

   

   </div>
  </div>
</template>

<script >
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ref,reactive,}from 'vue';
import { HotTable,HotColumn } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import { ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox, } from 'element-plus'
import   Action  from 'element-plus'
import { Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete} from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import request from '@/utils/request/request'

import 'handsontable/dist/handsontable.full.css';//解决样式没有的问题

registerAllModules();
export default{
  data() {
      return {
        departmentId:'',
        schoolId:'',




        tableData: reactive([ {
          teacherId: 2022030508,
          teacherName: '王小虎',
          email: '上海市普陀区金沙江路 1518 弄'
        },{
          teacherId: 2022030508,
          teacherName: '王小虎',
          email: '上海市普陀区金沙江路 1518 弄'
        },{
          teacherId: 2022030508,
          teacherName: '王小虎',
          email: '上海市普陀区金沙江路 1518 弄'
        },{
          teacherId: 2022030508,
          teacherName: '王小虎',
          email: '上海市普陀区金沙江路 1518 弄'
        }]),
        multipleSelection: [],
        numSelected:0,
        teacherId:[],
        closeShow : ref(false),
        clickState:0,
        form : reactive({
       queryString:''
      }),
        hotSettings : {
        licenseKey: 'non-commercial-and-evaluation',
        colHeaders: true,
        rowHeaders: true,
        minSpareRows: 1,
        preventOverflow: 'horizontal',
        manualColumnMove: true,
        // copyRowsLimit: settings.MAX_TEACHERS_IN_ONE_DEPARTMENT,  // TODO: minus current #teachers in department
        // maxRows: settings.MAX_TEACHERS_IN_ONE_DEPARTMENT,
        // contextMenu: ['row_above', 'row_below', 'remove_row'],
        contextMenu: {
          items:{
              'row_above': {
                  name: '在上方插入行'
              },
              'row_below': {
                  name: '在下方插入行'
              },
              'remove_row': {
                  name: '删除行'
              }
          }
        },},
      }
    },
    components:{
      HotTable,HotColumn,ElTooltip,ElIcon,ElInput,ElForm, ElButton, 
      ElTable,ref,reactive,Back , FolderChecked, InfoFilled, Loading,
      Search, Close, Plus, Delete, request,ElMessage,ElMessageBox,Action
      ,HeaderSearch,addBtn
    },
    methods:{
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
          if(this.clickState == 1){
            this.clickState=0;
            this.closeShow = !this.closeShow;
          }
        }
      },
      getCurrentRows(){

      },
      handleSelectionChange(val) {
        
        this.multipleSelection = val;
        var teacherId = [];
        val.forEach(function(teacher){
          let res = teacher.teacherId;
          teacherId.push(res);
        });
        console.log('选中的信息：',val);
        this.numSelected = this.multipleSelection.length;
        if(this.clickState != 1){
          this.closeShow = !this.closeShow;
          this.clickState = 1;
        }
        if(this.clickState==1&&this.numSelected == 0)
        {
          this.clickState=0;
            this.closeShow = !this.closeShow;
        }
        this.teacherId = teacherId;
        console.log('teacherId:',this.teacherId);
      },
      onSubmit () {
        alert(this.form.queryString)
      },
      clearqueryString () {
        this.form.queryString=''
        if(this.form.queryString!=''){
          this.closeShow=true
        }
        else{
          this.closeShow=false
        }
      },
      goAddTeacher(){
      this.$router.push({ path:'/addTeacher'})  //没有this
      },
      searchTeacher(){
        alert('search');
      },
      deleteTeacher(teacherId){
        ElMessageBox.confirm(
    '即将删除教师数据',
    '注意',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      return request({
            url:'/teacher/delete',
            method:'post',
            data:{
              teacherId
            }
        }).then(function(res){
          let localres = res;
          console.log('localres',localres);

          if(res.code == '200'){
            ElMessageBox.alert(res.msg, 'Code:'+res.code, {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',
            callback: (action) => {
              ElMessage({
                type: 'success',
                message: `删除成功`,
              })
              
            },
            });
          }
          else{
            ElMessageBox.alert(res.msg, 'Code:'+res.code, {
              // if you want to disable its autofocus
              // autofocus: false,
              confirmButtonText: 'OK',
              callback: (action) => {
                ElMessage({
                  type: 'error',
                  message: `删除失败`,
                })
              },
            });
          }
    return localres; 
        });
    })
    .catch(() => {
      
    })
        
      },
      getTeacherList(){
        let that = this;
        return request({
            url:'/teacher/list',
            method:'get',
            params:{
              'schoolId':this.schoolId,
              'departmentId':this.departmentId
            }
        }).then(function(res){
            console.log(res);
            that.tableData=res.rows;
});
      },
      activate(){
            this.departmentId = this.$store.state.currentInfo.departmentId;
            this.schoolId = this.$store.state.currentInfo.schoolId;
        },
    },
    mounted:function(){
      let that = this;
      this.activate();
      this.getTeacherList();
      


    }
    }
</script>

<style scoped>
.headerSearch{
  border: 0;
  float: left;
  width: 50%;
}
.searchBar{
  display: inline-block;
  width: 100%;
  border: 1px solid rgb(189, 189, 189);
}
.clearSelected{
  min-height:36px; 
  color: #3f51b5;
  float: left;
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
    user-select: none;
    outline: none;
    border: 0;
    padding: 0 6px;
    margin: 0;
    background: transparent;
    
    white-space: nowrap;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 14px;
    font-style: inherit;
    font-variant: inherit;
    font-family: inherit;
    text-decoration: none;
    overflow: hidden;
    transition: box-shadow .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1);
}
.addIcon{
  color: white;
  width: 24px;
  height: 24px;
  top: 3px;
}
.addCourseButton{
  background-color:rgb(33,150,243);
  min-height: 56px;
  min-width: 56px;
  float: right;
  top: -34px;
  right: 40px;
}
.elTable{
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}
.md-padding{
  margin-top: 10px;
}
body {
    font-family: Helvetica Neue,Hiragino Sans GB,Microsoft Yahei,WenQuanYi Micro Hei,sans-serif;
   
}




html {
    font-family: 'Roboto Slab', serif;
}


[layout=row] {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
}
.el-input-group__append{
  padding: 0;
}
.elTable{
  width: 50%;
  top:20%;
  left: 25%;
}
.numSelectedTeacher{
  min-height:36px; 
  color: #3f51b5;
  float: left;
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
    user-select: none;
    outline: none;
    border: 0;
    padding: 0 6px;
    margin: 0;
    background: transparent;
    
    white-space: nowrap;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 14px;
    font-style: inherit;
    font-variant: inherit;
    font-family: inherit;
    text-decoration: none;
    overflow: hidden;
    transition: box-shadow .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1);
}
.deleteButton{
  margin-right: 100px;
  margin-top: 0;
  margin-bottom: 0;
}
.el-checkbox__input.is-indeterminate .el-checkbox__inner::before{
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
.el-checkbox{
  --el-checkbox-font-size:20px;
  --el-checkbox-input-height:20px;
  --el-checkbox-input-width:20px;
}

.searchicon{
  margin: 0 6px;
  height: 40px;
  line-height: 24px;
  padding: 8px;
  width: 40px;
}
.closeicon{
  margin: 0 6px;
  height: 40px;
  line-height: 24px;
  padding: 8px;
  width: 40px;
}
.el-icon{
  height: 20px;
  width: 20px;
}

.el-icon svg{
  height: 20px;
  width: 20px;
}
.elinput{
  width: 20%;
  
}
.elinput:hover {
    border-color: #5c6bc0!important;
    color: #5c6bc0;
    width: 20%;
}
.searchform{
  width: 100%;
}

.submenu {
    color: #3f51b5;
    font-size: 14px;
    font-weight: 500;
    height: 48px;
    min-height: 48px;
    line-height: 1em;
    margin: 0;
    position: relative;
    padding: 6px 96px 5px 32px;
    border-bottom: 1px solid #d0d0d0;
    background-color: transparent;
}







.layout-column {
    flex-direction: column;
}

.flex {
    flex: 1;
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
        font-family: inherit;
        text-decoration: none;
        overflow: hidden;
        transition: box-shadow .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1);
    
} */
</style>