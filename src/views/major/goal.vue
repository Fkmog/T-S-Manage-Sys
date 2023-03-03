<template>
  <div class="content">
    <div v-show="hasProgram" class="body-check">
      <div class="card">
        <div class="card-head">
          <span class="head-text" style="color: grey; font-size: 14px"
            >毕业要求</span
          >
          <el-tooltip
            class="box-item"
            effect="dark"
            content="编辑"
            placement="bottom"
            :hide-after="0"
          >
            <el-icon class="edit-pen" @click="goEdit()"><EditPen /></el-icon>
          </el-tooltip>
        </div>
        <div class="noAttribute" v-if="!hasAttribute">
          <span>待添加</span>
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
            <div
              class="attribute-detail"
              v-for="detail in attribute.programIndicators"
              :key="detail.id"
            >
              <div class="detail-num">
                {{ detail.serialNum }}
              </div>
              <div class="detail-content">
                <div class="name">{{ detail.name }}</div>
                <div class="desc">{{ detail.description }}</div>
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
        请先点击右上角圆形按钮创建培养方案
      </div>

      <addBtn
        @click="
          this.addProgramForm.enrollyear = this.$store.state.currentInfo.year;
          dialogFormVisible = true;
        "
      >
      </addBtn>
      <!-- 弹出表单-新增培养方案 -->
      <el-dialog
        v-model="dialogFormVisible"
        title="创建培养方案"
        style="width: 400px"
      >
        <el-form
          :model="addProgramForm"
          label-position="top"
          style="margin-left: 30px"
        >
          <el-form-item label="专业" :label-width="formLabelWidth">
            <el-input
              v-model="addProgramForm.major"
              disabled
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="学年" :label-width="formLabelWidth">
            <el-input
              v-model="addProgramForm.enrollyear"
              disabled
              style="width: 300px"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="addProgram()"> 确认 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { EditPen } from "@element-plus/icons-vue";
import { checkProgram, addProgram } from "@/api/program";
import addBtn from "@/components/general/addBtn.vue";
export default {
  name: "Goal",
  components: {
    EditPen,
    addBtn,
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
    //查询有无培养计划
    checkProgram() {
      checkProgram(
        this.currentMajorId,
        this.$store.state.currentInfo.year
      ).then((res) => {
        console.log("checkProgram", res);
        if (res.msg == "未查到" && res.code == 200) {
          this.hasProgram = false;
          this.$store.commit("major/setProgramId", '');
        }
        if (res.msg == "操作成功" && res.code == 200) {
          this.hasProgram = true
          this.programId = res.data.programId;
          this.$store.commit("major/setProgramId", this.programId);
          this.requirements = res.data.graduateAttributes;
          if( this.requirements == null){
            this.hasAttribute = false;
          }
          console.log("requirements", this.requirements);
          if (this.requirements !== null&&this.requirements.length == 0) {
            this.hasAttribute = false;
          } 
          if(this.requirements!==null)
          {
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
  margin-top: 30px;
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
</style>