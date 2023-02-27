<template>
  <div class="content">
    <!-- 头部栏 -->
    <div class="Block"></div>
    <div v-show="hasProgram" class="body-check">
      <div class="card">
        <div class="noAttribute" v-if="!hasAttribute">
          <span>尚未设置毕业要求</span>
        </div>
        <div v-if="hasAttribute">
          <div
            class="graduate-attribute"
            v-for="attribute in requirements"
            :key="attribute.id"
          >
            <div class="attribute">
              <div class="two-digits">
                <section class="num-title">
                  <section class="num-wrap">
                    <span class="title-text">{{ attribute.serialNum }}</span>
                  </section>
                  <section class="rotate-bar"></section>
                </section>
              </div>
              <div class="attribute-content">
                <div class="name">
                  {{ attribute.name }}
                </div>
                <div class="desc">
                  {{ attribute.description }}
                </div>
              </div>
            </div>
            <div v-for="detail in attribute.programIndicators" :key="detail.id">
              <div class="attribute-detail">
                <div class="detail-num">
                  {{ detail.serialNum }}
                </div>
                <div class="detail-content">
                  <div class="name">{{ detail.name }}</div>
                  <div class="desc">{{ detail.description }}</div>
                </div>
              </div>
              <div class="support-course" style="margin: 30px 0 30px 120px">
                <div class="support-head">
                  <span style="color: grey; font-size: 14px">支撑课程</span>
                  <div class="penIcon">
                    <el-tooltip
                      effect="dark"
                      content="编辑"
                      placement="bottom"
                      :hide-after="0"
                    >
                      <el-icon
                        class="pen-icon"
                        @click="editSupportCourse(detail)"
                        ><EditPen
                      /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
                <div class="methods" style="margin: 20px 0 20px 100px">
                  <!-- <div
                    v-for="method in indicator.supportMethodVos"
                    :key="method.id"
                  > -->
                  <el-row class="method-detail">
                    <el-col :span="6" class="method-weight"
                      >(&nbsp; weight %&nbsp;)</el-col
                    >
                    <el-col
                      :span="10"
                      class="method-desc"
                      style="margin-left: 80px"
                      >123</el-col
                    >
                  </el-row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!hasProgram" class="no-program">
      <h2 style="display: flex; justify-content: center; margin-top: 100px">
        未创建培养方案
      </h2>
      <div style="display: flex; justify-content: center; color: grey">
        请先创建培养方案
      </div>
    </div>
    <!-- 弹出对话框 -->
    <div>
      <el-dialog
        v-model="dialogFormVisible"
        title="设置支撑课程"
        width="680px"
        :show-close="false"
        :align-center="true"
      >
        <el-col
          class="requirement"
          v-for="requirement in requirements"
          :key="requirement.id"
          style="margin-bottom:30px"
        >
          <el-row style="margin-bottom: 20px">
            <el-col :span="4" class="requirement-name"
              >毕业要求{{ requirement.serialNum }}：{{
                requirement.name
              }}</el-col
            >
            <el-col :span="19" class="requirement-desc">{{
              requirement.description
            }}</el-col>
          </el-row>
          <el-col
            class="indicator"
            v-for="indicator in requirement.programIndicators"
            :key="indicator.id"
          >
            <el-row>
              <el-col :span="4" class="indicator-name"
                >毕业要求{{ indicator.serialNum }}：{{ indicator.name }}</el-col
              >
              <el-col :span="19" class="indicator-desc">{{
                indicator.description
              }}</el-col>
              <el-col
                class="coreBasecourse"
                v-for="coreBasecourse in indicator.coreBaseCourses"
                :key="coreBasecourse.id"
                style="margin-top: 30px"
              >
                <el-col
                  :span="4"
                  v-show="!coreBasecourse.isEditWeight"
                  class="showWeight"
                >
                  <el-row>
                    <el-col :span="10">{{ coreBasecourse.weight }}% </el-col>
                    <el-col :span="12">
                      <el-icon @click="editWeight(coreBasecourse)"
                        ><Edit
                      /></el-icon>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col
                  :span="4"
                  v-show="coreBasecourse.isEditWeight"
                  class="editWeight"
                >
                  <el-row>
                    <el-col :span="12">
                      <el-input v-model="coreBasecourse.weight"></el-input>
                    </el-col>
                    <el-col :span="12">
                      <el-icon @click="saveWeight(coreBasecourse)"
                        ><DocumentChecked
                      /></el-icon>
                    </el-col>
                  </el-row>
                </el-col>
              </el-col>
            </el-row>

            <el-button
              class="add-support-button"
              style="color: #6573c0; margin-top: 30px"
              text
              @click="addCoreBaseCourse()"
            >
              <el-icon :size="18" color="#586dbe"><Plus /></el-icon>
              新增支撑课程
            </el-button>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button
                  type="primary"
                  @click="confirmAddSupport(dialogIndicator)"
                >
                  确定
                </el-button>
              </span>
            </template>
          </el-col>
        </el-col>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  EditPen,
  DocumentChecked,
  Plus,
  Delete,
  Close,
  Edit,
} from "@element-plus/icons-vue";
import { checkProgram, addProgram } from "@/api/program";
import addBtn from "@/components/general/addBtn.vue";
export default {
  name: "Achieve",
  components: {
    EditPen,
    addBtn,
    DocumentChecked,
    Plus,
    Delete,
    Close,
    Edit,
  },
  data() {
    return {
      hasProgram: Boolean,
      hasAttribute: Boolean,
      currentMajorId: Number,
      currentMajorName: "",
      currentSchoolId: "",
      currentYear: "",
      currentDepartmentId: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      addProgramForm: {
        major: "",
        enrollyear: "",
      },
      requirements: [],
      programId: "",
    };
  },
  mounted() {
    this.currentMajorId = this.$store.state.major.majorId;
    this.currentMajorName = this.$store.state.major.majorName;
    this.currentSchoolId = this.$store.state.currentInfo.schoolId;
    this.currentDepartmentId = this.$store.state.currentInfo.departmentId;
    this.currentYear = this.$store.state.currentInfo.year;
    //新增培养计划的表单 数据初始化
    this.addProgramForm.major = this.currentMajorName;
    this.addProgramForm.enrollyear = this.$store.state.currentInfo.year;

    this.checkProgram();
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
        this.checkProgram();
      },
    },
  },
  methods: {
    //跳转至编辑毕业要求页面
    goEdit() {
      this.$router.push({
        path: "/edit",
        query: { programId: this.programId },
      });
    },
    //编辑支撑课程
    editSupportCourse(detail) {
      console.log("1");

      this.dialogFormVisible = true;
    },
    //查询有无培养计划
    checkProgram() {
      checkProgram(
        this.currentMajorId,
        this.$store.state.currentInfo.year
      ).then((res) => {
        // console.log("checkProgram", res);
        if (res.msg == "未查到" && res.code == 200) {
          this.hasProgram = false;
          this.$store.commit("major/setProgramId", "");
        }
        if (res.msg == "操作成功" && res.code == 200) {
          this.hasProgram = true;
          this.programId = res.data.programId;
          this.$store.commit("major/setProgramId", this.programId);
          this.requirements = res.data.graduateAttributes;
          if (this.requirements == null) {
            this.hasAttribute = false;
          }
          console.log("requirements", this.requirements);
          if (this.requirements !== null && this.requirements.length == 0) {
            this.hasAttribute = false;
          }
          if (this.requirements !== null) {
            this.hasAttribute = true;
          }
        }
      });
    },
    //新增培养计划
    addProgram() {
      addProgram(
        this.currentMajorId,
        this.currentDepartmentId,
        this.currentSchoolId,
        this.addProgramForm.enrollyear
      ).then((res) => {
        console.log("addProgram", res);
        this.dialogFormVisible = false;
        this.checkProgram();
      });
    },
   
  },
};
</script>

<style scoped>
.Block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
.content {
  height: 100vh;
  background-color: #f2f2f2;
}
.body-check {
  display: flex;
  justify-content: center;
  background-color: #f2f2f2;
}
.no-program {
  display: flex;
  flex-direction: column;
}
.noAttribute {
  height: 100px;
  text-align: center;
  margin-top: 80px;
  color: rgb(143, 142, 142);
  font-size: 16px;
}
.card {
  width: 800px;
  background: white;
  margin-top: 85px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
/* 数字标题 */
.num-title {
  margin-top: 10px;
  margin-left: 10px;
  max-width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  display: table;
  width: 40px;
  color: #5c6bc0;
  border-color: rgb(72, 192, 163);
  word-wrap: break-word !important;
}
.num-wrap {
  max-width: 100%;
  box-sizing: border-box;
  display: table-cell;
  vertical-align: middle;
  color: rgb(255, 255, 255);
  border-color: rgb(72, 192, 163);
  word-wrap: break-word !important;
}
.title-text {
  max-width: 100%;
  font-size: 50px;
  font-weight: bold;
  color: #5c6bc0;
  box-sizing: border-box !important;
  word-wrap: break-word !important;
}
.rotate-bar {
  margin-top: 5px;
  margin-left: -4px;
  max-width: 100%;
  box-sizing: border-box;
  width: 18px;
  height: 70px;
  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: rgb(198, 198, 199);
  transform: rotate(35deg);
  word-wrap: break-word !important;
  background-color: rgb(254, 254, 254);
}
.edit-pen {
  cursor: pointer;
  color: grey;
  margin-left: 710px;
}
/* 毕业要求 */
.graduate-attribute {
  display: flex;
  flex-direction: column;
}
.attribute {
  display: flex;
  flex-direction: row;
}
.attribute-detail {
  display: flex;
  flex-direction: row;
}
.detail-num {
  color: #5c6bc0;
  font-weight: bold;
  margin-left: 40px;
  margin-top: 20px;
  font-size: 24px;
}
.name {
  font-size: 22px;
  font-weight: bold;
  margin: 20px;
  white-space: nowrap;
  margin-left: 30px;
}
.desc {
  margin: 20px;
  margin-left: 30px;
}
.support-head {
  display: flex;
  flex-direction: row;
}
.support-course:hover .penIcon {
  opacity: 1;
}
.penIcon {
  opacity: 0;
}
:deep().pen-icon {
  cursor: pointer;
  margin-left: 545px;
  width: 24px;
  height: 24px;
  color: #757575;
}
/* 对话框样式 */
:deep().el-dialog__title {
  color: #808080;
  display: flex;
  justify-content: center;
  font-size: 20px;
}
</style>
