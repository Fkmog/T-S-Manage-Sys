<template>
  <div class="content">
    <div class="body-check">
      <div class="card">
        <el-row class="all_block">
          <el-col class="block">
            <el-col class="title">专业</el-col>
            <el-col class="detail">{{ currentMajorName }}</el-col>
          </el-col>
          <el-col>
            <el-col class="title">年级</el-col>
            <el-col class="detail">{{ currentYear }} 级</el-col>
          </el-col>
          <el-col>
            <el-col class="title">设置</el-col>
            <el-col>
              <el-button style="color: #6573c0" text @click="openDrawer"
                >从其他课程大纲复制
              </el-button>
            </el-col>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
  <!-- 右侧复制抽屉 -->
  <el-drawer v-model="drawer" :with-header="false">
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
      大纲复制以下内容：</el-row
    >
    <el-checkbox-group v-model="checkList">
      <el-checkbox label="毕业要求和指标点"></el-checkbox>
      <el-checkbox label="课程体系"></el-checkbox>
      <el-checkbox label="达成度"></el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="copyInfo()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import DrawerSearch from "@/components/general/drawerSearch.vue";
import { searchProgram,checkProgram } from "@/api/program";
import { getDictionary } from "@/api/dictionary";
import { copyProgram } from "@/api/basecourse";
import {  ElMessage } from "element-plus";

export default {
  name: "Setting",
  components: {
    DrawerSearch,
  },
  data() {
    return {
      programId: "",
      year: "",
      enroll_year: [],
      checkList: [],
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
    this.checkProgram()
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
      checkProgram(this.currentMajorId, this.currentYear).then((res) => {
        console.log("checkProgram", res);

        this.programId = res.data.programId;
      });
    },
    // 唤起抽屉
    openDrawer() {
      this.drawer = true;
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
        }
      });
    },
  },
};
</script>

<style scoped>
.content {
  height: 100vh;
  background-color: #f2f2f2;
}
.body-check {
  display: flex;
  justify-content: center;
  background-color: #f2f2f2;
}
.card {
  width: 800px;
  background: white;
  margin-top: 30px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
.all_block {
  margin-left: 30px;
}
.block {
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
