<template>
  <div class="content">
    <!-- 顶部导航栏 -->
    <div class="block">
      <el-row class="block-row">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="从其他培养方案复制"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="22px"
            color="rgb(137, 137, 137)"
            style="margin-left: 70px"
            @click="openDrawer()"
          >
            <CopyDocument />
          </el-icon>
        </el-tooltip>
      </el-row>
    </div>

    <div class="body-check">
      <div class="card">
        <el-row class="all_block">
          <el-col class="body_block">
            <el-col class="title">专业</el-col>
            <el-col class="detail">{{ currentMajorName }}</el-col>
          </el-col>
          <el-col>
            <el-col class="title">年级</el-col>
            <el-col class="detail">{{ currentYear }} </el-col>
          </el-col>
          <el-col> </el-col>
        </el-row>
      </div>
    </div>
  </div>
  <!-- 右侧复制抽屉 -->
  <el-drawer v-model="drawer">
    <el-row>
      <el-col :span="14">
        <DrawerSearch msg="搜索专业名称" @SearchValue="getSearchValue" />
      </el-col>
      <el-col :span="10">
        <el-select
          v-model="year"
          placeholder="选择培养方案版本"
          clearable
          @change="getCopyProgram()"
        >
          <el-option
            v-for="year in enroll_year"
            :key="year.dictValue"
            :label="year.dictLabel"
            :value="year.dictLabel"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top: 40px">
      <el-table :data="programList" style="width: 100%" @row-click="copy">
        <el-table-column prop="majorName" label="专业名称" min-width="180px" />
        <el-table-column prop="enrollyear" label="版本" min-width="180px" />
      </el-table>
    </el-row>
  </el-drawer>
  <!-- 复制弹窗 -->
  <el-dialog v-model="dialogVisible" title="从其他大纲复制" width="400px">
    <el-row style="margin-bottom: 20px; font-size: 15px"
      >从《{{ currentRow.majorName }}》{{ currentRow.enrollyear }} 级
      培养方案复制以下内容：</el-row
    >
    <el-checkbox-group v-model="checkList">
      <el-checkbox label="毕业要求和指标点"></el-checkbox>
      <el-checkbox label="课程体系"></el-checkbox>
      <el-checkbox label="达成度"></el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import DrawerSearch from "@/components/general/drawerSearch.vue";
import { searchProgram, checkProgram } from "@/api/program";
import { getDictionary } from "@/api/dictionary";
import { copyProgram } from "@/api/basecourse";
import { ElMessage, ElMessageBox } from "element-plus";
import { addProgram } from "@/api/program";
import { List, CopyDocument } from "@element-plus/icons-vue";
export default {
  name: "Setting",
  components: {
    DrawerSearch,
    CopyDocument,
    List,
  },
  data() {
    return {
      programId: "",
      year: "",
      enroll_year: [],
      checkList: ["毕业要求和指标点", "课程体系", "达成度"],
      currentRow: [],
      programList: [],
      keyword: "",
      drawer: false,
      dialogVisible: false,
      currentMajorId: "",
      currentMajorName: "",
      departmentId: "",
      schoolId: "",
      currentYear: "",
      noProgram: Boolean,
    };
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
        this.currentYear = this.$store.state.currentInfo.year;
        this.checkProgram();
      },
    },
  },
  mounted() {
    this.currentMajorId = this.$store.state.major.majorId;
    this.currentMajorName = this.$store.state.major.majorName;
    this.currentYear = this.$store.state.currentInfo.year;
    this.departmentId = this.$store.state.currentInfo.departmentId;
    this.schoolId = this.$store.state.currentInfo.schoolId;
    this.getDictionary();
    this.checkProgram();
  },
  methods: {
    //获取数据字典
    getDictionary() {
      getDictionary().then((res) => {
        console.log("getDictionary", res);
        this.enroll_year = res.enroll_year;
      });
    },
    //查询培养计划
    checkProgram() {
      checkProgram(this.currentMajorId, this.currentYear)
        .then((res) => {
          console.log("checkProgram", res);
          this.programId = res.data.programId;
          console.log("@", this.programId);
          this.noProgram = false;
        })
        .catch((e) => {
          if (e.code === "PROGRAM_NOT_FIND" && e.msg === "资源不存在") {
            this.noProgram = true;
          }
        });
    },
    // 唤起抽屉
    openDrawer() {
      this.drawer = true;
      // 打开时默认进行一次搜索
      this.getCopyProgram();
    },
    //搜索栏搜索
    getSearchValue(data) {
      this.keyword = data;
      this.getCopyProgram();
    },
    // 查询对应的专业
    getCopyProgram() {
      searchProgram(
        this.schoolId,
        this.departmentId,
        this.keyword,
        this.year
      ).then((res) => {
        this.programList = res.rows;
        console.log("查询对应的专业 ", this.programList);
      });
    },
    //选中被复制对象
    copy(row) {
      console.log("copy", row);
      this.currentRow = row;
      // 唤起弹窗
      this.dialogVisible = true;
    },
    // 确定有无培养计划，没有则创建
    confirm() {
      if (this.noProgram === false) {
        this.copyInfo();
      } else {
        ElMessageBox.confirm("暂未创建培养方案，是否需要创建？", "注意", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.addProgram();
          })
          .catch(() => {});
      }
    },
    //新增培养计划
    addProgram() {
      addProgram(
        this.currentMajorId,
        this.departmentId,
        this.schoolId,
        this.currentYear
      ).then((res) => {
        console.log("addProgram", res);
        checkProgram(this.currentMajorId, this.currentYear)
        .then((r) => {
          console.log("checkProgram", r);
          this.programId = r.data.programId;
          console.log("@", this.programId);
          this.noProgram = false;
          this.copyInfo()
        })
        .catch((e) => {
          if (e.code === "PROGRAM_NOT_FIND" && e.msg === "资源不存在") {
            this.noProgram = true;
          }
        });
      });
    },
    //复制
    copyInfo() {
      let obj = {};
      obj.sourceProgramId = this.currentRow.programId;
      obj.targetProgramId = this.programId;
      // 确定需要复制的内容
      if (this.checkList.indexOf("毕业要求和指标点") !== -1) {
        obj.isCopyGraduateAttribute = 1;
      } else {
        obj.isCopyGraduateAttribute = 0;
      }
      if (this.checkList.indexOf("课程体系") !== -1) {
        obj.isCopyCourseSystem = 1;
      } else {
        obj.isCopyCourseSystem = 0;
      }
      if (this.checkList.indexOf("达成度") !== -1) {
        obj.isCopyAchievement = 1;
      } else {
        obj.isCopyAchievement = 0;
      }
      copyProgram(obj).then((res) => {
        console.log("copyActAndObj", res);
        this.dialogVisible = false;
        if (res.code == "SUCCESS") {
          ElMessage({
            type: "success",
            message: `复制成功`,
            duration: 1000,
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
.block_title {
  margin-left: 60px;
  font-size: 16px;
}
.divider {
  margin-left: 20px;
  height: 24px;
}
.body-check {
  display: flex;
  justify-content: center;
  /* background-color: #f2f2f2; */
}
.card {
  display: flex;
  width: 800px;
  background: white;
  margin-top: 100px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
.all_block {
  margin-left: 30px;
}
.body_block {
  margin-top: 20px;
}
.title {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.2em;
  color: #757575;
  height: 50px;
}
.detail {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.2em;
  height: 60px;
}
</style>
