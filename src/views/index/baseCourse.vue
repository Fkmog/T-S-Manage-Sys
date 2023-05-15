<template>
  <div  v-show="!closeShow">
    <HeaderSearch msg="搜索课程名称" @SearchValue='getSearchValue'>
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
      <el-col :span="14" class="columnstyle">
        <div class="numSelectedTeacher" >已选中 {{numSelected}} 门课程</div>
      </el-col>
   
      
      <el-col :span="8" v-show="identity == '学院管理员'" class="columnstyle">
       
        <el-dropdown class="dropdownstyle">
   
          <el-icon class="dropdownIcon" ><MoreFilled /></el-icon>
    
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="this.addPrincipal()">
              <el-icon><User /></el-icon>
              &nbsp添加课程负责人
            </el-dropdown-item>
            <el-dropdown-item @click="this.deleteRespondent()" >
              <el-icon><CircleClose /></el-icon>
              &nbsp删除课程负责人
            </el-dropdown-item>
            <el-dropdown-item @click="this.multideleteBaseCourse(this.courseId)" >
              <el-icon><Delete /></el-icon>
              &nbsp删除课程
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
        </el-dropdown>
      </el-col>
      
      <el-col :span="6" v-show="identity == '课程负责人'">
       
       <el-dropdown class="columnstyle">
  
         <el-icon><MoreFilled /></el-icon>
   
       <template #dropdown>
         <el-dropdown-menu>
           <el-dropdown-item >
             添加课程负责人
             <el-button   link >
               <el-icon @click="this.setDetail()">
                 <Plus />
               </el-icon>
             </el-button>
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
   
  
    <div layout="row" flex class="md-padding" v-show="identity == '学院管理员'" >
      <addBtn @click="dialogFormVisible = true"></addBtn>
      
          
            <el-table 
            :data="tableData"  
            v-loading="isloading"
            v-show="hasBaseCourse"
            ref="multipleTable1" 
            @selection-change="handleSelectionChange"
            @row-dblclick="editTrigger"
            class="el-table-container" 
            style="width: 1375px" 
            
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
            <el-table-column width="55" type="selection" :reserve-selection="true">
                </el-table-column>
              <el-table-column  label="课程名" width="250" label-class-name="textbold" >
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <span >{{ scope.row.courseName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column  label="课程号" width="180" >
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <span >{{ scope.row.courseCode }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column  label="课程类型" width="180" >
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <span >{{ scope.row.courseType }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column  label="课程性质" width="180" >
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <span >{{ scope.row.courseNature }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column  label="学分" width="80" >
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <span >{{ scope.row.credit }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column  label="负责人" width="150" >
                <template #default="scope">
                
                
                  <div style="display: flex; align-items: center" >
                    <span >{{ scope.row.respondentName }}&nbsp;&nbsp;</span>
                  </div>
                </template>
              </el-table-column>
            
            
              <el-table-column  label="操作" width="300">
                <template #default="scope" >
                  <el-row v-show="showToolIcon">
                    <el-col :span="4">
                      <el-tooltip  content="删除课程" >
                        <el-button  @click="deleteBaseCourse(scope.$index, scope.row.courseId)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Delete /></el-icon></el-button>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="4">
                      <el-tooltip content="修改课程">
                        <el-button @click="editTrigger(scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Edit /></el-icon></el-button>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="4" v-show="scope.row.versionId">
                      <el-tooltip content="查看信息">
                        <el-button  @click="goBaseCourseDetail(scope.$index, scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Document /></el-icon></el-button>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="8" v-show="!scope.row.versionId">
                      <el-tooltip content="添加课程大纲">
                        <el-tag  class="noBaseCourseDetail" type="danger" @click="addBaseCourseDetail(scope.row)">无课程大纲</el-tag>
                      </el-tooltip>
                    </el-col>
                </el-row>
                    

                  
                
      
                  

                  

                </template>
              </el-table-column>
              
            </el-table>
        
      
    </div>
    <div class="md-padding" layout="row" flex  v-show="identity == '课程负责人'">
      
        <el-table 
        :data="tableData"  
        ref="multipleTable2" 
        
        class="el-table-container"
        @selection-change="handleSelectionChange" 
        @row-dblclick="editTrigger"
        style="width: 1400px" 
        
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
         
          <el-table-column width="80" type="selection" :reserve-selection="true" >
            </el-table-column>
          <el-table-column  label="课程名" width="250" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span >{{ scope.row.courseName }}</span>
                
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="课程号" width="180" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span >{{ scope.row.courseCode }}</span>
                
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="课程类型" width="180" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span >{{ scope.row.courseType }}</span>
               
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="课程性质" width="180" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span >{{ scope.row.courseNature }}</span>
               
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="学分" width="80" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span >{{ scope.row.credit }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="负责人" width="150" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span v-for="(item,index) in scope.row.respondentName" :key="index">{{ item }}&nbsp;&nbsp;</span>
                <span >{{ scope.row.credit }}</span>
              </div>
            </template>
          </el-table-column>
         
         
         
         
          <el-table-column  label="操作" width="300">
            <template #default="scope" >
              <!-- <el-tooltip content="删除">
                <el-button @click="deleteBaseCourse(scope.$index, scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Delete /></el-icon></el-button>
              </el-tooltip> -->
              <el-tooltip content="修改" >
                <el-button @click="editTrigger(scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Edit /></el-icon></el-button>
              </el-tooltip>
              <!-- <el-tooltip content="修改课程负责人">
                <el-button v-show="scope.row.respondentInfos.length" @click="showEditRespondent(scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Avatar /></el-icon></el-button>
              </el-tooltip> -->
  
              <el-tooltip content="查看信息" >
                <el-button v-show="scope.row.versionId" @click="goBaseCourseDetail(scope.$index, scope.row)"  class="deleteButton" link style="color:#3f51b5;"><el-icon><Document /></el-icon></el-button>
              </el-tooltip>


              <el-tooltip content="添加课程大纲" >
              <el-tag v-show="!scope.row.versionId"  type="danger" @click="addBaseCourseDetail(scope.row)">无课程大纲</el-tag>
            </el-tooltip>


            </template>
          </el-table-column>
          
        </el-table>
      
        
     </div>
  
   <div v-show="!hasBaseCourse" class="no-class">
    没有课程
   </div>
  
    <el-dialog v-model="dialogFormVisible" title="添加基础课程" >
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="课程名称" :label-width="formLabelWidth" prop="courseName">
          <el-input v-model="form.courseName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程代码" :label-width="formLabelWidth" prop="courseCode" :error="C_ErrorMsg">
          <el-input v-model="form.courseCode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学分" :label-width="formLabelWidth" prop="credit">
          <el-input v-model="form.credit" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程性质" :label-width="formLabelWidth" prop="courseNature">
          <el-select v-model="form.courseNature" placeholder="请选择课程性质">
            <el-option v-for="(nature,index) in courseNatureSource" :key="nature" :label="nature" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型" :label-width="formLabelWidth" prop="courseType">
          <el-select v-model="form.courseType" placeholder="请选择课程类型">
            <el-option v-for="(type,index) in courseTypeSource" :key="type" :label="type" :value="index"></el-option>
          </el-select>
        </el-form-item>
        
        <!-- <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="form.remark" autocomplete="off" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer" >
          <el-button @click="goAddBaseCourses">批量添加</el-button>
          
          <el-button type="primary" @click="submitForm('ruleForm')">
            提交
          </el-button>
          <el-button  @click="resetForm('ruleForm')">
            重置
          </el-button>
          <el-button @click="dialogFormVisible = false;resetForm('ruleForm')">取消</el-button>
        </span>
      </template>
    </el-dialog>
     
    <el-dialog v-model="dialogFormVisible1" title="修改基础课程">
      <el-form :model="preform">
        <el-form-item label="课程名称" :label-width="formLabelWidth">
          <el-input v-model="preform.courseName" autocomplete="off" v-show="identity == '学院管理员'"/>
          <span v-show="identity == '课程负责人'">{{ preform.courseName }}</span>
        </el-form-item>
        <el-form-item label="课程代码" :label-width="formLabelWidth" :error="C_ErrorMsg_edit">
          <el-input v-model="preform.courseCode" autocomplete="off" v-show="identity == '学院管理员'"/>
          <span v-show="identity == '课程负责人'">{{ preform.courseCode }}</span>
        </el-form-item>
        <el-form-item label="学分" :label-width="formLabelWidth">
          <el-input v-model="preform.credit" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程性质" :label-width="formLabelWidth">
          <el-select v-model="preform.courseNature" placeholder="请选择课程性质">
            <el-option v-for="(nature,index) in courseNatureSource" :key="nature" :label="nature" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型" :label-width="formLabelWidth">
          <el-select v-model="preform.courseType" placeholder="请选择课程类型">
            <el-option v-for="(type,index) in courseTypeSource" :key="type" :label="type" :value="index"></el-option>
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


    <el-dialog v-model="showPrinciple" title="添加负责人">
     <span>
      请选择负责人姓名：
     </span>
     
          <el-select v-model="selectedRespondent" 
          :remote-method="remoteMethodinADD" 
          :loading="loading" 
          remote 
          
          filterable
          reserve-keyword>
            <el-option v-for="teacher in principleForm" :key="teacher.userId" :value="teacher.userId" :label="teacher.respondentName">
            </el-option>
          </el-select>
          
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="showPrinciple = false">取消</el-button>
              <el-button type="primary" @click="addRespondent">
                添加负责人
              </el-button>
            </span>
      </template>
    </el-dialog>

    <!-- <el-dialog v-model="editPrinciple" title="修改负责人">
     <span>
      请选择负责人姓名：
     </span>
          <el-select v-model="editRespondentInfo"
          :remote-method="remoteMethodinEdit" 
          :loading="loading" 
          remote 
          
          filterable
          reserve-keyword
          >
            <el-option v-for="teacher in principleForm" :key="teacher.userId" :value="teacher.userId" :label="teacher.respondentName">
            </el-option>
          </el-select>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="editPrinciple = false">取消</el-button>
              <el-button type="primary" @click="editRespondent">
                修改负责人
              </el-button>
              <el-button type="danger" @click="deleteRespondent">
                删除负责人
              </el-button>
            </span>
      </template>
    </el-dialog> -->

    <div  class="pagination-container" flex>
      <el-row type="flex" justify="center" align="middle" class="loadmorestyle">
        <el-button :disabled="loadmoreDisabled" link plain v-show="showLoadmore&&hasBaseCourse&&!isloading" @click="loadmoreCourse()">加载更多</el-button>
      </el-row>
      
    </div>
       
        
    
  
  </template>
  
  <script>
  import request from '@/utils/request/request'
  import HeaderSearch from "@/components/general/headerSearch.vue";
  import addBtn from "@/components/general/addBtn.vue";
  import { ref,reactive, version,}from 'vue';
  import { ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,ElDialog,ElDropdown,ElTag } from 'element-plus'
  import { Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete, Edit, MoreFilled, ArrowDown,Document,Avatar,DocumentChecked,User,CircleClose} from '@element-plus/icons-vue'
  import { getDictionary } from "@/api/dictionary";
  
  
  
  
  export default {
  name:"BaseCourse",
  components:{
    request,ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,
    Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete,ElDialog,
    ref,reactive,Delete,Edit,HeaderSearch, addBtn, MoreFilled, ElDropdown, ArrowDown,
    Document,ElTag,Avatar,DocumentChecked,User,CircleClose
  },
  data(){
    return{

      C_ErrorMsg:'',
      C_ErrorMsg_edit:'',

      showToolIcon:Boolean,



      loadmoreDisabled:Boolean,
      keyword:'',
      Respondentkeyword:'',
      isloading:true,
      hasBaseCourse:Boolean,
      courseTypeSource:[],
      courseNatureSource:[],
      //showSetDetailPage:false,
      showSetDetailPage:false,
      //selectedDetail
      selectedDetail:'',
      //userId
      userId:'',
      //identity
      identity:'',
      //remote option
      loading: false,
      remoteteacher:[],
      //current edit row
      currentEditRow:'',
      //editRespondentPostdata
      editRespondentPostdata:[],
      //editRespondentInfo
      editRespondentInfo:'',
      //respondentInfos
      respondentInfos:'',
      //editPrinciple
      editPrinciple:false,
      //respondentPostdata
      respondentPostdata:[],
      //selected respondent
      selectedRespondent:'',
      //principel form
      principleForm:[],
      //choose principle
      showPrinciple:false,
      //show load button
      showLoadmore:true,
      //form rules
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
            { required: false, message: '请选择课程性质', trigger: 'change' }
          ],
          courseType:[
            { required: false, message: '请选择课程类型', trigger: 'change' }
          ],

      },



      //from Route
      routeVersionId:'',
      routeCourseId:'',
  
      //select
      currentVersion:'2016版',
      currentVersionValue:1,
      loading:ref(false),
      options:[],
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
      // {
      //   value:9,
      //   label:'2024版'
      // },
      // {
      //   value:10,
      //   label:'2025版'
      // },
      // {
      //   value:11,
      //   label:'2026版'
      // },
      // {
      //   value:12,
      //   label:'2027版'
      // },
      ],
      versionLabel:[
      '2016版','2017版','2018版',
      '2019版','2020版','2021版','2022版','2023版',
      // '2024版','2025版','2026版','2027版'
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
      respondentInfos:'',
      respondentName:'',
      credit:'',
      courseYear:'',
      remark:'',
      versionId:'',
    },]),
    pageSize:ref(20),
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
    respondentInfos:'',
    respondentName:'',
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
    respondentInfos:'',
    respondentName:'',
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
    getSearchValueforRespondent(data){
      this.Respondentkeyword = data;
      this.getPrincipleInfo();
    },
    getSearchValue(data){
      this.keyword = data;
      this.getBaseCourse(this.pageSize,this.pageNum);
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


    rowKey(row) {
      return row.courseId;
    },
    //setDetail
    setDetail(){

},
    //remotemethod
    remoteMethodinADD(query){
      let that = this;
      if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.Respondentkeyword = query;
            this.getPrincipleInfo().then(()=>{
              that.principleForm = that.remoteteacher;
            })
            
          }, 200);
        } else {
          this.principleForm = [];
        }
    },
    // remoteMethodinEdit(query){
    //   if (query !== '') {
    //       this.loading = true;
    //       setTimeout(() => {
    //         this.loading = false;
           
    //         this.principleForm = this.remoteteacher.filter(item => {
    //           return item.respondentName
    //             .indexOf(query) > -1;
    //         });
    //       }, 200);
    //     } else {
    //       this.principleForm = [];
    //     }
    // },
    
    //showEditRespondent
    // showEditRespondent(row){
    //   this.editPrinciple = true;
    //   this.currentEditRow = row;
    // },
    //修改课程负责人
    // editRespondent(){
    //   let that = this;
    //   let row = this.currentEditRow;
    //   console.log('修改课程负责人：',row);
    //   this.respondentInfos = row.respondentInfos;
    //   var courseRespondentDict={
    //     "courseId": row.courseId,
    //     "departmentId": this.departmentId,
    //     "schoolId": this.schoolId,
    //     "userId": this.editRespondentInfo
    //   }
    // this.editRespondentPostdata.push(courseRespondentDict);
    // return request({
    // url:'/system/role/editRespondent',
    // method:'post',
    // data:this.editRespondentPostdata
    // }).then(function(res){
    //   console.log('edit respondent res:',res);
    //   that.getBaseCourse(that.pageSize,that.pageNum);
    //   that.editPrinciple = false;
    //   that.editRespondentPostdata = [];
    //   if(res.code == 'SUCCESS'){
    //       ElMessage({
    //                 type: 'success',
    //                 message: `修改负责人成功`,
    //                 duration:1000,
    //               });
    //     }
    //     else{
    //       ElMessage({
    //                 type: 'error',
    //                 message: `修改负责人失败`,
    //                 duration:1000,
    //               });
    //     }
    // })
    // },
    //删除课程负责人
    deleteRespondent(){
      let that = this;
      this.courseId.forEach(function(res){
        var courseRespondentDict={
          "courseId": res,
          "departmentId": that.departmentId,
          "schoolId": that.schoolId,
          "userId": 0
        }
        that.editRespondentPostdata.push(courseRespondentDict);
      })
      
      ElMessageBox.confirm("即将删除课程负责人", "注意", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        return request({
        url:'/system/role/editRespondent',
        method:'post',
        data:this.editRespondentPostdata
    }).then(function(res){
      console.log('delete respondent res:',res);
      that.getBaseCourse(that.pageSize,that.pageNum);
      that.editPrinciple = false;
      that.editRespondentPostdata = [];
      if(res.code == 'SUCCESS'){
          ElMessage({
                    type: 'success',
                    message: `删除负责人成功`,
                    duration:1000,
                  });
        }
        else{
          ElMessage({
                    type: 'error',
                    message: `删除负责人失败`,
                    duration:1000,
                  });
        }
    })
      }) .catch(() => {});
      
    },
    //添加课程负责人
    addRespondent(){
      let that = this;
      this.courseId.forEach(function(res){
        var courseRespondentDict={
          "courseId": res,
          "departmentId": that.departmentId,
          "schoolId": that.schoolId,
          "userId": that.selectedRespondent
        }
        that.respondentPostdata.push(courseRespondentDict);
      })
      return request({
        url:'/system/role/editRespondent',
        method:'post',
        data:this.respondentPostdata
      }).then(function(res){
        console.log('respondentPostdata :',res);
        that.getBaseCourse(that.pageSize,that.pageNum);
        that.showPrinciple = false;
        that.respondentPostdata = [];
        if(res.code == 'SUCCESS'){
          ElMessage({
                    type: 'success',
                    message: `添加负责人成功`,
                    duration:1000,
                  });
        }
        else{
          ElMessage({
                    type: 'error',
                    message: `添加负责人失败`,
                    duration:1000,
                  });
        }
        
      })
    },
    //获取负责人信息
    getPrincipleInfo(){
      let that = this;
      return request({
        url:'/teacher/list',
        method:'get',
        params: {
          'schoolId': this.schoolId,
          'departmentId': this.departmentId,
          'selectKeyWord':this.Respondentkeyword
        },
      }).then(function(res){
        
        that.remoteteacher = res.rows.map(item =>{
          return {userId:item.userId,respondentName:item.teacherName+"("+item.teacherNumber+")"}
        });
        console.log('principle INfo :',res.rows);
        // res.rows.forEach(function(teacher){
        //   if(teacher.userId){
        //     // that.principleForm.push(teacher);
        //     that.remoteteacher.push(teacher);
        //   }
        // })
      })
    },
    //load more course
    loadmoreCourse(){
    if(this.result.total-this.pageSize>=20){
      this.pageSize +=20;
      this.getBaseCourse(this.pageSize,this.pageNum);
    }
    else{
      this.pageSize +=(this.result.total-this.pageSize);
      this.getBaseCourse(this.pageSize,this.pageNum);
    }
    

  },
    //添加课程负责人
    addPrincipal(){
    console.log('add principle',this.principleForm);
    this.showPrinciple = true;
    },
     //是否可选
  // selectable(row,index){
  //   if(row.respondentInfos.length){
      
  //     return !row.respondentInfos.length;
  //   }
  //   else return true;
    
  // },
    //添加课程
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addBaseCourse();
          } else {
            ElMessage({
                    type: 'error',
                    message: `添加失败`,
                    duration:1000,
                  });
            return false;
          }
        });
      },
    //清除输入课程信息
    resetForm(formName) {
        this.$refs[formName].resetFields();
      },

    getRouter(){
      this.routeVersionId = this.$route.query.versionId;
      this.routeCourseId = this.$route.query.courseId;
      console.log('routeVersion:',this.routeVersionId)
      console.log('routeCourse:',this.routeCourseId)
    },
    addBaseCourseDetail(row){
      let that = this;
      this.versions.forEach((version)=>{
        if(version['value']==that.currentVersionValue){
          that.currentVersion = version['label']
        }
      });
      let versionMessage = '是否添加课程大纲（版本：'+this.currentVersion+' ）'
      ElMessageBox.confirm(
        versionMessage,
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
        if(res.code == 'SUCCESS'){
          ElMessage({
                  type: 'success',
                  message: `新增成功`,
                  duration:1000,
                });
              //成功后根据vesionId和basecouseId获取详细信息
              that.getBaseCourse(that.pageSize,that.pageNum);
            }
            
      }).catch(e=>{
        console.log('e',e);
        ElMessage({
                    type: 'error',
                    message: `新增失败`,
                    duration:1000,
                  });
              //失败后退回basecouse页面
              that.getBaseCourse(that.pageSize,that.pageNum);
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
      this.form.respondentInfos='',
      this.form.respondentName = '',
      this.form.credit='';
      this.form.courseYear='';
      this.form.remark = '';
    },
    toggleSelection(rows) {
          if (rows) {
            
            rows.forEach(row => {
              this.$refs.multipleTable1.toggleRowSelection(row);
              this.$refs.multipleTable2.toggleRowSelection(row);
            });
          } else {
            
            this.$refs.multipleTable1.clearSelection();
            this.$refs.multipleTable2.clearSelection();
            console.log('清空选择触发');
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
          if(val.length>0){
            this.showToolIcon = false;
            console.log('showToolIcon',this.showToolIcon);
          }
          else{
            this.showToolIcon = true;
            console.log('showToolIcon',this.showToolIcon);
          }
          
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
      
      this.C_ErrorMsg = '';
      console.log(this.form);
      
      let that = this;
      let postData = this.formTopostData(this.form);
      console.log('postData:',postData);
   
      return request({
              url:'/baseCourse/add',
              method:'post',
              data:postData
          }).then(function(res){
            
            if(res.code == 'SUCCESS'){
              that.dialogFormVisible = false;
              ElMessage({
                  type: 'success',
                  message: `添加成功`,
                  duration:1000,
                });
              that.clearForm();
              that.getBaseCourse(that.pageSize,that.pageNum);
            }
           
          }).catch(e=>{
            console.log('e',e);
            that.dialogFormVisible = true;
              if(e.code == 'E_CODE_EXIST'){
                ElMessage({
                  type: "error",
                  message: "添加失败，课程已存在",
                  duration: 2000,
                });
                that.C_ErrorMsg = "课程已存在，请重新输入"
               }
               else if(e.code == 'DATA_DUPLICATED'){
                ElMessage({
                  type: "error",
                  message: "添加失败，数据重复",
                  duration: 2000,
                });
                that.C_ErrorMsg = "课程已存在，请重新输入"
               }
            
            else{
              ElMessage({
                  type: "error",
                  message: "添加失败",
                  
                  duration: 1000,
                });
            }
          })
  
    },
    getBaseCourse(pageSize,pageNum){
      let identity = this.identity;
      
      if(identity == '学院管理员'){
      console.log('pageSize:',pageSize,' pageNum:',pageNum,'versionId',this.currentVersionValue);
      let that = this;
      let courses = [];
      this.isloading = true;
      this.loadmoreDisabled = true;
      return request({
              url:'/baseCourse/list',
              method:'get',
              params:{
              'pageSize':pageSize,
              'pageNum':pageNum,
              'versionId':that.currentVersionValue,
              'departmentId':that.departmentId,
              'schoolId':that.schoolId,
              'selectKeyWord':that.keyword
            }
          }).then(function(res){
            that.isloading = false;
            that.loadmoreDisabled = false;
            console.log('courseDetails:',res);
            console.log('department:',that.departmentId,'schoolId:',that.schoolId);
            if(res.total != 0){
              that.hasBaseCourse = true;
              res.rows.forEach(function(course){
              course.courseName= course.courseName;
              course.courseCode= course.courseCode;
              course.courseType = that.courseTypeSource[course.courseType];
              course.courseNature= that.courseNatureSource[course.courseNature];
              course.credit=course.credit;
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
                
                
                  // let teacherName =[];
                  course.respondentInfos.forEach(function(respondent){
                    course.respondentName = respondent.respondentName;
                    // teacherName.push(respondent.respondentName);
                  });
                  // course.respondentName = teacherName;
                
              }
              // course.remark = (_.isEmpty(course.remark)) ? '' : course.remark.trim();
              // course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
              course.semester=(course.semester == '0') ? '上学期' : '下学期';
              // course.versionId = (course.versionId== that.currentVersionValue) ? true : false;
  
              courses.push(course);
            });
            that.tableData = courses;
            that.result = res;
            
            if(pageSize>=res.total){
              that.showLoadmore = false;
            }
            else{
              that.showLoadmore = true;
            }
            console.log('pageSize:',pageSize,'res.total:',res.total,'showloadmore:',that.showLoadmore);
            }
            else{
              that.hasBaseCourse = false;
            }
            
          }).catch(e=>{
            console.log('e',e);
          });
      }
      if(identity == '课程负责人'){
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
            res.rows.forEach(function(course){
              
              course.courseName= course.courseName;
              course.courseCode= course.courseCode;
              course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
              course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
              course.credit=course.credit;
              course.courseName= course.courseName;
              course.courseCode= course.courseCode;
              course.courseType=(course.courseType == '0') ? '学科基础课' : '还未确定';
              course.courseNature=(course.courseNature == '0') ? '专业任选' : '还未确定';
              course.credit=course.credit;
              // course.remark = (_.isEmpty(course.remark)) ? '' : course.remark.trim();
              // course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
              course.semester=(course.semester == '0') ? '上学期' : '下学期';
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
              // course.versionId = (course.versionId== that.currentVersionValue) ? true : false;
  
              courses.push(course);
            });
            that.tableData = courses;
            that.result = res;
            if(pageSize>=res.total){
              that.showLoadmore = false;
            }
          }).catch(e=>{
            console.log('e',e);
          });
      }
      if(identity == '教师'){

      }
    },
    multideleteBaseCourse(row){
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
        url:'/baseCourse',
        method:'delete',
        data:row
        
      }).then(function(res){
        console.log(res);
        if(res === 204){
          ElMessage({
                  type: 'success',
                  message: `删除成功`,
                  duration:1500,
                });
                
                that.getBaseCourse(that.pageSize,that.pageNum);
                that.$refs.multipleTable1.clearSelection();
                that.numSelected = 0;
                if (that.clickState == 1) {
                  that.clickState = 0;
                  that.closeShow = !that.closeShow;
                }
            }
            
             
            
      })
      .catch(e=>{
            console.log('e',e);
            if(e.code == 'ALREADY_ADD_TO_PROGRAM'){
              ElMessage({
                    type: 'error',
                    message: `删除失败,已加入培养方案`,
                    duration:1500,
                  });
            }
            else if(e.code == 'ADD_TO_PROGRAM'){
              // let emessage = '删除失败'+e.data.courseName+"课程已被添加到培养计划中"
              let emessage = '删除失败,课程已被添加到培养计划中'
              ElMessage({
                    type: 'error',
                    message: emessage,
                    duration:2000,
                  });
            }
            else{
              ElMessage({
                    type: 'error',
                    message: `删除失败`,
                    duration:1500,
                  });
            }
            
              that.getBaseCourse(that.pageSize,that.pageNum);
          });
      })
      .catch(e =>{
        console.log('e',e);
      })
    },
    deleteBaseCourse(index, row){
      console.log('deleteCourse',row);
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
        url:'/baseCourse'+'/'+row,
        method:'delete',
        
      }).then(function(res){
        console.log(res);
        if(res === 204){
          ElMessage({
                  type: 'success',
                  message: `删除成功`,
                  duration:1000,
                });
                
                that.getBaseCourse(that.pageSize,that.pageNum);
                that.$refs.multipleTable1.clearSelection();
                that.numSelected = 0;
                if (that.clickState == 1) {
                  that.clickState = 0;
                  that.closeShow = !that.closeShow;
                }
            }
            
             
            
      })
      .catch(e=>{
            console.log('e',e);
            if(e.code == 'ALREADY_ADD_TO_PROGRAM'){
              ElMessage({
                    type: 'error',
                    message: `删除失败,该课程已加入培养方案`,
                    duration:1000,
                  });
            }
            else{
              ElMessage({
                    type: 'error',
                    message: `删除失败`,
                    duration:1000,
                  });
            }
            
              that.getBaseCourse(that.pageSize,that.pageNum);
          });
      })
      .catch(e =>{
        console.log('e',e);
      
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
      
      this.C_ErrorMsg_edit = '';
      let that = this;
      console.log('preform:',this.preform);
      return request({
        url:'/baseCourse',
        method:'put',
        data: this.preform
      }).then(function(res){
        console.log('res:',res);
        if(res.code == 'SUCCESS'){
          that.dialogFormVisible1 = false;
          ElMessage({
                  type: 'success',
                  message: `修改成功`,
                  duration:1000,
                });
              
              that.getBaseCourse(that.pageSize,that.pageNum);
            }
            

              
              // that.getBaseCourse(that.pageSize,that.pageNum);
            
      }).catch(e=>{
        that.dialogFormVisible1 = true;
            console.log('e',e);
            if(e.code == 'E_CODE_EXIST'){
                ElMessage({
                  type: "error",
                  message: "修改失败，课程已存在",
                  duration: 2000,
                });
                that.C_ErrorMsg_edit = "课程已存在，请重新输入"
               }
              else if(e.code=='UNAUTHENTICATED'){
                ElMessage({
                  type: "error",
                  message: "修改失败，无权限",
                  duration: 2000,
                });
              }
               else{
              ElMessage({
                  type: "error",
                  message: "修改失败",
                  
                  duration: 1000,
                });
            }
          });
  
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
      postData.respondentName = form.respondentName;
      postData.credit = form.credit;
      postData.courseYear = form.courseYear;
      postData.remark = form.remark;

      return postData;
    },
    postDataToform(val) {
      this.preform.courseId = val.courseId;
      this.preform.courseName = val.courseName;
      this.preform.courseCode = val.courseCode;
      this.preform.courseType = (this.courseTypeSource.indexOf(val.courseType)> -1 ) ? this.courseTypeSource.indexOf(val.courseType):'';
      this.preform.courseNature = (this.courseNatureSource.indexOf(val.courseNature)> -1) ? this.courseNatureSource.indexOf(val.courseNature):'';
      this.preform.credit = val.credit;
      this.preform.respondentName = val.respondentName;
      this.preform.courseYear = val.courseYear == "2022" ? "0" : "1";
      this.preform.remark = val.remark;
    },
    dataTransfrom(course){
      course.courseName=course.courseName;
      course.courseCode=course.courseCode;
      course.courseType=(course.courseType == '') ? '':this.courseTypeSource[course.courseType];
      course.courseNature=(course.courseNature == '')? '':this.courseNatureSource[course.courseNature];
      course.respondentName = course.respondentName;
      course.credit=course.credit;
      course.courseYear=(course.courseYear == '0') ? '2022' : '2023';
      course.remark=(course.remark) ? '' : course.remark.trim();
  
      return course;
  
    },
    activate(){
              this.departmentId = this.$store.state.currentInfo.departmentId;
              this.schoolId = this.$store.state.currentInfo.schoolId;
              this.identity = this.$store.state.currentInfo.identity;
              if(this.identity == '课程负责人'){
                this.userId = this.$store.state.userInfo.userId;
              }
          },
  },
  created(){
    this.activate();
    this.getDict();
    let identity = this.identity;
    if(identity == '学院管理员'){
    this.getRouter();
    // this.getPrincipleInfo();
    if(this.routeVersionId){
      this.currentVersionValue = this.routeVersionId;
    }
    }
    this.getBaseCourse(this.pageSize,this.pageNum);
  
  },
  
  
  }
  </script>
  
  <style scoped>
  .loadmorestyle{
  padding-top:24px;
  padding-bottom: 24px;
  }
  .noBaseCourseDetail:hover{
    cursor:pointer
  }
  .dropdownIcon{
    margin-top: 18px;
    cursor:pointer;
  }
  .dropdownstyle{
    position: absolute;
  }

  .no-class {
  
  margin-top: 120px;
  display: flex;
  justify-content: center;
  font-size: 22px;
}
  :deep().el-input__wrapper {
  border-bottom: 1px solid #d5d5d5;
  background-color: transparent;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  box-shadow:0 0 0 0px;
  border-radius: 0;
}
.el-select:hover:not(.el-select--disabled) :deep().el-input__wrapper{
  box-shadow: 0 0 0 0px;
}
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

  .dropDown{
    margin-left: 1%;
    width: 100px;
  }
  .clearSelected{
  color: black;
  margin-top: 11px;
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
  }
  .deleteButton, .editButton{
   
    line-height:55px;
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
    
    float: right;
    top: -34px;
    right: 40px;
  }
 
  .addCourseButton:hover{
    background-color:rgb(41,98,255);
    transition: all .3s cubic-bezier(.55,0,.55,.2);
  }
  
  .el-table-container{
    margin: 0 auto;
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
    background-color: #f2f2f2;
     
  }
  .color{
    background-color: #f2f2f2;
  }
  .deleteButton{
    margin-right: 10px;
    margin-top: 0;
    margin-bottom: 0;
  }
  .numSelectedTeacher{
      color: #3f51b5; 
      float: left;
      line-height: 55px;
      border-radius: 2px;
      border: 0;
      padding: 0 6px;
      margin: 0;
      user-select: none;
      background: transparent;
      transition: box-shadow .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1);
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  </style>