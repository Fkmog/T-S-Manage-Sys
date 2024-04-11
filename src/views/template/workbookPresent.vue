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
import { Back, DocumentChecked, UploadFilled } from "@element-plus/icons-vue";
import { WorkbookByCourseId, present, getPresent } from "@/api/workbook";
import _ from "lodash";
import { Base64 } from "js-base64";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "WorkbookPresent",
  components: {
    Back,
    DocumentChecked,
    UploadFilled,
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
      origin: {},
      editor: [],
    };
  },
  mounted() {
    this.courseId = this.$store.state.course.courseId;
    this.detailId = this.$store.state.course.detailId;
    this.getWorkbook();
  },
  methods: {
    // 返回上级页面
    back() {
      let temp = JSON.parse(JSON.stringify(this.json));
      console.log(_.isEqual(this.origin, temp));
      if (!_.isEqual(this.origin, temp)) {
        ElMessageBox.confirm("数据还未保存，是否仍然关闭？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push("/templateManage");
          })
          .catch(() => {});
      } else {
        this.$router.push("/templateManage");
      }
    },
    // 提交预设信息
    save() {
      this.searchChildren(this.json);
      let tempEditor = [...new Set(this.editor)];
      tempEditor.forEach((edit) => {
        this.presentValue.forEach((item) => {
          if (edit == item.field) {
            item.value = "zheshibase64bianma/" + Base64.encode(item.value);
          }
        });
      });
      console.log("!", tempEditor, this.presentValue);
      present(this.detailId, this.presentValue, this.courseId)
        .then((res) => {
          if (res.code === "SUCCESS") {
            // console.log("present", res);
            this.getWorkbook();
            ElMessage({
              type: "success",
              message: "保存成功",
              duration: 1500,
            });
          }
        })
        .catch((e) => {
          if (e.status == 500) {
            ElMessage({
              type: "error",
              message: `保存出错，请检查填写的内容`,
              duration: 1500,
            });
          }
        });
    },
    // 查询预设信息
    async getPresent() {
      await getPresent(this.detailId).then((res) => {
        this.formPresent = res.data.preset.formPreset;
        if (this.formPresent && this.formPresent.length > 0) {
          this.formPresent.forEach((i) => {
            if (i.value[0] == "[") {
              i.value = i.value.match(/\d+/g);
              console.log("!", i.value);
            }
          });
        }
      });
      await this.showPresent(this.json);
      this.origin = JSON.parse(JSON.stringify(this.json));
      // console.log("oringin", this.origin);
    },
    isBase64Encoded(str) {
      // Base64 编码的正则表达式
      const base64Regex =
        /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      return base64Regex.test(str);
    },
    // 回显预设信息
    async showPresent(forms) {
      forms.forEach((form) => {
        if (Array.isArray(form.children) && form.children.length > 0) {
          this.showPresent(form.children);
        } else {
          if (form !== "") {
            if (this.formPresent && this.formPresent.length > 0) {
              this.formPresent.forEach((present) => {
                if (present.field == form.field) {
                  form.value = present.value;
                  // 解码
                  if (typeof form.value === "string") {
                    if (form.value.includes("zheshibase64bianma/")) {
                      let temp = form.value.slice(19);
                      if (this.isBase64Encoded(temp)) {
                        form.value = Base64.decode(temp);
                        console.log("@@", Base64.decode(temp));
                      }
                    }
                  }
                }
              });
            }
          }
        }
      });
    },
    // 查询对应的工作手册 by courseId
    async getWorkbook() {
      WorkbookByCourseId(this.courseId).then((res) => {
        if (res.code === "SUCCESS") {
          // 找到上传组件，注入props配置
          res.data.formJson.forEach((form) => {
            if (form.type === "upload") {
              form.props = {
                disabled: true,
              };
            }
          });
          this.workbook = res.data;
          this.workbookId = this.workbook.workbookId;
          this.value = this.workbook.formJson;
          this.dfs(this.value);
          console.log("this.value", this.value);

          console.log("getWorkbook1111", this.workbook);
          this.json = res.data.formJson;
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
          // 获取手册信息后再查看预设信息
          this.getPresent();
        }
      });
    },
    // 遍历，去掉所有required
    dfs(forms) {
      forms.forEach((form) => {
        if (form.$required) {
          form.$required = false;
        }
        if (form.children) {
          this.dfs(form.children);
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
