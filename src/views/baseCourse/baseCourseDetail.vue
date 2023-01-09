<template>
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
            {{ form.remark }}
          </div>
        </el-col>
      </el-col>
    </div>
    <!-- </el-tab-pane> -->
    <!-- <el-tab-pane label="用户管理2" name="second"> -->

    <!-- </el-tab-pane> -->
    <!-- </el-tabs> -->
  </div>
</template>

<script>
import request from "@/utils/request/request";
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ElTooltip, ElMessage, ElMessageBox } from "element-plus";
import { Back, Histogram, List, Checked } from "@element-plus/icons-vue";

export default {
  name: "baseCourseDetail",
  components: {
    HeaderSearch,
    ElTooltip,
    ElMessage,
    ElMessageBox,
    addBtn,
    request,
    Back,
    Histogram,
    List,
    Checked,
  },
  data() {
    return {
      //毕业要求
      indicators: [],

      departmentId: "",
      schoolId: "",
      majorId: [],
      majorNumber: 0,
      currentMajorId: "",
      //详细信息
      detailId: "",
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
    };
  },
  mounted() {
    this.getRouter();
    this.$store.commit("course/setCourseName", this.form.courseName);
    let that = this;
    //如果没有版本信息，提示添加
    if (this.versionFlag != "已有版本信息") {
      ElMessageBox.confirm("尚未添加版本信息是否添加？", "注意", {
        confirmButtonText: "确定",
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
          if (res.code == "200") {
            ElMessageBox.alert(res.msg, "Code:" + res.code, {
              confirmButtonText: "OK",
              callback: function (action) {
                ElMessage({
                  type: "success",
                  message: `新增成功`,
                });
              },
            });
            //成功后根据vesionId和basecouseId获取详细信息
            that.isVisiable = true;
            that.getDetail();
          } else {
            ElMessageBox.alert(res.msg, "Code:" + res.code, {
              confirmButtonText: "OK",
              callback: function (action) {
                ElMessage({
                  type: "error",
                  message: `新增失败`,
                });
              },
            });
            //失败后退回basecouse页面
            that.goBaseCourse();
          }
        });
      });
    } else {
      this.isVisiable = true;
      this.getDetail();
    }
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
        console.log("getDetail:", res);
        res.rows.forEach(function (detail) {
          if (detail.versionId == that.versionId) {
            that.detailId = detail.detailId;
          }
        });
        console.log("detailId", that.detailId);
        that.$store.commit("course/setDetailId", that.detailId);
        that.getMajorId();
      });
    },
    //根据detailID获取majorId，bcdmId 第二步
    getMajorId() {
      let that = this;
      let majorList = [];
      let majorNumber = 0;
      return request({
        url: "/detailMajor/list" + "?detailId=" + this.detailId,
        method: "get",
      }).then(function (res) {
        console.log("getMajorId:", res);
        if (res.rows) {
          res.rows.forEach(function (detail) {
            majorList.push(detail.majorId);
            majorNumber++;
          });
        } else {
          majorList.push(res.data.majorId);
          majorNumber = 1;
        }
        that.majorId = majorList;
        that.majorNumber = majorNumber;
        that.showMajor();
      });
    },
    //根据majorId显示major,没有考虑其他学校中majorId会重复的问题，默认Id唯一 第三步
    showMajor() {
      let majorList = [];
      let index = 0;
      console.log("index Type:", typeof index.toString());
      if (this.majorNumber > 1) {
        this.majorId.forEach(function (major) {
          console.log("each majoId:", major);
          return request({
            url: "/major/" + major,
            method: "get",
          }).then(function (major) {
            console.log("Each Major Detail:", major);
            major.data.index = index.toString();
            majorList.push(major.data);
            index++;
          });
        });
      } else {
        return request({
          url: "/major/" + this.majorId[0],
          method: "get",
        }).then(function (major) {
          console.log("Each Major Detail:", major);
          major.data.index = index.toString();
          majorList.push(major.data);
        });
      }
      console.log("majorList", majorList);
      this.majorForm = majorList;
    },
    //路由跳转
    backBaseCourse() {
      this.$router.push("/baseCourse");
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
    //获取路由参数信息
    getRouter() {
      this.versionName = this.$route.query.versionName;
      this.versionId = this.$route.query.versionId;
      this.versionFlag = this.$route.query.versionFlag;
      this.courseId = this.$route.query.courseId;
      this.form.courseName = this.$route.query.courseName;
      this.form.courseCode = this.$route.query.courseCode;
      this.form.courseType = this.$route.query.courseType;
      this.form.courseNature = this.$route.query.courseNature;
      this.form.credit = this.$route.query.credit;
      this.form.courseYear = this.$route.query.courseYear;
      this.form.remark = this.$route.query.remark;
      this.departmentId = this.$store.state.currentInfo.departmentId;
      this.schoolId = this.$store.state.currentInfo.schoolId;
    },
  },
};
</script>

<style scoped>
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
</style>