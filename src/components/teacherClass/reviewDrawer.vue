<template>
    <div id="drawerbox">
    <el-drawer v-model="openDrawer" :show-close="false">
    <template #header>
      <h2 style="color: black;">
        审核记录
      </h2>
    </template>

   <template #default>
    <el-collapse v-model="activeNames" @change="collapseHandleChange">
    <el-collapse-item 
    v-for="(review,index) in reviewInfo" 
    :title="'审核时间：'+review.createTime+'-----审核人：'+review.createBy"
    >
      <div>退回理由：{{ review.remark }}</div>
    </el-collapse-item>
   </el-collapse>

   <div class="reviewBoxStyle" v-show="status == '已提交' && (identity == '学院管理员'||identity == '课程负责人')">
    <h2> 评审反馈： </h2>

    <el-form :model="checkFeedback" :rules="checkFeedbackRules" ref="ruleForm">
      <el-form-item label="审核是否通过：" :label-width="140" prop="checkState">
        <el-select v-model="checkFeedback.checkState">
          <el-option
            v-for="state in checkStates"
            :key="state.value"
            :value="state.value"
            :label="state.label"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="反馈内容：" :label-width="140" prop="message">
        <el-input
          v-model="checkFeedback.message"
          autocomplete="off"
          type="textarea"
        />
      </el-form-item>
    </el-form>
   </div>
    </template>

    <template #footer >
      <span class="dialog-footer" v-show="status == '已提交' && (identity == '学院管理员'||identity == '课程负责人')">
        <el-button type="primary"  @click="submitForm('ruleForm')"> 提交反馈 </el-button>
      </span>
      <span class="dialog-footer" v-show="status == '已退回' && identity == '教师'">
        <el-button type="primary"  @click="submit()"> 重新提交 </el-button>
      </span>
    </template>

  </el-drawer>
  </div>
</template>

<script>
import {
  Back,
  Avatar,
  TrendCharts,
  Checked,
  Download,
  UploadFilled,
  Finished,
  Management,} from "@element-plus/icons-vue";
import { submit, getClassInfo, submitFeedback, createReview, getReview} from "@/api/class";
import { getDictionary } from "@/api/dictionary";
import { ElMessageBox, ElMessage, ElDialog, ElForm, ElSwitch, ElDrawer, ElCollapse} from "element-plus";


export default{
    name:'reviewDrawer',
    props: {visible:Boolean},
    components: {
    Back,
    Avatar,
    TrendCharts,
    Checked,
    Download,
    UploadFilled,
    Finished,
    ElDialog,
    ElForm,
    Management,
    ElSwitch,
    ElDrawer,
    ElCollapse
  },
  data(){
    return{
      reviewInfo:[],
      activeNames:'',
      openDrawer:false,
      hasNoReviewInfo:Boolean,
      checkStates: [{label:"审核通过",value:'3'}, {label:"退回",value:'4'}],
      selectedCheckState: "",
      checkFeedback: {
        message: "",
        checkState: "",
        workNumber: "",
      },
      checkFeedbackRules:{ 
        checkState:[{ required: true, trigger: "blur" }],
      },
      showCheckDialogFlag: false,
      identity: "",
      classInfo: {},
      academicYear: [],
      semester: [],
      hasFile: false,
      objectInfo: [],
      status: "",
    }
  },
  mounted() {
    this.identity = this.$store.state.currentInfo.identity;
    if (this.identity == "学院管理员") {
      this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
      console.log("identity:", this.identity);
    } else {
      this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
      console.log("identity:", this.identity);
    }
    this.checkFeedback.message = this.$store.state.reviewInfo.message;
    this.checkFeedback.checkState = this.$store.state.reviewInfo.checkState;
    this.getClassInfo();
    this.getReviewInfo();
    console.log("classInfo", this.classInfo);
    this.getDictionary();
  },
  computed: {
    classInfoChange(){
      // console.log('teacherSideClassInfo changed');
      return this.$store.state.currentInfo.teacherSideClassInfo;
    },
    openDrawerChange(){
        return this.$props.visible;
    },
    checkStateChange(){
        return this.$store.state.reviewInfo.checkState;
    }
  },
  watch: {
    classInfoChange: {
      deep: true,
      handler(value) {
        this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
        this.classStatus();
      },
    },
    openDrawerChange:{
        deep:true,
        handler(value){
            this.openDrawer = this.$props.visible;
        }
    },
    checkStateChange:{
        deep:true,
        handler(value){
            this.checkFeedback.message = this.$store.state.reviewInfo.message;
            this.checkFeedback.checkState = this.$store.state.reviewInfo.checkState;
        }
    }
  },
  methods: {
    //向父组件船值
    sendopenDrawer(){
        console.log('sending false to father')
        this.$emit("getData", false);
    },
    collapseHandleChange(val){
      console.log('collapseHandleChange',val);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        submitFeedback(this.classInfo.classId,this.checkFeedback.checkState).then((res)=>{
        console.log('feedback res',res);
        if(res.code == 'SUCCESS'){
          this.showCheckDialogFlag = false;
          ElMessage({
            type: "success",
            message: `提交成功`,
            duration: 1500,
          });
          this.getClassInfo();
          this.getReviewInfo();
        }
      }).catch((e)=>{
        this.showCheckDialogFlag = false;
        console.log('e',e);
        ElMessage({
            type: "error",
            message: `提交失败`,
            duration: 1500,
          });
      });
      if(this.checkFeedback.checkState == '4'){
        console.log('creating review');
        createReview(this.classInfo.classId,this.checkFeedback).then((res)=>{
          console.log('creating review res',res);
        if(res.code == 'SUCCESS'){
          ElMessage({
            type: "success",
            message: `创建审核成功`,
            duration: 1500,
          });
          this.getClassInfo();
        }
        }).catch((e)=>{
          console.log('e',e);
        })
      }
        } else {
          ElMessage({
            type: "error",
            message: `提交失败`,
            duration: 1000,
          });
          return false;
        }
      });
    },
    //获取数据字典
    getDictionary() {
      getDictionary().then((res) => {
        console.log("getDictionary", res);
        this.academicYear = res.academic_year;
        this.semester = res.semester;
        this.academicYear.forEach((year) => {
          if (year.dictValue == this.classInfo.academicYear) {
            this.classInfo.academicYear = year.dictLabel;
          }
        });
        this.semester.forEach((semester) => {
          if (semester.dictValue == this.classInfo.semester) {
            this.classInfo.semester = semester.dictLabel;
          }
        });
      });
    },
    //查询课程审核信息
    getReviewInfo(){
      getReview(this.classInfo.classId).then((res)=>{
        console.log('getReviewInfo',res);
        
        if(res.total != 0){
          this.hasNoReviewInfo = false;
          this.reviewInfo = res.rows;
        }
        else{
          this.hasNoReviewInfo = true;

        }
        
      })
    },
    //查看教学班信息
    getClassInfo() {
      getClassInfo(this.classInfo.classId).then((res) => {
        console.log("getClassInfo", res.data);
        this.$store.commit("currentInfo/setTeacherSideClassInfo", res.data);
        this.classStatus();
      });
    },
    //提交
    submit() {
      submit(this.classInfo.classId).then((res) => {
        console.log("res", res);
        if (res.code == "SUCCESS") {
          ElMessage({
            type: "success",
            message: `提交成功`,
            duration: 1000,
          });
        }
        this.getClassInfo();

      });
    },
    //确定提交状态
    classStatus() {
      switch (this.classInfo.status) {
        case "1":
          this.status = "未提交";
          break;
        case "2":
          this.status = "已提交";
          break;
        case "3":
          this.status = "已审核";
          break;
        case "4":
          this.status = "已退回";
          break;
      }
      console.log('this.status',this.status);
    },
  },
}
</script>

<style scoped>

#drawerbox .el-overlay{
  position: satic;
}
.reviewBoxStyle{
  padding-top: 100px;
}

:deep().el-overlay{
  position: static;
}

.switchstyle{
  bottom: 4px;
}
.content {
  height: 100vh;
  background-color: #f2f2f2;
}
.block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
.icon {
  cursor: pointer;
}
.block-row {
  margin-top: 18px;
}
.title {
  margin-left: 20px;
  font-size: 16px;
}
.divider {
  margin-left: 20px;
  height: 24px;
}
.body {
  display: flex;
  justify-content: center;
}
.card {
  display: flex;
  flex-direction: column;
  width: 700px;
  background: white;
  margin-top: 75px;
  padding: 0 0 20px 20px;
  margin-bottom: 30px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
.detail-title {
  color: #828eae;
  font-size: 13px;
}
.detail-info {
  margin-top: 10px;
}
.fileName {
  color: #616981;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
}
.fileName :hover {
  color: #2857e4;
}
.status_desc {
  margin-left: 10px;
  color: #616981;
}
</style>