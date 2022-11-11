<template>
  <div layout="row" flex class="md-padding" >
    <el-button  class="addCourseButton"  circle @click="addBaseCourse"><el-icon class="addIcon"><Plus /></el-icon></el-button>
    <div class="el-table-container" layout="column" flex layout-align="start center" >
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="courseName" label="课程名" width="180" />
        <el-table-column prop="courseCode" label="课程号" width="180" />
        <el-table-column prop="courseYear" label="学年" width="180" />
        <el-table-column prop="courseTeacher" label="任课教师" width="180" />
        <el-table-column prop="openCourseNumber" label="开课号" width="250" />
        <el-table-column prop="semester" label="学期"  />
      </el-table>
   </div>
  </div>

  <el-dialog v-model="dialogFormVisible" title="Shipping address">
    <el-form :model="form">
      <el-form-item label="Promotion name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Zones" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
   
  
     
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[18]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
  

</template>

<script>
import request from '@/utils/request/request'
import { ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,ElDialog } from 'element-plus'
import { Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete} from '@element-plus/icons-vue'
export default {
name:"BaseCourse",
data(){
  return{
    tableData: [
  {
    courseName: '计算机导论',
    courseCode: 'A0401010',
    courseYear: '2017~2018',
    courseTeacher:'冯·诺依曼 (19031228)',
    openCourseNumber:'(2017-2018-1)-A0401010-1',
    semester:'上学期'
  },
  {
    courseName: '人工智能',
    courseCode: 'A0401020',
    courseYear: '2017~2018',
    courseTeacher:'冯·诺依曼 (19031228)',
    openCourseNumber:'(2017-2018-1)-A0401010-1',
    semester:'下学期'
  },
  {
    courseName: '测试课程',
    courseCode: 'B10031',
    courseYear: '2018~2019',
    courseTeacher:'冯·诺依曼 (19031228)',
    openCourseNumber:'2011',
    semester:'上学期'
  }
],
dialogFormVisible:ref(false),
formLabelWidth : '140px',
form : reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})
  }
}, 
methods: 
{
  handleSizeChange(val) {
    console.log(`每页 ${val} 条`);
  },
  handleCurrentChange(val) {
    console.log(`当前页: ${val}`);
   
  },
  currentPage(val){
    console.log(`当前页: ${val}`);
  },
  addBaseCourse(){

  },
  getBaseCourse(){
    return request({
            url:'/baseCourse/list',
            method:'get',
        }).then(function(res){
          console.log(res);
        })
  }
},
mounted:function(){
  let that = this;
  that.getBaseCourse();
},
components:{
  request,ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,
  Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete,ElDialog
}

}
</script>

<style scoped>
body {
    font-family: Helvetica Neue,Hiragino Sans GB,Microsoft Yahei,WenQuanYi Micro Hei,sans-serif;
    background-color: #f2f2f2;
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
.el-icon svg{
  width: 20px;
  height: 20px;

}
.addCourseButton:hover{
  background-color:rgb(41,98,255);
  transition: all .3s cubic-bezier(.55,0,.55,.2);
}

.el-table-container{
  width: 80%;
  margin-left: 10%;
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
    background-color: #f2f2f2;
}

.submenu .s-v-bar {
    background: #d0d0d0;
    cursor: default;
    height: 24px;
    margin: 0 6px;
    width: 1px;
}

.md-icon-button {
    margin: 0 6px;
    height: 40px;
    min-width: 0;
    line-height: 24px;
    padding: 8px;
    width: 40px;
    border-radius: 50%;
}

.md-button.md-icon-button {
    margin: 0 6px;
    height: 40px;
    min-width: 0;
    line-height: 24px;
    padding: 8px;
    width: 40px;
    border-radius: 50%;
}

.yw-unclickable {
    cursor: auto;
}

.layout, .layout-column, .layout-row {
    box-sizing: border-box;
    display: flex;
}

.layout-align-center-center, .layout-align-end-center, .layout-align-space-around-center, .layout-align-space-between-center, .layout-align-start-center {
    align-items: center;
    align-content: center;
    max-width: 100%;
}

.layout-align-center, .layout-align-center-center, .layout-align-center-end, .layout-align-center-start, .layout-align-center-stretch {
    justify-content: center;
}

.layout-column {
    flex-direction: column;
}

.flex {
    flex: 1;
}
.layout-row>.flex {
    min-width: 0;
}
</style>