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
    <!-- 表单回显器 -->
    <div class="form-card" v-show="hasWorkbook == true">
      <form-create
        v-model="value"
        v-model:api="fApi"
        :rule="json"
        :option="option"
      ></form-create>
    </div>
    <div class="noWorkbook" v-show="hasWorkbook == false">
      <div
        style="
          display: flex;
          justify-content: center;
          margin-top: 100px;
          font-size: 22px;
        "
      >
        未分配工作手册模板
      </div>
    </div>
  </div>
</template>

<script>
import { Back, DocumentChecked } from "@element-plus/icons-vue";
import { WorkbookByClass, editByTeacher } from "@/api/workbook";
import { ElMessage } from "element-plus";
import { getClassInfo } from "@/api/class";

export default {
  name: "Workbook",
  components: {
    Back,
    DocumentChecked,
  },
  data() {
    return {
      classInfo: {},
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
    this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
    // console.log("vuex中的classInfo", this.classInfo);
    this.getWorkbook();
    this.value = this.classInfo.workbookJson;
  },
  computed: {
    classInfoChange() {
      return this.$store.state.currentInfo.teacherSideClassInfo;
    },
  },
  watch: {
    classInfoChange: {
      deep: true,
      handler(value) {
        this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
      },
    },
  },
  methods: {
    // 返回上级页面
    backClass() {
      this.$router.push({ name: "TeacherClass" });
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
        console.log("abled后", this.workbook);
      });
    },
    save() {
      this.fApi.submit((formData, fApi) => {
        console.log("save", formData);
        editByTeacher(this.classInfo.classId, formData).then((res) => {
          console.log("保存", res);
          if (res.code === "SUCCESS") {
            ElMessage({
              type: "success",
              message: `保存成功`,
              duration: 1500,
            });
            this.getClassInfo();
          }
        });
      });
   
    },
    // 查询对应的工作手册
    getWorkbook() {
      WorkbookByClass(this.classInfo.classId).then((res) => {
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
            // this.option.onSubmit = function (e) {
            //   console.log("Submit", e);
            //   editByTeacher(that.classInfo.classId, e).then((res) => {
            //     console.log("保存", res);
            //     if (res.code === "SUCCESS") {
            //       ElMessage({
            //         type: "success",
            //         message: `保存成功`,
            //         duration: 1500,
            //       });
            //       that.getClassInfo();

            //       console.log("!", that.value);
            //     }
            //   });
            // };
            // this.setJson();
            // this.setOption();
            console.log(this.classInfo.status);
            if (this.classInfo.status == 2 || this.classInfo.status == 3) {
              this.disabledForm();
            } else {
              this.abledForm();
            }
          }
        }
      });
    },
    // 获取对应教学班手册保存内容
    getClassInfo() {
      getClassInfo(this.classInfo.classId).then((res) => {
        console.log("getClassInfo", res);
        this.$store.commit("currentInfo/setTeacherSideClassInfo", res.data);
        this.value = res.data.workbookJson;
      });
    },
    // 回显生成规则
    // setJson() {
    //   this.$refs.designer.setRule(this.json);
    // },
    // 回显样式规则
    // setOption() {
    //   this.$refs.designer.setOption(this.option);
    // },
  },
};
</script>

<style scoped>
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
  margin-top: 100px;
  width: 90%;
  margin-left: 5%;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  background: white;
  padding: 25px;
}
</style>
