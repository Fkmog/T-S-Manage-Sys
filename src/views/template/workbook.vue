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
        <el-divider
          v-show="hasWorkbook && identity == '教师' && !noEdit"
          class="divider"
          direction="vertical"
        />
        <div v-show="hasWorkbook && identity == '教师' && !noEdit">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="临时保存（仅临时存放在当前浏览器，请及时保存至服务器）"
            placement="bottom"
            :hide-after="0"
          >
            <el-icon
              class="icon"
              size="24px"
              color="rgb(137, 137, 137)"
              @click="tempSave(value, classInfo.classId)"
              style="margin-left: 10px"
            >
              <Clock />
            </el-icon>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="保存至服务器"
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
        </div>
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
            @change="openDrawerChange"
          />
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
        暂未设置工作手册模板
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
        请联系管理员设置工作手册模板
      </div>
    </div>
  </div>
  <reviewDrawer v-bind:visible="openDrawer" />
</template>

<script>
import {
  Back,
  DocumentChecked,
  UploadFilled,
  Clock,
} from "@element-plus/icons-vue";
import { WorkbookByClass, editByTeacher } from "@/api/workbook";
import { ElMessage, ElMessageBox, ElSwitch } from "element-plus";
import _ from "lodash";
import reviewDrawer from "@/components/teacherClass/reviewDrawer.vue";
import { getClassInfo } from "@/api/class";
import { downloadFile } from "@/api/common";
import Cookies from "js-cookie";
import { getPresent } from "@/api/workbook";
import { inject } from "vue";
import { Base64 } from "js-base64";

export default {
  name: "Workbook",
  components: {
    UploadFilled,
    Back,
    reviewDrawer,
    ElSwitch,
    DocumentChecked,
    Clock,
  },
  data() {
    return {
      identity: "",
      openDrawer: false,
      classInfo: {},
      noEdit: false,
      hasWorkbook: Boolean,
      courseId: "",
      detailId: "",
      formPresent: [],
      workbook: [],
      //表单生成规则
      json: [],
      //表单样式规则
      option: {},
      //实例对象
      fApi: {},
      //表单数据
      value: {},
      afterPreValue: {},
      // watchValue:{}
      url: "",
      editor: [],
      canSave: false,
    };
  },
  mounted() {
    this.url = inject("$baseURL");
    this.openDrawer = this.$store.state.currentInfo.opendrawer;
    this.getPre();
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
    adminInfoChange() {
      // console.log('teacherSideClassInfo changed');
      return this.$store.state.currentInfo.adminSideClassInfo;
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
    adminInfoChange: {
      deep: true,
      handler(value) {
        if (this.identity == "学院管理员") {
          this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
        }
      },
    },
  },
  methods: {
    openDrawerChange() {
      this.$store.commit("currentInfo/setOpenDrawer", this.openDrawer);
    },
    async getPre() {
      await this.create();
      console.log("classInfo", this.classInfo);
      this.courseId = this.classInfo.courseId;
      this.detailId = this.classInfo.detailId;
      // this.getPresent();
    },
    async create() {
      await this.createValue();
      this.getClassInfo();
      // await editByTeacher(this.classInfo.classId, this.value).then((res) => {
      //   if (res.code === "SUCCESS") {
      //     this.getClassInfo();
      //   }
      // });
    },
    async createValue() {
      return new Promise((resolve, reject) => {
        this.identity = this.$store.state.currentInfo.identity;
        if (this.identity == "学院管理员") {
          this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
        } else if (this.identity == "课程负责人") {
          this.classInfo = this.$store.state.currentInfo.respondClassInfo;
        } else {
          this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
        }
        if (this.classInfo.status == 2 || this.classInfo.status == 3) {
          // 状态为已提交或者已审核时，无法编辑
          this.noEdit = true;
        } else {
          this.noEdit = false;
        }
        if (
          this.classInfo.workbookJson !== null &&
          this.classInfo.workbookJson !== undefined
        ) {
          console.log("###", this.classInfo);
          this.value = JSON.parse(JSON.stringify(this.classInfo.workbookJson));
          console.log(
            "*(*())",
            _.isEqual(this.classInfo.workbookJson, this.value)
          );
        }
        this.getWorkbook();
        resolve("suc");
        reject(err);
      });
    },
    openDrawerChange() {
      this.$store.commit("currentInfo/setOpenDrawer", this.openDrawer);
    },
    isBase64Encoded(str) {
      // Base64 编码的正则表达式
      const base64Regex =
        /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      return base64Regex.test(str);
    },
    // 返回上级页面
    backClass() {
      if (this.identity == "教师") {
        console.log("save", this.value);
        // let temp = JSON.parse(JSON.stringify(this.classInfo.workbookJson));
        let temp = JSON.parse(JSON.stringify(this.afterPreValue));
        let another = JSON.parse(JSON.stringify(this.value));
        console.log(temp, another, _.isEqual(temp, another));
        this.editor.forEach((edit) => {
          if (typeof temp[edit] === "string") {
            if (temp[edit].includes("zheshibase64bianma/")) {
              temp[edit] = temp[edit].slice(19);
              if (this.isBase64Encoded(temp[edit])) {
                temp[edit] = Base64.decode(temp[edit]);
              }
            }
          }
        });
        if (
          _.isEqual(temp, another) ||
          this.canSave ||
          JSON.stringify(this.afterPreValue) === "{}"
        ) {
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
        if (Array.isArray(form.children)) {
          form.children.forEach((formChild) => {
            if (typeof formChild === "object") {
              if (Array.isArray(formChild.children)) {
                if (formChild.children[0] !== "") {
                  formChild.children.forEach((grandson) => {
                    if (typeof grandson === "object") {
                      if (grandson.props === undefined) {
                        grandson.props = {};
                      }
                      grandson.props.disabled = true;
                    }
                  });
                }
              }
              if (formChild.props === undefined) {
                formChild.props = {};
              }
              formChild.props.disabled = true;
            }
          });
        } else {
        }
        if (form.props === undefined) {
          form.props = {};
        }
        form.props.disabled = true;
      });
      // console.log("disabled后", this.workbook);
    },
    abledForm() {
      this.workbook.formJson.forEach((form) => {
        form.props.disabled = false;
      });
      // console.log("abled后", this.workbook);
    },
    // 暂存至localStorage
    saveToLocal(value, classId) {
      localStorage.setItem("classId", JSON.stringify(classId));
      localStorage.setItem("workbook", JSON.stringify(value));
      for (let key in value) {
        if (!value[key]) {
          continue;
        }
        this.editor.forEach((e) => {
          if (e == key && value[key].includes("zheshibase64bianma/")) {
            value[key] = value[key].slice(19);
            if (this.isBase64Encoded(value[key])) {
              value[key] = Base64.decode(value[key]);
            }
          }
        });
      }
    },
    // 点击暂存按钮
    tempSave(value, classId) {
      localStorage.setItem("classId", JSON.stringify(classId));
      localStorage.setItem("workbook", JSON.stringify(value));
      for (let key in value) {
        if (!value[key]) {
          continue;
        }
        this.editor.forEach((e) => {
          if (e == key && value[key].includes("zheshibase64bianma/")) {
            value[key] = value[key].slice(19);
            if (this.isBase64Encoded(value[key])) {
              value[key] = Base64.decode(value[key]);
            }
          }
        });
      }
      ElMessage({
        type: "success",
        message: `临时保存成功`,
        duration: 1500,
      });
      this.canSave = true;
    },
    // 保存
    save() {
      this.fApi
        .submit((formData, fApi) => {
          this.editor.forEach((edit) => {
            formData[edit] = Base64.encode(formData[edit]);
            formData[edit] = "zheshibase64bianma/" + formData[edit];
          });
          console.log("save", formData);
          editByTeacher(this.classInfo.classId, formData).then((res) => {
            if (res.code === "SUCCESS") {
              ElMessage({
                type: "success",
                message: `保存成功`,
                duration: 1500,
              });
              localStorage.removeItem("classId");
              localStorage.removeItem("workbook");
              this.getClassInfo();
            }
          });
        })
        .catch((e) => {
          ElMessage({
            type: "error",
            message: `部分字段未填写完整`,
            duration: 1500,
          });
        });
    },
    // 查询对应的工作手册 by classId
    getWorkbook() {
      WorkbookByClass(this.classInfo.classId)
        .then((res) => {
          if (res.code === "SUCCESS") {
            if (res.data.length == 0) {
              this.hasWorkbook = false;
            } else {
              this.hasWorkbook = true;
              // 找到上传组件，注入props配置
              res.data.formJson.forEach((form) => {
                let that = this;
                if (form.type === "upload") {
                  const limit = form.props.limit;
                  form.props = {
                    disabled: false,
                    limit: limit,
                    listType: "text",
                    multiple: true,
                    name: "files",
                    action: this.url + "common/upload/files",
                    headers: {
                      Authorization: "Bearer " + Cookies.get("Admin-Token"),
                    },
                    data: {
                      param: this.classInfo.classId,
                      type: "workbookFile",
                      field: form.field,
                    },
                    onSuccess: function (res, file) {
                      file.url = res.fileRecords[0].fileAddress;
                    },
                    onExceed: function () {
                      ElMessage({
                        type: "warning",
                        message: `超出上传文件数量限制`,
                        duration: 1500,
                      });
                    },
                    onPreview: function (file) {
                      that.download(file);
                    },
                  };
                }
              });
              this.workbook = res.data;
              this.workbookId = this.workbook.workbookId;
              console.log("workbook", this.workbook);
              this.json = res.data.formJson;
              // 找到所有的fc-editor，存到editor
              this.json.forEach((item) => {
                if (item.type) {
                  if (item.type === "fc-editor") {
                    this.editor.push(item.field);
                  }
                }
              });
              this.option = res.data.cssJson;
              // 保存提交
              this.option.submitBtn = false;
              if (
                this.classInfo.status == 2 ||
                this.classInfo.status == 3 ||
                this.identity !== "教师"
              ) {
                this.disabledForm();
              } else {
                this.abledForm();
              }
            }
          }
        })
        .catch((e) => {
          console.log("e", e);
          if (e.status == "404") {
            this.hasWorkbook = false;
          }
          // if (e.data.msg) {
          //   if (e.data.msg == "资源不存在" && e.data.code == "NOT_FIND") {
          //     this.hasWorkbook = false;
          //   }
          // }
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
        this.value = JSON.parse(JSON.stringify(res.data.workbookJson));
        console.log("value", this.value);
        if (this.value) {
          this.editor.forEach((edit) => {
            if (typeof this.value[edit] === "string") {
              if (this.value[edit].includes("zheshibase64bianma/")) {
                this.value[edit] = this.value[edit].slice(19);
                if (this.isBase64Encoded(this.value[edit])) {
                  this.value[edit] = Base64.decode(this.value[edit]);
                }
              }
            }
          });
        }
        console.log("decode", this.value);
        this.getPresent();
      });
    },
    // 下载文件
    download(file) {
      let fileAddress = file.url;
      let fileName = file.name;
      downloadFile(fileAddress).then((res) => {
        console.log("downloadFile", res);
        const blob = new Blob([res]);
        const link = document.createElement("a");
        link.download = decodeURI(fileName);
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
    },
    // 查询预设信息
    getPresent() {
      // TODO:detailId可能为null 还没有处理
      if (this.detailId) {
        getPresent(this.detailId).then((res) => {
          this.formPresent = res.data.preset.formPreset;
          this.formPresent.forEach((i) => {
            if (i.value[0] == "[") {
              i.value = i.value.match(/\d+/g);
            }
            if (typeof i.value === "string") {
              if (i.value.includes("zheshibase64bianma/")) {
                i.value = i.value.slice(19);
                if (this.isBase64Encoded(i.value)) {
                  i.value = Base64.decode(i.value);
                }
              }
            }
          });
          console.log("getPresent", this.formPresent);

          // this.showPresent(this.json);
          this.getLocalValue();
        });
      }
    },
    async getLocalValue() {
      await this.showPresent(this.json);
      if (localStorage.getItem("workbook")) {
        console.log("!", this.classInfo.classId);
        if (localStorage.getItem("classId") == this.classInfo.classId) {
          let temp = JSON.parse(localStorage.getItem("workbook"));
          this.value = temp;
          this.afterPreValue = temp;
          console.log("getLocalValue", this.afterPreValue);
        } else {
          console.log("remove");
          localStorage.removeItem("classId");
          localStorage.removeItem("workbook");
        }
      }
      this.$watch("value", (newValue) => {
        // 在元素值变化时执行特定的操作
        // console.log("元素的值已经变化：", newValue);
        // this.saveToLocal(newValue, this.classInfo.classId);
      });
    },
    // 回显预设信息
    async showPresent(forms) {
      forms.forEach((form) => {
        if (Array.isArray(form.children) && form.children.length > 0) {
          this.showPresent(form.children);
        } else {
          if (form !== "") {
            this.formPresent.forEach((present) => {
              if (present.field === form.field && form.value === undefined) {
                form.value = present.value;
                // console.log("@", present);
                if (typeof present.value === "string") {
                  if (present.value.includes("zheshibase64bianma/")) {
                    let cur = present.value.slice(19);
                    if (this.isBase64Encoded(cur)) {
                      cur = Base64.decode(cur);
                      // console.log("#@", cur);
                      form.value = cur;
                    }
                  }
                }
              }
            });
          }
        }
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
