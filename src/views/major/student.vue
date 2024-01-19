<template>
  <div v-show="hasProgram">
   
      <div v-show="closeShow" class="submenu" >
        <el-row>
          <el-col :span="2" class="columnstyle">
            <el-button @click="toggleSelection()"  class="clearSelected" link>取消选择</el-button>
          </el-col>
          <el-col :span="16" class="columnstyle">
            <div class="numSelectedTeacher" >已选中 {{numSelected}} 位学生</div>
          </el-col>
          <el-col :span="4" class="columnstyle">
            <el-button @click="deleteStudent()"  class="submenudeleteButton" link ><el-icon ><Delete /></el-icon></el-button>
          </el-col>
        </el-row>
      </div>
      <HeaderSearch msg="搜索学生名称" v-show="!closeShow" @SearchValue="getSearchValue"></HeaderSearch>
      <addBtn @click="goAddStudent"></addBtn>
        <div layout="row" flex v-show="hasStudent" class="md-padding">
          
          <!-- 学生信息列表 -->
          <el-table
          class="studentsTable"
          :data="studentsTable"
          
          ref="multipleTable"
          style="width: 40%"
          :header-cell-style="{  'padding-left':'40px','font-size': '14.4px','height':'48px','font-weight': 'bold','color':'black'}"
          :cell-style="{ 'padding-left':'40px','font-size': '16px','height':'60px' }"
          @selection-change="handleSelectionChange"
        >
        <el-table-column width="100" type="selection" ></el-table-column>
          <el-table-column prop="studentNumber" label="学号"  width="200"/>
          <el-table-column prop="studentName" label="姓名" />
        </el-table>


        <div class="pagination-container" flex>
        <el-row type="flex" justify="center" align="middle">
          <el-button v-show="showLoadmore && hasProgram && hasStudent" @click="loadmoreCourse()">加载更多</el-button>
        </el-row>
      </div>
      </div>

      
    
    <div v-show="!hasStudent" class="no-program">
      <div style="display: flex; justify-content: center; margin-top: 100px;font-size:22px">
      没有学生
      </div>
    <div style="display: flex; justify-content: center; color: grey;font-size:13px;margin-top: 30px">
        请先点击右上角圆形按钮添加学生
      </div>
    </div>
  </div>
  <div v-show="!hasProgram" class="no-program">
    <div style="display: flex; justify-content: center; margin-top: 100px;font-size:22px">
      未创建培养方案
    </div>
    <div style="display: flex; justify-content: center; color: grey;font-size:13px;margin-top: 30px">
        请先创建培养方案
      </div>
  </div>
</template>

<script>

import request from '@/utils/request/request'
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ref,reactive, version,}from 'vue';
import { ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,ElDialog,ElDropdown,ElTag } from 'element-plus'
import { Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete, Edit, MoreFilled, ArrowDown,Document} from '@element-plus/icons-vue'
import { checkProgram } from "@/api/program";

export default {
  name: "Student",
  components: {
    request,ElTooltip,ElIcon,ElInput,ElForm, ElButton, ElTable,ElMessage, ElMessageBox,
    Back , FolderChecked, InfoFilled, Loading, Search, Close, Plus, Delete,ElDialog,
    ref,reactive,Delete,Edit,HeaderSearch, addBtn, MoreFilled, ElDropdown, ArrowDown,
    Document,ElTag
  },
  computed: {
    yearChange() {
      return this.$store.state.currentInfo.year;
    },
  },
watch: {
    yearChange: {
      deep: true,
      handler(value) {
        this.checkCurrentProgram();
      },
    },
  },
  methods:{
    checkCurrentProgram() {
    console.log('year has changed');
    checkProgram(
        this.majorId,
        this.$store.state.currentInfo.year
      ).then((res)=>{
        console.log('res',res);
        if (res.msg == "操作成功" && res.code === 'SUCCESS') {
          this.hasProgram = true;
          this.programId = res.data.programId;
          this.$store.commit("major/setProgramId", this.programId);
        }
        console.log('current programId:',this.programId);
        this.getStudents(this.pageSize, this.pageNum);
      }).catch((e)=>{
        console.log('e',e);
        if(e.code == 'PROGRAM_NOT_FIND'){
          this.hasProgram = false;
        }
        
      })
  },
    getSearchValue(data) {
      this.keyword = data;
      this.getStudents(this.pageSize, this.pageNum);
    },
    //清空选项
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
    //删除学生
    deleteStudent(){
console.log('delete student');
ElMessageBox.confirm("是否确认删除学生信息", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(()=>{
        console.log('delete!')
      }).catch(()=>{})
    },
    //选择
    handleSelectionChange(val) {
          var studentId = [];
          this.multipleSelection = val;
          console.log('选中的信息：',val);
          val.forEach(function(student){
            let res = student.studentId;
            studentId.push(res);
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
          this.studentId = studentId;
          console.log('studentId:',this.studentId);
        },
    //loadmoreCourse
    loadmoreCourse(){
      if(this.result.total-this.pageSize>=20){
      this.pageSize +=20;
      this.getStudents(this.pageSize,this.pageNum);
    }
    else{
      this.pageSize +=(this.result.total-this.pageSize);
      this.getStudents(this.pageSize,this.pageNum);
    }
    },
    goAddStudent(){
      console.log('go add student');
      this.$router.push("/baseAddStudent");
    },
  getStudents(pageSize,pageNum){
    let that = this;
    let students = [];
      return request({
        url:'/student/listByProgram',
        method:'get',
        params:{
          'pageSize':pageSize,
          'pageNum':pageNum,
          'programId':this.programId,
          'schoolId':this.schoolId,
          'departmentId':this.departmentId,
          'selectKeyWord':this.keyword,
} 
      }).then(function(res){
        console.log('student:',res);
        if(res.total){
          that.hasStudent = true;
          that.hasNoStudent = false;
          res.rows.forEach(function(student){
          student.studentName = student.studentName;
          student.studentNumber = student.studentNumber;
          students.push(student);
        });
        that.studentsTable = students;
        that.result = res;
        if(pageSize>=res.total){
              that.showLoadmore = false;
            }
        }
        else{
          that.hasStudent = false;
          that.hasNoStudent = true;
          that.showLoadmore = false;
        }
        
      }).catch((e)=>{
        console.log('e',e);
      })
    }
  },
  data(){
    return{
      keyword:'',
      //studentId
      studentId:[],
      schoolId:'',
      departmentId:'',
      closeShow : false,
      //clickState:0,
      clickState:0,
      //numSelected 已经选择的数量
      numSelected:0,
      //multipleSelection
      multipleSelection:[],
      //result
      result:{},
      pageSize:20,
      pageNum:1,
      //showLoadmore
      showLoadmore:true,
      //是否有培养方案
      hasProgram:false,
      hasNoProgram:false,
      //学生是否为空
      hasStudent:false,
      hasNoStudent:false,

      programId:'',
      studentsTable:[]
      }
  },
  mounted:function(){
    this.departmentId = this.$store.state.currentInfo.departmentId;
    this.schoolId = this.$store.state.currentInfo.schoolId;
    this.majorId = this.$store.state.major.majorId;
    this.programId = this.$store.state.major.programId;
    this.checkCurrentProgram();
  }
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
:deep().el-icon svg {
  height: 18px;
  width: 18px;
}
:deep().el-icon {
  height: 18px;
  width: 18px;
}
.submenudeleteButton{
    float:right;
    margin-top:16px;
  }
.numSelectedTeacher{
    min-height:36px; 
    color: #3f51b5;
    
      position: relative;
      
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

      text-decoration: none;
      overflow: hidden;
      transition: box-shadow .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1);
  }
.columnstyle{
    height:50px;
    
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
.pagination-container{
    width: 100%;
    margin-top: 48px;
    margin-bottom: 48px;
  }
.studentsTable{
  margin: 0 auto;
  margin-top: 85px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
.md-padding {
  margin-top: 120px;
}
.no-program {
  display: flex;
  flex-direction: column;
  margin-top: 85px;
}

</style>