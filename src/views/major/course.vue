<template>
  <div v-show="hasProgram">
    <div v-show="hasCourse" >
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
 


<div v-show="closeShow" class="submenu" >
      <el-button @click="this.toggleSelection()" style="float:left;" class="clearSelected" link>取消选择</el-button>
      <div class="numSelectedTeacher" >已选中 {{numSelected}} 节基础课程</div>
      <el-button @click="this.deleteBaseCourse()" style="float:right;" class="deleteButton" link><el-icon class="iconSize"><Delete /></el-icon></el-button>
</div>

<div layout="row" flex class="md-padding" >
    
    <addBtn @click="this.drawerShow()"></addBtn>
    <div class="el-table-container">
      <el-table :data="drawertableData"  ref="multipleTable" style="width: 100%"
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
      @selection-change="handleSelectionChange">
        <el-table-column  type="selection" width="55" />
        <el-table-column prop="courseName" label="课程名" width="180" />           
        <el-table-column prop="courseCode" label="课程号" width="180" />
        <el-table-column prop="courseType" label="课程类型" width="180" />
        <el-table-column prop="courseNature" label="课程性质" width="180" />
        <el-table-column prop="credit" label="学分" width="180" />
        <el-table-column prop="versionName" label="版本"  />
      </el-table>
   </div>
  </div>


   
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
    </div>
    <div v-show="!hasCourse" class="no-program">
    <HeaderSearch v-show="!closeShow">
  </HeaderSearch>

<div layout="row" flex class="md-padding" >
  <addBtn @click="this.drawerShow()"></addBtn>
</div>
      <h2 style="display: flex; justify-content: center; margin-top: 100px">
      没有课程
    </h2>
    <div style="display: flex; justify-content: center; color: grey">
        请先点击右上角圆形按钮添加课程
      </div>
    </div>
    <el-drawer v-model="drawer" :direction="direction" size="50%">
    <template #header class="drawerHeader">
      <el-col :span="24">
        <el-row>
        <el-col :span="12">
          <el-row class="row-style">
            <span >基础课程</span>
          </el-row>
         
          <el-row >
            <HeaderSearch class="searchIndrawer"  :msg="searchCourse" ></HeaderSearch>
          </el-row>
         
         
        </el-col>
        <el-col :span="12">
          <el-row class="row-style">
            <el-select
              v-model="currentVersion"
              @change="getCourseByYear(currentVersion)"
            >
            <el-option
              v-for="item in versions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          </el-row>
          
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div  class="drawersubmenu">
            <div class="numSelectedTeacher" >已选中 {{drawernumSelected-programInfoCourseCount}} 节基础课程</div>
            <div class="drawerdeleteButton">
              <el-button @click="this.getBCMId();"  ><el-icon ><Plus class="iconSize" /></el-icon></el-button>
            </div>
          </div>
        </el-col>
        
      </el-row>

      </el-col>
      
     
      
    </template>

   <!-- 具体basecourse页面，分页 可搜索-->
      
  
      
      <div class="drawerBlock" flex>
        
        <div >
          <el-table 
          :data="tableData"  
          ref="drawermultipleTable" 
          style="width: 100%;" 
          @selection-change="drawerchandleSelectionChange" 
         
          >
            <el-table-column width="55" type="selection" :selectable="selectable">
            </el-table-column>
            <el-table-column prop="courseName" label="课程名" width="180" />
            <el-table-column prop="courseCode" label="课程号" width="180" />
            <el-table-column prop="respondentName" label="课程负责人" width="120" />
            <el-table-column  label="课程大纲" width="180" >
              <template #default="scope">
                <el-tooltip content="查看课程大纲">
                  <el-button v-show="scope.row.versionId" @click="goBaseCourseDetail(scope.$index, scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Document /></el-icon></el-button>
                </el-tooltip>
                <el-tooltip content="添加课程大纲">
                  <el-button v-show="!scope.row.versionId"  type="danger" @click="addBaseCourseDetail(scope.row)">无课程大纲</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

     
      
    
    
      <div style="flex: auto" class="drawerFooter">
       
        
        <div class="pagination-container" flex>
        <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="pagination"
            :page-sizes="[10, 12]"
            :page-size="10"
            layout="total,sizes,prev, pager, next, jumper"
            :total="result.total">
        </el-pagination> -->
        <el-row type="flex" justify="center" align="middle">
          <el-button v-show="showLoadmore" @click="loadmoreCourse()">加载更多</el-button>
        </el-row>
        
      </div>
      </div>
    
  </el-drawer>
  </div>
  <div v-show="!hasProgram" class="no-program">
    <h2 style="display: flex; justify-content: center; margin-top: 100px">
      未创建培养方案
    </h2>
    <div style="display: flex; justify-content: center; color: grey">
        请先创建培养方案
      </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ref,reactive,}from 'vue';
import { ElIcon,ElButton, ElTable,ElMessage, ElMessageBox,ElDialog,ElSelect,ElOption,ElTag,ElCheckbox } from 'element-plus'
import { Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete, Edit,Document} from '@element-plus/icons-vue'
import request from '@/utils/request/request'



export default {
name:"Courses",
components:{
  HeaderSearch,ElIcon,ElButton, ElTable,ElMessage, ElMessageBox,ElDialog,ElSelect,ElOption
  , Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete, Edit, addBtn,
  ElTag,ElCheckbox,Document
},
data(){
  return{
    //show loadmore
    showLoadmore:true,

    
    //是否有program
    hasProgram:Boolean,
    //课程是否为空
    hasCourse:Boolean,
    //checkbox
    checkList:ref([' ']),

    //programeInfo
    programeInfo:[
      {
    "bcdmId": 0,
    "courseId": 0,
    "detailId": 0,
    "groupId": 0,
    "programId": 0
      }
    ],
    programInfoCourseId:[0,0],
    programInfoCourseCount:0,


    //需要删除的信息
    deleteProgrameInfo:[
      {
    "bcdmId": 0,
    "courseId": 0,
    "detailId": 0,
    "groupId": 0,
    "programId": 0
      }
    ],
    //programe中已经添加的课程
    programeCourseInfo:[
      {
        'courseId':0,
        'versionId':0
      }
    ],
    //drawer
    drawer:false,
    direction:'ltr',
    drawercloseShow:ref(false),
    drawermultipleSelection: [],
    drawernumSelected:0,
    drawerclickState:0,
    drawercourseId:[],//clear after add,
    drawerCourseIndex:[],//clear after add,
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
    programId:'',

    
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
  searchCourseId:[0,0],


  currentVersion:'2016版',
  currentVersionValue:1,
  versions:[{
      label:'2016版',
      value:1
    },
    {
      label:'2017版',
      value:2
    },
    {
      value:3,
      label:'2018版'
    },
    {
      value:4,
      label:'2019版'
    },
    {
      value:5,
      label:'2020版'
    },
    {
      value:6,
      label:'2021版'
    },
    {
      value:7,
      label:'2022版'
    },
    {
      value:8,
      label:'2023版'
    },
    {
      value:9,
      label:'2024版'
    },
    {
      value:10,
      label:'2025版'
    },
    {
      value:11,
      label:'2026版'
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
  //直接添加课程大纲
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
          ElMessage({
                  type: 'success',
                  message: `新增成功`,
                  duration:1000,
                });
              //成功后根据vesionId和basecouseId获取详细信息
              that.getBaseCourse(that.pageSize,that.pageNum);
            }
            else{
              ElMessage({
                    type: 'error',
                    message: `新增失败`,
                    duration:1000,
                  });
              //失败后退回basecouse页面
              that.getBaseCourse(that.pageSize,that.pageNum);
            }
      })
      })
    },
  //load course
  loadmoreCourse(){
    if(this.result.total-this.pageSize>=10){
      this.pageSize +=10;
      this.getBaseCourse(this.pageSize,this.pageNum);
    }
    else{
      this.pageSize +=(this.result.total-this.pageSize);
      this.getBaseCourse(this.pageSize,this.pageNum);
    }
    

  },
  //跳转到详细页面
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
    })
  },
  //是否有program
  async checkProgram(){
    if(this.$store.state.major.programId){
      this.hasProgram = true;
    }
    else{
      this.hasProgram = false;
    }
  },
  
  //drawer show
  drawerShow(){
    let that = this;
    console.log('drawerShow:');
    this.drawer = true;
    this.getBaseCourse(this.pageSize,this.pageNum)
  },
  //是否可选
  selectable(row,index){
    if(row.remark){
      
      return !row.remark;
    }
    if(!row.versionId){
      
      return row.versionId;
    }
    else return true;
  },
  //根据version和courseId来确定detailId
  getDetail(courseId){
    let that = this;
    let coursedetaiId = '';
    return request({
      url:'/detail/list'+'?vesionId='+this.currentVersionValue+'&courseId='+courseId,
      method:'get'
    }).then(
      function(res){
      console.log('getDetail:',res);
      res.rows.forEach(function(detail){
        if(detail.versionId == that.currentVersionValue){
          console.log('detailId',detail.detailId);
          coursedetaiId = detail.detailId;
        }
      });
      return coursedetaiId;
    }
    )
  },
  // addBaseCourseDetail(row){
  //   let that = this;
  //   console.log('route push '+'versionValue:',that.currentVersionValue,'courseId:',row.courseId)
  //   ElMessageBox.confirm(
  //   '尚未添加版本信息是否添加？',
  //   '注意',
  //   {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning',
  //   }
  // ).then(() => {
  //   this.$router.push({
  //     path:'/baseCourse',
  //     query:{
  //       versionId:that.currentVersionValue,
  //       courseId:row.courseId,
  //     }
  // })
  //   })
  // },
  getCourseByYear(label){
    this.currentVersionValue = label;
    this.getBaseCourse(this.pageSize,this.pageNum);
  },
  async getProgramCourse(){
    let that = this;
    that.drawertableData = [];
    that.origintableData = [];
    let courses = [];
    let eachCourse = [];
    let CourseId = [];
    console.log('programId:',this.programId);
    return request({
      url:'/baseCourse/program/'+this.programId,
      method:'get',
    }).then(function(res){
      console.log('courseInPrograme:',res);
      console.log('department:',that.departmentId,'schoolId:',that.schoolId,'majorId:',that.majorId);
      that.programInfoCourseCount = res.total;
          if(res.total){
            res.rows.forEach(function(course){
            that.hasCourse = true;
            let eachCourseId = '';
            

            eachCourseId = course.courseId;
            
            course.courseName=course.courseName;
            course.courseCode=course.courseCode;
            course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
            course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
            
            course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
            course.semester=(course.semester == '0') ? '上学期' : '下学期';
            course.versionId = course.bcDetails[0].versionId;
            course.versionName = course.bcDetails[0].versionName;
            courses.push(course);
            let courseDict = {
              'courseId':eachCourseId,
              // 'versionId':eachVersionId,
            };
            
            eachCourse.push(courseDict);
            CourseId.push(eachCourseId);
          });
          }
          else{
            that.hasCourse = false;
          }

          that.drawertableData = courses;
          that.origintableData = courses;
          that.programeCourseInfo = eachCourse;
          that.programInfoCourseId = CourseId;
          console.log('programeCourseInfo is ',that.programeCourseInfo);
          // that.origintableData = courses;
          that.drawerresult = res;
    })
  },
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
    let originData = this.origintableData;
    let courseList = [];
    if(val=='全部'){
      this.drawertableData = originData;
    }
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
  //搜索一门课
  searchCourse(msg){
    let that = this;
    let courses = [];
    let count=0;
    let countofSelected =0;//查找得到的课中，和已经添加过的课的交集数
    let flag = Boolean;
    let searchCourseId = [];
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
        flag = true;
            ElMessage({
                type: 'success',
                message: `搜索成功`,
                duration:1000,
              });
            res.rows.forEach(function(course){
            course.courseName=course.courseName;
            course.courseCode=course.courseCode;
            course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
            course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
            course.remark = '';
            course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
            course.semester=(course.semester == '0') ? '上学期' : '下学期';
            course.trueversionId = course.versionId;
            if(course.bcDetails.length){
               
                for(let i=0;i<course.bcDetails.length;i++){
                  if(course.bcDetails[i].versionId == that.currentVersionValue){
                    course.versionId = true;
                    break;
                  }
                  else{
                    course.versionId = false;
                  }
                }
                
              };
              if(course.respondentInfos){
                
                // let teacherName =[];
                course.respondentInfos.forEach(function(respondent){
                  course.respondentName = respondent.respondentName;
                  // teacherName.push(respondent.respondentName);
                });
                // course.respondentName = teacherName;
              
            }
            // course.versionId = (course.versionId == that.currentVersionVale) ? true : false;
            course.index = count;
            courses.push(course);
            searchCourseId.push(course.courseId);
            count++;
          });
          that.searchCourseId = searchCourseId;
          that.programeCourseInfo.forEach(function(courseInfo){
              try{
                 
              courses.forEach(function(course){
                console.log('courseId:',courseInfo.courseId,course.courseId,' versionId: ',courseInfo.versionId,course.trueversionId)
                if(!course.remark){
                  
                if(courseInfo.courseId == course.courseId ){
                    
                      course.remark = true;
                      throw new Error("remark")
                    
                  }
                  else{
                    course.remark = false;
                  }
                }
                
              });
          }catch(e){
            if(e.message!='remark') throw e;
          }
          });

          that.searchCourseId.forEach(function(courseId){
            if(that.programInfoCourseId.includes(courseId)){
              countofSelected++;
            }
          });

          that.tableData = courses;
          that.programInfoCourseCount = countofSelected;
          that.result = res;


          }
          else{
            flag = false;
            ElMessage({
                  type: 'error',
                  message: `搜索失败`,
                  duration:1000,
                });
           
          }
    }).then(function(){
      if(flag){
        that.tableData.forEach(function(data){
      if(data.remark){
        console.log('data.remark:',data.remark);
        that.$refs.drawermultipleTable.toggleRowSelection(that.tableData[data.index],true);
      }
      else{
        console.log('data.remark is null',data.remark);
      }
    })
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
  // handleCurrentChange(val) {
  //   this.pageNum = val
  //   console.log(`当前页: ${val}`);
  //   this.getBaseCourse(this.pageSize,this.pageNum);
   
  // },
  // handleSizeChange(val) {
  //   this.pageSize = val;
  //   console.log(`每页 ${val} 条`);
  //   this.getBaseCourse(this.pageSize,this.pageNum);
  // },
  addBaseCourse(){
    this.dialogFormVisible = false;
    console.log(this.form);
    
    let that = this;
    let postData = this.formTopostData(this.form);
    console.log('postData:',postData);
    
    return request({
            url:'/baseCourse/add',
            method:'post',
            data:postData
        }).then(function(res){
          
          if(res.code == '200'){
            ElMessage({
                type: 'success',
                message: `添加成功`,
                duration:1000,
              });
            that.clearForm();
            that.getBaseCourse(that.pageSize,that.pageNum);
          }
          else{
            ElMessage({
                  type: 'error',
                  message: `添加失败`,
                  duration:1000,
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
    course.courseName=(course.courseName) ? '' : course.courseName.trim();
    course.courseCode=(course.courseCode) ? '' : course.courseCode.trim();
    course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
    course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
    course.credit=course.credit;
    course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
    course.remark=(course.remark) ? '' : course.remark.trim();

    return course;

  },
  // goAddBaseCourses(){
  //   this.$router.push({ path:'/courses'}) 
  // },
  deleteBaseCourse(){
    let that = this;
ElMessageBox.confirm(
    '是否删除选中的培养计划课程？',
    '注意',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    return request({
      url:'/baseCourse/program/remove',
      method:'delete',
      data: that.deleteProgrameInfo,
    }).then(function(res){
      if(res.code == '200'){
        ElMessage({
                type: 'success',
                message: `删除成功`,
                duration:1000,
              });
            // that.clearForm();
            that.getProgramCourse();
          }
          else{
            ElMessage({
                  type: 'error',
                  message: `删除失败`,
                  duration:1000,
                });
            // that.clearForm();
            // that.getProgramCourse();
          }
    })
    }) 
  },
  
  //总步骤
  getProgrameInfo(){
    let that = this;
    this.getBaseCourseDictforProgram();
   
  },
  //组建向programe里添加课程信息的字典
  getBaseCourseDictforProgram(){
    var postData = [];
    let that = this;
    this.drawercourseId.forEach(function(courseId){
    let courseBCDMId = '';
    let courseDetailId = '';
    if(!that.programInfoCourseId.includes(courseId)){
      that.getDetail(courseId).then(function(res){
      
      if(res){
        courseDetailId = res;
      }
      else{
       
        return console.log('detailId is null');
      }
    }).then(function(){
      
    var programCoursedict = {
     'bcmdId':courseBCDMId,
     'detailId':courseDetailId,
     'programId':that.programId,
     'courseId':courseId
   }
   postData.push(programCoursedict);
    }).then(function(){ 
  that.programeInfo = postData;
  console.log('getBaseCourseDictforProgram:',that.programeInfo);
    })
    }
    
    }); 
  },
  getBCMId(){
    let that = this;
    this.programeInfo.forEach(function(courseInfo){
      let courseBCDMId = '';
      console.log('getBCMId:',courseInfo.detailId);
      that.getBaseCourse(that.pageSize,that.pageNum,that.majorId,courseInfo.detailId).then(function(res){
        
            console.log('BCMId: ',res);
            if(res){
              console.log('bcdmId is :',res);
              courseBCDMId = res;
              courseInfo.bcmdId = courseBCDMId;
            }
            else{
              console.log('bcdmId is null');
            }
          });
    });

    ElMessageBox.confirm(
    '是否添加选中的培养计划课程？',
    '注意',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(function(){
    that.addBaseCourseInProgram();
  })

  },
  //向programe添加课程
  addBaseCourseInProgram(){
    let that = this; 
    return request({
      url:'/baseCourse/program/add',
      method:'post',
      data:this.programeInfo,
    }).then(function(res){
      if(res.code == '200'){
        ElMessage({
                type: 'success',
                message: `添加成功`,
                duration:1000,
              });
            that.drawercourseId=[];
            that.drawerCourseIndex = [];
            that.getProgramCourse();
            that.getBaseCourse(that.pageSize,that.pageNum);
            // that.$refs.drawermultipleTable.clearSelection();

            if(that.drawerclickState == 1){
              that.drawerclickState=0;
              that.drawercloseShow = !that.drawercloseShow;
            };
            
          }
          else{
            ElMessage({
                  type: 'error',
                  message: `添加失败`,
                  duration:1000,
                });
            that.drawercourseId=[];
            that.drawerCourseIndex = [];
            that.$refs.drawermultipleTable.clearSelection();
            if(that.drawerclickState == 1){
              that.drawerclickState=0;
              that.drawercloseShow = !that.drawercloseShow;
            };
          }
    });
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
        ElMessage({
                type: 'success',
                message: `修改成功`,
                duration:1000,
              });
            
            that.getBaseCourse(that.pageSize,that.pageNum);
          }
          else{
            ElMessage({
                  type: 'error',
                  message: `修改失败`,
                  duration:1000,
                });
            that.getBaseCourse(that.pageSize,that.pageNum);
          }
    })

  },
  handleSelectionChange(val) {
        let that = this;
        var courseId = [];
        var deleteCourseInfo = [];
        this.multipleSelection = val;
        console.log('选中的信息：',val);
        val.forEach(function(course){
          let res = course.courseId;
          let courseDetailId =course.bcDetails[0].detailId;
          var eachCourseInfo = {
            'courseId':res,
            'programId':that.programId,
            'detailId':courseDetailId
          };
          deleteCourseInfo.push(eachCourseInfo);
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
        this.deleteProgrameInfo = deleteCourseInfo;
        console.log('courseId:',this.courseId);
        console.log('deleteProgrameInfo:',this.deleteProgrameInfo );
        
      },
      drawerchandleSelectionChange(val) {
        var courseId = [];
        var courseIndex = [];
        this.drawermultipleSelection = val;
        console.log('选中的信息：',val);
        val.forEach(function(course){
          let res = course.courseId;
          let index = course.index;
          courseId.push(res);
          courseIndex.push(index);
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
        this.drawerCourseIndex = courseIndex;
        console.log('courseId:',this.drawercourseId,'courseIndex:',this.drawerCourseIndex);
        this.getBaseCourseDictforProgram();
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
          
        } else {
          this.$refs.drawermultipleTable.clearSelection();
          if(this.drawerclickState == 1){
            this.drawerclickState=0;
            this.drawercloseShow = !this.drawercloseShow;
          }
          
        }
    },
   async getBaseCourse(pageSize,pageNum,majorId,detailId){
    let that = this;
    let courses = [];
    let realurl ='';
    let courseBCDMId = '';
    let count=0;
    
    if(majorId){
      realurl = '/detailProgram/list';//通过majorId来显示已经添加的detail，可以获取到courseId
      return request({
            url:realurl+'?'+'majorId='+this.majorId,
            method:'get',
        }).then(function(res){
          
          if(res.rows){
            res.rows.forEach(function(course){
              
              if(course.detailId == detailId){
                
                courseBCDMId = course.bcdmId;
              }
          });
          };

          return courseBCDMId;
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
          console.log('department:',that.departmentId,'schoolId:',that.schoolId,'majorId:',that.majorId,'currentVersionValue',that.currentVersionValue);
          console.log('已经选择的课：',that.programeCourseInfo);
          res.rows.forEach(function(course){
            
            course.courseName=course.courseName;
            course.courseCode=course.courseCode;
            course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
            course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
            course.remark = '';//用remark来判断是否选课
            course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
            course.semester=(course.semester == '0') ? '上学期' : '下学期';
            course.trueversionId = course.versionId;
            if(course.bcDetails.length){
                
                for(let i=0;i<course.bcDetails.length;i++){
                  if(course.bcDetails[i].versionId == that.currentVersionValue){
                    course.versionId = true;
                    break;
                  }
                  else{
                    course.versionId = false;
                  }
                }
                
              };
              if(course.respondentInfos){
                
                // let teacherName =[];
                course.respondentInfos.forEach(function(respondent){
                  course.respondentName = respondent.respondentName;
                  // teacherName.push(respondent.respondentName);
                });
                // course.respondentName = teacherName;
              
            }
            // course.versionId = (course.versionId == that.currentVersionVale) ? true : false;
            course.index = count;
            courses.push(course);
            count++;
          });
          
          
            that.programeCourseInfo.forEach(function(courseInfo){
              try{
                 
              courses.forEach(function(course){
                // console.log('courseId:',courseInfo.courseId,course.courseId,' versionId: ',courseInfo.versionId,course.trueversionId)
                if(!course.remark){
                  
                if(courseInfo.courseId == course.courseId ){
                    
                      course.remark = true;
                      throw new Error("remark")
                    
                  }
                  else{
                    course.remark = false;
                  }
                }
                
              });
          }catch(e){
            if(e.message!='remark') throw e;
          }
          })
          
          
            that.tableData = courses;
            that.result = res;
            if(pageSize>=res.total){
              that.showLoadmore = false;
            }
          
          
        }).then(function(){
      that.tableData.forEach(function(data){
      if(data.remark){
       
        that.$refs.drawermultipleTable.toggleRowSelection(that.tableData[data.index],true);
      }
      else{
        
      }
    })
    });
    }
    
  },
  activate(){
            this.departmentId = this.$store.state.currentInfo.departmentId;
            this.schoolId = this.$store.state.currentInfo.schoolId;
            this.majorId = this.$store.state.major.majorId;
            this.majorName = this.$store.state.major.majorName;
            this.programId = this.$store.state.major.programId;
            console.log('schoolId+departmentId+majorId',this.schoolId,this.departmentId,this.majorId);
        },
},
mounted:function(){
  this.checkProgram();
  if(this.hasProgram){
    this.activate();
    this.getProgramCourse();
  }
  
  // this.getBaseCourse(this.pageSize,this.pageNum);
   
  // this.getBaseCourse(this.pageSize,this.pageNum,this.majorId);
  
}

}
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
:deep().el-icon svg {
  height: 18px;
  width: 18px;
}
:deep().el-icon {
  height: 18px;
  width: 18px;
}

.row-style{
  padding-top:5px
}
.el-checkbox__input.is-disabled{
    background-color: #0e5cd0;
}
.el-table.tableColumn{
  --el-table-tr-bg-color:rgb(189, 189, 189);
}
.el-table__body{
  background-color: rgb(189, 189, 189);
}


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
  color: rgb(189, 189, 189);
}
.iconSize{
  top: 7px;
  height: 20px;
  width: 20px;
  color: black;
  
}
.deleteButton{
  margin-right: 10%;
  margin-top: 0;
  margin-bottom: 0;
}
.searchIndrawer{
position:relative;
top:0px;
border-bottom:none;
left:-46px;
}
.drawerdeleteButton{
  float:right;
  margin-left: 30px;
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
    /* border-bottom: 1px solid #d0d0d0; */
    background-color: transparent;
}
.numSelectedTeacher{
  min-height:36px; 
  color: #3f51b5;
  
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
    height: 55px;
    position: absolute;
    top: 110px;
    left: 0px;
    width: 100%;
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
.no-program {
  display: flex;
  flex-direction: column;
}
</style>