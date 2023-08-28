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
            @click="backList()"
          >
            <Back />
          </el-icon>
        </el-tooltip>
        <div class="block_title">{{ total.name }}</div>
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
            @click="changeWorkbookInfo()"
            style="margin-left: 20px"
          >
            <DocumentChecked />
          </el-icon>
        </el-tooltip>
      </el-row>
    </div>
    <!-- 表单构建器 -->
    <div class="form-designer">
      <fc-designer
        ref="designer"
        class="designer"
        height="800px"
        :menu="menu"
      />
    </div>
    <!-- 表单回显器 先放着看看效果 -->
    <!-- <form-create
        v-model="value"
        v-model:api="fApi"
        :rule="json"
        :option="option"
      ></form-create> -->
  </div>
</template>

<script>
import { Back, DocumentChecked } from "@element-plus/icons-vue";
import { checkWorkbookInfo, editWorkbookInfo } from "@/api/workbook";
import { ElMessage, ElMessageBox } from "element-plus";
import _ from "lodash";
import { uploadRule,helloword } from "@/components/form-designer/upload.js";
export default {
  name: "TemplateEdit",
  components: {
    Back,
    DocumentChecked,
  },
  data() {
    return {
      total: [],
      //表单生成规则
      json: [],
      //表单样式规则
      option: {},
      workbookId: "",
      //实例对象
      fApi: {},
      //表单数据
      value: {},
      menu: [
        {
          title: "表单组件",
          name: "group1",
          list: [
            {
              icon: "icon-input",
              name: "input",
              label: "输入框",
            },
            {
              icon: "icon-number",
              name: "inputNumber",
              label: "计数器",
            },
            {
              icon: "icon-radio",
              name: "radio",
              label: "单选框",
            },
            {
              icon: "icon-checkbox",
              name: "checkbox",
              label: "多选框",
            },
            {
              icon: "icon-cascader",
              name: "cascader",
              label: "级联选择器",
            },
            {
              icon: "icon-select",
              name: "select",
              label: "选择器",
            },

            {
              icon: "icon-editor",
              name: "fc-editor",
              label: "富文本框",
            },
            {
              icon: "icon-rate",
              name: "rate",
              label: "评分",
            },
            {
              icon: "icon-slider",
              name: "slider",
              label: "滑块",
            },
            {
              icon: "icon-switch",
              name: "switch",
              label: "开关",
            },
            {
              icon: "icon-time",
              name: "timePicker",
              label: "时间选择器",
            },
            {
              icon: "icon-date",
              name: "datePicker",
              label: "日期选择器",
            },
          ],
        },
        {
          title: "辅助组件",
          name: "group2",
          list: [
            {
              icon: "icon-alert",
              name: "el-alert",
              label: "提示",
            },
            {
              icon: "icon-divider",
              name: "el-divider",
              label: "分割线",
            },
            {
              icon: "icon-span",
              name: "span",
              label: "文字",
            },
          ],
        },
        {
          title: "布局组件",
          name: "group3",
          list: [
            {
              icon: "icon-row",
              name: "row",
              label: "栅格布局",
            },
            {
              icon: "icon-tab",
              name: "tab",
              label: "标签页",
            },
            {
              icon: "icon-space",
              name: "div",
              label: "间距",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    //插入组件规则
    this.$refs.designer.addComponent(uploadRule);
    //插入拖拽按钮到`main`分类下
    this.$refs.designer.appendMenuItem("group1", {
      icon: uploadRule.icon,
      name: uploadRule.name,
      label: uploadRule.label,
    });
    this.workbookId = this.$route.query.workbookId;
    // console.log(this.workbookId);
    this.getWorkbookInfo();
  },
  methods: {
    backList() {
      this.json = JSON.parse(this.$refs.designer.getJson());
      this.getOption();
       console.log( _.isEqual(this.total.formJson, this.json),this.total.formJson, this.json);
       console.log(   _.isEqual(this.total.cssJson, this.option),this.total.cssJson, this.option);


      if (
        _.isEqual(this.total.formJson, this.json) &&
        _.isEqual(this.total.cssJson, this.option)
      ) {
        this.$router.push("/templateList");
      } else {
        ElMessageBox.confirm("数据还未保存，是否仍然关闭？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push("/templateList");
          })
          .catch(() => {});
      }
    },
    // 获取样式规则
    getOption() {
      this.option = this.$refs.designer.getOption();
      this.option.form.formCreateResetBtn = false;
      this.option.form.formCreateSubmitBtn = false;
      console.log("getOption", this.option);
    },
    // 回显样式规则
    setOption() {
      this.$refs.designer.setOption(this.option);
    },
    // 获取生成规则
    getJson() {
      this.json = this.$refs.designer.getJson();
      // console.log("json", this.json);
    },
    // 回显生成规则
    setJson() {
      this.$refs.designer.setRule(this.json);
    },
    //获取工作手册详细信息
    getWorkbookInfo() {
      checkWorkbookInfo(this.workbookId).then((res) => {
        console.log("getWorkbookInfo", res);
        this.total = res.data;
        this.json = res.data.formJson;
        this.option = res.data.cssJson;
        if (this.json === null) {
          this.json = [];
        }
        if (this.option === null) {
          this.option = {};
          this.option.form = {};
        }
        console.log("option", this.option);

        this.option.form.formCreateResetBtn = false;
        
        this.option.form.formCreateSubmitBtn = false;
        console.log("option操作后", this.option, this.option.form.formCreateSubmitBtn );

        this.setJson();
        this.setOption();
      });
    },
    //修改工作手册
    changeWorkbookInfo() {
      this.json = JSON.parse(this.$refs.designer.getJson());
      this.getOption();
      this.total.formJson = this.json;
      this.total.cssJson = this.option;
      if (this.total.formJson.length > 0) {
        this.total.formJson.forEach((form) => {
          if (form.type === "upload") {
            Reflect.deleteProperty(form, "component");
          }
        });
      }
      console.log("save", this.total);

      this.total.formJson
        editWorkbookInfo(this.total).then((res) => {
          // console.log("editWorkbookInfo", res);
          if (res.code === "SUCCESS") {
            ElMessage({
              type: "success",
              message: `更新成功`,
              duration: 1500,
            });
            this.getWorkbookInfo()
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
.getJsonButton {
  margin-left: 6%;
  margin-top: 30px;
}
.form-designer {
  display: flex;
  width: 90%;
  margin-left: 5%;
  margin-top: 70px;
}
</style>
