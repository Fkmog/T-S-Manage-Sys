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
        <el-tooltip
          class="box-item"
          effect="dark"
          content="工作手册"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="24px"
            color="rgb(137, 137, 137)"
            style="margin-left: 20px"
            @click="toWorkbook()"
          >
            <Management />
          </el-icon>
        </el-tooltip>
        <!-- <el-tooltip
          class="box-item"
          effect="dark"
          content="下载报告"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="24px"
            color="rgb(137, 137, 137)"
            style="margin-left: 20px"
            @click="downloadReport()"
          >
            <Download />
          </el-icon>
        </el-tooltip> -->

        <el-divider class="divider" direction="vertical" />
        <div v-show="status == '未提交' && identity == '教师'">
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
        <div
          v-show="
            status == '未提交' &&
            (identity == '学院管理员' || identity == '课程负责人')
          "
          class="status_desc"
        >
          未提交
        </div>
        <div
          v-show="status == '已提交' && identity == '教师'"
          class="status_desc"
        >
          已提交
        </div>
        <div
          v-show="
            status == '已提交' &&
            (identity == '学院管理员' || identity == '课程负责人')
          "
          class="status_desc"
        >
          待审核
        </div>
        <div v-show="status == '已退回' && identity == '教师'">已退回</div>
        <div v-show="status == '已退回' && identity == '教师'">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="重新提交"
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
        <div
          v-show="
            status == '已退回' &&
            (identity == '学院管理员' || identity == '课程负责人')
          "
        >
          已退回
        </div>
        <div v-show="status == '已审核'">已审核</div>
        <el-divider class="divider" direction="vertical" />
        <el-tooltip
          class="box-item"
          effect="dark"
          content="审核意见"
          placement="bottom"
          :hide-after="0"
        >
          <el-switch
            v-model="openDrawer"
            class="switchstyle"
            ref="switch"
            @change="openDrawerChange"
          />
        </el-tooltip>
      </el-row>
    </div>
    <div class="body">
      <div class="card">
        <h3>课程信息</h3>
        <el-col>
          <el-row style="margin-top: 15px">
            <el-col :span="12">
              <div class="detail-title">课程名</div>
              <div class="detail-info">{{ classInfo.className }}</div>
            </el-col>
            <el-col :span="12" style="margin-top:25px;cursor:default" v-show="classInfo.isRespondent == 2">
              <el-tooltip   placement="top" content="允许任课教师修改考核方式" :hide-after="0">
                <el-tag>特色班</el-tag>
              </el-tooltip>
            </el-col>
          </el-row>

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

              <el-col>
                <el-table
                  v-show="hasFile"
                  :data="filesList"
                  style="cursor: pointer; margin-top: 10px; width: 180px"
                  :show-header="false"
                  @row-click="downloadFile"
                >
                  <el-table-column
                    prop="originalName"
                    label="文件名"
                    width="180px"
                  />
                </el-table>
              </el-col>
            </el-row>
          </el-col>
        </el-col>
      </div>
    </div>
  </div>
  <reviewDrawer v-bind:visible="openDrawer" @getData="getdata" />
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
  Management,
} from "@element-plus/icons-vue";
import { submit, getClassInfo, downloadReport } from "@/api/class";
import { getDictionary } from "@/api/dictionary";
import reviewDrawer from "@/components/teacherClass/reviewDrawer.vue";
import { getFilesList } from "@/api/basecourse";
import { downloadFile } from "@/api/common";

import {
  ElMessageBox,
  ElMessage,
  ElDialog,
  ElForm,
  ElSwitch,
  ElDrawer,
  ElCollapse,
} from "element-plus";

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
    Management,
    ElSwitch,
    ElDrawer,
    ElCollapse,
    reviewDrawer,
  },
  data() {
    return {
      isRespondent: "",

      reviewInfo: [],
      activeNames: "",
      openDrawer: false,
      hasNoReviewInfo: Boolean,
      checkStates: [
        { label: "审核通过", value: "3" },
        { label: "退回", value: "4" },
      ],
      selectedCheckState: "",
      checkFeedback: {
        message: "",
        checkState: "",
        workNumber: "",
      },
      checkFeedbackRules: {
        checkState: [{ required: true, trigger: "blur" }],
      },
      showCheckDialogFlag: false,
      identity: "",
      classInfo: {},
      academicYear: [],
      semester: [],
      hasFile: false,
      objectInfo: [],
      status: "",
    };
  },
  mounted() {
    sessionStorage.setItem("classSearchFlag", true);
    sessionStorage.setItem("classTeacherSearchFlag", true);
    this.identity = this.$store.state.currentInfo.identity;
    this.openDrawer = this.$store.state.currentInfo.opendrawer;
    // if(sessionStorage.getItem("teacherClassOpenDrawer")){
    //   this.openDrawer = sessionStorage.getItem("teacherClassOpenDrawer");
    //   // this.$refs.switch['checked']=true;
    //   // console.log('this.$refs.switch',this.$refs.switch['checked']);
    //   // this.$refs.switch
    // }

    if (this.identity == "学院管理员") {
      this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
      console.log("identity:", this.identity);
    } else if (this.identity == "课程负责人") {
      this.classInfo = this.$store.state.currentInfo.respondClassInfo;
      console.log("identity:", this.identity);
    } else {
      this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
      console.log("identity:", this.identity);
    }
    this.getClassInfo();
    this.checkFileList();
  },
  computed: {
    teacherInfoChange() {
      // console.log('teacherSideClassInfo changed');
      return this.$store.state.currentInfo.teacherSideClassInfo;
    },
    respondInfoChange() {
      // console.log('teacherSideClassInfo changed');
      return this.$store.state.currentInfo.respondClassInfo;
    },
  },
  watch: {
    teacherInfoChange: {
      deep: true,
      handler(value) {
        if (this.identity == "教师") {
          this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
          this.classStatus();
        }
      },
    },
    respondInfoChange: {
      deep: true,
      handler(value) {
        if (this.identity == "课程负责人") {
          this.classInfo = this.$store.state.currentInfo.respondClassInfo;
          this.classStatus();
        }
      },
    },
  },
  methods: {
    //提交
    submit() {
      // console.log("submit", this.status, this.identity);
      if (this.status == "已退回" && this.identity == "教师") {
        ElMessageBox.confirm("是否已按照审核意见进行修改?", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            submit(this.classInfo.classId)
              .then((res) => {
                console.log("res", res);
                if (res.code == "SUCCESS") {
                  ElMessage({
                    type: "success",
                    message: `提交成功`,
                    duration: 1500,
                  });
                }
                this.getClassInfo();
              })
              .catch((e) => {
                if (e.data.code === "conflict") {
                  ElMessage({
                    type: "error",
                    message: `成绩或工作手册尚未填写完整`,
                    duration: 1500,
                  });
                } else if (e.status === 500) {
                  ElMessage({
                    type: "error",
                    message: `提交出错，请检查填写的内容`,
                    duration: 1500,
                  });
                } else {
                  ElMessage({
                    type: "error",
                    message: `未知错误,请联系相关人员`,
                    duration: 1500,
                  });
                }
                this.getClassInfo();
              });
          })
          .catch((e) => {
            console.log("e", e);
          });
      } else {
        ElMessageBox.confirm(
          "请确保已录入完整的成绩和工作手册",
          "是否确认提交",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            submit(this.classInfo.classId)
              .then((res) => {
                console.log("res", res);
                if (res.code == "SUCCESS") {
                  ElMessage({
                    type: "success",
                    message: `提交成功`,
                    duration: 1500,
                  });
                }
                this.getClassInfo();
              })
              .catch((e) => {
                if (e.data.code === "conflict") {
                  ElMessage({
                    type: "error",
                    message: `成绩或工作手册尚未填写完整`,
                    duration: 1500,
                  });
                } else if (e.status === 500) {
                  ElMessage({
                    type: "error",
                    message: `提交出错，请检查填写的内容`,
                    duration: 1500,
                  });
                } else {
                  ElMessage({
                    type: "error",
                    message: `未知错误,请联系相关人员`,
                    duration: 1500,
                  });
                }
                this.getClassInfo();
              });
          })
          .catch((e) => {
            console.log("e", e);
          });
      }
    },
    openDrawerChange() {
      // console.log("setting opendrawer");
      this.$store.commit("currentInfo/setOpenDrawer", this.openDrawer);
      // console.log(
      //   "currentInfo/setOpenDrawer",
      //   this.$store.state.currentInfo.opendrawer
      // );
      // sessionStorage.setItem("teacherClassOpenDrawer",this.openDrawer);
    },
    getdata(val) {
      this.openDrawer = val;
    },
    //返回教师端首页
    backHome() {
      if (this.identity == "学院管理员" || this.identity == "课程负责人") {
        this.$router.push("/class");
      } else {
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
    //跳转编辑工作手册页面
    toWorkbook() {
      this.$router.push({
        name: "Workbook",
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
        if (this.identity == "教师") {
          this.$store.commit("currentInfo/setTeacherSideClassInfo", res.data);
          this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
          this.isRespondent = this.classInfo.isRespondent;
        } else if (this.identity == "课程负责人") {
          this.$store.commit("currentInfo/setRespondClassInfo", res.data);
          this.classInfo = this.$store.state.currentInfo.respondClassInfo;
        } else {
          this.$store.commit("currentInfo/setadminSideClassInfo", res.data);
          this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
        }
        this.getDictionary();
        this.classStatus();
      });
    },
    //查看课程大纲文件列表
    checkFileList() {
      // TODO:detailId可能为null 还没处理
      if (this.classInfo.detailId) {
        getFilesList(this.classInfo.detailId).then((res) => {
          this.filesList = res.data;
          if (this.filesList.length == 0) {
            this.hasFile = false;
          } else {
            this.hasFile = true;
          }
        });
      }
    },
    //下载课程大纲文件
    downloadFile(row) {
      downloadFile(row.fileAddress).then((res) => {
        // console.log("downloadFile", res);
        const blob = new Blob([res]);
        // console.log("blob",blob);
        const link = document.createElement("a");
        link.download = decodeURI(row.originalName);
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
    },
    //确定提交状态
    classStatus() {
      // console.log("this.classInfo.status", this.classInfo.status);
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
      // console.log("this.status", this.status);
    },
    // 下载报告
    downloadReport() {
      downloadReport(this.classInfo.classId).then((res) => {
        console.log("下载报告", res);
        // console.log("downloadFile", res);
        const blob = new Blob([res]);
        // console.log("blob", blob);
        // saveAs(blob, this.objectInfo.fileName)
        const link = document.createElement("a");
        link.download = decodeURI("报告.doc");
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
    },
  },
};
</script>

<style scoped>
.reviewBoxStyle {
  padding-top: 100px;
}
:deep().el-overlay {
  position: static;
}
.switchstyle {
  bottom: 4px;
}
/* .content {
  height: 100vh;
  background-color: #f2f2f2;
} */
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
