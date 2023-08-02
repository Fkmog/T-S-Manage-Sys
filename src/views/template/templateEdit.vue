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
      </el-row>

      <!--功能按钮-->
      <div class="tool">
        <el-row>
          <el-button
            class="getJsonButton"
            type="primary"
            size="small"
            @click="changeWorkbookInfo()"
            round
            >保存
          </el-button>
        </el-row>
      </div>
    </div>
    <!-- 表单构建器 -->
    <div class="form-designer">
      <fc-designer ref="designer" class="designer" height="800px" />
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
import { Back } from "@element-plus/icons-vue";
import { checkWorkbookInfo, editWorkbookInfo } from "@/api/workbook";
import { ElMessage } from "element-plus";

export default {
  name: "TemplateEdit",
  components: {
    Back,
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
    };
  },
  mounted() {
    this.workbookId = this.$route.query.workbookId;
    // console.log(this.workbookId);
    this.getWorkbookInfo();
  },
  methods: {
    backList() {
      this.$router.push("/templateList");
    },
    getOption() {
      this.option = this.$refs.designer.getOption();
      console.log("getOption", this.option);
    },
    setOption() {
      this.$refs.designer.setOption(this.option);
    },
    getJson() {
      this.json = this.$refs.designer.getJson();
      console.log("json", this.json);
    },
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
        this.option.onSubmit = function (e) {
          console.log("Submit", e);
        };
        console.log("option", this.option);
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
      editWorkbookInfo(this.total).then((res) => {
        // console.log("editWorkbookInfo", res);
        if (res.code === "SUCCESS") {
          ElMessage({
            type: "success",
            message: `保存成功`,
            duration: 1500,
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
  margin-top:100px;
}
</style>
