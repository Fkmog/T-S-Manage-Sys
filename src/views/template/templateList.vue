<template>
  <div class="content">
    <addBtn @click="addTemplate()"></addBtn>
    <!-- 顶部导航栏 -->
    <!-- <div class="block">
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
            @click="backSetting()"
          >
            <Back />
          </el-icon>
        </el-tooltip>
        <div class="block_title">工作手册模板</div>
        <el-divider class="divider" direction="vertical" />
      </el-row>
    </div> -->
    <el-table
      class="ListTable"
      :data="workbookList"
      style="width: 700px"
      :header-cell-style="{
        'padding-left': '20px',
        'font-size': '14.4px',
        height: '48px',
        'font-weight': 'bold',
        color: 'black',
      }"
      :cell-style="{
        'padding-left': '20px',
        'font-size': '16px',
        height: '60px',
        cursor: 'pointer',
      }"
      highlight-current-row
      @row-click="goEdit"
    >
      <el-table-column prop="name" label="模板名称" width="300" />
      <el-table-column prop="updateTime" label="更新时间" width="300" />
      <el-table-column width="100">
        <template #default="scope">
          <el-row>
            <el-col :span="16">
              <el-tooltip content="删除" :hide-after="0">
                <el-button
                  link
                  style="color: #3f51b5"
                  @click.stop="deleteBook(scope.row)"
                  ><el-icon><Delete /></el-icon
                ></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Back, Delete } from "@element-plus/icons-vue";
import addBtn from "@/components/general/addBtn.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { checkWorkbook, newWorkbookInfo, deleteWorkbook } from "@/api/workbook";

export default {
  name: "TemplateList",
  components: {
    Back,
    addBtn,
    Delete,
  },
  data() {
    return {
      departmentId: "",
      workbookList: [],
    };
  },
  mounted() {
    this.departmentId = this.$store.state.currentInfo.departmentId;
    this.getWorkbookList();
  },
  methods: {
    backSetting() {
      this.$router.push("/departmentSetting");
    },
    //跳转编辑
    goEdit(row) {
      console.log(row);
      this.$router.push({
        path: "/templateEdit",
        query: { workbookId: row.workbookId },
      });
    },
    //新建模板
    addTemplate() {
      ElMessageBox.prompt("模板名称：", "新建模板", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        customClass: "add-major-box",
        //校验规则
        inputPattern: /^.+$/,
        inputErrorMessage: "请输入新增模板名称",
      })
        .then(({ value }) => {
          newWorkbookInfo(value, this.departmentId).then((res) => {
            if (res.code === "SUCCESS") {
              this.getWorkbookList();
              ElMessage({
                type: "success",
                message: `成功新建模板:${value}`,
                duration: 1500,
              });
            }
          });
        })
        .catch(() => {});
    },
    //查询工作手册列表
    getWorkbookList() {
      checkWorkbook(this.departmentId).then((res) => {
        console.log("workbookList", res);
        if (res.code === "SUCCESS") {
          this.workbookList = res.rows;
          this.workbookList.forEach((book) => {
            if (book.updateTime === null) {
              book.updateTime = book.createTime;
            }
          });
        }
      });
    },
    // 删除工作手册
    deleteBook(row) {
      console.log(row);
      ElMessageBox.confirm("是否确认删除该模板"  + "?", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteWorkbook(row.workbookId).then((res) => {
          if (res === 204) {
            this.getWorkbookList();
            ElMessage({
              type: "success",
              message: `删除成功`,
              duration: 1500,
            });
          }
        });
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
.ListTable {
  margin: 0 auto;
  margin-top: 85px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
</style>
