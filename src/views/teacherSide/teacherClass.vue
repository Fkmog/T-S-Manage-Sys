<template>
  <div class="content">
    <!-- 顶部导航栏 -->
    <div class="block">
      <el-row class="block-row">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="返回"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="24px"
            color="rgb(137, 137, 137)"
            style="margin-left: 50px"
            @click="backHome()"
          >
            <Back />
          </el-icon>
        </el-tooltip>
        <div class="title">全部课程</div>
        <el-divider class="divider" direction="vertical" />
        <el-tooltip
          class="box-item"
          effect="dark"
          content="成绩"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="24px"
            color="rgb(137, 137, 137)"
            style="margin-left: 20px"
            @click="toScore()"
          >
            <TrendCharts />
          </el-icon>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="课程目标"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="24px"
            color="rgb(137, 137, 137)"
            style="margin-left: 20px"
            @click="toObjectives()"
          >
            <Checked />
          </el-icon>
        </el-tooltip>
        <el-divider class="divider" direction="vertical" />
        <div v-show="status == '未提交' && identity != '学院管理员'">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="提交"
            placement="bottom"
            :hide-after="0"
          >
            <el-icon
              class="icon"
              size="24px"
              color="rgb(137, 137, 137)"
              style="margin-left: 10px"
              @click="submit()"
            >
              <UploadFilled />
            </el-icon>
          </el-tooltip>
        </div>
        <div v-show="status == '未提交' && identity == '学院管理员'" class="status_desc">未提交</div>
        <div v-show="status == '已提交' && identity != '学院管理员'" class="status_desc">已提交</div>
        <div v-show="status == '已提交' && identity == '学院管理员'" class="status_desc">
          <el-tooltip
          class="box-item"
          effect="dark"
          content="审核"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="24px"
            color="rgb(137, 137, 137)"
            style="margin-left: 20px"
            @click="this.showCheckDialogFlag = true"
          >
          <Finished />
          </el-icon>
        </el-tooltip>
        </div>
        <div v-show="status == '已退回'">已退回</div>
        <div v-show="status == '已审核'">已审核</div>
      </el-row>
    </div>
    <div class="body">
      <div class="card">
        <h3>课程信息</h3>
        <el-col>
          <el-col style="margin-top: 15px">
            <div class="detail-title">课程名</div>
            <div class="detail-info">{{ classInfo.courseName }}</div>
          </el-col>
          <el-row style="margin-top: 15px">
            <el-col :span="12" style="margin-top: 10px">
              <div class="detail-title">课程号</div>
              <div class="detail-info">{{ classInfo.courseCode }}</div>
            </el-col>
            <el-col :span="12" style="margin-top: 10px">
              <div class="detail-title">开课号</div>
              <div class="detail-info">{{ classInfo.identifier }}</div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="12" style="margin-top: 10px">
              <div class="detail-title">学年</div>
              <div class="detail-info">{{ classInfo.academicYear }}</div>
            </el-col>
            <el-col :span="6" style="margin-top: 10px">
              <div class="detail-title">学期</div>
              <div class="detail-info">{{ classInfo.semester }}</div>
            </el-col>
          </el-row>
          <el-col style="margin-top: 25px">
            <el-row>
              <el-col class="detail-title">课程大纲</el-col>

              <el-col :span="6" v-show="hasFile">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="点击下载"
                  placement="bottom"
                  :hide-after="0"
                >
                  <el-col class="fileName" @click="downloadFile">{{
                    objectInfo.fileName
                  }}</el-col>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-col>
        </el-col>
      </div>
    </div>
  </div>

  <el-dialog v-model="showCheckDialogFlag">
    <span>
      评审反馈：
     </span>
     

     <el-form :model="checkFeedback">
      <el-form-item  label="审核是否通过：" :label-width="140" prop="checkState" >
        <el-select v-model="checkFeedback.checkState">
          <el-option v-for="state in checkStates" :key="state" :value="state" :label="state">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="反馈内容：" :label-width="140" prop="message">
          <el-input v-model="checkFeedback.message" autocomplete="off"  type="textarea" />
      </el-form-item>
      <el-form-item  label="反馈人：" :label-width="140" prop="workNumber">
        {{ checkFeedback.workNumber }}
      </el-form-item>
     </el-form>


     <template #footer>
            <span class="dialog-footer">
              <el-button @click="showCheckDialogFlag = false">取消</el-button>
              <el-button type="primary" @click="submitFeedback">
                提交反馈
              </el-button>
            </span>
      </template>
  </el-dialog>
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
} from "@element-plus/icons-vue";
import { submit, getClassInfo } from "@/api/class";
import { getDictionary } from "@/api/dictionary";
import { getObjectives, downloadDetail } from "@/api/basecourse";
import { ElMessageBox, ElMessage , ElDialog , ElForm} from "element-plus";

export default {
  name: "TeacherClass",
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
  },
  data() {
    return {
      checkStates:['审核通过','退回'],
      selectedCheckState:'',
      checkFeedback:{
        message:'',
        checkState:'',
        workNumber:'',
      },
      showCheckDialogFlag:false,
      identity:'',
      classInfo: {},
      academicYear: [],
      semester: [],
      hasFile: false,
      objectInfo: [],
      status: "",
    };
  },
  mounted() {
    this.identity = this.$store.state.currentInfo.identity;
    if(this.identity == '学院管理员'){
      this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
      console.log('identity:',this.identity);
    }
    else{
    this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
    console.log('identity:',this.identity);
    }
    this.classStatus();
    console.log("classInfo", this.classInfo);
    this.getDictionary();
    this.getFile();
   
  },
  methods: {
    //提交反馈信息
    submitFeedback(){
      // return request({
      //   url:,
      //   method:,
      //   data:,
      // })
    },
    //返回教师端首页
    backHome() {
      if(this.identity == '学院管理员'){
        this.$router.push("/class");
      }
      else{
        this.$router.push("/teacherClasses");
      }
      
    },
    // 跳转学生页面
    toStudents() {
      this.$router.push({
        name: "Students",
      });
    },
    // 跳转成绩页面
    toScore() {
      
      this.$router.push({
        name: "Score",
      });
    },
    // 跳转课程目标页面
    toObjectives() {
      this.$router.push({
        name: "Objectives",
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
    //查看教学班信息
    getClassInfo() {
      getClassInfo(this.classInfo.classId).then((res) => {
        console.log("getClassInfo", res.data);
        this.$store.commit("currentInfo/setTeacherSideClassInfo", res.data);
        this.classStatus()
      });
    },
    //查看有无课程大纲文件
    getFile() {
      getObjectives(this.classInfo.detailId).then((res) => {
        console.log("getObjectives", res);
        this.objectInfo = res.data;
        if (
          !(res.data.syllabusFileId === null || res.data.syllabusFileId === 0)
        ) {
          this.hasFile = true;
        } else {
          this.hasFile = false;
        }
      });
    },
    //下载课程大纲文件
    downloadFile() {
      downloadDetail(this.classInfo.detailId).then((res) => {
        // console.log("downloadFile", res);
        const blob = new Blob([res]);
        // console.log("blob",blob);
        // saveAs(blob, this.objectInfo.fileName)
        const link = document.createElement("a");
        link.download = decodeURI(this.objectInfo.fileName);
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
    },
    //提交
    submit() {
      submit(this.classInfo.classId).then((res) => {
        console.log("res", res);
        if(res.code =="SUCCESS"){
           ElMessage({
              type: "success",
              message: `提交成功`,
              duration: 1000,
            });
        }
        this.getClassInfo();
        // this.
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
    },
  },
};
</script>

<style scoped>
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
