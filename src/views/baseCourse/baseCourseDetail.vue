<template>
   <div class="submenu" layout="row" layout-align="center center" style="justify-content: left">
      <el-tooltip content="返回" style="float:left;">
        <el-button class="md-icon-button" md-no-ink aria-label="返回" @click="goBaseCourse" link>
        <el-icon><Back /></el-icon>
      </el-button>
      </el-tooltip>
    </div>


    <div layout="row" flex class="md-padding" v-show="isVisiable">
    
    <addBtn @click="dialogFormVisible = true"></addBtn>
    <div class="el-table-container" layout="column" flex layout-align="start center" >

      <el-row class="rowBlock">
    <el-col :span="4">
      <el-row>
        <el-col :span="20"> 
          <h3 >Version: {{versionName}}</h3>
        </el-col>
       <el-col :span="4">
        <el-button class="deleteButton" link @click="deleteDetail()">
          <el-icon>
            <Delete/>
          </el-icon>
        </el-button>
       </el-col>
      </el-row>
      
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        
      >
      <el-menu-item index="1" @click="showBaseDetail()">
        <el-icon><Tickets /></el-icon>
          <span>课程信息</span>
        </el-menu-item>
        <el-menu-item index="2" @click="showMajorRelatedDetail()">
          <el-icon><CoffeeCup /></el-icon>
          <span>专业相关</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20" v-show="indexOne" class="baseDetail">
      <div class="courseCard">
        <el-row>
          <el-col :span="12">
          
            <h3 class="textPadding ">课程信息</h3>
        
        </el-col>
        <el-col :span="12">
          <el-button class="editButton" link>
            <el-icon><Edit /></el-icon>
          </el-button>
        </el-col>
        </el-row>
       
      <el-row>
        <div class="attr-container attr-container-margin flex">
          <label class="titleLabel textPadding">课程名</label>
          <span class="textPadding">{{form.courseName}}</span>
        </div>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="attr-container attr-container-margin flex">
          <label class="titleLabel textPadding">课程号</label>
          <span class="textPadding">{{form.courseCode}}</span>
        </div>
        </el-col>
        <el-col :span="12">
          <div class="attr-container attr-container-margin flex">
          <label class="titleLabel">学分</label>
          <span >{{form.credit}}</span>
        </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="attr-container attr-container-margin flex">
          <label class="titleLabel textPadding">课程类型</label>
          <span class="textPadding">{{form.courseNature}}</span>
        </div>
        </el-col>
        <el-col :span="12">
          <div class="attr-container attr-container-margin flex">
          <label class="titleLabel">选课类型</label>
          <span>{{form.courseType}}</span>
        </div>
        </el-col>
      </el-row>
      <el-row>
        <div class="attr-container attr-container-margin flex">
          <label class="titleLabel textPadding">备注</label>
          <span class="textPadding">{{form.remark}}</span>
        </div>
      </el-row>
      </div>
    </el-col>
    <el-col :span="20" v-show="indexTwo">
      <div class="indexTwoCard">
        <el-menu
      default-active="0"
    class="el-menu-demo"
    mode="horizontal"
    v-model="currentMajorId"
    v-if="isRouterAlive"
  >
    <el-menu-item 
    v-show="indexTwo"
    v-for="item in majorForm"
    :key="item.majorId"
    :label="item.majorName"
    :value="item.majorId"
    :index="item.index"
    @click="showDetailByMajor(item.majorId)"
    >{{item.majorName}}</el-menu-item>
  </el-menu>
  
  <div>
    <div class="Indicator" v-for="indicator in indicators" :key="indicator">
      <div v-for="item in indicator" :key="item.id">
        <h3>{{item.achievement}}</h3>
        <h4>{{item.id}}</h4>
        <h5>supportmethods:</h5>
        <div v-for="method in item.supportMethods" :key="method.id">
        <span>{{method.id}}</span>
        <span>{{method.weight}}</span>
        </div>
      </div>
    </div>
  </div>
      </div>
    

    </el-col>



  </el-row>
      
       
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


</template>

<script>
import request from '@/utils/request/request'
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ref,reactive,}from 'vue';
import { ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,ElDialog,ElRow,ElCol,ElMenu } from 'element-plus'
import { Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete, Edit, MoreFilled,Tickets,CoffeeCup} from '@element-plus/icons-vue'

export default {
name:'baseCourseDetail',
inject:['reload'],
components:{
    HeaderSearch,ref,reactive, ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,ElDialog
    ,Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete, Edit, MoreFilled, addBtn, request,ElRow,ElCol,ElMenu
    ,Tickets,CoffeeCup
},
methods:{
  //根据majorId和versionId还有courseId来查找detailMajor
  showDetailByMajor(value){
    this.currentMajorId = value;
    console.log('currentMajorId',this.currentMajorId);
    return request({
      url:'/detailMajor/list'+'?'+'detailId='+this.detailId+'&'+'majorId='+this.currentMajorId,
      method:'get'
    }).then(function(res){
      console.log(res);
      that.indicators = res.rows[0].courseIndicators;
     
    });
    
  },
  //reload
  reload(){
    this.isRouterAlive = false;
    this.$nextTick(function(){
      this.isRouterAlive = true;
    })
  },
  //删除detail
  deleteDetail(){
   
   let that = this;
    ElMessageBox.confirm(
    '是否删除版本信息？',
    '注意',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    console.log('curent Detail ID:',this.detailId);
    return request({
      url:'/detail/'+this.detailId,
      method:'delete'
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
            //删除成功后返回baseCouse页面
            that.goBaseCourse();
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
              },
            });
          }
    })
    })
  },
  //获取学校和部门ID
  activate(){
            this.departmentId = this.$store.state.currentInfo.departmentId;
            this.schoolId = this.$store.state.currentInfo.schoolId;
        },
  //根据versionId和courseId来获取detailId 第一步
  getDetail(){
    let that = this;
    return request({
      url:'/detail/list'+'?vesionId='+this.versionId+'&courseId='+this.courseId,
      method:'get'
    }).then(
      function(res){
      console.log('getDetail:',res);
      res.rows.forEach(function(detail){
        if(detail.versionId == that.versionId){
          that.detailId = detail.detailId;
        }
      });
      console.log('detailId',that.detailId);
      that.getMajor();
    }
    )
  },
  //根据detailID获取majorId 第二步
  getMajor(){
    let that = this;
    let majorList = [];
    let majorNumber = 0;
    console.log('detailId:',this.detailId)
    return request({
      url:'/detailMajor/list'+'?detailId='+this.detailId,
      method:'get'
    }).then(
      function(res){
      console.log('getMajor:',res);
      if(res.rows){
        res.rows.forEach(function(detail){
          majorList.push(detail.majorId);
          majorNumber++;
      });
      }
      else{
        majorList.push(res.data.majorId);
        majorNumber=1;
      }
      that.majorId = majorList;
      that.majorNumber = majorNumber;
      //根据majorId来获取majorName
      console.log('majorId',that.majorId);
      that.showMajor()
    }
    )
  },
//根据majorId显示major,没有考虑其他学校中majorId会重复的问题，默认Id唯一 第三步
showMajor(){
  let majorList = [];
  let index = 0;
  console.log('index Type:',typeof(index.toString()));
  if(this.majorNumber>1){
    this.majorId.forEach(function(major){
    console.log('each majoId:',major);
    return request({
      url:'/major/'+major,
      method:'get',
    }).then(
      function(major){
      console.log('Each Major Detail:',major);
      major.data.index = index.toString();
      majorList.push(major.data);
      index++;
    }
    )
  })
  }
  else{
    return request({
      url:'/major/'+this.majorId[0],
      method:'get',
    }).then(
      function(major){
      console.log('Each Major Detail:',major);
      major.data.index = index.toString();
      majorList.push(major.data);
    }
    )
  }
  console.log('majorList',majorList); 
  this.majorForm = majorList;
},
  showBaseDetail(){
    this.indexOne=true;
    this.indexTwo=false;
  },
  showMajorRelatedDetail(){
    this.indexOne=false;
    this.indexTwo=true;

    this.reload();
    
  },
    goBaseCourse(){
        this.$router.push('/baseCourse');
    },
    getRouter(){
        this.versionName = this.$route.query.versionName;
        this.versionId = this.$route.query.versionId;
        this.versionFlag = this.$route.query.versionFlag;
        this.courseId = this.$route.query.courseId;
        this.form.courseName =  this.$route.query.courseName;
        this.form.courseCode =  this.$route.query.courseCode;
        this.form.courseType =  this.$route.query.courseType;
        this.form.courseNature =  this.$route.query.courseNature;
        this.form.credit =  this.$route.query.credit;
        this.form.courseYear =  this.$route.query.courseYear;
        this.form.remark =  this.$route.query.remark;
        this.activate();
        console.log('form:',this.form);
    }
},
mounted:function(){
  console.log('mounted');
  
},
created() {
this.getRouter();

let that = this;
    if(this.versionFlag == false){
    ElMessageBox.confirm(
    '尚未添加版本信息是否添加？',
    '注意',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    console.log('versionId',that.versionId,'CourseId',that.courseId);

      return request({
      url:'/detail',
      method:'post',
      data:{
        'versionId':that.versionId,
        'courseId':that.courseId,
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
            that.isVisiable = true;
            that.getDetail();
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
            that.goBaseCourse();
          }
    })
    })
    // .catch(() => {
    //   console.log('cancel');
    //   that.goBaseCourse();
    // })
    }
    else{
      this.isVisiable = true;
      this.getDetail();
    }
},
data(){
    return{
      //vesionFlag
      isVisiable:false,
      isRouterAlive:true,
      
      //毕业要求
      indicators:[],


        dialogFormVisible:false,
        formLabelWidth : '140px',

        //学校部门
        departmentId:'',
        schoolId:'',

        //专业
        majorId:[],
        majorNumber:0,
        currentMajorId:'',

        //详细信息
        detailId:'',

        //basecourseID
        courseId:'',

        //版本信息
        versionName:'',
        versionId:'',
        versionFlag:'',

        //basecouse基本信息
        form: reactive({
            courseName: '',
            courseCode: '',
            courseType: '',
            courseNature: '',
            credit: '',
            courseYear: '',
            remark: '',
        }),

        //majorinformation
        majorForm:[
        {
        departmentId: 1,
        index: '0',
        majorId:29,
        majorName: "计算机专业2"},
        ],

        //col
        indexOne:true,
        indexTwo:false,

    }
}
}
</script>

<style scoped>
.deleteButton{
  display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  float: right;
  padding-right: 30px;
}
.editButton{
  display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  float: right;
  padding-right: 30px;
}
.textPadding{
  padding-left: 30px;
}
.courseCard{
  width: 810px;
  margin: 30px;
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}
.flex {
    min-width: 0;
}
.attr-container-margin {
    margin: 8px 0;
}
.attr-container {
    padding: 2px;
    text-overflow: ellipsis;
    overflow: hidden;
}
.flex{
    box-sizing: border-box;
}
.flex {
    flex: 1;
}
.attr-container{
    margin-bottom: 8px

}
.titleLabel{
  margin-bottom: 8px
}
.attr-container label {
    font-size: 13px;
    padding-top: 5px;
    color: #757575;
    height: 20px;
    display: block;
}
label {
    cursor: default;
}
.rowBlock{
  height: 600px;
}
.md-icon-button{
  padding: 20px !important;
}
.submenu{
    color: #3f51b5;
    font-size: 14px;
    font-weight: bold;
    height: 45px;
    min-height: 45px;
    line-height: 1em;
    margin: 0;
    position: relative;
    padding: 6px 96px 5px 32px;
    border-bottom: 1px solid #d0d0d0;
    background-color: transparent;
}
.md-padding {
  margin:0 auto;
  margin-top: 85px;
}
.el-table-container{
  width: 80%;
  margin-left: 10%;
  
}
</style>