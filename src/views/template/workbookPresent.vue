<template>
  <div class="content">
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
            @click="back()"
          >
            <Back />
          </el-icon>
        </el-tooltip>
        <div class="block_title">预设手册模板</div>
        <el-divider class="divider" direction="vertical" />
        <div>
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
        </div>
      </el-row>
    </div>
    <!-- 表单回显器 -->
    <div class="form-card">
      <form-create
        v-model="value"
        v-model:api="fApi"
        :rule="json"
        :option="option"
      ></form-create>
    </div>
  </div>
</template>

<script>
import { Back, DocumentChecked } from "@element-plus/icons-vue";
import { WorkbookByCourseId, present, getPresent } from "@/api/workbook";
import _ from "lodash";
import { ElMessage } from "element-plus";

export default {
  name: "WorkbookPresent",
  components: {
    Back,
    DocumentChecked,
  },
  data() {
    return {
      workbook: [],
      // 提交的预设信息
      presentValue: [],
      // 返回的预设信息
      formPresent: [],
      //表单生成规则
      json: [],
      //表单样式规则
      option: {},
      //实例对象
      fApi: {},
      //表单数据
      value: {},
      courseId: "",
      detailId: "",
      workbookId: "",
    };
  },
  mounted() {
    this.courseId = this.$store.state.course.courseId;
    this.detailId = this.$store.state.course.detailId;
    this.getWorkbook();
    this.getPresent();
  },
  methods: {
    // 返回上级页面
    back() {
      this.$router.push("/templateManage");
    },
    // 提交预设信息
    save() {
      console.log("save", this.json);
      // this.presentValue = this.formPresent;
      this.searchChildren(this.json);
      // console.log("presentValue", this.presentValue);
      present(this.detailId, this.presentValue, this.courseId).then((res) => {
        if (res.code === "SUCCESS") {
          console.log("present", res);
          // this.showPresent(this.json);
          this.getPresent();
          ElMessage({
            type: "success",
            message: "更新成功",
            duration: 1500,
          });
        }
      });
    },
    // 查询预设信息
    getPresent() {
      getPresent(this.detailId).then((res) => {
        this.formPresent = res.data.preset.formPreset;
        this.formPresent.forEach((i) => {
          if (i.value[0] == "[") {
            i.value = i.value.match(/\d+/g);
            console.log("!", i.value);
          }
        });
        console.log("getPresent", this.formPresent);
        this.showPresent(this.json);
      });
    },
    // 回显预设信息
    showPresent(forms) {
      forms.forEach((form) => {
        if (Array.isArray(form.children) && form.children.length > 0) {
          this.showPresent(form.children);
        } else {
          if (form !== "") {
            this.formPresent.forEach((present) => {
              if (present.field == form.field) {
                form.value = present.value;
              }
            });
          }
        }
      });
    },
    // 查询对应的工作手册 by courseId
    getWorkbook() {
      WorkbookByCourseId(this.courseId).then((res) => {
        if (res.code === "SUCCESS") {
          // 找到上传组件，注入props配置
          res.data.formJson.forEach((form) => {
            // let that = this;
            if (form.type === "upload") {
              //   console.log(form);
              //   const limit = form.props.limit;
              form.props = {
                disabled: true,
              };
              //     limit: limit,
              //     listType: "text",
              //     multiple: true,
              //     name: "files",
              //     action: "http://81.68.103.96:8080/common/upload/files",
              //     headers: {
              //       Authorization: "Bearer " + Cookies.get("Admin-Token"),
              //     },
              //     data: {
              //       param: this.classInfo.classId,
              //       type: "workbookFile",
              //       field: form.field,
              //     },
              //     onSuccess: function (res, file) {
              //       console.log("upload", res, file);
              //       file.url = res.fileRecords[0].fileAddress;
              //     },
              //     onExceed: function () {
              //       ElMessage({
              //         type: "warning",
              //         message: `超出上传文件数量限制`,
              //         duration: 1500,
              //       });
              //     },
              //     onPreview: function (file) {
              //       that.download(file);
              //     },
              //   };
            }
          });
          this.workbook = res.data;
          this.workbookId = this.workbook.workbookId;
          this.value = this.workbook.formJson;
          console.log("getWorkbook", this.workbook);
          this.json = res.data.formJson;
          this.option = res.data.cssJson;
          // 保存提交
          this.option.submitBtn = false;
        }
      });
    },
    // 遍历children => 找到对应的field以及value，放进一个数组
    searchChildren(forms) {
      forms.forEach((form) => {
        if (Array.isArray(form.children) && form.children.length > 0) {
          this.searchChildren(form.children);
        } else {
          if (form !== "") {
            if (form.value !== undefined) {
              if (typeof form.value === "object") {
                form.value = JSON.stringify(form.value);
              }
              this.presentValue.push({
                field: form.field,
                value: form.value,
              });
            }
          }
        }
      });
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
.block_title {
  margin-left: 20px;
  font-size: 16px;
}
.divider {
  margin-left: 20px;
  height: 24px;
}
/* 表单回显器 */
.form-card {
  width: 784px;
  margin: 100px auto;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  background: white;
  padding: 25px;
}
</style>
