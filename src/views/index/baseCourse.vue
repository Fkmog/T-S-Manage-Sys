<template>




<div class="submenu  " layout="row" 
layout-align="center center" style="justify-content: left" v-show="!closeShow">
  <el-icon class="searchicon"><Search /></el-icon>
</div>

<div v-show="closeShow" class="submenu ">
      <el-button @click="this.toggleSelection()" style="float:left;" class="clearSelected">取消选择</el-button>
      <div class="numSelectedTeacher">已选中 {{numSelected}} 节基础课程</div>
      <el-button @click="deleteBaseCourse" style="float:right;" class="deleteButton" link><el-icon class="iconSize"><Delete /></el-icon></el-button>
</div>

  <div layout="row" flex class="md-padding" >
    <el-button  class="addCourseButton"  circle @click="dialogFormVisible = true"><el-icon class="addIcon"><Plus /></el-icon></el-button>
    <div class="el-table-container" layout="column" flex layout-align="start center" >
      <el-table :data="tableData"  ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange" @row-dblclick="editTrigger">
        <el-table-column  type="selection" width="55" />
        <el-table-column prop="courseName" label="课程名" width="180" />
        <el-table-column prop="courseCode" label="课程号" width="180" />
        <el-table-column prop="courseType" label="课程类型" width="180" />
        <el-table-column prop="courseNature" label="课程性质" width="180" />
        <el-table-column prop="credit" label="学分" width="180" />
        <el-table-column prop="remark" label="备注"  />
      </el-table>
   </div>
  </div>

  <el-dialog v-model="dialogFormVisible" title="添加基础课程">
    <el-form :model="form">
      <el-form-item label="课程名称" :label-width="formLabelWidth">
        <el-input v-model="form.courseName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="课程代码" :label-width="formLabelWidth">
        <el-input v-model="form.courseCode" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学分" :label-width="formLabelWidth">
        <el-input v-model="form.credit" autocomplete="off" />
      </el-form-item>
      <el-form-item label="课程性质" :label-width="formLabelWidth">
        <el-select v-model="form.courseNature" placeholder="请选择课程性质">
          <el-option label="专业任选" value="0" />
          <el-option label="还未确定" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程类型" :label-width="formLabelWidth">
        <el-select v-model="form.courseType" placeholder="请选择课程类型">
          <el-option label="学科基础课" value="0" />
          <el-option label="还未确定" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="学年" :label-width="formLabelWidth">
        <el-select v-model="form.courseYear" placeholder="请选择学年">
          <el-option label="2022" value="0" />
          <el-option label="2023" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input v-model="form.remark" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="goAddBaseCourses">批量添加</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addBaseCourse">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
   
  <el-dialog v-model="dialogFormVisible1" title="修改基础课程">
    <el-form :model="preform">
      <el-form-item label="课程名称" :label-width="formLabelWidth">
        <el-input v-model="preform.courseName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="课程代码" :label-width="formLabelWidth">
        <el-input v-model="preform.courseCode" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学分" :label-width="formLabelWidth">
        <el-input v-model="preform.credit" autocomplete="off" />
      </el-form-item>
      <el-form-item label="课程性质" :label-width="formLabelWidth">
        <el-select v-model="preform.courseNature" placeholder="请选择课程性质">
          <el-option label="专业任选" value="0" />
          <el-option label="还未确定" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程类型" :label-width="formLabelWidth">
        <el-select v-model="preform.courseType" placeholder="请选择课程类型">
          <el-option label="学科基础课" value="0" />
          <el-option label="还未确定" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="学年" :label-width="formLabelWidth">
        <el-select v-model="preform.courseYear" placeholder="请选择学年">
          <el-option label="2022" value="0" />
          <el-option label="2023" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input v-model="preform.remark" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <el-button type="primary" @click="editBaseCourse">
          修改
        </el-button>
      </span>
    </template>
  </el-dialog>
  <div class="pagination-container" flex>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
        :page-sizes="[10, 20]"
        :page-size="10"
        layout="total,sizes,prev, pager, next, jumper"
        :total="result.total">
      </el-pagination>
  </div>
     
      
  

</template>

<script>
import request from '@/utils/request/request'
import { ref,reactive,}from 'vue';
import { ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,ElDialog } from 'element-plus'
import { Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete, Edit} from '@element-plus/icons-vue'
export default {
name:"BaseCourse",
// inject:['reload'], 
// provide(){
//       return{
//         reload:this.reload
//       }
//     },
data(){
  return{
    // isRouterAlive:true,
    closeShow : ref(false),
    multipleSelection: [],
    numSelected:0,
    clickState:0,
    courseId:ref([]),
    tableData: reactive([
  {
    courseName:'',
    courseCode:'',
    courseType:'',
    courseNature:'',
    credit:'',
    courseYear:'',
    remark:'',
  },]),
  pageSize:ref(10),
  pageNum:ref(1),
dialogFormVisible:ref(false),
dialogFormVisible1:ref(false),
formLabelWidth : '140px',
form : reactive({
  courseName: '',
  courseCode: '',
  courseType: '',
  courseNature: '',
  credit: '',
  courseYear: '',
  remark: '',
  
}),
preform:reactive({
  courseName: '',
  courseCode: '',
  courseType: '',
  courseNature: '',
  credit: '',
  courseYear: '',
  remark: '',
  
}),
result:reactive({}),

  }
}, 
methods: 
{
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
      handleSelectionChange(val) {
        var courseId = [];
        this.multipleSelection = val;
        console.log('选中的信息：',val);
        val.forEach(function(course){
          let res = course.courseId;
          courseId.push(res);
        });
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
        this.courseId = courseId;
        console.log('courseId:',this.courseId);
      },
  handleSizeChange(val) {
    this.pageSize = val;
    console.log(`每页 ${val} 条`);
    this.getBaseCourse(this.pageSize,this.pageNum);
  },
  handleCurrentChange(val) {
    this.pageNum = val
    console.log(`当前页: ${val}`);
    this.getBaseCourse(this.pageSize,this.pageNum);
   
  },
  
  // currentPage(val){
  //   console.log(`当前页: ${val}`);
  // },
  addBaseCourse(){
    this.dialogFormVisible = false;
    console.log(this.form);
    
    let that = this;
    let postData = this.formTopostData(this.form);
    console.log('postData:',postData);
    // console.log('psotData:',postData);
    // postData.courseName=this.form.courseName;
    // postData.courseCode=this.form.courseCode;
    // postData.courseType=this.form.courseType;
    // postData.courseNature=this.form.courseNature;
    // postData.credit=this.form.credit;
    // postData.courseYear=this.form.courseYear;
    // postData.semester=this.form.semester;
    // console.log('postData:',postData);
    return request({
            url:'/baseCourse/add',
            method:'post',
            data:postData
        }).then(function(res){
          
          if(res.code == '200'){
            ElMessageBox.alert(res.msg, 'Code:'+res.code, {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',
            callback: function(action) {
              ElMessage({
                type: 'success',
                message: `添加成功`,
              });
              // that.reload();
            },
            });
            
            that.getBaseCourse(that.pageSize,that.pageNum);
          }
          else{
            ElMessageBox.alert(res.msg, 'Code:'+res.code, {
              // if you want to disable its autofocus
              // autofocus: false,
              confirmButtonText: 'OK',
              callback: function(action)  {
                ElMessage({
                  type: 'error',
                  message: `添加失败`,
                });
                // that.reload();
              },
            });
            that.getBaseCourse(that.pageSize,that.pageNum);
          }
        })

  },
  getBaseCourse(pageSize,pageNum){
    console.log('pageSize:',pageSize,' pageNum:',pageNum);
    let that = this;
    return request({
            url:'/baseCourse/list',
            method:'get',
            params:{'pageSize':pageSize,'pageNum':pageNum}
        }).then(function(res){
          console.log('courseDetails:',res);
          res.rows.forEach(function(course){

            that.dataTransfrom(course);
            // course.courseName=(_.isEmpty(course.courseName)) ? '' : course.courseName.trim();
            // course.courseCode=(_.isEmpty(course.courseCode)) ? '' : course.courseCode.trim();
            // course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
            // course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
            // course.credit=course.credit;
            // course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
            // course.semester=(course.semester == '0') ? '上学期' : '下学期';

            // res.rows.push(course);
          });
          that.tableData = res.rows;
          that.result = res;
        });
  },
  deleteBaseCourse(){
    console.log('deleteCourse');
    let that = this;
    return request({
      url:'/baseCourse',
      method:'post',
      data: this.courseId
    })
  },
  editTrigger(val){
    console.log('选中的信息：',val.courseId);
    this.postDataToform(val);
    this.dialogFormVisible1 = true;
    // return request({
    //   url:'/baseCourse/edit',
    //   method:'post',
      
    // })
  },
  editBaseCourse(){
    this.dialogFormVisible1 = false;
    let that = this;
    console.log('preform:',this.preform);
    return request({
      url:'/baseCourse/edit',
      method:'post',
      data: this.preform
    }).then(function(res){
      console.log('res:',res);
      if(res.code == '200'){
            ElMessageBox.alert(res.msg, 'Code:'+res.code, {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',
            callback: function(action) {
              ElMessage({
                type: 'success',
                message: `修改成功`,
              });
              // that.reload();
            },
            });
            
            that.getBaseCourse(that.pageSize,that.pageNum);
          }
          else{
            ElMessageBox.alert(res.msg, 'Code:'+res.code, {
              // if you want to disable its autofocus
              // autofocus: false,
              confirmButtonText: 'OK',
              callback: function(action)  {
                ElMessage({
                  type: 'error',
                  message: `修改失败`,
                });
                // that.reload();
              },
            });
            that.getBaseCourse(that.pageSize,that.pageNum);
          }
    })

  },
  goAddBaseCourses(){
    this.$router.push({ path:'/batchCourseAdd'}) 
  },
  formTopostData(form){
    let postData = {};
    
    postData.courseName=form.courseName;
    postData.courseCode=form.courseCode;
    postData.courseType=form.courseType;
    postData.courseNature=form.courseNature;
    postData.credit=form.credit;
    postData.courseYear=form.courseYear;
    postData.remark=form.remark;
    
    return postData;
  },
  postDataToform(val){
    this.preform.courseId = val.courseId;
    this.preform.courseName= val.courseName;
    this.preform.courseCode = val.courseCode;
    this.preform.courseType= (val.courseType == '学科基础课') ? '0':'1';
    this.preform.courseNature= (val.courseNature=='专业任选') ? '0':'1';
    this.preform.credit=val.credit;
    this.preform.courseYear=(val.courseYear=='2022')? '0':'1';
    this.preform.remark = val.remark;
   
  },
  dataTransfrom(course){
    course.courseName=(_.isEmpty(course.courseName)) ? '' : course.courseName.trim();
    course.courseCode=(_.isEmpty(course.courseCode)) ? '' : course.courseCode.trim();
    course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
    course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
    course.credit=course.credit;
    course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
    course.remark=(_.isEmpty(course.remark)) ? '' : course.remark.trim();

    return course;

  }
},
mounted:function(){
  let that = this;
  that.getBaseCourse(that.pageSize,that.pageNum);
},
components:{
  request,ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,
  Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete,ElDialog,
  ref,reactive,Delete,Edit
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
.pagination{
  margin-left: 40%;
}
.pagination-container{
  width: 100%;
}
.deleteButton, .editButton{
  min-width: 60px;
  padding: 0;
  margin: 0;
}
.iconSize{
  top: 7px;
  height: 20px;
  width: 20px;
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
    height: 36px;
    min-height: 36px;
    line-height: 3em;
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
.deleteButton{
  margin-right: 100px;
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
    margin: 6px 8px;
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