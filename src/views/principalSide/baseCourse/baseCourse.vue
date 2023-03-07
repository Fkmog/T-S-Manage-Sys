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

  <div v-show="closeShow" class="submenu" >
    <el-row>
      <el-col :span="6" class="columnstyle">
        <el-button @click="this.toggleSelection()"  class="clearSelected" link>取消选择</el-button>
      </el-col>
      <el-col :span="6" class="columnstyle">
        <div class="numSelectedTeacher" >已选中 {{numSelected}} 节基础课程</div>
      </el-col>
      <el-col :span="6" class="columnstyle">
        <el-button @click="this.setDetail()"  class="submenudeleteButton" link ><el-icon ><Plus /></el-icon></el-button>
        
      </el-col>
    </el-row>
  </div>

  <div layout="row" flex class="md-padding" >
      
      <!-- <addBtn @click="dialogFormVisible = true"></addBtn> -->
      
      <div class="el-table-container" layout="column" flex layout-align="start center" >
        
        <el-table 
        :data="tableData"  
        ref="multipleTable" 
        style="width: 100%" 
        @selection-change="handleSelectionChange" 
        @row-dblclick="editTrigger"
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
        >
          <el-table-column width="80" type="selection" >
            </el-table-column>
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
          
         
         
          <el-table-column  label="操作" >
            <template #default="scope">
              <!-- <el-tooltip content="删除">
                <el-button @click="deleteBaseCourse(scope.$index, scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Delete /></el-icon></el-button>
              </el-tooltip> -->
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

    <el-dialog v-model="dialogFormVisible1" title="修改基础课程">
      <el-form :model="preform" :rules="rules" ref="ruleForm">
        <el-form-item label="课程名称" :label-width="formLabelWidth" prop="courseName">
          <span >{{ preform.courseName }}</span>
          <!-- <el-input v-model="preform.courseName" autocomplete="off" /> -->
        </el-form-item>
        <el-form-item label="课程代码" :label-width="formLabelWidth" prop="courseCode">
          <span >{{ preform.courseCode }}</span>
          <!-- <el-input v-model="preform.courseCode" autocomplete="off" /> -->
        </el-form-item>
        <el-form-item label="学分" :label-width="formLabelWidth" prop="credit">
          <el-input v-model="preform.credit" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程性质" :label-width="formLabelWidth" prop="courseNature">
          <el-select v-model="preform.courseNature" placeholder="请选择课程性质">
            <el-option label="专业任选" value="0" />
            <el-option label="还未确定" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型" :label-width="formLabelWidth" prop="courseType">
          <el-select v-model="preform.courseType" placeholder="请选择课程类型">
            <el-option label="学科基础课" value="0" />
            <el-option label="还未确定" value="1" />
          </el-select>
        </el-form-item>
        
        <!-- <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="preform.remark" autocomplete="off" />
        </el-form-item> -->
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

    


</template>

<script>
import request from '@/utils/request/request'
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ref,reactive, version,}from 'vue';
import { ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,ElDialog,ElDropdown,ElTag } from 'element-plus'
import { Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete, Edit, MoreFilled, ArrowDown,Document} from '@element-plus/icons-vue'



export default {
  name: "PrincipalBaseCourse",
  data() {
    return {
      //remoteDetail
      remoteDetail:[],
      //DetailForm
      detailForm:[],
      //loading
      loading:false,
      //showSetDetailPage
      showSetDetailPage:false,
      //selectedDetail
      selectedDetail:'',
      //form rules
      rules: {
        courseName: [
            { required: true, message: '请输入课程名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          courseCode: [
            { required: true, message: '请输入课程代码', trigger: 'blur' },
            // { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
          ],
          credit: [
            { required: true, message: '请输入课程学分', trigger: 'blur' },
            // { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
          ],
          courseNature:[
            { required: true, message: '请选择课程性质', trigger: 'change' }
          ],
          courseType:[
            { required: true, message: '请选择课程类型', trigger: 'change' }
          ],

      },
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
      {
        value:9,
        label:'2024级'
      },
      {
        value:10,
        label:'2025级'
      },
      {
        value:11,
        label:'2026级'
      },
      ],
      versionLabel:[
      '2016级','2017级','2018级',
      '2019级','2020级','2021级','2022级','2023级',
      '2024级','2025级','2026级'
      ],
      // basecourseTable: [],
      rules: {
        courseName: [
            { required: true, message: '请输入课程名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          courseCode: [
            { required: true, message: '请输入课程代码', trigger: 'blur' },
            { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
          ],
          credit: [
            { required: true, message: '请输入课程学分', trigger: 'blur' },
            // { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
          ],
          courseNature:[
            { required: true, message: '请选择课程性质', trigger: 'change' }
          ],
          courseType:[
            { required: true, message: '请选择课程类型', trigger: 'change' }
          ],

      },



      //from Route
      routeVersionId:'',
      routeCourseId:'',

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
    userId:'',
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


    };
  },
  methods: {
    //获取detail信息
    getDetailInfo(){
      let that = this;
      return request({
        url:'',
        method:'get',
        params:{
          schoolId:this.schoolId,
          departmentId:this.departmentId
        }
      })
    },
    //remoteMethod
    remoteMethod(){
      if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.detailForm = this.remoteDetail.filter(item => {
              return item.respondentName
                .indexOf(query) > -1;
            });
          }, 200);
        } else {
          this.detailForm = [];
        }
    },
    //setDetail
    setDetail(){

    },
    //清除输入课程信息
     resetForm(formName) {
        this.$refs[formName].resetFields();
      },
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
    getBaseCourse(pageSize,pageNum){
      console.log('pageSize:',pageSize,' pageNum:',pageNum,'versionId',this.currentVersionValue);
      let that = this;
      let courses = []
      return request({
              url:'/baseCourse/respondent',
              method:'get',
              params:{
              'pageSize':pageSize,
              'pageNum':pageNum,
              'userId':that.userId,
              'departmentId':that.departmentId,
              'schoolId':that.schoolId}
          }).then(function(res){
            console.log('courseDetails:',res);
            console.log('department:',that.departmentId,'schoolId:',that.schoolId,'currentVersionValue',that.currentVersionValue);
            res.data.forEach(function(course){
              
              course.courseName= course.courseName;
              course.courseCode= course.courseCode;
              course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
              course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
              course.credit=course.credit;
              // course.remark = (_.isEmpty(course.remark)) ? '' : course.remark.trim();
              // course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
              course.semester=(course.semester == '0') ? '上学期' : '下学期';
              if(course.bcDetails.length){
                console.log('courseName: ',course.courseName)
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
              // course.versionId = (course.versionId== that.currentVersionValue) ? true : false;
  
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
          ElMessage({
                  type: 'success',
                  message: `删除成功`,
                  duration:1000,
                });
              
              that.getBaseCourse(that.pageSize,that.pageNum);
            }
            else{
              ElMessage({
                    type: 'error',
                    message: `删除失败`,
                    duration:1000,
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
      path:'/principalBaseCourseDetail',
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
    goAddBaseCourses() {
      this.$router.push({ path: "/batchCourseAdd" });
    },
    formTopostData(form) {
      let postData = {};
      postData.departmentId = this.departmentId;
      postData.schoolId = this.schoolId;
      postData.courseName = form.courseName;
      postData.courseCode = form.courseCode;
      postData.courseType = form.courseType;
      postData.courseNature = form.courseNature;
      postData.credit = form.credit;
      postData.courseYear = form.courseYear;
      postData.remark = form.remark;

      return postData;
    },
    postDataToform(val) {
      this.preform.courseId = val.courseId;
      this.preform.courseName = val.courseName;
      this.preform.courseCode = val.courseCode;
      this.preform.courseType = val.courseType == "学科基础课" ? "0" : "1";
      this.preform.courseNature = val.courseNature == "专业任选" ? "0" : "1";
      this.preform.credit = val.credit;
      this.preform.courseYear = val.courseYear == "2022" ? "0" : "1";
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
    activate(){
              this.departmentId = this.$store.state.currentInfo.departmentId;
              this.schoolId = this.$store.state.currentInfo.schoolId;
              this.userId = this.$store.state.userInfo.userId;
          },
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
};
</script>

<style scoped>
.submenudeleteButton{
    float:right;
    margin-top:16px;
  }
.columnstyle{
    height:50px;
    
  }
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
    
     
      
      min-height: 36px;
      min-width: 88px;
      line-height: 55px;
     
      align-items: center;
      text-align: center;
      border-radius: 2px;
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
    height: 55px;
    position: absolute;
    top: 110px;
    left: 0px;
    width: 100%;
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
    
      position: relative;
      cursor: pointer;
      min-height: 36px;
      min-width: 88px;
      line-height: 55px;
    
      border-radius: 2px;
     
      border: 0;
      padding: 0 6px;
      margin: 0;
      background: transparent;
      
     
    
      
      transition: box-shadow .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1);
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  </style>