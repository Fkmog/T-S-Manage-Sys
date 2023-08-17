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
            size="22px"
            color="rgb(137, 137, 137)"
            style="margin-left: 50px"
            @click="backClass()"
          >
            <Back />
          </el-icon>
        </el-tooltip>
        <div class="block_title">工作手册</div>
        <el-divider class="divider" direction="vertical" />
        <div v-show="hasWorkbook && identity == '教师' && !noEdit">
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
              style="margin-left: 10px"
            >
              <DocumentChecked />
            </el-icon>
          </el-tooltip>
          <el-divider class="divider" direction="vertical" />
        </div>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="审核意见"
          placement="bottom"
          :hide-after="0"
        >
          <el-switch v-model="openDrawer" class="switchstyle" />
        </el-tooltip>
      </el-row>
    </div>
    <!-- 表单回显器 -->
    <div class="form-card" v-show="hasWorkbook">
      <form-create
        v-model="value"
        v-model:api="fApi"
        :rule="json"
        :option="option"
      ></form-create>
    </div>
    <div class="noWorkbook" v-show="!hasWorkbook">
      <div
        style="
          display: flex;
          justify-content: center;
          margin-top: 100px;
          font-size: 22px;
        "
      >
        暂未分配工作手册模板
      </div>
      <div
        style="
          display: flex;
          justify-content: center;
          color: grey;
          font-size: 13px;
          margin-top: 30px;
        "
      >
        请先分配工作手册模板
      </div>
    </div>
  </div>
  <reviewDrawer v-bind:visible="openDrawer" />
</template>

<script>
import { Back, DocumentChecked } from "@element-plus/icons-vue";
import { WorkbookByClass, editByTeacher } from "@/api/workbook";
import { ElMessage, ElMessageBox, ElSwitch } from "element-plus";
import _ from "lodash";
import reviewDrawer from "@/components/teacherClass/reviewDrawer.vue";
import { getClassInfo } from "@/api/class";

export default {
  name: "Workbook",
  components: {
    Back,
    reviewDrawer,
    ElSwitch,
    DocumentChecked,
  },
  data() {
    return {
      openDrawer: false,
      classInfo: {},
      noEdit: false,
      hasWorkbook: Boolean,
      workbook: [],
      //表单生成规则
      json: [],
      //表单样式规则
      option: {},
      //实例对象
      fApi: {},
      //表单数据
      value: {},
    };
  },

  mounted() {
    this.openDrawer = this.$store.state.currentInfo.opendrawer;
    this.create();
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
        }
      },
    },
    respondInfoChange: {
      deep: true,
      handler(value) {
        if (this.identity == "课程负责人") {
          this.classInfo = this.$store.state.currentInfo.respondClassInfo;
        }
      },
    },
  },
  methods: {
    async create() {
      await this.createValue();
      this.getWorkbook();
      editByTeacher(this.classInfo.classId, this.value).then((res) => {
        if (res.code === "SUCCESS") {
          this.getClassInfo();
        }
      });
    },
    createValue() {
      return new Promise((resolve, reject) => {
        this.identity = this.$store.state.currentInfo.identity;
        // console.log("identity",this.identity);
        if (this.identity == "学院管理员") {
          this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
          console.log("identity:", this.identity);
        } else if (this.identity == "课程负责人") {
          this.classInfo = this.$store.state.currentInfo.respondClassInfo;
        } else {
          this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
          console.log("identity:", this.identity);
        }
        if (this.classInfo.status == 2 || this.classInfo.status == 3) {
          // 状态为已提交或者已审核时，无法编辑
          this.noEdit = true;
        } else {
          this.noEdit = false;
        }
        this.value = this.classInfo.workbookJson;
        resolve("suc");
        reject(err);
      });
    },
    openDrawerChange() {
      this.$store.commit("currentInfo/setOpenDrawer", this.openDrawer);
    },
    // 返回上级页面
    backClass() {
      if (this.identity == "教师") {
        console.log("save", this.value);
        if (_.isEqual(this.classInfo.workbookJson, this.value)) {
          this.$router.push({ name: "TeacherClass" });
        } else {
          ElMessageBox.confirm("数据还未保存，是否仍然关闭？", "", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$router.push({ name: "TeacherClass" });
            })
            .catch(() => {});
        }
      } else {
        this.$router.push({ name: "TeacherClass" });
      }
    },
    //当 status 为2，3时，无法编辑表单，注入disable属性
    disabledForm() {
      this.workbook.formJson.forEach((form) => {
        form.props = {};
        form.props.disabled = true;
      });
      console.log("disabled后", this.workbook);
    },
    abledForm() {
      this.workbook.formJson.forEach((form) => {
        form.props = {};
        form.props.disabled = false;
      });
      console.log("abled后", this.workbook);
    },
    save() {
      this.fApi.submit((formData, fApi) => {
        console.log("save", formData, fApi, this.value);
        editByTeacher(this.classInfo.classId, formData).then((res) => {
          console.log("保存", res);
          if (res.code === "SUCCESS") {
            ElMessage({
              type: "success",
              message: `更新成功`,
              duration: 1500,
            });
            this.getClassInfo();
          }
        });
      });
    },
    // 查询对应的工作手册
    getWorkbook() {
      WorkbookByClass(this.classInfo.classId)
        .then((res) => {
          if (res.code === "SUCCESS") {
            if (res.data.length == 0) {
              this.hasWorkbook = false;
            } else {
              this.hasWorkbook = true;
              this.workbook = res.data;
              this.workbookId = this.workbook.workbookId;
              console.log("workbook", this.workbook);
              this.json = res.data.formJson;
              this.option = res.data.cssJson;
              // 保存提交
              this.option.submitBtn = false;
              // console.log(this.classInfo.status);
              if (
                this.classInfo.status == 2 ||
                this.classInfo.status == 3 ||
                !(this.identity == "教师")
              ) {
                this.disabledForm();
              } else {
                this.abledForm();
              }
            }
          }
        })
        .catch((e) => {
          if (e.msg == "资源不存在" && e.code == "NOT_FIND") {
            this.hasWorkbook = false;
          }
        });
    },
    // 获取对应教学班手册保存内容
    getClassInfo() {
      getClassInfo(this.classInfo.classId).then((res) => {
        console.log("getClassInfo", res);
        if (this.identity == "学院管理员") {
          this.$store.commit("currentInfo/setadminSideClassInfo", res.data);
        } else if (this.identity == "课程负责人") {
          this.$store.commit("currentInfo/setRespondClassInfo", res.data);
        } else {
          this.$store.commit("currentInfo/setTeacherSideClassInfo", res.data);
        }
        this.value = res.data.workbookJson;
      });
    },
  },
};
</script>

<style scoped>
.switchstyle {
  bottom: 4px;
}
.content {
  height: 100vh;
  background-color: #f2f2f2;
}
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
  margin-left: 20px;
  font-size: 16px;
}
.divider {
  margin-left: 20px;
  height: 24px;
}
.form-card {
  width: 784px;
  margin: 100px auto;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  background: white;
  padding: 25px;
}
</style>
