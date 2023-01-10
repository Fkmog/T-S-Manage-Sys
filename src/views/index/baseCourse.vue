<template>
<div  v-show="!closeShow">
  <HeaderSearch >
    <template #rightTime>
      <div class="selectionBar">
        <el-select
        v-model="currentVersion"
        class="m-3"
        
        placeholder="Please enter a keyword"
        
        @change="getCourseByYear(currentVersion)"
      >
      <!-- 远程搜索version -->
      <!-- remote-show-suffix
        remote
        filterable
        reserve-keyword
        :remote-method="remoteMethod"
        :loading="loading" -->
        <el-option
          v-for="item in versions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      </div>
     
    </template>
  </HeaderSearch>
</div>

<!-- <div v-show="closeShow" class="submenu " style="height: 45px;min-height: 45px;">
      <el-button @click="this.toggleSelection()" style="float:left;" class="clearSelected" link>取消选择</el-button>
      <div class="numSelectedTeacher">已选中 {{numSelected}} 节基础课程</div>
      <el-button @click="deleteBaseCourse" style="float:right;" class="deleteButton" link><el-icon class="iconSize"><Delete /></el-icon></el-button>
</div> -->

  <div layout="row" flex class="md-padding" >
    
    <addBtn @click="dialogFormVisible = true"></addBtn>
    
    <div class="el-table-container" layout="column" flex layout-align="start center" >
      
      <el-table :data="tableData"  ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange" @row-dblclick="editTrigger">
        <!-- <el-table-column  type="selection" width="55" /> -->
        <el-table-column  label="课程名" width="250" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ scope.row.courseName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column  label="课程号" width="180" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ scope.row.courseCode }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column  label="课程类型" width="180" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ scope.row.courseType }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column  label="课程性质" width="180" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ scope.row.courseNature }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column  label="学分" width="80" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ scope.row.credit }}</span>
            </div>
          </template>
        </el-table-column>
        
       
        <!-- <el-table-column prop="remark" label="备注" width="150">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ scope.row.remark }}</span>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column  label="操作" >
          <template #default="scope">
            <el-tooltip content="删除">
              <el-button @click="deleteBaseCourse(scope.$index, scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Delete /></el-icon></el-button>
            </el-tooltip>
            <el-tooltip content="修改">
              <el-button @click="editTrigger(scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Edit /></el-icon></el-button>
            </el-tooltip>

            <el-tooltip content="查看信息">
              <el-button v-show="scope.row.versionId" @click="goBaseCourseDetail(scope.$index, scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Document /></el-icon></el-button>
            </el-tooltip>
            <el-tooltip content="添加信息">
            <el-tag v-show="!scope.row.versionId"  type="danger" @click="addBaseCourseDetail(scope.row)">无课程大纲</el-tag>
          </el-tooltip>
          </template>
        </el-table-column>
        
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
        :page-sizes="[10, 15]"
        :page-size="10"
        layout="total,sizes,prev, pager, next, jumper"
        :total="result.total">
      </el-pagination>
  </div>
     
      
  

</template>

<script>
import request from '@/utils/request/request'
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ref,reactive, version,}from 'vue';
import { ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,ElDialog,ElDropdown,ElTag } from 'element-plus'
import { Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete, Edit, MoreFilled, ArrowDown,Document} from '@element-plus/icons-vue'





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
    //from Route
    routeVersionId:'',
    routeCourseId:'',

    //select
    currentVersion:'2016级',
    currentVersionValue:1,
    loading:ref(false),
    options:[],
    versions:[{
      label:'2016级',
      value:1
    },
    {
      label:'2017级',
      value:2
    },
    {
      value:3,
      label:'2018级'
    },
    {
      value:4,
      label:'2019级'
    },
    {
      value:5,
      label:'2020级'
    },
    {
      value:6,
      label:'2021级'
    },
    {
      value:7,
      label:'2022级'
    },
    {
      value:8,
      label:'2023级'
    },
    ],
    versionLabel:[
    '2016级','2017级','2018级',
    '2019级','2020级','2021级','2022级','2023级'
    ],

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
    versionId:'',
  },]),
  pageSize:ref(10),
  pageNum:ref(1),
  departmentId:'',
  schoolId:'',
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
  versionId:'',
}),

preform:reactive({
  courseName: '',
  courseCode: '',
  courseType: '',
  courseNature: '',
  credit: '',
  courseYear: '',
  remark: '',
  versionId:'',
}),

result:reactive({}),

  }
}, 
methods: 
{
  getRouter(){
    this.routeVersionId = this.$route.query.versionId;
    this.routeCourseId = this.$route.query.courseId;
    console.log('routeVersion:',this.routeVersionId)
    console.log('routeCourse:',this.routeCourseId )
  },
  addBaseCourseDetail(row){
    let that = this;
    ElMessageBox.confirm(
    '尚未添加版本信息是否添加？',
    '注意',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    console.log('versionId',that.currentVersionValue,'CourseId',that.courseId);

      return request({
      url:'/detail',
      method:'post',
      data:{
        'versionId':that.currentVersionValue,
        'courseId':row.courseId,
        'departmentId':that.departmentId,
        'schoolId':that.schoolId
      }
    }).then(function(res){
      console.log(res);
      if(res.code == '200'){
            ElMessageBox.alert(res.msg, 'Code:'+res.code, {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',
            callback: function(action) {
              ElMessage({
                type: 'success',
                message: `新增成功`,
              });
              // that.reload();
            },
            });
            //成功后根据vesionId和basecouseId获取详细信息
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
                  message: `新增失败`,
                });
                // that.reload();
              },
            });
            //失败后退回basecouse页面
            that.getBaseCourse(that.pageSize,that.pageNum);
          }
    })
    })
  },
  remoteMethod(version){
    let that = this;
    if (version) {
    this.loading = true
    setTimeout(() => {
      that.loading = false
      that.options = that.versionLabel.filter((item) => {
        return item.includes(version)
      })
    }, 200)
  } else {
    that.options = []
  }

  },
  getCourseByYear(label){
    this.currentVersionValue = label;
    
    this.getBaseCourse(this.pageSize,this.pageNum);
  },
  clearForm(){
    this.form.courseId = '';
    this.form.courseName= '';
    this.form.courseCode = '';
    this.form.courseType= '';
    this.form.courseNature= '';
    this.form.credit='';
    this.form.courseYear='';
    this.form.remark = '';
  },
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
            that.clearForm();
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
            that.clearForm();
            that.getBaseCourse(that.pageSize,that.pageNum);
          }
        })

  },
  getBaseCourse(pageSize,pageNum){
    console.log('pageSize:',pageSize,' pageNum:',pageNum,'versionId',this.currentVersionValue);
    let that = this;
    let courses = []
    return request({
            url:'/baseCourse/list',
            method:'get',
            params:{
            'pageSize':pageSize,
            'pageNum':pageNum,
            'versionId':that.currentVersionValue,
            'departmentId':that.departmentId,
            'schoolId':that.schoolId}
        }).then(function(res){
          console.log('courseDetails:',res);
          console.log('department:',that.departmentId,'schoolId:',that.schoolId);
          res.rows.forEach(function(course){
            
            course.courseName=(_.isEmpty(course.courseName)) ? '' : course.courseName.trim();
            course.courseCode=(_.isEmpty(course.courseCode)) ? '' : course.courseCode.trim();
            course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
            course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
            course.credit=course.credit;
            course.remark = (_.isEmpty(course.remark)) ? '' : course.remark.trim();
            course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
            course.semester=(course.semester == '0') ? '上学期' : '下学期';
            course.versionId = (course.versionId== that.currentVersionValue) ? true : false;

            courses.push(course);
          });
          that.tableData = courses;
          that.result = res;
        });
  },
  deleteBaseCourse(index, row){
    console.log('deleteCourse',row.courseId);
    let that = this;

    ElMessageBox.confirm(
    '将要删除基础课程，是否确定删除？',
    '注意',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      return request({
      url:'/baseCourse'+'/'+row.courseId,
      method:'delete',
      
    }).then(function(res){
      console.log(res);
      if(res.code == '200'){
            ElMessageBox.alert(res.msg, 'Code:'+res.code, {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',
            callback: function(action) {
              ElMessage({
                type: 'success',
                message: `删除成功`,
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
                  message: `删除失败`,
                });
                // that.reload();
              },
            });
            that.getBaseCourse(that.pageSize,that.pageNum);
          }
    })
    })
    .catch(() => {
      
    })
    
  },
  goBaseCourseDetail(index, row){
    console.log('goBaseCourseDetail',row);
    let versionName = this.versions[this.currentVersionValue-1].label;
    this.$router.push({
      path:'/baseCourseDetail',
      query:{
        versionName:versionName,
        versionFlag:row.versionId,
        versionId:this.currentVersionValue,
        courseId:row.courseId,
        courseName: row.courseName,
        courseCode: row.courseCode,
        courseType: row.courseType,
        courseNature: row.courseNature,
        credit: row.credit,
        courseYear: row.courseYear,
        remark: row.remark,
      },
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
    postData.departmentId=this.departmentId;
    postData.schoolId = this.schoolId;
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

  },
  activate(){
            this.departmentId = this.$store.state.currentInfo.departmentId;
            this.schoolId = this.$store.state.currentInfo.schoolId;
        },
},
mounted:function(){
  // let that = this;
  // this.activate();
  // that.getBaseCourse(that.pageSize,that.pageNum);
  // console.log('vesions:',this.versions);
},
created(){
  let that = this;
  this.activate();
  this.getRouter();
  if(this.routeVersionId){
    
    this.currentVersionValue = this.routeVersionId;
  }
  
  that.getBaseCourse(that.pageSize,that.pageNum);

},
components:{
  request,ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,
  Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete,ElDialog,
  ref,reactive,Delete,Edit,HeaderSearch, addBtn, MoreFilled, ElDropdown, ArrowDown,
  Document,ElTag
}

}
</script>

<style scoped>
.selectionBar{
  
  position: absolute;
  right: 10%;
  width: 700px;
  
}
.m-3{
  
  float: right;
  top: 6px;
  right: 10%;
}
.el-icon--right{
  color: white;
}
.dropDown{
  margin-left: 1%;
  width: 100px;
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
.md-padding {
  margin:0 auto;
  margin-top: 85px;
}

.pagination{
  margin-left: 40%;
}
.pagination-container{
  width: 100%;
  margin-top: 10px;
}
.deleteButton, .editButton{
  min-width: 10px;
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
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}
.submenu {
    color: #3f51b5;
    font-size: 14px;
    font-weight: 500;
    height: 44px;
    min-height: 44px;
    line-height: 3em;
    margin-bottom: 13px;
    position: relative;
    padding: 6px 96px 5px 32px;
    border-bottom: 1px solid #d0d0d0;
    background-color: transparent;
   
}

.deleteButton{
  margin-right: 10px;
  margin-top: 0;
  margin-bottom: 0;
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













</style>
  <div  v-show="!closeShow">
    <HeaderSearch >
      <template #rightTime>
        <div class="selectionBar">
          <el-select
          v-model="currentVersion"
          class="m-3"
          
          placeholder="Please enter a keyword"
          
          @change="getCourseByYear(currentVersion)"
        >
        <!-- 远程搜索version -->
        <!-- remote-show-suffix
          remote
          filterable
          reserve-keyword
          :remote-method="remoteMethod"
          :loading="loading" -->
          <el-option
            v-for="item in versions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        </div>
       
      </template>
    </HeaderSearch>
  </div>
  
  <!-- <div v-show="closeShow" class="submenu " style="height: 45px;min-height: 45px;">
        <el-button @click="this.toggleSelection()" style="float:left;" class="clearSelected" link>取消选择</el-button>
        <div class="numSelectedTeacher">已选中 {{numSelected}} 节基础课程</div>
        <el-button @click="deleteBaseCourse" style="float:right;" class="deleteButton" link><el-icon class="iconSize"><Delete /></el-icon></el-button>
  </div> -->
  
    <div layout="row" flex class="md-padding" >
      
      <addBtn @click="dialogFormVisible = true"></addBtn>
      
      <div class="el-table-container" layout="column" flex layout-align="start center" >
        
        <el-table :data="tableData"  ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange" @row-dblclick="editTrigger">
          <!-- <el-table-column  type="selection" width="55" /> -->
          <el-table-column  label="课程名" width="250" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span>{{ scope.row.courseName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="课程号" width="180" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span>{{ scope.row.courseCode }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="课程类型" width="180" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span>{{ scope.row.courseType }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="课程性质" width="180" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span>{{ scope.row.courseNature }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="学分" width="80" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span>{{ scope.row.credit }}</span>
              </div>
            </template>
          </el-table-column>
          
         
          <!-- <el-table-column prop="remark" label="备注" width="150">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span>{{ scope.row.remark }}</span>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column  label="操作" >
            <template #default="scope">
              <el-tooltip content="删除">
                <el-button @click="deleteBaseCourse(scope.$index, scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Delete /></el-icon></el-button>
              </el-tooltip>
              <el-tooltip content="修改">
                <el-button @click="editTrigger(scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Edit /></el-icon></el-button>
              </el-tooltip>
  
              <el-tooltip content="查看信息">
                <el-button v-show="scope.row.versionId" @click="goBaseCourseDetail(scope.$index, scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Document /></el-icon></el-button>
              </el-tooltip>
              <el-tooltip content="添加信息">
              <el-tag v-show="!scope.row.versionId"  type="danger" @click="addBaseCourseDetail(scope.row)">无课程大纲</el-tag>
            </el-tooltip>
            </template>
          </el-table-column>
          
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
          :page-sizes="[10, 15]"
          :page-size="10"
          layout="total,sizes,prev, pager, next, jumper"
          :total="result.total">
        </el-pagination>
    </div>
       
        
    
  
  </template>
  
  <script>
  import request from '@/utils/request/request'
  import HeaderSearch from "@/components/general/headerSearch.vue";
  import addBtn from "@/components/general/addBtn.vue";
  import { ref,reactive, version,}from 'vue';
  import { ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,ElDialog,ElDropdown,ElTag } from 'element-plus'
  import { Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete, Edit, MoreFilled, ArrowDown,Document} from '@element-plus/icons-vue'
  
  
  
  
  
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
      //from Route
      routeVersionId:'',
      routeCourseId:'',
  
      //select
      currentVersion:'2016级',
      currentVersionValue:1,
      loading:ref(false),
      options:[],
      versions:[{
        label:'2016级',
        value:1
      },
      {
        label:'2017级',
        value:2
      },
      {
        value:3,
        label:'2018级'
      },
      {
        value:4,
        label:'2019级'
      },
      {
        value:5,
        label:'2020级'
      },
      {
        value:6,
        label:'2021级'
      },
      {
        value:7,
        label:'2022级'
      },
      {
        value:8,
        label:'2023级'
      },
      ],
      versionLabel:[
      '2016级','2017级','2018级',
      '2019级','2020级','2021级','2022级','2023级'
      ],
  
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
      versionId:'',
    },]),
    pageSize:ref(10),
    pageNum:ref(1),
    departmentId:'',
    schoolId:'',
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
    versionId:'',
  }),
  
  preform:reactive({
    courseName: '',
    courseCode: '',
    courseType: '',
    courseNature: '',
    credit: '',
    courseYear: '',
    remark: '',
    versionId:'',
  }),
  
  result:reactive({}),
  
    }
  }, 
  methods: 
  {
    getRouter(){
      this.routeVersionId = this.$route.query.versionId;
      this.routeCourseId = this.$route.query.courseId;
      console.log('routeVersion:',this.routeVersionId)
      console.log('routeCourse:',this.routeCourseId )
    },
    addBaseCourseDetail(row){
      let that = this;
      ElMessageBox.confirm(
      '尚未添加版本信息是否添加？',
      '注意',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      console.log('versionId',that.currentVersionValue,'CourseId',that.courseId);
  
        return request({
        url:'/detail',
        method:'post',
        data:{
          'versionId':that.currentVersionValue,
          'courseId':row.courseId,
          'departmentId':that.departmentId,
          'schoolId':that.schoolId
        }
      }).then(function(res){
        console.log(res);
        if(res.code == '200'){
              ElMessageBox.alert(res.msg, 'Code:'+res.code, {
              // if you want to disable its autofocus
              // autofocus: false,
              confirmButtonText: 'OK',
              callback: function(action) {
                ElMessage({
                  type: 'success',
                  message: `新增成功`,
                });
                // that.reload();
              },
              });
              //成功后根据vesionId和basecouseId获取详细信息
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
                    message: `新增失败`,
                  });
                  // that.reload();
                },
              });
              //失败后退回basecouse页面
              that.getBaseCourse(that.pageSize,that.pageNum);
            }
      })
      })
    },
    remoteMethod(version){
      let that = this;
      if (version) {
      this.loading = true
      setTimeout(() => {
        that.loading = false
        that.options = that.versionLabel.filter((item) => {
          return item.includes(version)
        })
      }, 200)
    } else {
      that.options = []
    }
  
    },
    getCourseByYear(label){
      this.currentVersionValue = label;
      
      this.getBaseCourse(this.pageSize,this.pageNum);
    },
    clearForm(){
      this.form.courseId = '';
      this.form.courseName= '';
      this.form.courseCode = '';
      this.form.courseType= '';
      this.form.courseNature= '';
      this.form.credit='';
      this.form.courseYear='';
      this.form.remark = '';
    },
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
              that.clearForm();
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
              that.clearForm();
              that.getBaseCourse(that.pageSize,that.pageNum);
            }
          })
  
    },
    getBaseCourse(pageSize,pageNum){
      console.log('pageSize:',pageSize,' pageNum:',pageNum,'versionId',this.currentVersionValue);
      let that = this;
      let courses = []
      return request({
              url:'/baseCourse/list',
              method:'get',
              params:{
              'pageSize':pageSize,
              'pageNum':pageNum,
              'versionId':that.currentVersionValue,
              'departmentId':that.departmentId,
              'schoolId':that.schoolId}
          }).then(function(res){
            console.log('courseDetails:',res);
            console.log('department:',that.departmentId,'schoolId:',that.schoolId);
            res.rows.forEach(function(course){
              
              course.courseName=(_.isEmpty(course.courseName)) ? '' : course.courseName.trim();
              course.courseCode=(_.isEmpty(course.courseCode)) ? '' : course.courseCode.trim();
              course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
              course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
              course.credit=course.credit;
              course.remark = (_.isEmpty(course.remark)) ? '' : course.remark.trim();
              course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
              course.semester=(course.semester == '0') ? '上学期' : '下学期';
              course.versionId = (course.versionId== that.currentVersionValue) ? true : false;
  
              courses.push(course);
            });
            that.tableData = courses;
            that.result = res;
          });
    },
    deleteBaseCourse(index, row){
      console.log('deleteCourse',row.courseId);
      let that = this;
  
      ElMessageBox.confirm(
      '将要删除基础课程，是否确定删除？',
      '注意',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        return request({
        url:'/baseCourse'+'/'+row.courseId,
        method:'delete',
        
      }).then(function(res){
        console.log(res);
        if(res.code == '200'){
              ElMessageBox.alert(res.msg, 'Code:'+res.code, {
              // if you want to disable its autofocus
              // autofocus: false,
              confirmButtonText: 'OK',
              callback: function(action) {
                ElMessage({
                  type: 'success',
                  message: `删除成功`,
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
                    message: `删除失败`,
                  });
                  // that.reload();
                },
              });
              that.getBaseCourse(that.pageSize,that.pageNum);
            }
      })
      })
      .catch(() => {
        
      })
      
    },
    goBaseCourseDetail(index, row){
      console.log('goBaseCourseDetail',row);
      let versionName = this.versions[this.currentVersionValue-1].label;

      this.$store.commit("course/setbaseCourseVersionName", versionName);
      this.$store.commit("course/setbaseCourseVersionFlag", row.versionId);
      this.$store.commit("course/setbaseCourseVersionId", this.currentVersionValue);
      this.$store.commit("course/setbaseCourseCourseId", row.courseId);
      this.$store.commit("course/setbaseCourseCourseName", row.courseName);
      this.$store.commit("course/setbaseCourseCourseCode", row.courseCode);
      this.$store.commit("course/setbaseCourseCourseType", row.courseType);
      this.$store.commit("course/setbaseCourseCourseNature", row.courseNature);
      this.$store.commit("course/setbaseCourseCredit",  row.credit);
      this.$store.commit("course/setbaseCourseCourseYear", row.courseYear);
      this.$store.commit("course/setbaseCourseRemark", row.remark);



      this.$router.push({
        path:'/baseCourseDetail',
        // query:{
        //   versionName:versionName,
        //   versionFlag:row.versionId,
        //   versionId:this.currentVersionValue,
        //   courseId:row.courseId,
        //   courseName: row.courseName,
        //   courseCode: row.courseCode,
        //   courseType: row.courseType,
        //   courseNature: row.courseNature,
        //   credit: row.credit,
        //   courseYear: row.courseYear,
        //   remark: row.remark,
        // },
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
      postData.departmentId=this.departmentId;
      postData.schoolId = this.schoolId;
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
  
    },
    activate(){
              this.departmentId = this.$store.state.currentInfo.departmentId;
              this.schoolId = this.$store.state.currentInfo.schoolId;
          },
  },
  mounted:function(){
    // let that = this;
    // this.activate();
    // that.getBaseCourse(that.pageSize,that.pageNum);
    // console.log('vesions:',this.versions);
  },
  created(){
    let that = this;
    this.activate();
    this.getRouter();
    if(this.routeVersionId){
      
      this.currentVersionValue = this.routeVersionId;
    }
    
    that.getBaseCourse(that.pageSize,that.pageNum);
  
  },
  components:{
    request,ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,
    Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete,ElDialog,
    ref,reactive,Delete,Edit,HeaderSearch, addBtn, MoreFilled, ElDropdown, ArrowDown,
    Document,ElTag
  }
  
  }
  </script>
  
  <style scoped>
  .selectionBar{
    
    position: absolute;
    right: 10%;
    width: 700px;
    
  }
  .m-3{
    
    float: right;
    top: 6px;
    right: 10%;
  }
  .el-icon--right{
    color: white;
  }
  .dropDown{
    margin-left: 1%;
    width: 100px;
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
  .md-padding {
    margin:0 auto;
    margin-top: 85px;
  }
  
  .pagination{
    margin-left: 40%;
  }
  .pagination-container{
    width: 100%;
    margin-top: 10px;
  }
  .deleteButton, .editButton{
    min-width: 10px;
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
    box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
  }
  .submenu {
      color: #3f51b5;
      font-size: 14px;
      font-weight: 500;
      height: 44px;
      min-height: 44px;
      line-height: 3em;
      margin-bottom: 13px;
      position: relative;
      padding: 6px 96px 5px 32px;
      border-bottom: 1px solid #d0d0d0;
      background-color: transparent;
     
  }
  
  .deleteButton{
    margin-right: 10px;
    margin-top: 0;
    margin-bottom: 0;
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
  
  
  
  
  
  
  
  
  
  
  
  
  
  </style>