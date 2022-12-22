<template>
  <HeaderSearch v-show="!closeShow">
    <template #rightTime>
        <div class="selectionBar">
          
              <el-select v-model="option1.value" class="m-2" clearable placeholder="更新时间⬇" size="large" @change="selectionOption1" >
              <el-option
                v-for="item in option1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                class="option"
              /></el-select>
            <el-select v-model="option2.value" class="m-3" clearable placeholder="全部" size="large" @change="selectionOption2" >
          <el-option
            v-for="item in option2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          /></el-select>
         
          
        </div>
    </template>
  </HeaderSearch>
 


<div v-show="closeShow" class="submenu" style="height: 45px;min-height: 45px;">
      <el-button @click="this.toggleSelection()" style="float:left;" class="clearSelected" link>取消选择</el-button>
      <div class="numSelectedTeacher" >已选中 {{numSelected}} 节基础课程</div>
      <el-button @click="deleteBaseCourse" style="float:right;" class="deleteButton" link><el-icon class="iconSize"><Delete /></el-icon></el-button>
</div>

<div layout="row" flex class="md-padding" >
    <!-- <el-button  class="addCourseButton"  circle @click="drawer = true"><el-icon class="addIcon"><Plus /></el-icon></el-button> -->
    <addBtn @click="drawer = true"></addBtn>
    <div class="el-table-container">
      <el-table :data="drawertableData"  ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange" @row-dblclick="editTrigger">
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


  <!-- <el-dialog v-model="dialogFormVisible" title="添加基础课程">
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
  </el-dialog> -->
   
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

  <el-drawer v-model="drawer" :direction="direction" >
    <template #title>
      <h4 style="width:100px;">基础课程</h4>
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
    </template>

    <template #default ><!-- 具体basecourse页面，分页 可搜索-->
      <div v-show="!drawercloseShow" class="drawersubmenu" style="height: 45px;min-height: 45px;"></div>
      <div v-show="drawercloseShow" class="drawersubmenu" style="height: 45px;min-height: 45px;">
        <el-button @click="this.drawertoggleSelection()" style="float:left;" class="clearSelected" link>取消选择</el-button>
        <div class="numSelectedTeacher" >已选中 {{drawernumSelected}} 节基础课程</div>
        <el-button @click="addBaseCourseInProgram" style="float:right;" class="drawerdeleteButton" link><el-icon ><Plus class="iconSize" /></el-icon></el-button>
      </div>
      <HeaderSearch style="border: 0;" :msg="searchCourse"></HeaderSearch>
      <div class="drawerBlock" flex>
        <div class="el-table-container">
          <el-table :data="tableData"  ref="drawermultipleTable" style="width: 100%" @selection-change="drawerchandleSelectionChange" @row-dblclick="editTrigger">
            <el-table-column  type="selection" width="55" />
            <el-table-column prop="courseName" label="课程名" width="180" />
            <el-table-column prop="courseCode" label="课程号" width="180" />
            <!-- <el-table-column prop="courseType" label="课程类型" width="180" />
            <el-table-column prop="courseNature" label="课程性质" width="180" />
            <el-table-column prop="credit" label="学分" width="180" />
            <el-table-column prop="remark" label="备注"  /> -->
          </el-table>
        </div>
      </div>

     
      
    </template>
    <template #footer>
      <div style="flex: auto" class="drawerFooter">
       
        
        <div class="pagination-container" flex>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="pagination"
            :page-sizes="[10, 12]"
            :page-size="10"
            layout="total,sizes,prev, pager, next, jumper"
            :total="result.total">
        </el-pagination>
      </div>
      </div>
    </template>
  </el-drawer>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ref,reactive,}from 'vue';
import { ElIcon,ElButton, ElTable,ElMessage, ElMessageBox,ElDialog,ElSelect,ElOption } from 'element-plus'
import { Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete, Edit} from '@element-plus/icons-vue'
import request from '@/utils/request/request'


export default {
name:"Courses",
components:{
  HeaderSearch,ElIcon,ElButton, ElTable,ElMessage, ElMessageBox,ElDialog,ElSelect,ElOption
  , Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete, Edit, addBtn
},
data(){
  return{
    //drawer
    drawer:false,
    direction:'ltr',
    drawercloseShow:ref(false),
    drawermultipleSelection: [],
    drawernumSelected:0,
    drawerclickState:0,
    drawercourseId:[],//clear after add,
    drawerresult:reactive({}),
    drawertableData:[
  {
    courseName:'',
    courseCode:'',
    courseType:'',
    courseNature:'',
    credit:'',
    courseYear:'',
    remark:'',
  },],
    origintableData:[
  {
    courseName:'',
    courseCode:'',
    courseType:'',
    courseNature:'',
    credit:'',
    courseYear:'',
    remark:'',
  },],

    //学校部门专业信息
    departmentId:'',
    schoolId:'',
    majorId:'',
    majorName:'',
    programId:'3',

    
    closeShow : ref(false),
    multipleSelection: [],
    numSelected:0,
    clickState:0,

    //对话框信息
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
      remark: '',}),

    preform:reactive({
      courseName: '',
      courseCode: '',
      courseType: '',
      courseNature: '',
      credit: '',
      courseYear: '',
      remark: '',
      
    }),

    //el-table
    tableData: [
  {
    courseName:'',
    courseCode:'',
    courseType:'',
    courseNature:'',
    credit:'',
    courseYear:'',
    remark:'',
  },],
   

  //分页参数
  pageSize:ref(10),
  pageNum:ref(1),

  //搜索
  searchItems:{
    programId:'',
    courseId:'',
    courseName:'',
  },
  sortBy:{
    option1:'',
    option2:'',
  },


  currentVersion:'2016级',
  currentVersionValue:1,
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


  

result:reactive({}),
    option1 : [
  {
    value: '更新时间',
    label: '更新时间⬇',
  },
  {
    value: '创建时间',
    label: '创建时间⬇',
  },
  {
    value: '名称',
    label: '名称',
  },
],option2 : [
  {
    value: '全部',
    label: '全部',
  },
  {
    value: '已完成设置',
    label: '已完成设置',
  },
  {
    value: '未完成设置',
    label: '未完成设置',
  },
  {
    value: '回收站',
    label: '回收站',
  },
],

  }
},
methods:{
  getCourseByYear(label){
    this.currentVersionValue = label;
    this.getBaseCourse(this.pageSize,this.pageNum);
  },
  // getProgramCourse(){
  //   this.programId = 3;
  //   return request({
  //     url:'/baseCourse/program',
  //     method:'post',
  //     params:this.programId
  //   }).then(function(res){
  //     console.log('getProgramCourse:',res);
  //   })
  // },
  selectionOption1(val){
    console.log(val,typeof(val));
    
    if(val == '更新时间'){
      this.sortBy.option1 = val;
      this.drawertableData.sort((a,b)=>parseInt(a.courseId) - parseInt(b.courseId));
      
    };
    if(val == '创建时间'){
      this.sortBy.option1 = val;
      this.drawertableData.sort((a,b)=>parseInt(b.courseId) - parseInt(a.courseId));
      
    }
    if(val == '名称'){
      this.sortBy.option1 = val;
      this.drawertableData.sort(function(a,b){
        return a.courseName.localeCompare(b.courseName);
      });
    }
    
    if(val == ''){
      this.sortBy.option1 = '更新时间';
      this.drawertableData.sort((a,b)=>parseInt(a.courseId) - parseInt(b.courseId));
    }
    
  },
  selectionOption2(val){
    console.log(val,typeof(val));
    let courseList = [];
    if(val == '已完成设置'){
      this.drawertableData.forEach(function(course){
        if(course.status == '0'){
          courseList.push(course);
        }
      });
      console.log('courseList',courseList);
      this.drawertableData = courseList;
    };
    if(val == '未完成设置'){
      
    };
    if(val == '回收站'){

    };
    if(val == '' ){
      this.drawertableData.sort((a,b)=>parseInt(a.courseId) - parseInt(b.courseId));
    }
    
  },
  searchCourse(msg){
    let that = this;
    let courses = []
    console.log('searchMsg:',msg);
    return request({
      url:'baseCourse/list',
      method:'get',
      params:{
        'courseName':msg,
        'pageSize':that.pageSize,
        'pageNum':that.pageNum,
        'departmentId':that.departmentId,
        'schoolId':that.schoolId,
        'majorId':that.majorId
      }
    }).then(function(res){
      if(res.code == '200'){
            ElMessageBox.alert(res.msg, 'Code:'+res.code, {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',
            callback: function(action) {
              ElMessage({
                type: 'success',
                message: `搜索成功`,
              });
              // that.reload();
            },
            });
            res.rows.forEach(function(course){
            course.courseName=(_.isEmpty(course.courseName)) ? '' : course.courseName.trim();
            course.courseCode=(_.isEmpty(course.courseCode)) ? '' : course.courseCode.trim();
            course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
            course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
            course.credit=course.credit;
            course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
            course.semester=(course.semester == '0') ? '上学期' : '下学期';
            courses.push(course);
          });
          that.tableData = courses;
          that.result = res;
          }
          else{
            ElMessageBox.alert(res.msg, 'Code:'+res.code, {
              // if you want to disable its autofocus
              // autofocus: false,
              confirmButtonText: 'OK',
              callback: function(action)  {
                ElMessage({
                  type: 'error',
                  message: `搜索失败`,
                });
                // that.reload();
              },
            });
           
          }
    });
  },
  confirmClick() {
  ElMessageBox.confirm(`Are you confirm to chose ${this.drawernumSelected} ?`)
    .then(() => {
      this.drawer = false;
    })
    .catch(() => {
      // catch error
    })
},
  cancelClick() {
  this.drawer = false;
},
  handleCurrentChange(val) {
    this.pageNum = val
    console.log(`当前页: ${val}`);
    this.getBaseCourse(this.pageSize,this.pageNum);
   
  },
  handleSizeChange(val) {
    this.pageSize = val;
    console.log(`每页 ${val} 条`);
    this.getBaseCourse(this.pageSize,this.pageNum);
  },
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
  formTopostData(form){
    let postData = {};
    postData.departmentId=this.departmentId;
    postData.schoolId = this.schoolId;
    postData.majorId = this.majorId;
    postData.courseName=form.courseName;
    postData.courseCode=form.courseCode;
    postData.courseType=form.courseType;
    postData.courseNature=form.courseNature;
    postData.credit=form.credit;
    postData.courseYear=form.courseYear;
    postData.remark=form.remark;
    
    return postData;
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
  goAddBaseCourses(){
    this.$router.push({ path:'/courses'}) 
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
  //添加basecourseDetail关联major 没有实现批量添加
  addBaseCourseInProgram(){
    var postData = [];
    let that = this;
    this.drawercourseId.forEach(function(courseId){
      var programCoursedict = {
        schoolId:that.schoolId,
        departmentId:that.departmentId,
        majorId:that.majorId,
        vesionId:that.currentVersionValue,
        courseId:courseId
      }
      postData.push(programCoursedict);
    });
    console.log('addCourse:',postData);
    return request({
      url:'/detail',
      method:'post',
      data:postData,
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
            that.drawercourseId=[];
            that.$refs.drawermultipleTable.clearSelection();
            if(that.drawerclickState == 1){
              that.drawerclickState=0;
              that.drawercloseShow = !that.drawercloseShow;
            };
            
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
            that.drawercourseId=[];
            that.$refs.drawermultipleTable.clearSelection();
            if(that.drawerclickState == 1){
              that.drawerclickState=0;
              that.drawercloseShow = !that.drawercloseShow;
            };
          }
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
      drawerchandleSelectionChange(val) {
        var courseId = [];
        this.drawermultipleSelection = val;
        console.log('选中的信息：',val);
        val.forEach(function(course){
          let res = course.courseId;
          courseId.push(res);
        });
        this.drawernumSelected = this.drawermultipleSelection.length;
        if(this.drawerclickState != 1){
          this.drawercloseShow = !this.drawercloseShow;
          this.drawerclickState = 1;
        }
        if(this.drawerclickState==1&&this.drawernumSelected == 0)
        {
          this.drawerclickState=0;
            this.drawercloseShow = !this.drawercloseShow;
        }
        this.drawercourseId = courseId;
        console.log('courseId:',this.drawercourseId);
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
  drawertoggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.drawermultipleTable.drawertoggleSelection(row);
          });
        } else {
          this.$refs.drawermultipleTable.clearSelection();
          if(this.drawerclickState == 1){
            this.drawerclickState=0;
            this.drawercloseShow = !this.drawercloseShow;
          }
          
        }
    },
  getBaseCourse(pageSize,pageNum,majorId){
    let that = this;
    let courses = [];
    let realurl ='';
    
    if(majorId){
      realurl = '/detailMajor/list';//通过majorId来显示已经添加的detail，可以获取到courseId
      
      return request({
            url:realurl+'?'+'majorId='+this.majorId,
            method:'get',
        }).then(function(res){
          console.log('courseDetails:',res);
          console.log('department:',that.departmentId,'schoolId:',that.schoolId,'majorId:',that.majorId);
          res.rows.forEach(function(course){
            
            course.courseName=(_.isEmpty(course.courseName)) ? '' : course.courseName.trim();
            course.courseCode=(_.isEmpty(course.courseCode)) ? '' : course.courseCode.trim();
            course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
            course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
            course.credit=course.credit;
            course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
            course.semester=(course.semester == '0') ? '上学期' : '下学期';

            courses.push(course);
          });
          
          
            that.drawertableData = courses;
            that.origintableData = courses;
            that.drawerresult = res;
          
          
          
        });
    }
    else{
      realurl = '/baseCourse/list';//根据获取到的已经添加过的courseId来排除搜索到的detail，两个限制vesionId和couseId
      
      return request({
            url:realurl,
            method:'get',
            params:{
            'pageSize':pageSize,
            'pageNum':pageNum,
            'departmentId':that.departmentId,
            'versionId':that.currentVersionValue,
            'schoolId':that.schoolId,
            
            },
        }).then(function(res){
          console.log('courseDetails:',res);
          console.log('department:',that.departmentId,'schoolId:',that.schoolId,'majorId:',that.majorId,);
          res.rows.forEach(function(course){
            if(course.versionId == that.currentVersionValue){
            course.courseName=(_.isEmpty(course.courseName)) ? '' : course.courseName.trim();
            course.courseCode=(_.isEmpty(course.courseCode)) ? '' : course.courseCode.trim();
            course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
            course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
            
            course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
            course.semester=(course.semester == '0') ? '上学期' : '下学期';

            courses.push(course);
            }
            

          });
          
          
            that.tableData = courses;
            that.result = res;
          
          
          
        });
    }
    
  },
  activate(){
            this.departmentId = this.$store.state.currentInfo.departmentId;
            this.schoolId = this.$store.state.currentInfo.schoolId;
            this.majorId = this.$store.state.major.majorId;
            this.majorName = this.$store.state.major.majorName;

            console.log('schoolId+departmentId+majorId',this.schoolId,this.departmentId,this.majorId);
        },
},
mounted:function(){
  this.activate();
  this.getBaseCourse(this.pageSize,this.pageNum);
  this.getBaseCourse(this.pageSize,this.pageNum,this.majorId);
  // this.getProgramCourse();
}

}
</script>

<style scoped> 
.drawerFooter{
  padding-bottom: 100px;
}
.pagination-container{
  bottom: 10px;
}
#rightTime{
  color: #3f51b5;
}

.drawerBlock{
  position: relative;
}
.iconSize{
  top: 7px;
  height: 20px;
  width: 20px;
  color: black;
  
}
.deleteButton{
  margin-right: 100px;
  margin-top: 0;
  margin-bottom: 0;
}
.drawerdeleteButton{
  margin-right: 10px;
  margin-top: 0;
  margin-bottom: 0;
}
.drawersubmenu{
  color: #3f51b5;
    font-size: 14px;
    font-weight: 500;
    height: 44px;
    min-height: 44px;
    line-height: 3em;
    margin-bottom: 13px;
    position: relative;
    padding: 6px 6px 5px 5px;
    border-bottom: 1px solid #d0d0d0;
    background-color: transparent;
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
.md-padding {
  margin-top: 85px;
}

.searchBar{
  display: inline-block;
  width: 100%;
  border: 1px solid rgb(189, 189, 189);
}
.headerSearch{
  border: 0;
  float: left;
  width: 50%;
}
.selectionBar{
  
  position: absolute;
  right: 10%;
  width: 700px;
  
}
.m-2{
  
  left: 10%;
  float: left;
  top: 6px;
  
}
.m-3{
  
  float: right;
  top: 6px;
  right: 10%;
}
.addCourseButton{
  background-color:rgb(33,150,243);
  min-height: 56px;
  min-width: 56px;
  float: right;
  top: -34px;
  right: 40px;
}
.el-table-container{
  
  width: 80%;
  margin-left: 10%;
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}
.addIcon{
  color: white;
  width: 24px;
  height: 24px;
  top: 3px;
}
.addCourseButton:hover{
  background-color:rgb(41,98,255);
  transition: all .3s cubic-bezier(.55,0,.55,.2);
}
</style>