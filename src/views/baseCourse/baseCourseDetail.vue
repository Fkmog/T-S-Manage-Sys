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
            @click="backBaseCourse()"
          >
            <Back />
          </el-icon>
        </el-tooltip>
        <div class="title">全部课程</div>
        <el-divider class="divider" direction="vertical" />
        <div class="title">{{ versionName }}</div>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="成绩项"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="22px"
            color="rgb(137, 137, 137)"
            style="margin-left: 20px"
            @click="toActivities()"
          >
            <Histogram />
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
            size="22px"
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
          content="毕业要求指标点"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="22px"
            color="rgb(137, 137, 137)"
            style="margin-left: 20px"
            @click="toIndicators()"
          >
            <List />
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
            size="22px"
            color="rgb(137, 137, 137)"
            style="margin-left: 15px"
            @click="toTemplate()"
          >
            <Management />
          </el-icon>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="从其他大纲复制"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="22px"
            color="rgb(137, 137, 137)"
            style="margin-left: 20px"
            @click="openDrawer()"
          >
            <CopyDocument />
          </el-icon>
        </el-tooltip>
      </el-row>
    </div>
    <div class="body">
      <!-- <el-tabs class="tabs" type="border-card" v-model="activeName"> -->
      <!-- <el-tab-pane label="用户管理" name="first"> -->
      <div class="card">
        <h3>课程信息</h3>
        <el-col>
          <el-col style="margin-top: 15px">
            <div class="detail-title">课程名</div>
            <div class="detail-info" style="margin-top: 10px">
              {{ form.courseName }}
            </div>
          </el-col>
          <el-row style="margin-top: 15px">
            <el-col :span="12" style="margin-top: 10px">
              <div class="detail-title">课程号</div>
              <div class="detail-info" style="margin-top: 10px">
                {{ form.courseCode }}
              </div>
            </el-col>
            <el-col :span="6" style="margin-top: 10px">
              <div class="detail-title">学分</div>
              <div class="detail-info" style="margin-top: 10px">
                {{ form.credit }}
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="12" style="margin-top: 10px">
              <div class="detail-title">课程类型</div>
              <div class="detail-info" style="margin-top: 10px">
                {{ form.courseNature }}
              </div>
            </el-col>
            <el-col :span="6" style="margin-top: 10px">
              <div class="detail-title">选课类型</div>
              <div class="detail-info" style="margin-top: 10px">
                {{ form.courseType }}
              </div>
            </el-col>
          </el-row>
          <el-col style="margin-top: 25px">
            <div class="detail-title">备注</div>
            <div class="detail-info" style="margin-top: 10px">
              <!-- {{ form.remark }} -->
            </div>
          </el-col>
          <el-col style="margin-top: 45px">
            <el-row>
              <el-col class="detail-title">课程大纲</el-col>
              <el-col :span="6">
                <el-upload
                  v-show="!hasFile"
                  class="upload-demo"
                  :action="action"
                  :data="data"
                  :headers="headers"
                  accept=".doc,.docx,.pdf,.rar,.zip"
                  :file-list="fileList"
                  :limit="1"
                  show-file-list
                  name="files"
                  :on-success="uploadSuccess"
                  :on-exceed="uploadExceed"
                  :on-remove="uploadRemove"
                >
                  <el-button size="small" type="primary"
                    >上传课程大纲</el-button
                  >
                </el-upload>
              </el-col>
              <el-col>
                <el-table
                  v-show="hasFile"
                  :data="filesList"
                  style="cursor: pointer; margin-top: 10px; width: 225px"
                  :show-header="false"
                  @row-click="downloadFile"
                >
                  <el-table-column
                    prop="originalName"
                    label="文件名"
                    width="180px"
                  />
                  <el-table-column width="45px">
                    <template #default="scope">
                      <el-tooltip content="移除" :hide-after="0">
                        <el-button
                          link
                          style="color: #3f51b5"
                          @click.stop="beforeRemove(scope.row)"
                          ><el-icon><CircleClose /></el-icon
                        ></el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <!-- <el-col :span="6" v-show="hasFile" class="fileName">
                <el-row>
                  <el-col :span="20" @click="downloadFile">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="点击下载"
                      placement="bottom"
                      :hide-after="0"
                    >
                      {{ object.fileName }}
                    </el-tooltip>
                  </el-col>
                  <el-col :span="4" @click="beforeRemove" class="fileCloseIcon">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="点击移除"
                      placement="bottom"
                      :hide-after="0"
                    >
                      <el-icon><CircleClose /></el-icon> </el-tooltip
                  ></el-col>
                </el-row>
              </el-col> -->
            </el-row>
          </el-col>
        </el-col>
      </div>
    </div>
    <!-- 右侧复制抽屉 -->
    <el-drawer v-model="drawer" :modal="true">
      <el-row>
        <el-col :span="14">
          <DrawerSearch
            msg="搜索课程名称、课程号"
            @SearchValue="getSearchValue"
          />
        </el-col>
        <el-col :span="10">
          <el-select
            v-model="version"
            placeholder="选择课程大纲版本"
            clearable
            @change="getEditDetail()"
          >
            <el-option
              v-for="version in versionList"
              :key="version.versionId"
              :label="version.versionName"
              :value="version.versionId"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 40px">
        <el-table
          :data="copyCourseList"
          style="width: 100%"
          @row-click="copyDetail"
        >
          <el-table-column prop="courseName" label="课程名" min-width="180px" />
          <el-table-column prop="courseCode" label="课程号" min-width="180px" />
          <el-table-column prop="versionName" label="版本" min-width="180px" />
        </el-table>
      </el-row>
      <!-- 分页 -->
      <div class="pagination-container" flex>
        <div class="loadMore">
          <el-button link plain v-show="showLoadmore" @click="loadMore()"
            >加载更多</el-button
          >
        </div>
      </div>
    </el-drawer>

    <!-- 复制弹窗 -->
    <el-dialog v-model="dialogVisible" title="从其他大纲复制" width="400px">
      <el-row style="margin-bottom: 20px; font-size: 15px"
        >从《{{ currentRow.courseName }}》{{
          currentRow.versionName
        }}大纲复制以下内容：</el-row
      >
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="成绩项"></el-checkbox>
        <el-checkbox label="课程目标"></el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="copyInfo()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request/request";
import addBtn from "@/components/general/addBtn.vue";
import { ElTooltip, ElMessage, ElMessageBox } from "element-plus";
import {
  Back,
  Histogram,
  List,
  Checked,
  CircleClose,
  CopyDocument,
  Management,
} from "@element-plus/icons-vue";
import Cookies from "js-cookie";
import {
  getObjectives,
  downloadDetail,
  getEditDetail,
  getVersion,
  getFilesList,
  copyActAndObj,
} from "@/api/basecourse";
import DrawerSearch from "@/components/general/drawerSearch.vue";
import { downloadFileId, downloadFile, removeFileId } from "@/api/common";

export default {
  name: "baseCourseDetail",
  components: {
    DrawerSearch,
    CopyDocument,
    ElTooltip,
    ElMessage,
    ElMessageBox,
    addBtn,
    request,
    Back,
    Histogram,
    List,
    Checked,
    CircleClose,
    Management,
  },
  data() {
    return {
      from:'',
      filesList: [],
      checkList: ["成绩项", "课程目标"],
      currentRow: {},
      copyCourseList: [],
      keyword: "",
      dialogVisible: false,
      versionList: [],
      version: "",
      drawer: false,
      //上传文件
      fileList: [],
      headers: {
        Authorization: "Bearer " + Cookies.get("Admin-Token"),
      },
      action: "",
      data: [],
      //毕业要求
      indicators: [],
      departmentId: "",
      schoolId: "",
      majorId: [],
      majorNumber: 0,
      currentMajorId: "",
      //详细信息
      detailId: "",
      object: [],
      hasFile: false,
      courseId: "",
      //版本信息
      versionName: "",
      versionId: "",
      versionFlag: "",
      //basecouse基本信息
      form: {
        courseName: "",
        courseCode: "",
        courseType: "",
        courseNature: "",
        credit: "",
        courseYear: "",
        remark: "",
      },
      //majorinformation
      majorForm: [],
      pageSize: 20,
      pageNum: 1,
      total: 0,
      showLoadmore: false,
    };
  },
  mounted() {
    this.getRouter();
    this.$store.commit("course/setCourseName", this.form.courseName);
    this.$store.commit("course/setCourseId", this.courseId);

    let that = this;
    //如果没有版本信息，提示添加
    if (!this.versionFlag) {
      ElMessageBox.confirm("尚未添加版本信息是否添加？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log("versionId", that.versionId, "CourseId", that.courseId);
        return request({
          url: "/detail",
          method: "post",
          data: {
            versionId: that.versionId,
            courseId: that.courseId,
            departmentId: that.departmentId,
            schoolId: that.schoolId,
          },
        }).then(function (res) {
          console.log(res);
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `新建成功`,
              duration: 1500,
            });
            //成功后根据vesionId和basecouseId获取详细信息
            that.isVisiable = true;
            that.getDetail();
          } else {
            ElMessage({
              type: "error",
              message: `新建失败`,
              duration: 1500,
            });
            //失败后退回basecouse页面
            that.goBaseCourse();
          }
        });
      });
    } else {
      this.isVisiable = true;
      this.getDetail();
      this.checkVersion();
    }
    console.log('router from', this.$route.query['parentName']);
      if( this.$route.query['parentName'] == 'courseInMajor'){
          this.from = this.$route.query['parentName'];
      }
      else{
        this.from = '';
      }
      console.log('from',this.from);
  },
  methods: {
    //获取学校和部门ID
    //根据versionId和courseId来获取detailId 第一步
    getDetail() {
      let that = this;
      return request({
        url:
          "/detail/list" +
          "?vesionId=" +
          this.versionId +
          "&courseId=" +
          this.courseId,
        method: "get",
      }).then(function (res) {
        // console.log("getDetail:", res);
        res.rows.forEach(function (detail) {
          if (detail.versionId == that.versionId) {
            that.detailId = detail.detailId;
          }
        });
        // console.log("detailId", that.detailId);
        let array = [];
        let obj = {};
        obj.param = that.detailId;
        obj.type = "syllabusFile";
        array.push(obj);
        that.action = "http://81.68.103.96:8080/common/upload/files";
        that.data = array[0];
        that.$store.commit("course/setDetailId", that.detailId);
        that.checkFileList();
      });
    },
    //路由跳转
    backBaseCourse() {
      console.log("from:", this.from);
      if (this.from == "courseInMajor") {
        this.$store.commit("navInfo/setActiveDisplay2", 1);

        this.$router.push("/courses");
      } else {
        this.$router.push("/baseCourse");
      }
    },
    toActivities() {
      this.$router.push("/baseCourseActivities");
    },
    toIndicators() {
      this.$router.push("/baseCourseIndicators");
    },
    toObjectives() {
      this.$router.push("/baseCourseObjectives");
    },
    toTemplate() {
      this.$router.push("/templateManage");
    },
    //获取路由参数信息
    getRouter() {
      this.versionName = this.$store.state.course.baseCourseVersionName;
      this.versionId = this.$store.state.course.baseCourseVersionId;
      this.versionFlag = this.$store.state.course.baseCourseVersionFlag;
      this.courseId = this.$store.state.course.baseCourseCourseId;
      this.form.courseName = this.$store.state.course.baseCourseCourseName;
      this.form.courseCode = this.$store.state.course.baseCourseCourseCode;
      this.form.courseType = this.$store.state.course.baseCourseCourseType;
      this.form.courseNature = this.$store.state.course.baseCourseCourseNature;
      this.form.credit = this.$store.state.course.baseCourseCredit;
      this.form.courseYear = this.$store.state.course.baseCourseCourseYear;
      this.form.remark = this.$store.state.course.baseCourseRemark;
      this.departmentId = this.$store.state.currentInfo.departmentId;
      this.schoolId = this.$store.state.currentInfo.schoolId;
    },
    //查询版本信息
    checkVersion() {
      getVersion().then((res) => {
        console.log("checkVersion", res);
        this.versionList = res.data;
      });
    },
    //上传成功
    uploadSuccess(response, file, fileList) {
      console.log("response", response, file, "file", fileList, "fileList");
      if (response.code == "SUCCESS") {
        ElMessage({
          type: "success",
          message: `上传成功`,
          duration: 1500,
        });
        this.checkFileList();
      }
    },
    //文件上传数量限制
    uploadExceed() {
      ElMessage({
        type: "warning",
        message: `最多上传一个文件`,
        duration: 1500,
      });
    },
    //移除文件前
    beforeRemove(row) {
      ElMessageBox.confirm(`确认移除课程大纲文件？`, "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.fileList = [];
          this.uploadRemove(row);
        })
        .catch(() => {});
    },
    // 移除文件
    uploadRemove(row) {
      console.log("xcxscsdd", row);
      removeFileId(row.fileId).then((res) => {
        console.log("removeDetail", res);
        if (res.code === "SUCCESS") {
          ElMessage({
            type: "success",
            message: `删除成功`,
            duration: 1500,
          });
          this.checkFileList();
        }
      });
    },
    //文件上传钩子前
    beforeUpload(file) {
      if (file.size === 0) {
        return ElMessage({
          type: "warning",
          message: `文件不能为空`,
          duration: 1500,
        });
      }
    },

    //查看课程大纲文件列表
    checkFileList() {
      getFilesList(this.detailId).then((res) => {
        this.filesList = res.data;
        if (this.filesList.length == 0) {
          this.hasFile = false;
        } else {
          this.hasFile = true;
        }
      });
    },
    //下载文件
    downloadFile(row) {
      downloadFile(row.fileAddress).then((res) => {
        // console.log("downloadFile", res);
        const blob = new Blob([res]);
        // console.log("blob", blob);
        // saveAs(blob, this.objectInfo.fileName)
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
    //唤起抽屉
    openDrawer() {
      this.drawer = true;
      this.getEditDetail();
    },
    //选中被复制对象
    copyDetail(row) {
      console.log("copyDetail", row);
      this.currentRow = row;
      // 唤起弹窗
      this.dialogVisible = true;
    },
    //查询可复制的课程
    getEditDetail() {
      getEditDetail(
        this.keyword,
        this.version,
        this.pageSize,
        this.pageNum
      ).then((res) => {
        console.log("getEditDetail", res);
        this.copyCourseList = res.rows;
        this.total = res.total;
        if (this.pageSize >= res.total) {
          this.showLoadmore = false;
        } else {
          this.showLoadmore = true;
        }
      });
    },
    //加载更多
    loadMore() {
      if (this.total - this.pageSize >= 20) {
        this.pageSize += 20;
        this.getEditDetail();
      } else {
        this.pageSize += this.total - this.pageSize;
        this.getEditDetail();
      }
    },
    //搜索栏搜索
    getSearchValue(data) {
      this.keyword = data;
      this.getEditDetail();
    },
    //复制
    copyInfo() {
      let obj = {};
      obj.sourceDetailId = this.currentRow.detailId;
      obj.targetDetailId = this.detailId;
      // 确定需要复制的内容
      if (this.checkList.indexOf("成绩项") !== -1) {
        obj.isCopyActivities = 1;
      } else {
        obj.isCopyActivities = 0;
      }
      if (this.checkList.indexOf("课程目标") !== -1) {
        obj.isCopyObjectives = 1;
      } else {
        obj.isCopyObjectives = 0;
      }
      copyActAndObj(obj).then((res) => {
        console.log("copyActAndObj", res);
        this.dialogVisible = false;
        if (res.code == "SUCCESS") {
          ElMessage({
            type: "success",
            message: `复制成功`,
            duration: 1500,
          });
          this.drawer = false;
        }
      });
    },
  },
};
</script>

<style scoped>
/* .content {
  height: 100vh;
  background-color: #f2f2f2;
} */
/* 顶部导航栏 */
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
/* 卡片 */
.body {
  display: flex;
  justify-content: center;
}
.card {
  display: flex;
  flex-direction: column;
  width: 750px;
  background: white;
  padding: 0 0 10px 10px;
  margin-bottom: 20px;
  margin-top: 100px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  padding: 0 0 20px 20px;
}

.detail-title {
  color: #828eae;
  font-size: 13px;
}
.detail-info {
  margin-top: 5px;
}
.upload-demo {
  margin-top: 15px;
}
.fileName {
  color: #616981;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
}

.fileCloseIcon {
  opacity: 0;
}
.fileName:hover .fileCloseIcon {
  opacity: 1;
}
.loadMore {
  display: flex;
  justify-content: center;
  padding-top: 24px;
  padding-bottom: 24px;
}
</style>
