<template>
  <div class="content">
    <div class="head-block">
      <el-row style="margin-left: 30px">
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
            @click="backGoal()"
          >
            <Back />
          </el-icon>
        </el-tooltip>
        <div
          style="
            margin-top: 15px;
            margin-left: 20px;
            height: 30px;
            border-left: 1px solid rgb(189, 189, 189);
          "
        ></div>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="保存"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="24px"
            color="rgb(137, 137, 137)"
            @click="save()"
            style="margin-left: 20px"
          >
            <DocumentChecked />
          </el-icon>
        </el-tooltip>
      </el-row>
    </div>
    <div class="body-check">
      <div class="card">
        <div class="card-head">
          <span class="head-text" style="color: grey; font-size: 14px"
            >培养目标</span
          >
        </div>
        <div>
          <div class="desc">
            <el-form
              :model="requirements"
              :rules="rules"
              ref="requirements"
              label-position="top"
              ><el-form-item
                :prop="'requirements.' + index1 + '.name'"
                label=""
                class="title"
              >
                <el-input
                  v-model="programInfo.goal"
                  type="textarea"
                  :autosize="{ minRows: 6 }"
                  maxlength="1000"
                  placeholder="培养目标"
                /> </el-form-item
            ></el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  EditPen,
  Back,
  DocumentChecked,
  Plus,
  Delete,
} from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";
import _ from "lodash";
import {
  checkProgramByProgramId,
  addProgram,
  editProgram,
} from "@/api/program";
export default {
  name: "GoalEdit",
  components: {
    EditPen,
    Back,
    DocumentChecked,
    Plus,
    Delete,
  },
  data() {
    return {
      hasProgram: false,
      noProgram: false,
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
      programInfo: "",
    };
  },
  mounted() {
    this.programId = this.$route.query.programId;
    this.currentMajorId = this.$store.state.major.majorId;
    this.currentMajorName = this.$store.state.major.majorName;
    this.currentSchoolId = this.$store.state.currentInfo.schoolId;
    this.currentDepartmentId = this.$store.state.currentInfo.departmentId;
    this.currentYear = this.$store.state.currentInfo.year;
    //新增培养计划的表单 数据初始化
    this.addProgramForm.major = this.currentMajorName;
    this.addProgramForm.enrollyear = this.$store.state.currentInfo.year;
    this.checkProgramInfo();
  },

  methods: {
    backGoal() {
      if (_.isEqual(this.programInfo, this.clone)) {
        this.$router.push("/goal");
      } else {
        ElMessageBox.confirm("数据还未保存，是否仍然关闭？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push("/goal");
          })
          .catch(() => {});
      }
    },
    save() {
      console.log("save", this.programInfo);
      editProgram(this.programInfo)
        .then((res) => {
          console.log(res);
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `更新成功`,
              duration: 4000,
            });
            this.$router.push("/goal");
          } else {
            ElMessage({
              type: "error",
              message: `更新失败`,
              duration: 4000,
            });
          }
        })
        .catch((e) => {});
    },
    checkProgramInfo() {
      checkProgramByProgramId(this.programId).then((res) => {
        this.programInfo = res.data;
        this.clone = JSON.parse(JSON.stringify(this.programInfo));
        console.log(
          this.programInfo,
          this.clone,
          _.isEqual(this.programInfo, this.clone)
        );
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
.body-check {
  display: flex;
  justify-content: center;
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
  margin-top: 80px;
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
.head-block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
.icon {
  margin-top: 15px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
